import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
const Newsletter = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim() || null,
        email: formData.email.trim().toLowerCase(),
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to subscribe',
          description: error.message,
        });
        return;
      }

      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'newsletter',
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim() || null,
            email: formData.email.trim().toLowerCase(),
          },
        },
      });

      toast({
        title: 'Welcome to the circle!',
        description: 'Thanks! Angels of Comfort Team will get back to you. Thanks for choosing Angels of Comfort.',
      });
      setFormData({ firstName: '', lastName: '', email: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: message,
      });
    }
  };

  return (
    <section id="contact" className="bg-[#f4e8da] px-6 py-24 scroll-mt-28">
      <div className="container mx-auto max-w-3xl text-center">
        <h2
          className="text-[38px] font-semibold text-[#3c2b1c] sm:text-[46px]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Comfort is a circle.
          <br />
          Join ours.
        </h2>

        <p
          className="mt-6 text-[18px] leading-relaxed text-[#3c2b1c] sm:text-[20px]"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          Stories of care. Gentle reminders. Ways to bring comfort home — shared once a month.
          <br />
          No spam. Just heart.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="rounded-[18px] border border-[#bfc5cf] bg-white py-4 text-lg text-[#2f2c29] placeholder:text-[#b0b6c1]"
              required
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="rounded-[18px] border border-[#bfc5cf] bg-white py-4 text-lg text-[#2f2c29] placeholder:text-[#b0b6c1]"
            />
          </div>

          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-[18px] border border-[#bfc5cf] bg-white py-4 text-lg text-[#2f2c29] placeholder:text-[#b0b6c1]"
            required
          />

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-sm bg-[hsl(var(--brand-orange))] py-5 text-lg font-semibold text-white shadow-lg shadow-[#d4844f]/25 transition-transform hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-orange))]/90"
          >
            Join The Circle
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
