import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useQuery } from '@tanstack/react-query';

interface CaregiverApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string | null;
  status: string;
  created_at: string;
}

interface ComfortVisitRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  created_at: string;
}

interface GuideDownload {
  id: string;
  first_name: string;
  email: string;
  created_at: string;
}

interface DashboardSummary {
  caregiver_applications: CaregiverApplication[];
  comfort_visit_requests: ComfortVisitRequest[];
  guide_downloads: GuideDownload[];
}

const formatDate = (value?: string) => {
  if (!value) return '—';
  const dt = new Date(value);
  return dt.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const SuperadminDashboard = () => {
  const { session, profile } = useAuth();
  const displayName =
    (profile?.first_name && profile.first_name.length > 0
      ? profile.first_name
      : profile?.email) ??
    session?.user.email ??
    '';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const links = [
    { id: 'overview', label: 'Family & Caregiver Overview' },
    { id: 'revenue', label: 'Revenue Snapshot' },
    { id: 'applications', label: 'Caregiver Applications' },
    { id: 'broadcast', label: 'Broadcast Messages' },
    { id: 'requests', label: 'Comfort Visit Requests' },
    { id: 'guides', label: 'Guide Downloads' },
  ];

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const { data: summary, error: fnError } = await supabase.functions.invoke('dashboard-summary');
      if (fnError) throw new Error(fnError.message);
      return summary as DashboardSummary;
    },
    enabled: profile?.role === 'superadmin',
    staleTime: 60_000,
  });

  const caregiverCount = data?.caregiver_applications.length ?? 0;
  const comfortCount = data?.comfort_visit_requests.length ?? 0;
  const guideCount = data?.guide_downloads.length ?? 0;

  return (
    <main className="min-h-screen bg-[#f0edf6] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <aside className="sticky top-24 rounded-3xl bg-white p-6 shadow-[0_25px_60px_-35px_rgba(38,28,18,0.35)] lg:w-72">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#ba5927]">Control Center</p>
            <p className="mt-2 text-base text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
              Signed in as
              <br />
              <span className="font-semibold">{displayName}</span>
            </p>
          </div>
          <nav className="mt-6 space-y-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="flex items-center justify-between rounded-2xl border border-[#ba5927]/20 px-4 py-3 text-sm font-semibold text-[#3c2b1c] transition hover:border-[#ba5927] hover:bg-[#ba5927]/10"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="w-full rounded-full border border-[#ba5927] bg-transparent py-3 text-sm font-semibold text-[#ba5927] hover:bg-[#ba5927]/10"
            >
              {isFetching ? 'Refreshing…' : 'Refresh data'}
            </Button>
            <Button
              onClick={handleSignOut}
              className="w-full rounded-full bg-[#ba5927] py-3 text-white hover:bg-[#a04b1b]"
            >
              Sign out
            </Button>
          </div>
        </aside>

        <div className="flex-1 space-y-10">
          <header className="rounded-3xl border border-[#ba5927]/20 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-[#ba5927]">
              Superadmin Control Center
            </p>
            <h1
              className="mt-3 text-4xl font-bold text-[#3c2b1c]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Good day{displayName ? `, ${displayName}` : ''}.
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-[#2b1e14]">
              Assign caregivers, review applications, monitor revenue, and keep every family cared
              for with presence and ease.
            </p>
            {error && (
              <p className="mt-4 rounded-2xl bg-[#ba5927]/10 p-4 text-sm text-[#a0380f]">
                {error.message}
              </p>
            )}
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Caregiver Applications', value: caregiverCount },
              { label: 'Comfort Visit Requests', value: comfortCount },
              { label: 'Guide Downloads', value: guideCount },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-[#ba5927]/30 bg-white/90 p-5 text-center shadow-sm"
              >
                <p className="text-sm uppercase tracking-[0.25em] text-[#ba5927]">{stat.label}</p>
                <p className="mt-3 text-4xl font-bold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                  {isLoading ? '—' : stat.value}
                </p>
              </div>
            ))}
          </section>

          <section id="overview" className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                Family & Caregiver Overview
              </h2>
              <p className="mt-2 text-sm text-[#2b1e14]">
                Later this space will visualize active clients, matching families, and which
                caregivers are on duty. For now consider it a warm placeholder while we finish the
                data connections.
              </p>
              <div className="mt-4 rounded-2xl border border-dashed border-[#ba5927]/40 p-6 text-center text-sm text-[#2b1e14]/70">
                Dashboard cards coming soon. Use this as a reminder to define the key metrics you
                want to see every morning.
              </div>
            </article>

            <article
              id="revenue"
              className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                Revenue Snapshot
              </h2>
              <p className="mt-2 text-sm text-[#2b1e14]">
                Track upcoming invoices, monthly totals, and overdue balances.
              </p>
              <div className="mt-4 rounded-2xl border border-dashed border-[#ba5927]/40 p-4 text-center text-sm text-[#2b1e14]/70">
                Metrics will display here once payment tracking is connected.
              </div>
            </article>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <article
              id="applications"
              className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                Pending Caregiver Applications
              </h2>
              <p className="mt-2 text-sm text-[#2b1e14]">
                Review new candidates from the public site and invite them to join the calling.
              </p>
              <div className="mt-4 rounded-2xl border border-dashed border-[#ba5927]/40 p-4 text-center text-sm text-[#2b1e14]/70">
                No pending applications. You&apos;ll receive an email once someone applies.
              </div>
            </article>

            <article
              id="broadcast"
              className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                Broadcast Messages
              </h2>
              <p className="mt-2 text-sm text-[#2b1e14]">
                Send heartfelt updates or urgent notices to families and caregivers in just a few
                clicks.
              </p>
              <div className="mt-4 rounded-2xl border border-dashed border-[#ba5927]/40 p-4 text-center text-sm text-[#2b1e14]/70">
                Messaging tools will live here as we wire up Supabase functions for outreach.
              </div>
            </article>
          </section>

          <section id="requests" className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                  Comfort Visit Requests
                </h2>
                <p className="text-sm text-[#2b1e14]">Families who asked for support via Get Started.</p>
              </div>
            </div>
            <div className="mt-4 max-h-96 overflow-auto rounded-2xl border border-[#ba5927]/20">
              <table className="w-full min-w-[520px] text-left text-sm text-[#2b1e14]">
                <thead className="bg-[#f7efe7] text-xs uppercase tracking-wide text-[#3c2b1c]">
                  <tr>
                    <th className="px-4 py-3">Family</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.comfort_visit_requests ?? []).length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-center text-[#6a5a4a]" colSpan={5}>
                        {isLoading ? 'Loading requests…' : 'No comfort visits recorded yet.'}
                      </td>
                    </tr>
                  ) : (
                    data?.comfort_visit_requests.map((item) => (
                      <tr key={item.id} className="border-b border-[#f3e2d4]">
                        <td className="px-4 py-3 font-semibold">{`${item.first_name} ${item.last_name}`}</td>
                        <td className="px-4 py-3">{item.city}</td>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3">{item.phone}</td>
                        <td className="px-4 py-3 text-[#6a5a4a]">{formatDate(item.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                Caregiver Applications
              </h2>
              <p className="mt-2 text-sm text-[#2b1e14]">Latest submissions from Become a Caregiver.</p>
              <div className="mt-4 max-h-80 overflow-auto rounded-2xl border border-[#ba5927]/20">
                <table className="w-full min-w-[420px] text-left text-sm text-[#2b1e14]">
                  <thead className="bg-[#f7efe7] text-xs uppercase tracking-wide text-[#3c2b1c]">
                    <tr>
                      <th className="px-4 py-3">Applicant</th>
                      <th className="px-4 py-3">City</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.caregiver_applications ?? []).length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-center text-[#6a5a4a]" colSpan={5}>
                          {isLoading ? 'Loading applications…' : 'No caregiver applications yet.'}
                        </td>
                      </tr>
                    ) : (
                      data?.caregiver_applications.map((item) => (
                        <tr key={item.id} className="border-b border-[#f3e2d4]">
                          <td className="px-4 py-3 font-semibold">{`${item.first_name} ${item.last_name}`}</td>
                          <td className="px-4 py-3">{item.city ?? '—'}</td>
                          <td className="px-4 py-3">{item.email}</td>
                          <td className="px-4 py-3 capitalize">{item.status ?? 'pending'}</td>
                          <td className="px-4 py-3 text-[#6a5a4a]">{formatDate(item.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article
              id="guides"
              className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                Guide Downloads
              </h2>
              <p className="mt-2 text-sm text-[#2b1e14]">
                Leads captured before receiving the Quiet Signs guide.
              </p>
              <div className="mt-4 max-h-80 overflow-auto rounded-2xl border border-[#ba5927]/20">
                <table className="w-full min-w-[360px] text-left text-sm text-[#2b1e14]">
                  <thead className="bg-[#f7efe7] text-xs uppercase tracking-wide text-[#3c2b1c]">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Downloaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.guide_downloads ?? []).length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-center text-[#6a5a4a]" colSpan={3}>
                          {isLoading ? 'Loading leads…' : 'No guide downloads yet.'}
                        </td>
                      </tr>
                    ) : (
                      data?.guide_downloads.map((item) => (
                        <tr key={item.id} className="border-b border-[#f3e2d4]">
                          <td className="px-4 py-3 font-semibold">{item.first_name || '—'}</td>
                          <td className="px-4 py-3">{item.email}</td>
                          <td className="px-4 py-3 text-[#6a5a4a]">{formatDate(item.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SuperadminDashboard;
