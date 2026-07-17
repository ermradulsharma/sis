import type { Metadata } from 'next';
import FAQSection from '@/components/website/FAQSection';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about SIS ERP.',
};

export default function FAQPage() {
  return (
    <>
      <FAQSection />
    </>
  );
}
