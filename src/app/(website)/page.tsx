import type { Metadata } from 'next';
import HeroSection from '@/components/website/HeroSection';
import StatsSection from '@/components/website/StatsSection';
import TestimonialsSection from '@/components/website/TestimonialsSection';

export const metadata: Metadata = {
  title: 'SIS ERP — Enterprise Resource Planning for Modern Businesses',
  description:
    'Unify your business operations with SIS ERP. A comprehensive platform for CRM, HR, Finance, Project Management, Inventory, and more.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <TestimonialsSection />
    </>
  );
}
