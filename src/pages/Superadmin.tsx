import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { verifyUserRole } from '@/lib/auth';

const Superadmin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  useEffect(() => {
    if (!profile) return;
    if (profile.role === 'superadmin') {
      navigate('/superadmin/dashboard', { replace: true });
      return;
    }
    if (profile.role === 'caregiver') {
      navigate('/caregiver', { replace: true });
      return;
    }
    if (profile.role === 'family') {
      navigate('/family', { replace: true });
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to sign in',
          description: error.message,
        });
        return;
      }
      try {
        await verifyUserRole('superadmin');
        await refreshProfile();
        toast({
          title: 'Superadmin login successful',
          description:
            'Thanks! Angels of Comfort Team will get back to you. Thanks for choosing Angels of Comfort.',
        });
        setCredentials({ email: '', password: '' });
        navigate('/superadmin/dashboard', { replace: true });
      } catch (roleError) {
        const message =
          roleError instanceof Error
            ? roleError.message
            : 'We could not confirm your superadmin access. Please contact Angels of Comfort.';
        toast({
          variant: 'destructive',
          title: 'Access issue',
          description: message,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f0ec] px-6 py-24">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_28px_60px_-32px_rgba(70,45,25,0.45)]">
        <h1 className="text-3xl font-bold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
          Superadmin Access
        </h1>
        <p className="mt-2 text-sm text-[#2b1e14]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          Restricted area for Angels of Comfort leadership.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="superadmin-email" className="text-sm font-medium text-[#3c2b1c]">
              Email
            </label>
            <Input
              id="superadmin-email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="superadmin-password" className="text-sm font-medium text-[#3c2b1c]">
              Password
            </label>
            <Input
              id="superadmin-password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Superadmin;
