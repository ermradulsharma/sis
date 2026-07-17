import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | SIS ERP',
    default: 'SIS ERP - Enterprise Resource Planning',
  },
  description: 'Enterprise Resource Planning for Software Companies',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We initialize the theme by setting the class on the html element.
  // The default is 'dark'. The theme store handles changes on the client.
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-slate-950 font-sans text-slate-100 antialiased`}>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
