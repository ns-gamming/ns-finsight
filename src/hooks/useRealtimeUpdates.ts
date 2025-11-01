import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseRealtimeUpdatesProps {
  table: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  enabled?: boolean;
}

export const useRealtimeUpdates = ({
  table,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeUpdatesProps) => {
  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel(`schema-db-changes-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload.new);
              toast.success(`New ${table} added!`, {
                description: 'Your data has been updated in real-time.',
              });
              break;
            case 'UPDATE':
              onUpdate?.(payload.new);
              toast.info(`${table} updated`, {
                description: 'Changes detected in your data.',
              });
              break;
            case 'DELETE':
              onDelete?.(payload.old);
              toast.error(`${table} deleted`, {
                description: 'An item has been removed.',
              });
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onInsert, onUpdate, onDelete, enabled]);
};
