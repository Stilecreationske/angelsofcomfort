import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { useVisits } from '@/hooks/useVisits';
import { CompletedLog, VisitDetails } from './VisitCard';

export default function AssignVisit() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const visits = useVisits();
  const [clientId, setClientId] = useState('');
  const [success, setSuccess] = useState(false);
  const options = useQuery({
    queryKey: ['visit-options', profile?.user_id],
    enabled: profile?.role === 'superadmin' && profile.status === 'active',
    queryFn: async () => {
      const [clients, people] = await Promise.all([
        supabase.from('clients').select('id, first_name, last_name, family_contact').eq('status', 'active').order('first_name'),
        supabase.from('profiles').select('user_id, first_name, last_name, email, role').eq('status', 'active').in('role', ['caregiver', 'family']).order('first_name'),
      ]);
      if (clients.error) throw clients.error;
      if (people.error) throw people.error;
      return { clients: clients.data, people: people.data };
    },
  });
  const mutation = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      setSuccess(false);
      const values = new FormData(form);
      const { error } = await supabase.rpc('create_assigned_visit', {
        p_client_id: clientId || null,
        p_caregiver_id: values.get('caregiver'),
        p_scheduled_for: new Date(String(values.get('start'))).toISOString(),
        p_duration: Number(values.get('duration')),
        p_instructions: values.get('instructions'),
        p_first_name: values.get('first_name') ?? '',
        p_last_name: values.get('last_name') ?? '',
        p_family_id: values.get('family') || null,
      });
      if (error) throw error;
    },
    onSuccess: async (_, form) => {
      form.reset();
      setClientId('');
      setSuccess(true);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['visits'] }),
        queryClient.invalidateQueries({ queryKey: ['visit-options'] }),
      ]);
    },
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(event.currentTarget);
  };
  const families = options.data?.people.filter(p => p.role === 'family') ?? [];
  const caregivers = options.data?.people.filter(p => p.role === 'caregiver') ?? [];
  const clients = options.data?.clients.filter(c => families.some(f => f.user_id === c.family_contact)) ?? [];
  const selectClass = 'w-full rounded-md border bg-white px-3 py-2';
  return <section id="visits" className="space-y-4 rounded-3xl border bg-white p-6">
    <h2 className="text-2xl font-semibold">Create & assign a visit</h2>
    {options.isLoading && <p role="status">Loading clients and portal users…</p>}
    {options.error && <div role="alert"><p>Could not load assignment options: {options.error.message}</p><Button variant="outline" onClick={() => options.refetch()}>Retry</Button></div>}
    {options.isSuccess && <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={mutation.isPending} className="space-y-4">
        <label className="block">Client
          <select className={selectClass} value={clientId} onChange={e => setClientId(e.target.value)}>
            <option value="">Create a new client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
          </select>
        </label>
        {!clientId && <>
          <label className="block">Client first name<Input name="first_name" required /></label>
          <label className="block">Client last name<Input name="last_name" required /></label>
          <label className="block">Family contact
            <select name="family" className={selectClass} required defaultValue=""><option value="" disabled>Select a family portal user</option>{families.map(p => <option key={p.user_id} value={p.user_id}>{p.first_name} {p.last_name} ({p.email})</option>)}</select>
          </label>
        </>}
        <label className="block">Assigned caregiver
          <select name="caregiver" className={selectClass} required defaultValue=""><option value="" disabled>Select a caregiver</option>{caregivers.map(p => <option key={p.user_id} value={p.user_id}>{p.first_name} {p.last_name} ({p.email})</option>)}</select>
        </label>
        <label className="block">Start time (your local time)<Input name="start" type="datetime-local" required /></label>
        <label className="block">Duration in minutes<Input name="duration" type="number" min="1" step="1" defaultValue="60" required /></label>
        <label className="block">Visit location & instructions<Textarea name="instructions" /></label>
        {(!families.length || !caregivers.length) && <p>Add active caregiver and family portal accounts before assigning a visit.</p>}
        <Button type="submit" disabled={!families.length || !caregivers.length}>{mutation.isPending ? 'Assigning…' : 'Create & assign visit'}</Button>
      </fieldset>
    </form>}
    {mutation.error && <p role="alert" className="text-red-700">{mutation.error.message}</p>}
    {success && <p role="status">Visit assigned. It is now visible in the caregiver and family portals.</p>}
    <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-semibold">Visits</h3><Button variant="outline" onClick={() => visits.refetch()} disabled={visits.isFetching}>Refresh visits</Button></div>
    {visits.isLoading && <p role="status">Loading visits…</p>}
    {visits.error && <p role="alert" className="text-red-700">Could not load visits: {visits.error.message}</p>}
    {visits.isSuccess && !visits.data.length && <p>No visits assigned yet.</p>}
    {visits.data?.map(visit => <article key={visit.id} className="rounded-2xl border p-4"><VisitDetails visit={visit} /><CompletedLog visit={visit} /></article>)}
  </section>;
}
