-- =====================================================
-- WhatsApp Automation Cleanup Script
-- =====================================================
-- This script removes all WhatsApp automation components
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop triggers
DROP TRIGGER IF EXISTS trig_assignment_whatsapp ON assignments;
DROP TRIGGER IF EXISTS trig_announcement_whatsapp ON announcements;

-- Drop function
DROP FUNCTION IF EXISTS notify_whatsapp_update();

-- NOTE: We're keeping pg_net extension as it might be used elsewhere
-- If you're sure you don't need it, uncomment the line below:
-- DROP EXTENSION IF EXISTS pg_net;

-- =====================================================
-- Cleanup complete!
-- =====================================================
