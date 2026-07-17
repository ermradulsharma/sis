import type { Metadata } from 'next';
import ContactSection from '@/components/website/ContactSection';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the SIS ERP team.',
};

export default function ContactPage() {
  return (
    <>
      <ContactSection />
    </>
  );
}
