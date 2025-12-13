// components/landing/HowItWorksSection.tsx
import { Brain, Workflow, Zap } from 'lucide-react';

const HowItWorksSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How SOC-AI Works</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    
                    <div className="p-6 border-t-4 border-indigo-500 rounded-lg shadow-lg">
                        <Workflow className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">1. Ingest & Detect</h3>
                        <p className="text-gray-600">Logs and alerts are forwarded via Webhook API from your existing systems (Firewall, AWS, etc.).</p>
                    </div>
                    
                    <div className="p-6 border-t-4 border-purple-500 rounded-lg shadow-lg">
                        <Brain className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">2. Triage & Decide</h3>
                        <p className="text-gray-600">The **Oumi AI Agent** structures the raw data, determines severity, and selects the perfect Kestra flow.</p>
                    </div>
                    
                    <div className="p-6 border-t-4 border-green-500 rounded-lg shadow-lg">
                        <Zap className="h-10 w-10 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">3. Execute & Learn</h3>
                        <p className="text-gray-600">Kestra executes the remediation action. Analyst feedback trains the AI via **Reinforcement Learning**.</p>
                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;