// components/landing/FinalCtaSection.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const FinalCtaSection = () => {
    return (
        <section className="py-16 bg-indigo-600 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Stop Chasing Alerts. Start Automating.</h2>
            <Link href="/dashboard" passHref>
                <Button size="lg" variant="secondary" className="text-indigo-600 hover:bg-white/90 text-lg px-10 py-3 shadow-2xl">
                    Experience Autonomous SOC Now
                </Button>
            </Link>
        </section>
    );
};

export default FinalCtaSection;