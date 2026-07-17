import type { Metadata } from 'next';
import FeaturesSection from '@/components/website/FeaturesSection';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore the comprehensive modules and features of SIS ERP.',
};

export default function FeaturesPage() {
  return (
    <>
      <FeaturesSection />
    </>
  );
}
