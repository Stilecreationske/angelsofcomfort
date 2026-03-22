import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MODAL_EVENT_NAME, emitOpenModal } from '@/lib/modal-events';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { verifyUserRole } from '@/lib/auth';

type ActiveModal = 'family' | 'caregiver' | 'get-started' | 'caregiver-apply' | 'guide-download' | null;

interface NavItem {
  label: string;
  href?: string;
  modal?: Exclude<ActiveModal, null>;
}

const navLinks: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Family Portal', modal: 'family' },
  { label: 'Caregiver Portal', modal: 'caregiver' },
  { label: 'Caregiver Jobs', modal: 'caregiver-apply' },
  { label: 'Contact Us', href: '#contact' },
];

const initialGetStartedState = {
  firstName: '',
  lastName: '',
  dob: '',
  city: '',
  email: '',
  phone: '',
  verification: '',
};

const initialCaregiverApplication = {
  firstName: '',
  lastName: '',
  dob: '',
  city: '',
  email: '',
  phone: '',
};

const initialGuideDownloadState = {
  firstName: '',
  email: '',
};

const GUIDE_DOWNLOAD_URL =
  'https://jfipmdcuvxcrkkapidpd.supabase.co/storage/v1/object/public/angelsofcomfortbucket/7-Quiet-Signs-Your-Loved%20-One-May-Need-Extra-Support.pdf';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [loading, setLoading] = useState(false);

  const [familyCredentials, setFamilyCredentials] = useState({ email: '', password: '' });
  const [caregiverCredentials, setCaregiverCredentials] = useState({ email: '', password: '' });
  const [getStartedData, setGetStartedData] = useState(initialGetStartedState);
  const [caregiverApplication, setCaregiverApplication] = useState(initialCaregiverApplication);
  const [guideDownloadData, setGuideDownloadData] = useState(initialGuideDownloadState);
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const closeModal = () => {
    setActiveModal(null);
    setLoading(false);
  };

  const openModalOrNavigate = (modal: Exclude<ActiveModal, null>) => {
    if (modal === 'family' && profile?.role === 'family') {
      navigate('/family');
      closeMenu();
      return;
    }
    if (modal === 'caregiver' && profile?.role === 'caregiver') {
      navigate('/caregiver');
      closeMenu();
      return;
    }
    setActiveModal(modal);
    closeMenu();
  };

  const guardRoleAndNavigate = async (role: Parameters<typeof verifyUserRole>[0], destination: string) => {
    const verifiedProfile = await verifyUserRole(role);
    await refreshProfile();
    navigate(destination);
    return verifiedProfile;
  };

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<ActiveModal>;
      setActiveModal(customEvent.detail ?? null);
      setIsMenuOpen(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(MODAL_EVENT_NAME, listener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(MODAL_EVENT_NAME, listener);
      }
    };
  }, []);

  const handleFamilyLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: familyCredentials.email.trim().toLowerCase(),
        password: familyCredentials.password,
      });
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to sign in',
          description: error.message,
        });
        return;
      }
      try {
        await guardRoleAndNavigate('family', '/family');
        toast({
          title: 'Welcome back!',
          description:
            'Thanks! Angels of Comfort Team will get back to you. Thanks for choosing Angels of Comfort.',
        });
        setFamilyCredentials({ email: '', password: '' });
        closeModal();
      } catch (roleError) {
        const message =
          roleError instanceof Error
            ? roleError.message
            : 'Your access could not be verified. Please contact Angels of Comfort.';
        toast({
          variant: 'destructive',
          title: 'Access issue',
          description: message,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCaregiverLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: caregiverCredentials.email.trim().toLowerCase(),
        password: caregiverCredentials.password,
      });
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to sign in',
          description: error.message,
        });
        return;
      }
      try {
        await guardRoleAndNavigate('caregiver', '/caregiver');
        toast({
          title: 'Login successful',
          description:
            'Thanks! Angels of Comfort Team will get back to you. Thanks for choosing Angels of Comfort.',
        });
        setCaregiverCredentials({ email: '', password: '' });
        closeModal();
      } catch (roleError) {
        const message =
          roleError instanceof Error
            ? roleError.message
            : 'Your access could not be verified. Please contact Angels of Comfort.';
        toast({
          variant: 'destructive',
          title: 'Access issue',
          description: message,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetStartedSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (getStartedData.verification.trim().toLowerCase() !== 'comfort') {
      toast({
        variant: 'destructive',
        title: 'Verification required',
        description: 'Please type COMFORT in the verification field to confirm you are not a bot.',
      });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        first_name: getStartedData.firstName.trim(),
        last_name: getStartedData.lastName.trim(),
        dob: getStartedData.dob || null,
        city: getStartedData.city.trim(),
        email: getStartedData.email.trim().toLowerCase(),
        phone: getStartedData.phone.trim(),
      };

      const { error } = await supabase.from('comfort_visit_requests').insert(payload);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to submit request',
          description: error.message,
        });
        return;
      }

      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'comfort_visit',
          data: payload,
        },
      });

      toast({
        title: 'Request received!',
        description: 'Thanks! Angels of Comfort Team will get back to you. Thanks for choosing Angels of Comfort.',
      });
      setGetStartedData(initialGetStartedState);
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCaregiverApplicationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        first_name: caregiverApplication.firstName.trim(),
        last_name: caregiverApplication.lastName.trim(),
        dob: caregiverApplication.dob || null,
        city: caregiverApplication.city.trim(),
        email: caregiverApplication.email.trim().toLowerCase(),
        phone: caregiverApplication.phone.trim(),
      };

      const { error } = await supabase.from('caregiver_applications').insert(payload);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to submit application',
          description: error.message,
        });
        return;
      }

      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'caregiver_application',
          data: payload,
        },
      });

      toast({
        title: 'Application received!',
        description: 'Thanks! Angels of Comfort Team will get back to you. Thanks for choosing Angels of Comfort.',
      });
      setCaregiverApplication(initialCaregiverApplication);
      closeModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuideDownloadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        first_name: guideDownloadData.firstName.trim(),
        email: guideDownloadData.email.trim().toLowerCase(),
      };

      const { error } = await supabase.from('guide_downloads').insert(payload);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Unable to process request',
          description: error.message,
        });
        return;
      }

      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'guide_download',
          data: payload,
        },
      });

      toast({
        title: 'Guide ready!',
        description: 'Thanks! Angels of Comfort Team will get back to you. Thanks for choosing Angels of Comfort.',
      });
      setGuideDownloadData(initialGuideDownloadState);
      closeModal();

      if (typeof window !== 'undefined') {
        window.open(GUIDE_DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      toast({
        variant: 'destructive',
        title: 'Unexpected error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderNavItem = (item: NavItem) => {
    if (item.modal) {
      return (
        <button
          type="button"
          onClick={() => openModalOrNavigate(item.modal)}
          className="text-base font-medium tracking-wide transition-colors hover:text-[hsl(var(--brand-orange))]"
        >
          {item.label}
        </button>
      );
    }
    return (
      <a
        href={item.href}
        onClick={closeMenu}
        className="text-base font-medium tracking-wide transition-colors hover:text-[hsl(var(--brand-orange))]"
      >
        {item.label}
      </a>
    );
  };

  const renderFamilyPortalModal = () => (
    <Dialog open={activeModal === 'family'} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto text-[#2b1e14]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Lora', serif" }}>Family Portal Login</DialogTitle>
          <DialogDescription>Access activity logs and updates for your loved one.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4 text-[#2b1e14]" onSubmit={handleFamilyLogin}>
          <div className="space-y-2">
            <Label htmlFor="family-email" className="text-[#2b1e14]">
              Email
            </Label>
            <Input
              id="family-email"
              type="email"
              value={familyCredentials.email}
              onChange={(e) => setFamilyCredentials((prev) => ({ ...prev, email: e.target.value }))}
              required
              autoComplete="email"
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="family-password" className="text-[#2b1e14]">
              Password
            </Label>
            <Input
              id="family-password"
              type="password"
              value={familyCredentials.password}
              onChange={(e) =>
                setFamilyCredentials((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              autoComplete="current-password"
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#ba5927] text-white hover:bg-[#a04b1b]"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderCaregiverPortalModal = () => (
    <Dialog open={activeModal === 'caregiver'} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto text-[#2b1e14]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Lora', serif" }}>Caregiver Portal Login</DialogTitle>
          <DialogDescription>Log visits, view assignments, and stay connected.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4 text-[#2b1e14]" onSubmit={handleCaregiverLogin}>
          <div className="space-y-2">
            <Label htmlFor="caregiver-email" className="text-[#2b1e14]">
              Email
            </Label>
            <Input
              id="caregiver-email"
              type="email"
              value={caregiverCredentials.email}
              onChange={(e) =>
                setCaregiverCredentials((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              autoComplete="email"
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caregiver-password" className="text-[#2b1e14]">
              Password
            </Label>
            <Input
              id="caregiver-password"
              type="password"
              value={caregiverCredentials.password}
              onChange={(e) =>
                setCaregiverCredentials((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              autoComplete="current-password"
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#ba5927] text-white hover:bg-[#a04b1b]"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderGetStartedModal = () => (
    <Dialog open={activeModal === 'get-started'} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto text-[#2b1e14]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Lora', serif" }}>Request a Comfort Visit</DialogTitle>
          <DialogDescription>
            Share a few details and we will get your complimentary visit scheduled.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4 space-y-4 text-[#2b1e14]" onSubmit={handleGetStartedSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="visit-first-name" className="text-[#2b1e14]">
                First Name
              </Label>
            <Input
              id="visit-first-name"
              value={getStartedData.firstName}
              onChange={(e) =>
                setGetStartedData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-last-name" className="text-[#2b1e14]">
                Last Name
              </Label>
            <Input
              id="visit-last-name"
              value={getStartedData.lastName}
              onChange={(e) =>
                setGetStartedData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="visit-dob" className="text-[#2b1e14]">
                Preferred Visit Date
              </Label>
            <Input
              id="visit-dob"
              type="date"
              value={getStartedData.dob}
              onChange={(e) => setGetStartedData((prev) => ({ ...prev, dob: e.target.value }))}
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-city" className="text-[#2b1e14]">
                City
              </Label>
            <Input
              id="visit-city"
              value={getStartedData.city}
              onChange={(e) => setGetStartedData((prev) => ({ ...prev, city: e.target.value }))}
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="visit-email" className="text-[#2b1e14]">
                Email
              </Label>
            <Input
              id="visit-email"
              type="email"
              value={getStartedData.email}
              onChange={(e) => setGetStartedData((prev) => ({ ...prev, email: e.target.value }))}
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-phone" className="text-[#2b1e14]">
                Phone
              </Label>
            <Input
              id="visit-phone"
              value={getStartedData.phone}
              onChange={(e) => setGetStartedData((prev) => ({ ...prev, phone: e.target.value }))}
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="visit-check" className="text-[#2b1e14]">
              Type COMFORT to verify you are human
            </Label>
            <Input
              id="visit-check"
              value={getStartedData.verification}
              onChange={(e) =>
                setGetStartedData((prev) => ({ ...prev, verification: e.target.value }))
              }
              placeholder="COMFORT"
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#ba5927] text-white hover:bg-[#a04b1b]"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderCaregiverApplicationModal = () => (
    <Dialog open={activeModal === 'caregiver-apply'} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto text-[#2b1e14]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Lora', serif" }}>Become a Caregiver</DialogTitle>
          <DialogDescription>
            Share your details to begin the Angels of Comfort caregiver application.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4 space-y-4 text-[#2b1e14]" onSubmit={handleCaregiverApplicationSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apply-first-name" className="text-[#2b1e14]">
                First Name
              </Label>
              <Input
                id="apply-first-name"
                value={caregiverApplication.firstName}
                onChange={(e) =>
                  setCaregiverApplication((prev) => ({ ...prev, firstName: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-last-name" className="text-[#2b1e14]">
                Last Name
              </Label>
              <Input
                id="apply-last-name"
                value={caregiverApplication.lastName}
                onChange={(e) =>
                  setCaregiverApplication((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apply-dob" className="text-[#2b1e14]">
                Date of Birth
              </Label>
              <Input
                id="apply-dob"
                type="date"
                value={caregiverApplication.dob}
                onChange={(e) =>
                  setCaregiverApplication((prev) => ({ ...prev, dob: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-city" className="text-[#2b1e14]">
                City
              </Label>
              <Input
                id="apply-city"
                value={caregiverApplication.city}
                onChange={(e) =>
                  setCaregiverApplication((prev) => ({ ...prev, city: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apply-email" className="text-[#2b1e14]">
                Email
              </Label>
              <Input
                id="apply-email"
                type="email"
                value={caregiverApplication.email}
                onChange={(e) =>
                  setCaregiverApplication((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apply-phone" className="text-[#2b1e14]">
                Phone
              </Label>
              <Input
                id="apply-phone"
                value={caregiverApplication.phone}
                onChange={(e) =>
                  setCaregiverApplication((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
                className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#ba5927] text-white hover:bg-[#a04b1b]"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderGuideDownloadModal = () => (
    <Dialog open={activeModal === 'guide-download'} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto text-[#2b1e14]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Lora', serif" }}>Download Your Guide</DialogTitle>
          <DialogDescription>
            Share your details to unlock the 7 Quiet Signs guide instantly.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-4 space-y-4 text-[#2b1e14]" onSubmit={handleGuideDownloadSubmit}>
          <div className="space-y-2">
            <Label htmlFor="guide-first-name" className="text-[#2b1e14]">
              First Name
            </Label>
            <Input
              id="guide-first-name"
              value={guideDownloadData.firstName}
              onChange={(e) =>
                setGuideDownloadData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guide-email" className="text-[#2b1e14]">
              Email
            </Label>
            <Input
              id="guide-email"
              type="email"
              value={guideDownloadData.email}
              onChange={(e) =>
                setGuideDownloadData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="border-[#ba5927]/60 focus-visible:ring-[#ba5927]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#ba5927] text-white hover:bg-[#a04b1b]"
            disabled={loading}
          >
            {loading ? 'Preparing...' : 'Access the Guide'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 bg-[#3c2b1c] py-2 text-center text-sm text-white">
        <p className="flex flex-wrap items-center justify-center gap-4 px-4" style={{ fontFamily: '"Open Sans", sans-serif' }}>
          <a href="tel:12404263304" className="font-semibold underline-offset-4 hover:underline">
            (240) 426-3304
          </a>
          <span className="hidden h-3 w-px bg-white/40 sm:inline-block" aria-hidden />
          <a href="mailto:care@angelsofcomfort.com" className="font-semibold underline-offset-4 hover:underline">
            care@angelsofcomfort.com
          </a>
        </p>
      </div>
      <header className="fixed inset-x-0 z-50 bg-[#fffbf7] py-0 shadow-sm" style={{ top: '40px' }}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-12">
          <a href="#home" className="flex items-center gap-7 lg:mr-14">
            <img
              src="https://res.cloudinary.com/dl1gcpclb/image/upload/v1766569535/navbarlogo-removebg-preview_tbzuhl.png"
              alt="Angels of Comfort logo"
              className="h-[149px] w-[150px]"
            />
          </a>

          <button
            className="relative ml-auto inline-flex h-12 w-12 items-center justify-center rounded-md border border-[#3c2b1c]/30 bg-[#3c2b1c]/5 text-[#3c2b1c] transition-colors hover:border-[#3c2b1c] hover:bg-[#3c2b1c]/10 lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="flex flex-col items-center justify-center gap-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>

          <nav
            className={cn(
              'absolute left-0 right-0 top-full origin-top bg-[#fffbf7] px-6 py-6 shadow-lg transition-transform duration-200 ease-out lg:static lg:flex lg:flex-1 lg:items-center lg:justify-between lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:transition-none',
              isMenuOpen
                ? 'pointer-events-auto scale-y-100'
                : 'pointer-events-none scale-y-0 lg:pointer-events-auto lg:scale-y-100',
              'transform',
            )}
          >
            <ul
              className="flex flex-col gap-4 text-[#3c2b1c] lg:flex-row lg:items-center lg:gap-8"
              style={{ fontFamily: '"Open Sans", sans-serif' }}
            >
              {navLinks.map((link) => (
                <li key={link.label}>{renderNavItem(link)}</li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-stretch gap-4 text-[#3c2b1c] lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <Button
                size="lg"
              className="h-auto rounded-full bg-[#ba5927] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 hover:bg-[#a04b1b]"
              onClick={() => {
                emitOpenModal('get-started');
                closeMenu();
              }}
            >
              Get Started
            </Button>
            </div>
          </nav>
        </div>
      </header>

      {renderFamilyPortalModal()}
      {renderCaregiverPortalModal()}
      {renderGetStartedModal()}
      {renderCaregiverApplicationModal()}
      {renderGuideDownloadModal()}
    </>
  );
};

export default Navbar;
