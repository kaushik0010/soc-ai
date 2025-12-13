// components/landing/CoreFeaturesSection.tsx
import { Code, Shield, RefreshCcw } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="flex flex-col items-start p-6 bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <Icon className="h-8 w-8 text-indigo-600 mb-3" />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const CoreFeaturesSection = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Core Intelligence</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={RefreshCcw} 
                        title="Oumi Reinforcement Loop"
                        description="Analyst corrections (DPO/RLHF) are captured via the feedback modal, ensuring the AI constantly learns from superior human judgment."
                    />
                    <FeatureCard 
                        icon={Code} 
                        title="Structured Groq Triage"
                        description="We use Zod schemas and Groq's low-latency performance to generate reliable, structured Incident JSON, bypassing messy text outputs."
                    />
                    <FeatureCard 
                        icon={Shield} 
                        title="Kestra Execution Guardrails"
                        description="Automated actions are auditable, verifiable, and controlled by Kestra flows, providing a secure bridge between AI decision and production systems."
                    />
                </div>
            </div>
        </section>
    );
};

export default CoreFeaturesSection;