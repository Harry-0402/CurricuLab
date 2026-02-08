-- Add missing INSERT policy for whatsapp_groups table

CREATE POLICY "Anyone can register WhatsApp groups" ON whatsapp_groups
    FOR INSERT WITH CHECK (true);

-- Optional: Add UPDATE policy if you want users to edit groups later
CREATE POLICY "Anyone can update WhatsApp groups" ON whatsapp_groups
    FOR UPDATE USING (true);

-- Optional: Add DELETE policy if you want users to delete groups later
CREATE POLICY "Anyone can delete WhatsApp groups" ON whatsapp_groups
    FOR DELETE USING (true);
