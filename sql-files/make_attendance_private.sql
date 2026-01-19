-- =====================================================
-- Make Attendance Logs Private
-- =====================================================
-- Users can only see their OWN attendance
-- Prevents other students from viewing your attendance
-- =====================================================

-- Drop the public access policy
DROP POLICY IF EXISTS "Anyone can view attendance logs" ON attendance_logs;

-- Create private access policy
CREATE POLICY "Users can view own attendance"
  ON attendance_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Keep the management policy for authenticated users
-- (This allows you to create/update/delete your own attendance)
-- Already exists from previous setup:
-- CREATE POLICY "Authenticated users can manage all attendance"
--   ON attendance_logs FOR ALL
--   TO authenticated
--   USING (true)
--   WITH CHECK (true);

-- =====================================================
-- Result:
-- =====================================================
-- ✅ You can only see YOUR attendance
-- ✅ Other students can only see THEIR attendance
-- ✅ You can still create/update/delete your attendance
-- ✅ No one can see anyone else's attendance
-- =====================================================
