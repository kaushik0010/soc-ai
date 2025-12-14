"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, Shield, Zap, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { securityTips, SecurityTip } from '@/lib/securityTips';
import { Button } from "@/components/ui/button";

const getRandomTip = (): SecurityTip => {
  const randomIndex = Math.floor(Math.random() * securityTips.length);
  return securityTips[randomIndex];
};

const getTipIcon = (category?: SecurityTip['category']) => {
  switch (category?.toLowerCase()) {
    case 'response':
      return <Zap className="h-4 w-4 text-yellow-600" />;
    case 'prevention':
      return <Shield className="h-4 w-4 text-blue-600" />;
    case 'detection':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    default:
      return <Lightbulb className="h-4 w-4 text-indigo-600" />;
  }
};

const SecurityProTip: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<SecurityTip>(getRandomTip());
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNewTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTip(getRandomTip());
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const intervalId = setInterval(handleNewTip, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="relative overflow-hidden border-none shadow-lg rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative z-10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100">
                {getTipIcon(currentTip.category)}
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Security Pro-Tip
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Expert guidance for SOC analysts
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewTip}
              disabled={isAnimating}
              className="cursor-pointer hover:bg-white/50 transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 ${isAnimating ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-1">
                {getTipIcon(currentTip.category)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">
                  {currentTip.title}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentTip.tip}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentTip.category && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 capitalize">
                    {currentTip.category}
                  </span>
                )}
                {currentTip.priority && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    currentTip.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : currentTip.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {currentTip.priority} priority
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Tip #{securityTips.findIndex(t => t.title === currentTip.title) + 1} of {securityTips.length}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default SecurityProTip;