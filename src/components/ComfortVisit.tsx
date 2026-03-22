import { Button } from '@/components/ui/button';
import { emitOpenModal } from '@/lib/modal-events';

const ComfortVisit = () => {
  return (
    <section id="caregiver-portal" className="bg-[#f5f0ec] px-6 py-24 scroll-mt-28">
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[420px] rounded-[36px] bg-[#ede0d1] p-6 shadow-[0_26px_60px_-28px_rgba(70,45,25,0.45)]">
              <div className="rounded-[28px] bg-white/85 p-6">
                <img
                  src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1760090147/lady_with_cross_bag_l5dzec.png"
                  alt="Caregiver ready for a comfort visit"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="lg:pl-12">
            <h2
              className="text-[44.5px] font-semibold leading-snug text-[#3c2b1c]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              <span className="block">Try Our Gifted</span>
              <span className="block">Visit — Free.</span>
              <span className="block">No Pressure.</span>
              <span className="block">Just Care.</span>
            </h2>

            <p className="mt-8 space-y-2 text-[23px] leading-relaxed text-[#2b1e14]" style={{ fontFamily: "'Lora', serif" }}>
              <span className="block">3 hours of joyful, respectful company for your loved one.</span>
              <span className="block">No obligation.</span>
              <span className="block">Just comfort.</span>
            </p>

            <Button
              size="lg"
              className="mt-12 h-auto rounded-sm bg-[hsl(var(--brand-orange))] px-12 py-5 text-lg font-semibold text-white shadow-lg shadow-[#c9783f]/25 transition-transform hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-orange))]/90"
              onClick={() => emitOpenModal('get-started')}
            >
              Book Your Comfort Visit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComfortVisit;
