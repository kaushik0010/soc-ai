import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap } from 'lucide-react';

const FinalCtaSection = () => {
    return (
        <section className="relative py-20 md:py-28 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#4f46e5] -z-10"></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10 -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                        <Shield className="h-4 w-4 mr-2" />
                        Enterprise Security Platform
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Stop Chasing Alerts.
                        <span className="block mt-2 bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent">
                            Start Automating Response.
                        </span>
                    </h2>
                    
                    <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join forward-thinking security teams who have reduced MTTR by 85% and improved analyst efficiency by 300%.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/dashboard" passHref>
                            <Button 
                                size="lg"
                                className="group bg-white text-[#6366f1] hover:bg-white/90 text-lg px-10 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            >
                                <Zap className="h-5 w-5 mr-3 group-hover:animate-pulse" />
                                Experience Autonomous SOC Now
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                            </Button>
                        </Link>
                        
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl transition-all duration-300 cursor-pointer"
                        >
                            Schedule a Demo
                        </Button>
                    </div>
                    
                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/20">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
                            <div className="text-sm text-white/70">Uptime SLA</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">85%</div>
                            <div className="text-sm text-white/70">Faster MTTR</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-sm text-white/70">AI Monitoring</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">50ms</div>
                            <div className="text-sm text-white/70">Avg. Response Time</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCtaSection;