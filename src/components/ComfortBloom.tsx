import { Button } from '@/components/ui/button';

const ComfortBloom = () => {
  return (
    <section id="family-portal" className="relative overflow-hidden bg-[#0d362b] px-6 py-24 scroll-mt-28">
      <img
        src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1762789773/minibloomtransparent_vjrgud.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-6 -left-10 h-48 w-48 select-none opacity-80"
      />
    

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative">
            <h2
              className="mt-6 text-[42px] font-semibold leading-tight text-white sm:text-[42px]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              <span className="block">The</span>
              <span className="block">Comfort</span>
              <span className="block">Bloom</span>
            </h2>

            <div className="mt-4 h-[2px] w-28 bg-[#ba5927]" />

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#f7f0e4] sm:text-xl">
              Every new family receives a Comfort Bloom —
              <br />a hand-crocheted flower made with stillness and care.
            </p>
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-[#f7f0e4] sm:text-xl">
              It&apos;s not a gift.
              <br />It&apos;s a reminder that someone is walking beside you.
            </p>

            <Button
              size="lg"
              className="mt-12 h-auto rounded-full bg-[#ba5927] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 hover:bg-[#a04b1b]"
            >
              Learn More: Comfort Blooms
            </Button>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-t from-[#ba5927]/10 to-transparent blur-3xl" />
              <div className="relative overflow-hidden rounded-[40px] shadow-[0_30px_60px_-32px_rgba(70,45,25,0.5)]">
                <img
                  src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1761724635/new_bloom_flower_e_background_removal_f_png_zeifsp.png"
                  alt="Comfort bloom flower resting on cloth"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComfortBloom;
