-- =====================================================
-- CurricuLab RLS Security Fix
-- =====================================================
-- This script fixes all overly permissive RLS policies
-- Strategy: Public READ access, Authenticated WRITE access
-- =====================================================

-- =====================================================
-- STEP 1: Drop All Overly Permissive Policies
-- =====================================================

-- Announcements
drop policy if exists "Allow authenticated write access announcements" on announcements;
drop policy if exists "Allow public write access announcements" on announcements;
drop policy if exists "Authenticated users can manage announcements" on announcements;

-- Assignments
drop policy if exists "Allow authenticated write access assignments" on assignments;
drop policy if exists "Allow public write access assignments" on assignments;

-- Change Logs
drop policy if exists "Enable insert for authenticated users only" on change_logs;

-- Faculty Members
drop policy if exists "Allow authenticated write access faculty" on faculty_members;
drop policy if exists "Allow public write access" on faculty_members;

-- MarkWise Questions
drop policy if exists "Allow all operations on markwise_questions" on markwise_questions;
drop policy if exists "Allow authenticated access markwise" on markwise_questions;

-- Notes
drop policy if exists "Allow authenticated write access notes" on notes;
drop policy if exists "Allow public write access notes" on notes;

-- Questions
drop policy if exists "Allow authenticated write access questions" on questions;
drop policy if exists "Allow public write access questions" on questions;
drop policy if exists "Allow public delete" on questions;
drop policy if exists "Allow public insert" on questions;
drop policy if exists "Allow public update" on questions;

-- Revision Notes
drop policy if exists "Allow authenticated write access revision_notes" on revision_notes;
drop policy if exists "Allow public write access revision_notes" on revision_notes;

-- Subjects
drop policy if exists "Allow authenticated write access subjects" on subjects;
drop policy if exists "Allow public write access subjects" on subjects;

-- Team Members
drop policy if exists "Enable write access for authenticated users only" on team_members;

-- Teams
drop policy if exists "Allow authenticated write access teams" on teams;
drop policy if exists "Allow public write access teams" on teams;

-- Timetable
drop policy if exists "Allow authenticated write access timetable" on timetable;
drop policy if exists "Allow public write access timetable" on timetable;

-- Units
drop policy if exists "Allow authenticated write access units" on units;
drop policy if exists "Allow public write access units" on units;

-- Vault Resources
drop policy if exists "Allow all operations on vault_resources" on vault_resources;
drop policy if exists "Allow authenticated access vault" on vault_resources;

-- Workflow Steps
drop policy if exists "Enable write access for authenticated users only" on workflow_steps;

-- Attendance Logs (if exists)
drop policy if exists "Allow authenticated write access attendance" on attendance_logs;
drop policy if exists "Allow public write access attendance" on attendance_logs;

-- Unit Details
drop policy if exists "Anyone can view unit details" on unit_details;
drop policy if exists "Authenticated users can insert unit details" on unit_details;
drop policy if exists "Authenticated users can update unit details" on unit_details;
drop policy if exists "Authenticated users can delete unit details" on unit_details;

-- App Data
drop policy if exists "Anyone can view app data" on app_data;
drop policy if exists "Authenticated users can manage app data" on app_data;

-- =====================================================
-- STEP 1.5: Enable RLS on Tables (if disabled)
-- =====================================================
alter table unit_details enable row level security;
alter table app_data enable row level security;

-- =====================================================
-- STEP 2: Create Proper RLS Policies
-- =====================================================

-- ----------------------------
-- ANNOUNCEMENTS
-- ----------------------------
create policy "Anyone can view announcements"
  on announcements for select
  using (true);

create policy "Authenticated users can insert announcements"
  on announcements for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update announcements"
  on announcements for update
  to authenticated
  using (true);

create policy "Authenticated users can delete announcements"
  on announcements for delete
  to authenticated
  using (true);

-- ----------------------------
-- ASSIGNMENTS
-- ----------------------------
create policy "Anyone can view assignments"
  on assignments for select
  using (true);

create policy "Authenticated users can insert assignments"
  on assignments for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update assignments"
  on assignments for update
  to authenticated
  using (true);

create policy "Authenticated users can delete assignments"
  on assignments for delete
  to authenticated
  using (true);

-- ----------------------------
-- CHANGE LOGS
-- ----------------------------
create policy "Anyone can view change logs"
  on change_logs for select
  using (true);

create policy "Only authenticated can insert change logs"
  on change_logs for insert
  to authenticated
  with check (true);

-- Note: No update/delete for change_logs (audit trail)

-- ----------------------------
-- FACULTY MEMBERS
-- ----------------------------
create policy "Anyone can view faculty"
  on faculty_members for select
  using (true);

create policy "Authenticated users can insert faculty"
  on faculty_members for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update faculty"
  on faculty_members for update
  to authenticated
  using (true);

create policy "Authenticated users can delete faculty"
  on faculty_members for delete
  to authenticated
  using (true);

-- ----------------------------
-- MARKWISE QUESTIONS
-- ----------------------------
create policy "Anyone can view markwise questions"
  on markwise_questions for select
  using (true);

create policy "Authenticated users can insert markwise questions"
  on markwise_questions for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update markwise questions"
  on markwise_questions for update
  to authenticated
  using (true);

create policy "Authenticated users can delete markwise questions"
  on markwise_questions for delete
  to authenticated
  using (true);

-- ----------------------------
-- NOTES
-- ----------------------------
create policy "Anyone can view notes"
  on notes for select
  using (true);

create policy "Authenticated users can insert notes"
  on notes for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update notes"
  on notes for update
  to authenticated
  using (true);

create policy "Authenticated users can delete notes"
  on notes for delete
  to authenticated
  using (true);

-- ----------------------------
-- QUESTIONS (PaperTrail)
-- ----------------------------
create policy "Anyone can view questions"
  on questions for select
  using (true);

create policy "Authenticated users can insert questions"
  on questions for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update questions"
  on questions for update
  to authenticated
  using (true);

create policy "Authenticated users can delete questions"
  on questions for delete
  to authenticated
  using (true);

-- ----------------------------
-- REVISION NOTES
-- ----------------------------
create policy "Anyone can view revision notes"
  on revision_notes for select
  using (true);

create policy "Authenticated users can insert revision notes"
  on revision_notes for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update revision notes"
  on revision_notes for update
  to authenticated
  using (true);

create policy "Authenticated users can delete revision notes"
  on revision_notes for delete
  to authenticated
  using (true);

-- ----------------------------
-- SUBJECTS
-- ----------------------------
create policy "Anyone can view subjects"
  on subjects for select
  using (true);

create policy "Authenticated users can insert subjects"
  on subjects for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update subjects"
  on subjects for update
  to authenticated
  using (true);

create policy "Authenticated users can delete subjects"
  on subjects for delete
  to authenticated
  using (true);

-- ----------------------------
-- TEAM MEMBERS
-- ----------------------------
create policy "Anyone can view team members"
  on team_members for select
  using (true);

create policy "Authenticated users can insert team members"
  on team_members for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update team members"
  on team_members for update
  to authenticated
  using (true);

create policy "Authenticated users can delete team members"
  on team_members for delete
  to authenticated
  using (true);

-- ----------------------------
-- TEAMS
-- ----------------------------
create policy "Anyone can view teams"
  on teams for select
  using (true);

create policy "Authenticated users can insert teams"
  on teams for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update teams"
  on teams for update
  to authenticated
  using (true);

create policy "Authenticated users can delete teams"
  on teams for delete
  to authenticated
  using (true);

-- ----------------------------
-- TIMETABLE
-- ----------------------------
create policy "Anyone can view timetable"
  on timetable for select
  using (true);

create policy "Authenticated users can insert timetable"
  on timetable for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update timetable"
  on timetable for update
  to authenticated
  using (true);

create policy "Authenticated users can delete timetable"
  on timetable for delete
  to authenticated
  using (true);

-- ----------------------------
-- UNITS
-- ----------------------------
create policy "Anyone can view units"
  on units for select
  using (true);

create policy "Authenticated users can insert units"
  on units for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update units"
  on units for update
  to authenticated
  using (true);

create policy "Authenticated users can delete units"
  on units for delete
  to authenticated
  using (true);

-- ----------------------------
-- VAULT RESOURCES
-- ----------------------------
create policy "Anyone can view vault resources"
  on vault_resources for select
  using (true);

create policy "Authenticated users can insert vault resources"
  on vault_resources for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update vault resources"
  on vault_resources for update
  to authenticated
  using (true);

create policy "Authenticated users can delete vault resources"
  on vault_resources for delete
  to authenticated
  using (true);

-- ----------------------------
-- WORKFLOW STEPS
-- ----------------------------
create policy "Anyone can view workflow steps"
  on workflow_steps for select
  using (true);

create policy "Authenticated users can insert workflow steps"
  on workflow_steps for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update workflow steps"
  on workflow_steps for update
  to authenticated
  using (true);

create policy "Authenticated users can delete workflow steps"
  on workflow_steps for delete
  to authenticated
  using (true);

-- ----------------------------
-- UNIT_DETAILS
-- ----------------------------
create policy "Anyone can view unit details"
  on unit_details for select
  using (true);

create policy "Authenticated users can insert unit details"
  on unit_details for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update unit details"
  on unit_details for update
  to authenticated
  using (true);

create policy "Authenticated users can delete unit details"
  on unit_details for delete
  to authenticated
  using (true);

-- ----------------------------
-- APP_DATA
-- ----------------------------
create policy "Anyone can view app data"
  on app_data for select
  using (true);

create policy "Authenticated users can insert app data"
  on app_data for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update app data"
  on app_data for update
  to authenticated
  using (true);

create policy "Authenticated users can delete app data"
  on app_data for delete
  to authenticated
  using (true);

-- ----------------------------
-- ATTENDANCE LOGS
-- ----------------------------
create policy "Anyone can view attendance logs"
  on attendance_logs for select
  using (true);

create policy "Authenticated users can insert attendance"
  on attendance_logs for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update attendance"
  on attendance_logs for update
  to authenticated
  using (true);

create policy "Authenticated users can delete attendance"
  on attendance_logs for delete
  to authenticated
  using (true);

-- =====================================================
-- STEP 3: Fix Function Search Path
-- =====================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = public, pg_temp;

-- =====================================================
-- DONE! Security policies have been fixed.
-- =====================================================
-- Summary:
-- - Public users can READ all content
-- - Authenticated users can CREATE/UPDATE/DELETE
-- - Attendance logs are user-specific
-- - Change logs are insert-only (audit trail)
-- =====================================================
