-- ==========================================
-- CurricuLab Flashcards & SRS Schema
-- ==========================================

-- 1. Create the flashcards table
CREATE TABLE IF NOT EXISTS vault_flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_resource_id UUID NOT NULL REFERENCES vault_resources(id) ON DELETE CASCADE,
    front_content TEXT NOT NULL,
    back_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the SRS tracking table
-- We use SM-2 algorithm variables: ease_factor, interval, repetitions
CREATE TABLE IF NOT EXISTS flashcard_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flashcard_id UUID NOT NULL REFERENCES vault_flashcards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- SM-2 SRS Algorithm Fields
    ease_factor REAL DEFAULT 2.5 NOT NULL,  -- Starts at 2.5
    interval_days INTEGER DEFAULT 0 NOT NULL, -- Days until next review
    repetitions INTEGER DEFAULT 0 NOT NULL,   -- Number of successful repetitions in a row
    next_review_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one review tracking record per user per flashcard
    UNIQUE(flashcard_id, user_id)
);

-- Add indexes for fast querying of due cards
CREATE INDEX IF NOT EXISTS idx_flashcard_reviews_next_review 
    ON flashcard_reviews(user_id, next_review_date);
