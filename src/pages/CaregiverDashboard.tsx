import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const CaregiverDashboard = () => {
  const { session, profile } = useAuth();
  const displayName =
    (profile?.first_name && profile.first_name.length > 0
      ? profile.first_name
      : profile?.email) ??
    session?.user.email ??
    'caregiver';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <main className="min-h-screen bg-[#f5f0ec] px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#ba5927]">
              Caregiver Portal
            </p>
            <h1
              className="mt-2 text-4xl font-bold text-[#3c2b1c]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Hello {displayName}.
            </h1>
            <p className="mt-2 max-w-2xl text-lg text-[#2b1e14]">
              Review your current assignments, prepare for upcoming visits, and log moments that
              mattered for each family.
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
              Today&apos;s Assignments
            </h2>
            <p className="mt-2 text-sm text-[#2b1e14]">
              The superadmin will assign visits with start time, location, and special notes.
            </p>
            <div className="mt-4 rounded-2xl border border-dashed border-[#ba5927]/40 p-4 text-center text-sm text-[#2b1e14]/70">
              No assignments yet. You&apos;ll be notified once your first family is scheduled.
            </div>
          </article>

          <article className="rounded-3xl border border-[#ba5927]/40 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
              Visit Log Drafts
            </h2>
            <p className="mt-2 text-sm text-[#2b1e14]">
              Capture arrival times, activities completed, and recommendations while they&apos;re
              fresh.
            </p>
            <div className="mt-4 rounded-2xl border border-dashed border-[#ba5927]/40 p-4 text-center text-sm text-[#2b1e14]/70">
              Draft entries will appear here for quick edits before you submit them.
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

export default CaregiverDashboard;
