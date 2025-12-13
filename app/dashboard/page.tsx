// app/dashboard/page.tsx
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { fetcher } from '@/utils/fetcher';
import TrendChart from '@/components/dashboard/TrendChart';
import SeverityPie from '@/components/dashboard/SeverityPie';
import KestraStatusWidget from '@/components/dashboard/KestraStatusWidget';
import SecurityProTip from '@/components/dashboard/SecurityProTip';

// Define the expected structure of your API response for type safety
interface DashboardData {
    totalLogs: number;
    totalIncidents: number;
    securityAlerts: number;
    systemHealthScore: number;
    logsBySource: Array<{ _id: string; count: number }>;
    incidentsBySeverity: Record<string, number>;
    logs24hTrend: Array<{ _id: string; count: number }>;
}

interface BriefingData {
    briefing: string;
}

async function getBriefing(): Promise<string> {
    try {
        const data = await fetcher<BriefingData>('/analytics/briefing');
        return data.briefing;
    } catch (e) {
        console.error("Briefing fetch error:", e);
        return "System briefing is currently unavailable. Please check backend services.";
    }
}
/**
 * Utility to fetch data from your new backend endpoint
 * Note: You will need to create this simple fetcher in utils/fetcher.ts
 */
async function getDashboardData(): Promise<DashboardData | null> {
    try {
        // Fetch data from the endpoint created in the previous step
        const data = await fetcher<{ dashboardData: DashboardData }>('/analytics/dashboard');
        return data.dashboardData;
    } catch (e) {
        console.error("Client fetch error:", e);
        return null;
    }
}

export default async function DashboardPage() {
    const [fetchedDashboardData, briefingText] = await Promise.all([
        getDashboardData(), 
        getBriefing()
    ]);
    
    // Fallback data for quick rendering if API fails
    const mockData: DashboardData = {
        totalLogs: 0, totalIncidents: 0, securityAlerts: 0, systemHealthScore: 0,
        logsBySource: [], incidentsBySeverity: {}, logs24hTrend: [],
    };

    const dashboardData = fetchedDashboardData || mockData;
    const totalIncidentsCount = Object.values(dashboardData.incidentsBySeverity).reduce((sum, count) => sum + count, 0);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                SOC-AI Security Dashboard 🛡️
            </h1>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-8 shadow-md">
                <p className="font-bold text-lg mb-2">🚨 AI SYSTEM BRIEFING (Tier 1 Focus) 🚨</p>
                <p className="whitespace-pre-wrap">{briefingText}</p>
            </div>

            {/* --- 1. HERO STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <DashboardCard 
                    title="Total Logs Ingested" 
                    value={dashboardData.totalLogs.toLocaleString()} 
                    description="Total events processed by the system."
                    color="bg-indigo-500"
                />
                <DashboardCard 
                    title="Security Alerts (High/Critical)" 
                    value={dashboardData.securityAlerts.toLocaleString()} 
                    description="Incidents requiring immediate attention."
                    color="bg-red-500"
                />
                <DashboardCard 
                    title="Total Incidents Triaged" 
                    value={dashboardData.totalIncidents.toLocaleString()} 
                    description="Total events successfully structured by AI Triage."
                    color="bg-blue-500"
                />
                <DashboardCard 
                    title="System Health Score" 
                    value={`${dashboardData.systemHealthScore}%`} 
                    description="AI-driven measure of organizational risk."
                    color="bg-green-500"
                />
            </div>

            {/* 2. Placeholder for Charts and Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Log Activity Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Log Activity Trend (Last 24 Hours)</h2>
                    <div className="h-64">
                        <TrendChart data={dashboardData.logs24hTrend} /> 
                    </div>
                </div>
                
                {/* Incident Severity Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Incident Severity Distribution</h2>
                    <div className="h-64 pt-4">
                        <SeverityPie 
                            data={dashboardData.incidentsBySeverity} 
                            total={totalIncidentsCount} 
                        />
                    </div>
                </div>

                <SecurityProTip />
            </div>

            {/* --- 3. KESTRA STATUS WIDGET --- */}
            <KestraStatusWidget />
            
            {/* --- 4. Sources of Logs (Moved below Kestra Status) --- */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Sources of Logs</h2>
                <p className="text-gray-600">
                    Active sources: 
                    <span className="font-mono bg-gray-100 p-1 rounded ml-2">
                        {dashboardData.logsBySource.map(s => `${s._id} (${s.count})`).join(' | ')}
                    </span>
                </p>
            </div>
        </div>
    );
}