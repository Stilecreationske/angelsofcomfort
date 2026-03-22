import { supabase } from '@/lib/supabaseClient';
import type { Profile, UserRole } from '@/context/AuthContext';

export const verifyUserRole = async (expectedRole: UserRole): Promise<Profile> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('No active session found. Please try signing in again.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, email, first_name, last_name, role, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    await supabase.auth.signOut();
    throw new Error(
      'Profile not configured. Please contact Angels of Comfort so your invitation can be activated.',
    );
  }

  if (data.status !== 'active') {
    await supabase.auth.signOut();
    throw new Error(
      'Your account is not active yet. Please reach out to Angels of Comfort support for assistance.',
    );
  }

  if (data.role !== expectedRole) {
    await supabase.auth.signOut();
    throw new Error(
      'This email is assigned to a different portal. Please use the correct portal link sent to you.',
    );
  }

  return data as Profile;
};
