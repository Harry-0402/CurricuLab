-- ==========================================
-- Create Revision Notes Table
-- ==========================================
create table if not exists public.revision_notes (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unit_id text references public.units(id) on delete cascade,
  title text not null,
  content text,
  generated_at timestamp with time zone default now()
);

alter table public.revision_notes enable row level security;

drop policy if exists "Allow public read access revision_notes" on public.revision_notes;
create policy "Allow public read access revision_notes" on public.revision_notes for select to anon using (true);

drop policy if exists "Allow public write access revision_notes" on public.revision_notes;
create policy "Allow public write access revision_notes" on public.revision_notes for all to anon using (true) with check (true);


-- ==========================================
-- Migrate Existing Notes to Revision Notes
-- ==========================================
INSERT INTO public.revision_notes (id, unit_id, title, content, generated_at)
SELECT id, unit_id, title, content, created_at
FROM public.notes
ON CONFLICT (id) DO NOTHING;

-- Verify data has been migrated, then delete old notes:
DELETE FROM public.notes;
