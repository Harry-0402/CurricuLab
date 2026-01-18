import { supabase } from '@/utils/supabase/client';
import { AuthService } from './auth.service';

export interface ChangeLog {
    id: string;
    entityType: string;
    entityId: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changedBy: string;
    changes: any;
    timestamp: string;
}

export const ChangelogService = {
    async logChange(entityType: string | { entity_type: string, entity_id: string, action: 'CREATE' | 'UPDATE' | 'DELETE', changes?: any }, entityId?: string, action?: 'CREATE' | 'UPDATE' | 'DELETE', changes?: any) {
        // Get current user to attribute the change
        const user = await AuthService.getCurrentUser();
        const changedBy = user ? (user.email || user.id) : 'Guest/System';

        let logEntry;
        if (typeof entityType === 'object') {
            logEntry = {
                entity_type: entityType.entity_type,
                entity_id: entityType.entity_id,
                action: entityType.action,
                changes: entityType.changes || {}
            };
        } else {
            logEntry = {
                entity_type: entityType,
                entity_id: entityId,
                action: action,
                changes: changes || {}
            };
        }

        const { error } = await supabase
            .from('change_logs')
            .insert({
                entity_type: logEntry.entity_type,
                entity_id: logEntry.entity_id,
                action: logEntry.action,
                changed_by: changedBy,
                changes: logEntry.changes
            });

        if (error) {
            console.error('Failed to log change:', error);
        }
    },

    async getRecentChanges(limit = 20): Promise<ChangeLog[]> {
        const { data, error } = await supabase
            .from('change_logs')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Failed to fetch changelogs:', error);
            return [];
        }

        return data.map(log => ({
            id: log.id,
            entityType: log.entity_type,
            entityId: log.entity_id,
            action: log.action,
            changedBy: log.changed_by,
            changes: log.changes,
            timestamp: log.timestamp
        }));
    }
};
