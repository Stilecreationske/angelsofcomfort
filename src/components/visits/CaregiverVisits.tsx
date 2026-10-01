import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { useVisits, type Visit, visitTime } from '@/hooks/useVisits';
import { CompletedLog, VisitDetails } from './VisitCard';

function VisitEditor({ visit }: { visit: Visit }) {
  const log = visit.visit_logs[0];
  const [activities, setActivities] = useState(log?.activities ?? '');
  const [notes, setNotes] = useState(log?.summary ?? '');
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (action: 'arrive' | 'save' | 'complete') => {
      setSaved(false);
      const { error } = await supabase.rpc('record_visit', {
        p_assignment_id: visit.id, p_action: action, p_activities: activities, p_notes: notes,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      setSaved(true);
      await queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
  });
  return <article className="rounded-3xl border bg-white p-6 text-[#3c2b1c]">
    <VisitDetails visit={visit} />
    {visit.status === 'scheduled' && <Button className="mt-4" disabled={mutation.isPending} onClick={() => mutation.mutate('arrive')}>Record arrival</Button>}
    {visit.status === 'in_progress' && log && <div className="mt-4 space-y-4">
      <p>Arrived: {visitTime(log.visit_started_at)}</p>
      <label className="block" htmlFor={`activities-${visit.id}`}>Activities completed</label>
      <Textarea id={`activities-${visit.id}`} value={activities} onChange={e => { setActivities(e.target.value); setSaved(false); }} disabled={mutation.isPending} />
      <label className="block" htmlFor={`notes-${visit.id}`}>Visit notes (required before clock-out)</label>
      <Textarea id={`notes-${visit.id}`} value={notes} onChange={e => { setNotes(e.target.value); setSaved(false); }} disabled={mutation.isPending} required />
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" disabled={mutation.isPending} onClick={() => mutation.mutate('save')}>Save draft</Button>
        <Button disabled={mutation.isPending || !notes.trim()} onClick={() => mutation.mutate('complete')}>Clock out & submit log</Button>
      </div>
    </div>}
    <CompletedLog visit={visit} />
    {mutation.isPending && <p role="status" className="mt-3">Saving…</p>}
    {saved && <p role="status" className="mt-3">Saved.</p>}
    {mutation.error && <p role="alert" className="mt-3 text-red-700">{mutation.error.message}</p>}
  </article>;
}

export default function CaregiverVisits() {
  const visits = useVisits();
  return <section className="space-y-4">
    <div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-semibold">Assigned visits</h2><Button variant="outline" onClick={() => visits.refetch()} disabled={visits.isFetching}>Refresh visits</Button></div>
    {visits.isLoading && <p role="status">Loading assignments…</p>}
    {visits.error && <p role="alert" className="text-red-700">Could not load visits: {visits.error.message}</p>}
    {visits.isSuccess && visits.data.length === 0 && <p>No assignments yet.</p>}
    {visits.data?.map(visit => <VisitEditor key={`${visit.id}-${visit.visit_logs[0]?.id ?? 'scheduled'}`} visit={visit} />)}
  </section>;
}
