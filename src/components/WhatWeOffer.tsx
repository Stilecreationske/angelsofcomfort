const services = [
  {
    title: "Gentle Hands",
    lead: "Bathing. Dressing. Grooming.",
    body: "Handled slowly, with dignity — not a rush to get done.",
    icon: (
      <img
        src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1761740375/comfort_1_coz2yq.png"
        alt="Gentle hands icon"
        className="h-16 w-16 object-contain"
      />
    ),
  },
  {
    title: "Everyday Rhythm",
    lead: "Meals. Laundry. Medication reminders.",
    body: "We move in sync with your loved one's rhythm — not ours.",
    icon: (
      <img
        src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1761740375/basket_1_wr8vkw.png"
        alt="Basket icon"
        className="h-16 w-16 object-contain"
      />
    ),
  },
  {
    title: "Light in the Room",
    lead: "Conversation. Companionship. Crochet. Music.",
    body: "Moments that make life still feel like life.",
    icon: (
      <img
        src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1761740375/chat_1_wvlhvb.png"
        alt="Chat icon"
        className="h-16 w-16 object-contain"
      />
    ),
  },
  {
    title: "A Breath for You",
    lead: "Respite visits, overnight support, or a few hours to reset.",
    body: "We step in, so you can step away without guilt.",
    icon: (
      <img
        src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1761740375/love_pdznn0.png"
        alt="Heart icon"
        className="h-16 w-16 object-contain"
      />
    ),
  },
];

const WhatWeOffer = () => {
  return (
    <section id="services" className="relative overflow-hidden bg-[#fffbf7] px-6 py-24 scroll-mt-28">
      <div className="container mx-auto max-w-6xl text-center">
        <h2
          className="text-[40px] font-semibold text-[#3c2b1c] sm:text-[46px]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Care That Feels Human Again
        </h2>

        <div className="mx-auto mt-4 h-[2px] w-24 bg-[hsl(var(--brand-orange))]" />

        <p
          className="mx-auto mt-10 max-w-3xl text-[21px] leading-relaxed text-black italic"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Not everyone needs the same kind of help. But everyone needs to feel Safe. Seen. Cared for.
          At Angels of Comfort, we move at the pace of the heart — serving with presence, not
          pressure.
        </p>

        <div className="mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative flex h-full flex-col items-center overflow-hidden rounded-[32px] bg-white/95 px-8 py-12 text-center shadow-[0_25px_70px_-35px_rgba(56,34,15,0.65)] ring-1 ring-white/40 before:absolute before:-inset-x-6 before:-inset-y-10 before:-z-10 before:bg-gradient-to-b before:from-[#ffffff]/40 before:to-transparent sm:px-10 sm:py-14"
              style={{ boxShadow: '0 25px 70px -35px rgba(186, 89, 39, 0.55), 0 0 30px rgba(186, 89, 39, 0.25)' }}
            >
              <div className="text-[#ba5927]">{service.icon}</div>
              <h3
                className="mt-6 text-[32px] font-bold text-[#ba5927]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {service.title}
              </h3>
              <div className="mt-3 h-0.5 w-16 rounded-full bg-[#ba5927]/40" />
              <p className="mt-4 text-base leading-relaxed text-[#2f2c29] sm:text-lg">
                <span className="font-semibold text-[#3c2b1c]">{service.lead}</span>
                <span className="mt-2 block">{service.body}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
