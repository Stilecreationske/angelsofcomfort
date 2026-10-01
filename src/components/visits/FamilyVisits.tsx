import { Button } from '@/components/ui/button';
import { useVisits } from '@/hooks/useVisits';
import { CompletedLog, VisitDetails } from './VisitCard';

export default function FamilyVisits() {
  const visits = useVisits();
  const upcoming = visits.data?.filter(v => ['scheduled', 'in_progress'].includes(v.status)) ?? [];
  const completed = visits.data?.filter(v => v.visit_logs.some(log => log.visit_ended_at)).reverse() ?? [];
  return <section className="space-y-6">
    <Button variant="outline" onClick={() => visits.refetch()} disabled={visits.isFetching}>Refresh visits</Button>
    {visits.isLoading && <p role="status">Loading visits…</p>}
    {visits.error && <p role="alert" className="text-red-700">Could not load visits: {visits.error.message}</p>}
    <h2 className="text-2xl font-semibold">Scheduled & active visits</h2>
    {visits.isSuccess && !upcoming.length && <p>No upcoming visits assigned.</p>}
    {upcoming.map(visit => <article key={visit.id} className="rounded-3xl border bg-white p-6"><VisitDetails visit={visit} /></article>)}
    <h2 className="text-2xl font-semibold">Completed visit logs</h2>
    {visits.isSuccess && !completed.length && <p>No completed visit logs yet.</p>}
    {completed.map(visit => <article key={visit.id} className="rounded-3xl border bg-white p-6"><VisitDetails visit={visit} /><CompletedLog visit={visit} /></article>)}
  </section>;
}
