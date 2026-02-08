import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, conversationHistory = [] } = await req.json();

        // Fetch user's SkillForge data
        const [tracksRes, skillsRes, resourcesRes, journalRes] = await Promise.all([
            supabase.from('skillforge_tracks').select('*').eq('user_id', user.id),
            supabase.from('skillforge_skills').select('*').eq('user_id', user.id),
            supabase.from('skillforge_resources').select('*').eq('user_id', user.id),
            supabase.from('skillforge_journal').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
        ]);

        // Build context from user data
        const contextParts: string[] = [];

        // Active tracks
        const activeTracks = tracksRes.data?.filter(t => t.status === 'active') || [];
        if (activeTracks.length > 0) {
            contextParts.push(`Active Learning Tracks: ${activeTracks.map(t => `"${t.title}" (${t.progress}% complete, Category: ${t.category})`).join(', ')}`);
        }

        // Skills by proficiency
        const skills = skillsRes.data || [];
        if (skills.length > 0) {
            const skillsByLevel = {
                beginner: skills.filter(s => s.proficiency_level === 'beginner'),
                intermediate: skills.filter(s => s.proficiency_level === 'intermediate'),
                advanced: skills.filter(s => s.proficiency_level === 'advanced'),
                expert: skills.filter(s => s.proficiency_level === 'expert')
            };

            const skillSummary: string[] = [];
            if (skillsByLevel.beginner.length) skillSummary.push(`Beginner: ${skillsByLevel.beginner.map(s => s.skill_name).join(', ')}`);
            if (skillsByLevel.intermediate.length) skillSummary.push(`Intermediate: ${skillsByLevel.intermediate.map(s => s.skill_name).join(', ')}`);
            if (skillsByLevel.advanced.length) skillSummary.push(`Advanced: ${skillsByLevel.advanced.map(s => s.skill_name).join(', ')}`);
            if (skillsByLevel.expert.length) skillSummary.push(`Expert: ${skillsByLevel.expert.map(s => s.skill_name).join(', ')}`);

            if (skillSummary.length) {
                contextParts.push(`Skills: ${skillSummary.join(' | ')}`);
            }
        }

        // In-progress resources
        const inProgressResources = resourcesRes.data?.filter(r => r.status === 'in_progress') || [];
        if (inProgressResources.length > 0) {
            contextParts.push(`Currently Learning From: ${inProgressResources.map((r: any) => `${r.title} (${r.resource_type})`).slice(0, 3).join(', ')}`);
        }

        // Recent journal insights
        const recentJournal = journalRes.data || [];
        if (recentJournal.length > 0) {
            const recentLearnings = recentJournal
                .filter((j: any) => j.key_learnings)
                .map((j: any) => j.key_learnings)
                .slice(0, 2);
            if (recentLearnings.length) {
                contextParts.push(`Recent Learning Insights: ${recentLearnings.join('; ')}`);
            }
        }

        // Build system prompt with context
        const userContext = contextParts.length > 0
            ? `\n\nUser's Current Learning Profile:\n${contextParts.join('\n')}`
            : `\n\nNote: User is just getting started with SkillForge. Encourage them to add tracks, skills, and resources.`;

        const systemPrompt = `You are a personalized AI Learning Mentor for SkillForge, a personal learning management system.

Your role is to:
- Provide study planning and learning strategy advice
- Recommend resources and learning paths
- Help with skill development and career growth
- Offer motivation and guidance for continuous learning
- Suggest next steps based on their progress
${userContext}

FORMATTING RULES:
- Use clean Markdown for structure (headers, lists, bold, italic)
- NO LaTeX or mathematical notation
- Use bullet points and numbered lists for clarity
- Keep responses concise, actionable, and encouraging
- Focus on practical, real-world learning strategies
- Reference the user's actual tracks, skills, and progress when giving advice`;

        // Call the main chat API
        const chatResponse = await fetch(`${req.headers.get('origin')}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...conversationHistory,
                    { role: 'user', content: message }
                ],
                mode: 'skillforge'
            })
        });

        const chatData = await chatResponse.json();
        return NextResponse.json({ message: chatData.message || 'Sorry, I could not generate a response.' });

    } catch (error: any) {
        console.error('SkillForge chat error:', error);
        return NextResponse.json(
            { error: 'Failed to process request', details: error.message },
            { status: 500 }
        );
    }
}
