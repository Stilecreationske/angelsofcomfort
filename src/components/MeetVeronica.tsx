const MeetVeronica = () => {
  return (
    <section className="bg-[#f5f0ec] px-6 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2
              className="text-[38.7px] font-bold text-[#3c2b1c]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Meet Veronica
            </h2>
            <div className="mt-4 h-[2px] w-20 bg-[hsl(var(--brand-orange))]" />

            <div className="mt-10 space-y-5 text-lg leading-relaxed text-[#2f2c29] sm:text-xl">
              <p>
                Behind every act of care is a person who believes in dignity. For us, that person is
                Veronica Karendi — founder, caregiver, and maker of every Comfort Bloom.
              </p>
              <p>
                Veronica began Angels of Comfort with one simple promise: that no family should ever
                feel alone in the hardest moments.
              </p>
              <p>Her joy, her quiet strength, and her stitches of kindness shape everything we do.</p>
            </div>

            <p className="mt-10 text-2xl font-semibold text-[#1f1c1a]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              — Veronica Karendi, Founder
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-[#ba5927]/12 to-transparent blur-3xl" />
              <div className="relative overflow-hidden rounded-[36px] border-[10px] border-white shadow-[0_28px_60px_-28px_rgba(70,45,25,0.55)]">
                <img
                  src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1761614522/karendipng_dbalhj.png"
                  alt="Veronica Karendi smiling outdoors"
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

export default MeetVeronica;
