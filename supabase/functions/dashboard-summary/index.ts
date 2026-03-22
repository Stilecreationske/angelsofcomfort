import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('DASHBOARD_SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('DASHBOARD_SUPABASE_ANON_KEY') ?? '';

serve(async (req) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return new Response('Supabase credentials missing', { status: 500 });
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: { Authorization: authHeader },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError || profile?.role !== 'superadmin') {
    return new Response('Forbidden', { status: 403 });
  }

  const [caregiverApplications, comfortVisits, guideDownloads] = await Promise.all([
    supabase.from('caregiver_applications').select('*').order('created_at', { ascending: false }),
    supabase.from('comfort_visit_requests').select('*').order('created_at', { ascending: false }),
    supabase.from('guide_downloads').select('*').order('created_at', { ascending: false }),
  ]);

  if (caregiverApplications.error || comfortVisits.error || guideDownloads.error) {
    const message =
      caregiverApplications.error?.message ??
      comfortVisits.error?.message ??
      guideDownloads.error?.message ??
      'Unknown error';
    return new Response(message, { status: 500 });
  }

  return new Response(
    JSON.stringify({
      caregiver_applications: caregiverApplications.data ?? [],
      comfort_visit_requests: comfortVisits.data ?? [],
      guide_downloads: guideDownloads.data ?? [],
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );
});
