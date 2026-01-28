# Timetable Update for MBA (BA) - II, Semester II

## Overview
This document provides instructions for updating the timetable data for **MBA (BA) - II, Semester II** for the academic year **2025-2026**, effective from **12/01/2026**.

## Institution Details
- **Institution**: Sandip University
- **School**: School of Commerce & Management Studies
- **Program**: MBA (BA) - II
- **Academic Year**: 2025-2026
- **Semester**: Semester II
- **Effective From**: 12/01/2026

## Course Details

| Code | Subject | L | T | P | Faculty |
|------|---------|---|---|---|---------|
| PBA204 | Production and Operations Management | 3 | 1 | 0 | Dr. Shailendra Baraniya |
| PBA205 | Digital Transformation | 3 | 1 | 0 | Mr. Aniket Alvekar |
| PBA206 | Legal Aspects of Business | 4 | 0 | 0 | Adv. Vishal Jadhav |
| PBA207 | Data Visualization and Story Telling | 3 | 0 | 1 | Dr. Samadhan Bundhe |
| PBA208 | Business Research Methods | 3 | 1 | 0 | Dr. Zahir Shaikh |
| PBA211 | Data Analysis using Python | 1 | 0 | 3 | Mr. Aniket Alvekar |
| PBA212 | Data Analysis using Power BI | 0 | 0 | 4 | Dr. Samadhan Bundhe |
| PBA213 | Business Communication Skills - II | 0 | 0 | 2 | Mrs. Prachi Muskar |

**Legend**: L = Lecture, T = Tutorial, P = Practical

## Weekly Schedule Summary

### Monday
- **10:15-11:00**: Legal Aspects of Business (Adv. Vishal Jadhav)
- **11:00-12:00**: Digital Transformation (Mr. Aniket Alvekar)
- **12:00-01:00**: Production and Operations Management (Dr. Shailendra Baraniya)
- **02:00-03:00**: Data Visualization and Story Telling (Dr. Samadhan Bundhe)
- **03:00-04:00**: Business Research Methods (Dr. Zahir Shaikh)
- **04:00-05:00**: Data Analysis using Power BI (P) (Dr. Samadhan Bundhe)

### Tuesday
- **10:15-11:00**: Legal Aspects of Business (Adv. Vishal Jadhav)
- **11:00-12:00**: Business Research Methods (Dr. Zahir Shaikh)
- **12:00-01:00**: Production and Operations Management (T) (Dr. Shailendra Baraniya)
- **02:00-03:00**: Data Analysis using Python (P) (Mr. Aniket Alvekar)
- **03:00-04:00**: Data Analysis using Power BI (P) (Dr. Samadhan Bundhe)
- **04:00-05:00**: Digital Transformation (Mr. Aniket Alvekar)

### Wednesday
- **10:15-11:00**: Legal Aspects of Business (Adv. Vishal Jadhav)
- **11:00-12:00**: Business Research Methods (Dr. Zahir Shaikh)
- **12:00-01:00**: Data Visualization and Story Telling (Dr. Samadhan Bundhe)
- **02:00-03:00**: Data Analysis using Python (P) (Mr. Aniket Alvekar)
- **03:00-04:00**: Data Analysis using Power BI (P) (Dr. Samadhan Bundhe)
- **04:00-05:00**: Digital Transformation (T) (Mr. Aniket Alvekar)

### Thursday
- **10:15-11:00**: Legal Aspects of Business (Adv. Vishal Jadhav)
- **11:00-12:00**: Data Analysis using Python (P) (Mr. Aniket Alvekar)
- **12:00-01:00**: Data Visualization and Story Telling (Dr. Samadhan Bundhe)
- **02:00-03:00**: Production and Operations Management (Dr. Shailendra Baraniya)
- **03:00-04:00**: Business Research Methods (Dr. Zahir Shaikh)
- **04:00-05:00**: Data Analysis using Power BI (P) (Dr. Samadhan Bundhe)

### Friday
- **10:15-11:00**: Production and Operations Management (Dr. Shailendra Baraniya)
- **11:00-12:00**: Digital Transformation (Mr. Aniket Alvekar)
- **12:00-01:00**: Data Visualization and Story Telling (P) (Dr. Samadhan Bundhe)
- **02:00-03:00**: Data Analysis using Python (P) (Mr. Aniket Alvekar)
- **03:00-04:00**: Business Communication Skills-II (P) (Mrs. Prachi Muskar)
- **04:00-05:00**: Business Communication Skills-II (P) (Mrs. Prachi Muskar)

### Saturday
- **10:15-11:00**: VAP (TBD)
- **11:00-12:00**: VAP (TBD)

## SQL Files Created

### 1. `update_timetable_mba_ba_sem2.sql`
This script updates the timetable table with the complete weekly schedule for MBA (BA) - II, Semester II.

**What it does**:
- Clears existing timetable entries
- Inserts all 38 timetable entries (Monday through Saturday)
- Each entry includes: day, subject title, subject code, start time, end time, and faculty name

**Usage**:
```sql
-- Run this file in your Supabase SQL Editor or via psql
\i sql-files/update_timetable_mba_ba_sem2.sql
```

### 2. `update_subjects_mba_ba_sem2.sql`
This script ensures all subjects for the semester exist in the subjects table.

**What it does**:
- Inserts or updates 8 subject records
- Includes subject code, title, icon emoji, color, and description with faculty info
- Uses UPSERT to avoid duplicates

**Usage**:
```sql
-- Run this file in your Supabase SQL Editor or via psql
\i sql-files/update_subjects_mba_ba_sem2.sql
```

## Execution Instructions

### Option 1: Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `update_subjects_mba_ba_sem2.sql`
5. Click **Run**
6. Repeat steps 3-5 for `update_timetable_mba_ba_sem2.sql`

### Option 2: Command Line (psql)
```bash
# Update subjects first
psql -h <your-host> -U <your-user> -d <your-database> -f sql-files/update_subjects_mba_ba_sem2.sql

# Then update timetable
psql -h <your-host> -U <your-user> -d <your-database> -f sql-files/update_timetable_mba_ba_sem2.sql
```

### Option 3: Run via Supabase CLI
```bash
# Update subjects
supabase db execute --file sql-files/update_subjects_mba_ba_sem2.sql

# Update timetable
supabase db execute --file sql-files/update_timetable_mba_ba_sem2.sql
```

## Verification

After running the SQL scripts, verify the data was inserted correctly:

### Verify Subjects
```sql
SELECT code, title, icon, color, description 
FROM public.subjects 
WHERE code LIKE 'PBA2%' 
ORDER BY code;
```

Expected: 8 rows (PBA204, PBA205, PBA206, PBA207, PBA208, PBA211, PBA212, PBA213)

### Verify Timetable
```sql
SELECT day, subject_title, subject_code, teacher, start_time, end_time 
FROM public.timetable 
ORDER BY 
  CASE day
    WHEN 'Monday' THEN 1
    WHEN 'Tuesday' THEN 2
    WHEN 'Wednesday' THEN 3
    WHEN 'Thursday' THEN 4
    WHEN 'Friday' THEN 5
    WHEN 'Saturday' THEN 6
  END,
  start_time;
```

Expected: 38 rows (6 for Mon-Fri, 2 for Saturday)

### Count by Day
```sql
SELECT day, COUNT(*) as class_count 
FROM public.timetable 
GROUP BY day 
ORDER BY 
  CASE day
    WHEN 'Monday' THEN 1
    WHEN 'Tuesday' THEN 2
    WHEN 'Wednesday' THEN 3
    WHEN 'Thursday' THEN 4
    WHEN 'Friday' THEN 5
    WHEN 'Saturday' THEN 6
  END;
```

Expected Output:
- Monday: 6
- Tuesday: 6
- Wednesday: 6
- Thursday: 6
- Friday: 6
- Saturday: 2

## Faculty Information

| Faculty Name | Subjects Taught |
|--------------|-----------------|
| Dr. Shailendra Baraniya | Production and Operations Management (PBA204) |
| Mr. Aniket Alvekar | Digital Transformation (PBA205), Data Analysis using Python (PBA211) |
| Adv. Vishal Jadhav | Legal Aspects of Business (PBA206) |
| Dr. Samadhan Bundhe | Data Visualization and Story Telling (PBA207), Data Analysis using Power BI (PBA212) |
| Dr. Zahir Shaikh | Business Research Methods (PBA208) |
| Mrs. Prachi Muskar | Business Communication Skills - II (PBA213) |

## Notes

- **(P)** indicates Practical sessions
- **(T)** indicates Tutorial sessions
- **VAP** = Value Added Program (details TBD)
- Location is set to "TBD" for all entries and can be updated later
- All progress values are initialized to 0

## Next Steps

1. Run both SQL scripts in order (subjects first, then timetable)
2. Verify the data using the verification queries above
3. Update location information if specific room numbers/buildings are known
4. Test the timetable widget in the CurricuLab application to ensure proper display
5. Update syllabus PDF URLs in the subjects table when available

## Troubleshooting

### Issue: Permission Denied
**Solution**: Ensure you're running the scripts as an authenticated user with write permissions.

### Issue: Duplicate Key Errors
**Solution**: The scripts are designed to handle duplicates. For subjects, we use UPSERT. For timetable, we delete all entries first.

### Issue: Foreign Key Violations
**Solution**: Run `update_subjects_mba_ba_sem2.sql` before `update_timetable_mba_ba_sem2.sql` to ensure subject references exist.

## Contact

For questions or issues with the timetable update:
- Check the RESEARCH_DOCUMENTATION.md for CurricuLab architecture details
- Review the timetable service at `lib/services/timetable-service.ts`
- Check the timetable widget at `components/web/TimetableWidget.tsx`
