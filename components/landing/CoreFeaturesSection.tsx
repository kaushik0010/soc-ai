'use client'
import { Code, Shield, RefreshCcw, Sparkles, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const FeatureCard = ({ icon: Icon, title, description, index }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative p-6 md:p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient border effect on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
      
      {/* Icon with gradient background */}
      <div className="relative w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-300">
        <Icon className="h-7 w-7 text-[#6366f1] group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute -inset-2 bg-indigo-200 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#6366f1] transition-colors duration-300">
        {title}
        <Sparkles className="h-5 w-5 text-yellow-500 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      
      {/* Feature benefits list */}
      <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center text-sm text-gray-700">
          <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
          <span>Enterprise-grade security</span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
          <span>Real-time processing</span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
          <span>Full audit trail</span>
        </div>
      </div>
    </div>
  );
};

const CoreFeaturesSection = () => {
    const features = [
        {
            icon: RefreshCcw,
            title: "Oumi Reinforcement Loop",
            description: "Analyst corrections (DPO/RLHF) are captured via the feedback modal, ensuring the AI constantly learns from superior human judgment.",
        },
        {
            icon: Code,
            title: "Structured Groq Triage",
            description: "We use Zod schemas and Groq's low-latency performance to generate reliable, structured Incident JSON, bypassing messy text outputs.",
        },
        {
            icon: Shield,
            title: "Kestra Execution Guardrails",
            description: "Automated actions are auditable, verifiable, and controlled by Kestra flows, providing a secure bridge between AI decision and production systems.",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-[#6366f1] text-sm font-medium mb-4">
                        <span className="h-2 w-2 rounded-full bg-[#6366f1] mr-2"></span>
                        Core Intelligence Features
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Built for <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">Enterprise SOC</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Advanced features designed for modern security operations
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <FeatureCard 
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreFeaturesSection;