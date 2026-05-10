import React from 'react';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import SocialProofBar from '@/components/landing/SocialProofBar';
import ModelsSection from '@/components/landing/ModelsSection';
import RouterSection from '@/components/landing/RouterSection';
import MemorySection from '@/components/landing/MemorySection';
import SpeedSection from '@/components/landing/SpeedSection';
import FallbackSection from '@/components/landing/FallbackSection';
import FeatureGrid from '@/components/landing/FeatureGrid';
import DashboardPreview from '@/components/landing/DashboardPreview';
import FinalCTA from '@/components/landing/FinalCTA';
import LandingFooter from '@/components/landing/LandingFooter';

const Separator = () => (
  <div className="mx-auto" style={{ width: '80%', height: 1, background: 'linear-gradient(90deg, transparent, var(--c-border), transparent)' }} />
);

const Landing: React.FC = () => {
  React.useEffect(() => {
    document.title = 'AI Station — Every AI Model. One Station.';
  }, []);

  return (
    <div style={{ background: 'var(--c-void)', color: 'var(--c-text)' }}>
      <LandingNav />
      <main>
        <HeroSection />
        <SocialProofBar />
        <ModelsSection />
        <Separator />
        <RouterSection />
        <Separator />
        <MemorySection />
        <Separator />
        <SpeedSection />
        <Separator />
        <FallbackSection />
        <Separator />
        <FeatureGrid />
        <Separator />
        <DashboardPreview />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landing;