import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export interface VisitLog {
  id: string;
  visit_started_at: string | null;
  visit_ended_at: string | null;
  activities: string;
  summary: string | null;
}
export interface Visit {
  id: string;
  scheduled_for: string | null;
  visit_duration_minutes: number | null;
  status: string;
  notes: string | null;
  clients: { first_name: string; last_name: string } | null;
  visit_logs: VisitLog[];
}
export const visitTime = (value: string | null) => value ? new Date(value).toLocaleString() : 'Not scheduled';

export function useVisits() {
  const { profile } = useAuth();
  return useQuery({
    queryKey: ['visits', profile?.user_id, profile?.role],
    enabled: profile?.status === 'active',
    queryFn: async (): Promise<Visit[]> => {
      const { data, error } = await supabase.from('caregiver_assignments')
        .select('id, scheduled_for, visit_duration_minutes, status, notes, clients(first_name, last_name), visit_logs(id, visit_started_at, visit_ended_at, activities, summary)')
        .order('scheduled_for', { ascending: true });
      if (error) throw error;
      return data as unknown as Visit[];
    },
    // Refetch on focus and periodically so other portals see saved changes.
    refetchInterval: 30_000,
  });
}
