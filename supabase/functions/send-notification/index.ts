import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type PayloadType =
  | { type: 'comfort_visit'; data: Record<string, unknown> }
  | { type: 'caregiver_application'; data: Record<string, unknown> }
  | { type: 'newsletter'; data: Record<string, unknown> }
  | { type: 'guide_download'; data: Record<string, unknown> };

const RESEND_URL = 'https://api.resend.com/emails';

const templateSubject: Record<PayloadType['type'], string> = {
  comfort_visit: 'New Comfort Visit Request',
  caregiver_application: 'New Caregiver Application',
  newsletter: 'New Newsletter Subscriber',
  guide_download: 'New Guide Download Lead',
};

const destinationEmail = Deno.env.get('NOTIFICATION_EMAIL') ?? 'care@angelsofcomfort.com';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    return new Response('Resend API key not configured', { status: 500 });
  }

  try {
    const payload = (await req.json()) as PayloadType;
    const { type, data } = payload;

    const subject = templateSubject[type] ?? 'New Angels of Comfort Notification';
    const htmlBody = `<p>${subject}</p><pre>${JSON.stringify(data, null, 2)}</pre>`;

    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Angels of Comfort <notifications@angelsofcomfort.com>',
        to: [destinationEmail],
        subject,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(message, { status: 500 });
  }
});
