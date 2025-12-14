'use client'

import { Brain, Workflow, Zap, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const StepCard = ({ step, icon: Icon, title, description, borderColor, delay }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="group relative p-6 md:p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 animate-fade-in"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                borderTop: `4px solid ${borderColor}`,
                animationDelay: `${delay}ms`
            }}
        >
            {/* Hover effect background */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
            
            {/* Step number */}
            <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-gray-700 shadow-md">
                {step}
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl mb-6 mx-auto"
                     style={{ 
                         background: `linear-gradient(135deg, ${borderColor}20, ${borderColor}40)`,
                         transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                         transition: 'transform 0.3s ease'
                     }}
                >
                    <Icon className="h-8 w-8" style={{ color: borderColor }} />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-[#6366f1] transition-colors duration-300">
                    {title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                    {description}
                </p>
                
                <div className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ color: borderColor }}
                >
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>
        </div>
    );
};

const HowItWorksSection = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        How <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">SOC-AI</span> Works
                    </h2>
                    <p className="text-lg text-gray-600">
                        A seamless integration of AI intelligence and automated execution
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    <StepCard 
                        step="1"
                        icon={Workflow}
                        title="Ingest & Detect"
                        description="Logs and alerts are forwarded via Webhook API from your existing systems (Firewall, AWS, SIEM tools). Real-time detection with minimal latency."
                        borderColor="#6366f1" // indigo-500
                        delay={0}
                    />
                    
                    <StepCard 
                        step="2"
                        icon={Brain}
                        title="Triage & Decide"
                        description="Oumi AI Agent structures raw data, determines severity using ML models, and selects optimal Kestra workflows for automated response."
                        borderColor="#8b5cf6" // purple-500
                        delay={200}
                    />
                    
                    <StepCard 
                        step="3"
                        icon={Zap}
                        title="Execute & Learn"
                        description="Kestra executes precise remediation actions. Analyst feedback continuously trains the AI via Reinforcement Learning for improved accuracy."
                        borderColor="#10b981" // emerald-500
                        delay={400}
                    />
                </div>
                
                {/* Connection lines - visible on desktop */}
                <div className="hidden md:flex justify-center items-center mt-8">
                    <div className="w-32 h-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 mx-4 animate-pulse"></div>
                    <div className="w-32 h-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#10b981]"></div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;