import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const FamilyDashboard = () => {
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

  return (
    <main className="min-h-screen bg-[#fffbf7] px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#ba5927]">
              Family Portal
            </p>
            <h1
              className="mt-2 text-4xl font-bold text-[#3c2b1c]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Welcome back{displayName ? `, ${displayName}` : ''}.
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-[#2b1e14]">
              Track upcoming caregiver visits, see detailed activity logs, and receive gentle
              reminders for your loved one&apos;s care.
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            className="self-start rounded-full bg-[#ba5927] px-6 py-3 text-white hover:bg-[#a04b1b]"
          >
            Sign out
          </Button>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
              Upcoming Visits
            </h2>
            <p className="mt-2 text-sm text-[#2b1e14]">
              When the superadmin assigns a caregiver, you will see the date, time, and focus of the
              visit here.
            </p>
            <div className="mt-4 rounded-2xl border border-dashed border-[#ba5927]/40 p-4 text-center text-sm text-[#2b1e14]/70">
              No visits assigned yet. You&apos;ll receive an email once the first visit is scheduled.
            </div>
          </article>

          <article className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
              Caregiver Activity Log
            </h2>
            <p className="mt-2 text-sm text-[#2b1e14]">
              After each visit, caregivers record highlights, medications given, and moments of joy.
            </p>
            <div className="mt-4 rounded-2xl border border-dashed border-[#ba5927]/40 p-4 text-center text-sm text-[#2b1e14]/70">
              Logs will populate here once a caregiver submits them.
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

export default FamilyDashboard;
