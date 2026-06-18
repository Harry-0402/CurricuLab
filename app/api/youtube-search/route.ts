import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import ytSearch from 'yt-search';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing youtube_library_id' }, { status: 400 });
    }

    try {
        const supabase = await createSupabaseServerClient();
        
        // 1. Fetch the library item
        const { data: item, error: fetchError } = await supabase
            .from('youtube_library')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !item) {
            console.error('Failed to fetch youtube_library item:', fetchError);
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // 2. Check if cache exists and is fresh (< 30 days old)
        if (item.video_payload && item.updated_at) {
            const updatedAt = new Date(item.updated_at);
            const daysOld = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
            
            if (daysOld < 30 && Array.isArray(item.video_payload) && item.video_payload.length > 0) {
                return NextResponse.json({ data: item.video_payload, cached: true });
            }
        }

        // 3. Fallback: Parse URL and Scrape
        let searchQuery = item.title; // Default fallback
        if (item.url) {
            try {
                const urlObj = new URL(item.url);
                if (urlObj.searchParams.has('search_query')) {
                    searchQuery = urlObj.searchParams.get('search_query') || item.title;
                }
            } catch (e) {
                // Ignore URL parsing errors, just use title
                console.warn('Could not parse search_query from URL:', item.url);
            }
        }

        // Scrape using yt-search (fetch multiple pages to get a large list of results)
        const searchResults = await ytSearch({ query: searchQuery, pageEnd: 3 });
        
        if (!searchResults || !searchResults.videos || searchResults.videos.length === 0) {
            return NextResponse.json({ error: 'No results found on YouTube' }, { status: 404 });
        }

        // Return all scraped videos (removed the 25 result limit)
        const topResults = searchResults.videos.map((v: any) => ({
            videoId: v.videoId,
            title: v.title,
            thumbnail: v.thumbnail || v.image,
            channelName: v.author?.name || 'Unknown',
        }));

        // 4. Update the Cache in Supabase
        const { error: updateError } = await supabase
            .from('youtube_library')
            .update({
                video_payload: topResults,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (updateError) {
            console.error('Failed to update cache:', updateError);
            // Even if update fails, we can still return the results to the user
        }

        return NextResponse.json({ data: topResults, cached: false });

    } catch (error: any) {
        console.error('API /youtube-search error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
