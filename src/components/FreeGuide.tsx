import { Button } from '@/components/ui/button';
import { emitOpenModal } from '@/lib/modal-events';

const checklistItems = [
  'Practical tips',
  'Emotional reassurance',
  'Delivered instantly to your inbox',
];

const FreeGuide = () => {
  return (
    <section className="relative overflow-hidden">
      <img
        src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1760089769/background_image_x2ttt9.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="relative z-10 flex min-h-[520px] items-center px-6 py-20 sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-4xl lg:ml-0">
          <h2
            className="text-[37px] font-bold leading-snug text-[#3c2b1c] sm:text-[37px]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            7 Quiet Signs Your Loved One May Need Extra Support
            <span className="block text-[32px] italic text-[#3c2b1c]" style={{ fontFamily: "'Lora', serif" }}>
              (Even If They Say They&apos;re Fine)
            </span>
          </h2>

          <ul className="mt-8 space-y-4 text-[23.7px] text-[#2b1e14]" style={{ fontFamily: "'Lora', serif" }}>
            {checklistItems.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#3c2b1c] text-white">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 10 3 3 7-7" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="mt-10 h-auto rounded-sm bg-[hsl(var(--brand-orange))] px-12 py-5 text-lg font-semibold text-white shadow-lg shadow-[#c9783f]/30 transition-transform hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-orange))]/90"
            onClick={() => emitOpenModal('guide-download')}
          >
            Download Free Guide
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FreeGuide;
