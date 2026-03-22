import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyWeExist from '@/components/WhyWeExist';
import WhatWeOffer from '@/components/WhatWeOffer';
import ComfortBloom from '@/components/ComfortBloom';
import MeetVeronica from '@/components/MeetVeronica';
import FreeGuide from '@/components/FreeGuide';
import ComfortVisit from '@/components/ComfortVisit';
import Testimonial from '@/components/Testimonial';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <WhyWeExist />
      <WhatWeOffer />
      <ComfortBloom />
      <MeetVeronica />
      <FreeGuide />
      <ComfortVisit />
      <FAQ />
      <Testimonial />
      <Newsletter />
      <Footer />
    </main>
  );
};

export default Index;
