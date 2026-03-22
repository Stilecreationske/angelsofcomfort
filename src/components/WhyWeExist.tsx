const WhyWeExist = () => {
  return (
    <section id="about" className="bg-[#f5f0ec] px-6 py-20 scroll-mt-28 lg:px-0">
      <div className="container mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2
            className="text-[38px] font-semibold text-[#2b1e14]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Why We Exist
          </h2>
          <div className="mt-4 h-[2px] w-24 bg-[hsl(var(--brand-orange))]" />
        </div>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative">
            <div className="rounded-3xl bg-[#efdecf] p-10 shadow-[0_24px_70px_-45px_rgba(70,50,30,0.55)] lg:p-12">
              <div
                className="space-y-6 text-[18px] leading-relaxed text-[#4c3b32]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                <p>
                  It didn&apos;t start with forms or policies. It started with Anna &mdash; with laughter
                  so loud it filled the room, with poetry, with music, with joy even in the middle of
                  pain.
                </p>
                <p>
                  We saw that what families need isn&apos;t just someone to &quot;do tasks.&quot; They
                  need someone who shows up with heart.
                </p>
                <p>
                  That&apos;s why Angels of Comfort exists. To bring dignity, joy, and companionship back
                  into the hardest moments.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="overflow-hidden rounded-3xl border-[10px] border-white shadow-xl">
              <img
                src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1760000563/anna_image_ozg7vg.png"
                alt="Anna, the inspiration for Angels of Comfort"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <p
          className="mt-10 text-right text-5xl text-[hsl(var(--brand-orange))] lg:text-6xl"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Anna
        </p>
      </div>
    </section>
  );
};

export default WhyWeExist;
