-- ================================================================
-- Fix RLS Policies for Authenticated Users
-- ================================================================
-- Problem: Previous policies were explicitly set TO anon (public/unauthenticated).
-- Now that users are logging in (authenticated role), they are blocked.
-- Fix: We add parallel policies TO authenticated for all core tables.
-- ================================================================

-- 1. Faculty Members
CREATE POLICY "Allow authenticated read access faculty" ON public.faculty_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access faculty" ON public.faculty_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Subjects
CREATE POLICY "Allow authenticated read access subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access subjects" ON public.subjects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Units
CREATE POLICY "Allow authenticated read access units" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access units" ON public.units FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Notes
CREATE POLICY "Allow authenticated read access notes" ON public.notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access notes" ON public.notes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Questions (Legacy table, might be used in some views)
CREATE POLICY "Allow authenticated read access questions" ON public.questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access questions" ON public.questions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Assignments
CREATE POLICY "Allow authenticated read access assignments" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access assignments" ON public.assignments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Timetable
CREATE POLICY "Allow authenticated read access timetable" ON public.timetable FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access timetable" ON public.timetable FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Announcements
CREATE POLICY "Allow authenticated read access announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access announcements" ON public.announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. Teams
CREATE POLICY "Allow authenticated read access teams" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access teams" ON public.teams FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. MarkWise Questions (Ensuring explicit access, though existing policy might cover it)
-- Note: The existing policy for markwise_questions uses "FOR ALL" default (public), which should work.
-- But adding explicit authenticated access ensures clarity if default behavior changes.
CREATE POLICY "Allow authenticated access markwise" ON public.markwise_questions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. Knowledge Vault (Vault Resources)
CREATE POLICY "Allow authenticated access vault" ON public.vault_resources FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 12. Revision Notes
CREATE POLICY "Allow authenticated read access revision_notes" ON public.revision_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write access revision_notes" ON public.revision_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
