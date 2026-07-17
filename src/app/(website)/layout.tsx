import Navbar from '@/components/website/Navbar';
import Footer from '@/components/website/Footer';

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-16 lg:pt-20">
                {children}
            </main>
            <Footer />
        </>
    );
}
