import { type Visit, visitTime } from '@/hooks/useVisits';

export function VisitDetails({ visit }: { visit: Visit }) {
  return <>
    <h3 className="text-xl font-semibold">{visit.clients ? `${visit.clients.first_name} ${visit.clients.last_name}` : 'Client unavailable'}</h3>
    <p>{visitTime(visit.scheduled_for)} · {visit.visit_duration_minutes} minutes</p>
    <p className="text-sm capitalize">{visit.status.replace('_', ' ')}</p>
    {visit.notes && <p className="mt-2 whitespace-pre-wrap">Visit instructions: {visit.notes}</p>}
  </>;
}

export function CompletedLog({ visit }: { visit: Visit }) {
  const log = visit.visit_logs.find(item => item.visit_ended_at);
  if (!log) return null;
  return <div className="mt-4 space-y-2 border-t pt-4">
    <p>Arrival: {visitTime(log.visit_started_at)}</p>
    <p>Clock-out: {visitTime(log.visit_ended_at)}</p>
    <p className="whitespace-pre-wrap"><strong>Activities:</strong> {log.activities || 'None recorded'}</p>
    <p className="whitespace-pre-wrap"><strong>Visit notes:</strong> {log.summary}</p>
  </div>;
}
