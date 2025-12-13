// components/landing/HeroSection.tsx
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="py-20 bg-gray-50 text-center">
            <div className="container mx-auto px-4">
                <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
                    Autonomous Triage. <span className="text-indigo-600">Instant Response.</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    The Human-in-the-Loop SOC Platform. We use **Oumi AI** for decision-making and **Kestra** for flawless, auditable execution.
                </p>
                <Link href="/dashboard" passHref>
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3 shadow-lg">
                        <LayoutDashboard className="h-5 w-5 mr-3" />
                        View Live Dashboard Demo
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default HeroSection;