import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How quickly can care start?',
    answer:
      "We understand urgency in care situations. In most cases, we can begin services within 24-48 hours of your initial consultation. Emergency situations may be accommodated even sooner.",
  },
  {
    question: 'Do you accept long-term care insurance?',
    answer:
      "Yes, we work with most major long-term care insurance providers. We'll help you navigate your benefits and handle the paperwork to make the process as smooth as possible.",
  },
  {
    question: 'What makes your caregivers different?',
    answer:
      "Our caregivers are chosen for their hearts first, qualifications second. Each goes through extensive background checks, training, and most importantly—they're selected for their genuine calling to care. We don't just hire employees; we welcome family.",
  },
  {
    question: "What's the minimum number of hours?",
    answer:
      "We're flexible to meet your needs. Whether you need a few hours of companionship or round-the-clock care, we'll work with you to create a schedule that provides comfort and peace of mind.",
  },
  {
    question: 'Can I meet the caregiver first?',
    answer:
      "Absolutely. We believe relationships are everything in care. We'll arrange a meet-and-greet so you can get to know your caregiver before services begin. Chemistry matters, and we want you to feel completely comfortable.",
  },
  {
    question: 'What areas do you serve?',
    answer:
      "We're proudly based in Columbia, Maryland, and serve the greater Baltimore and Washington DC metropolitan areas. If you're unsure whether we serve your location, please call us—we're always expanding to help more families.",
  },
  {
    question: 'Are you available 24/7?',
    answer:
      "Yes, we provide care around the clock when needed. Whether it's overnight care, weekend support, or holiday coverage, our angels are here when you need them most.",
  },
];

const FAQ = () => {
  return (
    <section className="bg-[#f5f0ec] px-6 py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          <h2
            className="text-[35px] font-bold text-[#3c2b1c]"
            style={{ fontFamily: "'Lora', serif" }}
          >
            You Have Questions. We Have Comfort.
          </h2>
          <p className="mt-4 text-[20px] text-[#2b1e14]" style={{ fontFamily: "'Lora', serif" }}>
            Here are the answers to questions families ask us most often.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-12 space-y-6">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="overflow-hidden rounded-2xl border border-[#d3c7b8] bg-white shadow-[0_18px_45px_-30px_rgba(60,43,28,0.45)]"
            >
              <AccordionTrigger
                className="px-6 text-left text-[20px] font-semibold text-[#3c2b1c] hover:no-underline sm:text-[22px]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-[18px] text-[#2b1e14] sm:text-[19px]" style={{ fontFamily: "'Lora', serif" }}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
