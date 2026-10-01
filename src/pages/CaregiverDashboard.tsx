import CaregiverVisits from '@/components/visits/CaregiverVisits';
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

        <CaregiverVisits />
      </div>
    </main>
  );
};

export default CaregiverDashboard;
