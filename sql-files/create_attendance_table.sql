-- Create attendance_logs table
create table if not exists attendance_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subject_id text references subjects(id) on delete set null,
  subject_name text, -- Store name in case subject is deleted or for quick access
  date date not null,
  status text not null check (status in ('Present', 'Absent', 'Canceled')),
  created_at timestamptz default now()
);

-- Add unique constraint to prevent duplicate logs for same subject on same day
alter table attendance_logs 
  add constraint unique_attendance_per_subject_date 
  unique (user_id, subject_id, date);

-- RLS Policies
alter table attendance_logs enable row level security;

create policy "Users can view their own attendance"
  on attendance_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own attendance"
  on attendance_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own attendance"
  on attendance_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own attendance"
  on attendance_logs for delete
  using (auth.uid() = user_id);
