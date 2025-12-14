import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ArrowRight } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
            
            <div className="container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-[#6366f1] text-sm font-medium mb-6 animate-fade-in">
                        <span className="h-2 w-2 rounded-full bg-[#6366f1] mr-2 animate-pulse"></span>
                        Human-in-the-Loop SOC Platform
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                        Autonomous Triage. 
                        <span className="block mt-2 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent animate-gradient">
                            Instant Response.
                        </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Leveraging <span className="font-semibold text-[#6366f1]">Oumi AI</span> for intelligent decision-making and <span className="font-semibold text-[#8b5cf6]">Kestra</span> for flawless, auditable execution workflows.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/dashboard" passHref>
                            <Button 
                                size="lg" 
                                className="group bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            >
                                <LayoutDashboard className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                                View Live Dashboard Demo
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                        </Link>
                        
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="text-lg px-8 py-6 rounded-xl border-2 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
                        >
                            Read Documentation
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;