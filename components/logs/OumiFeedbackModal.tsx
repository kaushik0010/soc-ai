// components/OumiFeedbackModal.tsx
'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, CornerDownRight } from 'lucide-react';

interface OumiFeedbackModalProps {
    incidentId: string;
    onFeedbackSubmitted: () => void;
}

const severityLevels = ["Low", "Medium", "High", "Critical", "Informational"];
const actionTypes = ["block_ip", "disable_user", "isolate_host", "create_ticket"];

const OumiFeedbackModal: React.FC<OumiFeedbackModalProps> = ({ incidentId, onFeedbackSubmitted }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [severity, setSeverity] = useState<string>('');
    const [actionType, setActionType] = useState<string>('');
    const [actionTarget, setActionTarget] = useState<string>('');
    const [justification, setJustification] = useState<string>('');
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async () => {
        if (!severity || !justification) {
            alert("Please select a severity and provide a justification.");
            return;
        }

        setSubmissionStatus('loading');

        // Note: The feedback route expects actionId, type, and justification 
        // within suggestedActions, based on our prior debugging.
        const payload = {
            incidentId,
            severity,
            suggestedActions: [
                {
                    actionId: crypto.randomUUID(), // Generate a client-side UUID
                    type: actionType || actionTypes[0], 
                    target: actionTarget || 'N/A',
                    justification: `Analyst override: ${justification}`,
                    reason: `Override due to analyst judgment.`, // required field on schema
                }
            ],
            justification: `Analyst overrode AI judgment for incident ${incidentId}. Reason: ${justification}`
        };

        try {
            const response = await fetch('/api/oumi/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                setSubmissionStatus('success');
                onFeedbackSubmitted(); // Trigger dashboard refresh if needed
                setTimeout(() => setIsOpen(false), 2000); // Close after success
            } else {
                setSubmissionStatus('error');
                console.error("Oumi Feedback API Error:", data.errors || data.message);
                alert(`Submission failed: ${data.message || 'Check console.'}`);
            }
        } catch (error) {
            setSubmissionStatus('error');
            console.error("Network Error:", error);
            alert("Network error submitting feedback.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Zap className="w-4 h-4 mr-2" /> Override AI Feedback
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className='flex items-center'>
                        <CornerDownRight className='w-5 h-5 mr-2 text-orange-600' />
                        Reinforcement Learning Override
                    </DialogTitle>
                    <DialogDescription>
                        Submit your corrected judgment for **Incident {incidentId}** to refine the Oumi AI Triage Model (DPO/RLHF).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="severity" className="text-right">
                            Severity
                        </Label>
                        <Select onValueChange={setSeverity} value={severity}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Analyst Severity" />
                            </SelectTrigger>
                            <SelectContent>
                                {severityLevels.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="actionType" className="text-right">
                            Action Type
                        </Label>
                        <Select onValueChange={setActionType} value={actionType}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Analyst Action" />
                            </SelectTrigger>
                            <SelectContent>
                                {actionTypes.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="actionTarget" className="text-right">
                            Target/Target
                        </Label>
                        <Input id="actionTarget" value={actionTarget} onChange={(e) => setActionTarget(e.target.value)} placeholder="e.g., JIRA, 192.168.1.1" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <Label htmlFor="justification" className="text-right pt-2">
                            Justification
                        </Label>
                        <Textarea id="justification" value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Why did the AI get it wrong? E.g., 'Low confidence IOC, only needs ticket.'" className="col-span-3" rows={4} />
                    </div>
                </div>
                <DialogFooter>
                    {submissionStatus === 'success' ? (
                        <Button type="button" disabled className='bg-green-500'>Feedback Sent!</Button>
                    ) : (
                        <Button 
                            type="submit" 
                            onClick={handleSubmit} 
                            disabled={submissionStatus === 'loading' || !severity || !justification}
                        >
                            {submissionStatus === 'loading' ? 'Submitting...' : 'Submit Override'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OumiFeedbackModal;