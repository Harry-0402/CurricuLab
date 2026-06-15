-- ==========================================
-- CurricuLab RAG & Vector Search Schema
-- ==========================================

-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the embeddings table
-- We store vectors of dimension 768 for Gemini's text-embedding-004
-- Or 384 for fast small models. We'll use 768.
CREATE TABLE IF NOT EXISTS vault_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vault_resource_id UUID NOT NULL REFERENCES vault_resources(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL, -- The text chunk that this embedding represents
    embedding vector(768) NOT NULL, -- Adjust dimension based on your exact embedding model
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create a vector index for faster similarity searches (HNSW)
-- Note: You need enough data for an index to be useful, but good to add.
CREATE INDEX IF NOT EXISTS idx_vault_embeddings_vector 
ON vault_embeddings USING hnsw (embedding vector_cosine_ops);

-- 4. Create a Postgres function for performing cosine similarity search
CREATE OR REPLACE FUNCTION match_vault_embeddings (
    query_embedding vector(768),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    vault_resource_id UUID,
    content_chunk TEXT,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ve.vault_resource_id,
        ve.content_chunk,
        1 - (ve.embedding <=> query_embedding) AS similarity
    FROM vault_embeddings ve
    WHERE 1 - (ve.embedding <=> query_embedding) > match_threshold
    ORDER BY ve.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
