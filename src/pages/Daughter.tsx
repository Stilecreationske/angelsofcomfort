import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { emitOpenModal } from '@/lib/modal-events';

const bulletColumns = [
  {
    title: 'Relief\nfor You',
    points: [
      'Caregivers who show up when they say they will',
      'Flexible scheduling that fits your life, not the other way around',
      "A Comfort Lead who gives you weekly updates so you're never in the dark",
    ],
    icon: '🌸',
  },
  {
    title: 'Dignity\nfor Them',
    points: [
      'Gentle help with bathing, dressing, meals',
      'Daily presence that feels like companionship, not clinical duty',
      'Caregivers matched by personality, not just availability',
    ],
    icon: '❤️',
  },
  {
    title: 'Trust\nfor Everyone',
    points: [
      'Licensed, bonded, and insured for peace of mind',
      'Consistent caregivers — no endless rotation',
      "Founder-led matching process so you know who's coming to your home",
    ],
    icon: '🕊️',
  },
];

const Daughter = () => {
  return (
    <div className="bg-[#f7f1ea]">
      <Navbar />
      <main className="space-y-12 pt-32 lg:pt-36">
        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-[42px] bg-white p-6 shadow-[0_50px_90px_-45px_rgba(34,23,15,0.45)] lg:grid-cols-2 lg:p-12">
            <div className="flex flex-col justify-center gap-6 text-[#3c2b1c]">
              <h1
                className="text-4xl font-bold leading-snug lg:text-[46px]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                You’ve been carrying it all. Now let us walk beside you.
              </h1>
              <p className="text-lg leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                Aging with dignity shouldn’t mean carrying it all alone. We bring peace back for you,
                and for the one you love.
              </p>
              <div className="flex flex-col gap-2 text-base text-[#3c2b1c]">
                <p>
                  Prefer to call?{' '}
                  <a className="font-semibold underline-offset-4 hover:underline" href="tel:12402190308">
                    (240) 219-0308
                  </a>
                </p>
                <p>
                  Or text at{' '}
                  <a className="font-semibold underline-offset-4 hover:underline" href="tel:12404263304">
                    (240) 426-3304
                  </a>
                </p>
              </div>
              <Button
                size="lg"
                className="mt-4 h-auto w-full rounded-full bg-[#ba5927] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#a54c23]/40 transition hover:-translate-y-0.5 hover:bg-[#a04b1b]"
                onClick={() => emitOpenModal('get-started')}
              >
                Book Your Free Comfort Consultation
              </Button>
            </div>
            <div className="overflow-hidden rounded-[32px] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)]">
              <img
                src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1763129531/daughtercroppedwell_d1v4nh.png"
                alt="Daughter caring for her mother"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-[#fdf4ea] p-8 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.4)] sm:p-10">
            <h2 className="text-3xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
              Why This Page Exists
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#2b1e14]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              We built Angels of Comfort because we’ve been in your shoes. This isn’t about tasks and checklists. It’s about
              restoring peace — for you, and for the one you love.
            </p>
            <blockquote className="mt-6 rounded-2xl bg-white/90 p-6 text-lg italic text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
              “For the first time in months, I slept through the night — knowing someone was there.” – Rachel, daughter of our client
            </blockquote>
          </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-[#ba5927]">
                How We Help You and Your Loved One
              </p>
              <h2
                className="mt-3 text-[38px] font-semibold text-[#3c2b1c]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                You’ve been carrying the weight — appointments, logistics, late-night worry.
                Here’s how we bring peace back into your family’s rhythm:
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {bulletColumns.map((column) => (
                <div key={column.title} className="rounded-[28px] border border-[#ba5927]/20 bg-[#fffbf7] p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.45)]">
                  <div className="text-3xl">{column.icon}</div>
                  <h3
                    className="mt-4 text-2xl font-semibold text-[#3c2b1c]"
                    style={{ fontFamily: "'Lora', serif", whiteSpace: 'pre-line' }}
                  >
                    {column.title}
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#2b1e14]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    {column.points.map((item) => (
                      <li key={item} className="border-l-2 border-[#ba5927]/40 pl-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#ba5927] px-4 py-16 text-white sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2
              className="text-[36px] font-semibold"
              style={{ fontFamily: "'Lora', serif" }}
            >
              The Comfort Promise
            </h2>
            <p className="mt-4 text-lg leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              We only accept as many families as we can serve with intention. No rotation mills. No cut corners. Just presence,
              professionalism, and peace.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-[28px] bg-white p-5 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.5)]">
                <div className="rounded-[20px] border border-[#ba5927]/30 p-5 text-center">
                  <p className="text-lg font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                    Ready to choose steady support?
                  </p>
                  <Button
                    size="lg"
                    className="mt-5 h-auto w-full rounded-full bg-[#ba5927] px-5 py-3 text-base font-semibold text-white shadow-[0_15px_30px_-20px_rgba(0,0,0,0.6)] hover:bg-[#a04b1b]"
                    onClick={() => emitOpenModal('get-started')}
                  >
                    Book Your Free Comfort Consultation
                  </Button>
                </div>
              </div>
              <div className="rounded-[28px] bg-white p-6 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.5)]">
                <h3 className="text-2xl font-semibold text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                  About Veronica
                </h3>
                <p className="mt-4 text-lg italic text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
                  “I founded Angels of Comfort because of Anna — our very first client. Walking alongside her showed me what families
                  truly need…”
                </p>
                <p className="mt-4 font-semibold text-[#ba5927]" style={{ fontFamily: "'Great Vibes', cursive" }}>
                  Veronica Karendi, Founder
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Daughter;
