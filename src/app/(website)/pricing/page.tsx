import type { Metadata } from 'next';
import PricingSection from '@/components/website/PricingSection';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for teams of all sizes.',
};

export default function PricingPage() {
  return (
    <>
      <PricingSection />
    </>
  );
}
