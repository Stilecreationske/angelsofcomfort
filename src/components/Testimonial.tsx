const certifications = [
  {
    label: 'Maryland RSA Licensed',
    image: 'https://res.cloudinary.com/dl1gcpclb/image/upload/v1760098438/mary_land_logo_ixrvqu.png',
  },
  {
    label: 'Background Checked',
    image: 'https://res.cloudinary.com/dl1gcpclb/image/upload/v1760098436/background_checked_logo_gf3bas.png',
  },
  {
    label: 'Licensed & Insured',
    image: 'https://res.cloudinary.com/dl1gcpclb/image/upload/v1760098437/licensed_logo_smjpi4.png',
  },
  {
    label: 'HIPAA Compliant',
    image: 'https://res.cloudinary.com/dl1gcpclb/image/upload/v1760098437/hipaa_compliant_license_mrmf0b.png',
  },
  {
    label: 'Best Home Care Provider of Choice',
    image: 'https://res.cloudinary.com/dl1gcpclb/image/upload/v1760098437/best_home_care_logo_s7uvgu.png',
  },
];

const Testimonial = () => {
  return (
    <section className="relative overflow-hidden bg-[#ba5927] px-6 py-24 text-white">
      <div className="container mx-auto max-w-5xl">
        <div className="relative mx-auto max-w-3xl rounded-[28px] bg-[#fffbf7] px-8 py-10 text-[#2f2c29] shadow-[0_28px_70px_-38px_rgba(0,0,0,0.7)] sm:px-12 sm:py-14">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--brand-orange))] text-white text-3xl leading-none">
              &rdquo;
            </div>
          </div>

          <h3
            className="text-[35px] font-semibold italic text-[hsl(var(--brand-orange))] sm:text-[35px]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            From Deb
          </h3>

          <blockquote
            className="mt-6 space-y-4 text-[21.7px] italic leading-relaxed sm:text-[21.7px]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            <p>
              &ldquo;When my sister Anna needed care, I was anxious of entrusting her to strangers. But
              Angels of Comfort didn&apos;t feel like strangers. They laughed with her, sang with her, and
              gave me the peace of knowing she was truly seen.
            </p>
            <p>
              They didn&apos;t just take care of Anna. They took care of me, too.&rdquo;
            </p>
          </blockquote>

          <cite
            className="mt-8 block text-right text-[18px] font-medium text-[#1f1c1a] sm:text-[20px]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            — Deb D., Anna&apos;s sister
          </cite>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-10">
          {certifications.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center text-sm">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <img src={item.image} alt={item.label} className="max-h-16 max-w-16 object-contain" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-wide text-white/90" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
