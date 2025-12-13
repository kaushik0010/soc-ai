// components/SecurityProTip.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb } from 'lucide-react';
import { securityTips } from '@/lib/securityTips';

const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * securityTips.length);
    return securityTips[randomIndex];
};

const SecurityProTip: React.FC = () => {
    const [currentTip, setCurrentTip] = useState(getRandomTip());

    // Optional: Cycle the tip every 30 seconds to keep the dashboard dynamic
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTip(getRandomTip());
        }, 30000); // Change tip every 30 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <Card className="col-span-12 xl:col-span-4 h-full bg-indigo-50 border-indigo-200">
            <CardHeader className="flex flex-row items-center space-y-0 p-3 pb-2">
                <Lightbulb className="w-5 h-5 mr-2 text-indigo-600 fill-indigo-200" />
                <CardTitle className="text-md font-semibold text-indigo-700">
                    Security Pro-Tip
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <h3 className="text-sm font-bold text-gray-800 mb-1">{currentTip.title}</h3>
                <p className="text-xs text-gray-600">
                    {currentTip.tip}
                </p>
            </CardContent>
        </Card>
    );
};

export default SecurityProTip;