import { Button } from '@/components/ui/button';
import { emitOpenModal } from '@/lib/modal-events';

const navLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Comfort Blooms', href: '#family-portal' },
  { label: 'Family Portal', type: 'modal', modal: 'family' },
  { label: 'Caregiver Portal', type: 'modal', modal: 'caregiver' },
  { label: 'Caregiver Jobs', type: 'modal', modal: 'caregiver-apply' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/angelsofcomfort' },
  { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/angelsofcomfort' },
  { icon: 'x', label: 'X', href: 'https://www.x.com/angelsofcomfort' },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/angelsofcomfort' },
];

const renderSocialIcon = (type: string) => {
  switch (type) {
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M22 12.07C22 6.49 17.52 2 11.93 2S2 6.49 2 12.07c0 4.98 3.65 9.11 8.44 9.88v-6.99H8.08v-2.89h2.36V9.41c0-2.33 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46v1.75h2.59l-.41 2.89h-2.18v6.99C18.35 21.18 22 17.05 22 12.07Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7Zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3Zm10.5 1.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 1 0 0-2.5ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M4 4h3.3l4.23 5.97L16.92 4H20l-6.54 8.9L20 20h-3.3l-4.26-6.02L7.08 20H4l6.56-9z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M4.98 3.5a2 2 0 1 1-.02 4 2 2 0 0 1 .02-4ZM3 8.5h4v12H3v-12Zm6 0h3.8v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V20.5h-4v-5.96c0-1.42-.02-3.25-1.98-3.25-1.98 0-2.29 1.54-2.29 3.14v6.07h-4v-12Z" />
        </svg>
      );
    default:
      return null;
  }
};

const Footer = () => {
  return (
    <footer className="bg-[#ba5927] px-6 py-16 text-white">
      <div className="container mx-auto flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <img
            src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1761862407/white_logo_p0qjxb.png"
            alt="Angels of Comfort logo"
            className="w-[110px] lg:w-[120px]"
          />
          <Button
            size="lg"
            className="h-auto rounded-full bg-white px-8 py-3 text-base font-bold text-[#3c2b1c] shadow-md shadow-black/20 transition-transform hover:-translate-y-0.5 hover:bg-white/90"
            onClick={() => emitOpenModal('get-started')}
          >
            Book You Free Comfort Consultation
          </Button>
        </div>

        <div className="flex flex-col gap-10 text-center text-base lg:flex-row lg:items-start lg:gap-16 lg:text-left" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          <nav>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  {link.type === 'modal' ? (
                    <button
                      type="button"
                      onClick={() => emitOpenModal(link.modal)}
                      className="transition-colors hover:text-white/80"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a className="transition-colors hover:text-white/80" href={link.href}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden h-[160px] w-px bg-white/60 lg:block" />

          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <div className="space-y-2 text-base">
              <p>Columbia, Maryland</p>
              <p>
                <a className="transition-colors hover:text-white/80" href="tel:12402190308">
                  (240) 219-0308 (office)
                </a>
                <br />
                <a className="transition-colors hover:text-white/80" href="tel:12404263304">
                  (240) 426-3304 (cell)
                </a>
              </p>
              <p>
                <a className="transition-colors hover:text-white/80" href="mailto:care@angelsofcomfort.com">
                  care@angelsofcomfort.com
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4 text-lg">
              {socialLinks.map((link) => (
                <a
                  key={link.icon}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white transition-transform hover:-translate-y-0.5 hover:bg-white/10"
                  aria-label={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {renderSocialIcon(link.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-white/90">
        © 2025 Angels of Comfort · A Lumari Group Company. All rights reserved. Powered by{' '}
        <a href="https://codexsafari.com" className="font-semibold underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
          CODEXSAFARI
        </a>
        .
      </div>
    </footer>
  );
};

export default Footer;
