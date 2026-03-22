import { Button } from '@/components/ui/button';
import { emitOpenModal } from '@/lib/modal-events';

const Hero = () => {
  return (
    <section id="home" className="relative isolate min-h-[720px] overflow-hidden pt-[220px] sm:pt-[240px]">
      <img
        src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1761725093/hero_new_image_kk3xea.png"
        alt="Caregiver sharing a joyful moment with an older adult"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      <div className="relative z-10 flex min-h-[720px] flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="flex w-full justify-center lg:justify-end">
          <div className="w-full max-w-[560px] p-8 text-left text-white sm:p-10 lg:p-12">
            <h1 className="font-serif text-[52px] leading-tight text-white drop-shadow-lg">
              Care That Feels Human Again.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white drop-shadow-lg lg:text-xl">
              We don't just provide homecare. We slow down, listen, and show up. For families in
              Maryland, our care feels less like a service... and more like home.
            </p>

            <div className="mt-10 flex flex-col gap-4 text-left sm:flex-row sm:justify-end sm:text-left">
              <Button
                size="lg"
                className="h-auto rounded-full bg-[hsl(var(--brand-orange))] px-8 py-5 text-lg font-semibold text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-orange))]/90"
                onClick={() => emitOpenModal('get-started')}
              >
                <span className="block whitespace-normal leading-snug">
                  Book Your Free Comfort Visit
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-auto rounded-full border-white/70 bg-white px-8 py-5 text-lg font-semibold text-[#3c2b1c] hover:bg-white/90"
                onClick={() => emitOpenModal('guide-download')}
              >
                <span className="block whitespace-normal leading-snug text-[#3c2b1c]">
                  Download Free Guide
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
