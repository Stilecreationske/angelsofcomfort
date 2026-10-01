import FamilyVisits from '@/components/visits/FamilyVisits';
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

        <FamilyVisits />
      </div>
    </main>
  );
};

export default FamilyDashboard;
