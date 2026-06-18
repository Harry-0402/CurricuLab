-- Clear the youtube_library cache to see the 25 results immediately
UPDATE youtube_library SET video_payload = NULL, updated_at = NULL WHERE video_payload IS NOT NULL;
