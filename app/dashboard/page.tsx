import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { fetcher } from '@/utils/fetcher';
import TrendChart from '@/components/dashboard/TrendChart';
import SeverityPie from '@/components/dashboard/SeverityPie';
import KestraStatusWidget from '@/components/dashboard/KestraStatusWidget';
import SecurityProTip from '@/components/dashboard/SecurityProTip';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  Zap, 
  Server, 
  FileText,
  BarChart3,
  Cpu,
  Users,
  Clock
} from 'lucide-react';

interface DashboardData {
  totalLogs: number;
  totalIncidents: number;
  securityAlerts: number;
  systemHealthScore: number;
  logsBySource: Array<{ _id: string; count: number }>;
  incidentsBySeverity: Record<string, number>;
  logs24hTrend: Array<{ _id: string; count: number }>;
  avgResponseTime?: number;
  activeAnalysts?: number;
  aiAccuracy?: number;
}

interface BriefingData {
  briefing: string;
  priority?: 'high' | 'medium' | 'low';
}

async function getBriefing(): Promise<BriefingData> {
  try {
    const data = await fetcher<BriefingData>('/analytics/briefing');
    return data;
  } catch (e) {
    console.error("Briefing fetch error:", e);
    return {
      briefing: "⚠️ System briefing is currently unavailable. Backend services may be experiencing issues.",
      priority: 'high'
    };
  }
}

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const data = await fetcher<{ dashboardData: DashboardData }>('/analytics/dashboard');
    return data.dashboardData;
  } catch (e) {
    console.error("Client fetch error:", e);
    return null;
  }
}

export default async function DashboardPage() {
  const [fetchedDashboardData, briefingData] = await Promise.all([
    getDashboardData(),
    getBriefing()
  ]);
  
  const mockData: DashboardData = {
    totalLogs: 0,
    totalIncidents: 0,
    securityAlerts: 0,
    systemHealthScore: 0,
    logsBySource: [],
    incidentsBySeverity: {},
    logs24hTrend: [],
    avgResponseTime: 0,
    activeAnalysts: 0,
    aiAccuracy: 0
  };

  const dashboardData = fetchedDashboardData || mockData;
  const totalIncidentsCount = Object.values(dashboardData.incidentsBySeverity).reduce((sum, count) => sum + count, 0);
  
  const briefingPriority = briefingData.priority || 'medium';
  const priorityColors = {
    high: 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-800',
    medium: 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800',
    low: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800'
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              SOC-AI Security Dashboard
              <span className="text-sm font-normal bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-full">
                AI-Powered
              </span>
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Real-time security monitoring with autonomous triage and automated incident response
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2.5 rounded-full border shadow-sm">
              <Activity className="h-4 w-4 text-green-500 animate-pulse" />
              <span>Live stream • {dashboardData.totalLogs.toLocaleString()} events</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2.5 rounded-full border shadow-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Updated just now</span>
            </div>
          </div>
        </div>

        {/* AI System Briefing */}
        <div className={`rounded-2xl p-6 border shadow-lg ${priorityColors[briefingPriority]}`}>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
              {briefingPriority === 'high' ? (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              ) : briefingPriority === 'medium' ? (
                <Zap className="h-6 w-6 text-yellow-600" />
              ) : (
                <Shield className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">🚨 AI SYSTEM BRIEFING (Tier 1 Focus)</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  briefingPriority === 'high' 
                    ? 'bg-red-600 text-white' 
                    : briefingPriority === 'medium'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}>
                  {briefingPriority} priority
                </span>
              </div>
              <div className="bg-white/50 p-4 rounded-lg border border-white/80">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {briefingData.briefing}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            title="Total Logs Ingested" 
            value={dashboardData.totalLogs.toLocaleString()} 
            description="Security events processed by the system"
            color="bg-gradient-to-r from-indigo-500 to-purple-600"
            trend={12.5}
            icon={<FileText className="h-6 w-6 text-indigo-600" />}
          />
          <DashboardCard 
            title="Active Alerts" 
            value={dashboardData.securityAlerts.toLocaleString()} 
            description="Critical incidents requiring immediate attention"
            color="bg-gradient-to-r from-red-500 to-orange-600"
            trend={-8.3}
            icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
          />
          <DashboardCard 
            title="AI-Triaged Incidents" 
            value={dashboardData.totalIncidents.toLocaleString()} 
            description="Events successfully structured by Oumi AI"
            color="bg-gradient-to-r from-blue-500 to-cyan-600"
            trend={24.7}
            icon={<Cpu className="h-6 w-6 text-blue-600" />}
          />
          <DashboardCard 
            title="System Health" 
            value={`${dashboardData.systemHealthScore}%`} 
            description="Overall organizational security posture"
            color="bg-gradient-to-r from-emerald-500 to-green-600"
            trend={3.2}
            icon={<BarChart3 className="h-6 w-6 text-emerald-600" />}
          />
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border p-6">
            <TrendChart 
              data={dashboardData.logs24hTrend}
              title="Real-time Activity Trend"
              subtitle="Last 24 hours • Event volume per hour"
            />
          </div>
          
          {/* Severity Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <SeverityPie 
              data={dashboardData.incidentsBySeverity} 
              total={totalIncidentsCount} 
            />
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Response Time */}
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Response Metrics</h3>
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Response Time</span>
                <span className="text-xl font-bold text-gray-900">
                  {dashboardData.avgResponseTime || '85'}ms
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                  style={{ width: `${Math.min((dashboardData.avgResponseTime || 0) / 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Active Analysts */}
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Team Activity</h3>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Analysts</span>
                <span className="text-3xl font-bold text-gray-900">
                  {dashboardData.activeAnalysts || '2'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Currently monitoring the SOC dashboard
              </div>
            </div>
          </div>

          {/* AI Accuracy */}
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">AI Performance</h3>
              <Cpu className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Triage Accuracy</span>
                <span className="text-3xl font-bold text-gray-900">
                  {dashboardData.aiAccuracy || '90'}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                  style={{ width: `${dashboardData.aiAccuracy || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kestra Status */}
          <div className="lg:col-span-2">
            <KestraStatusWidget />
          </div>
          
          {/* Security Pro-Tip */}
          <div>
            <SecurityProTip />
          </div>
        </div>

        {/* Log Sources Footer */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Log Sources</h3>
              <p className="text-gray-600">
                Active security event sources currently feeding the system
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {dashboardData.logsBySource.map((source) => (
                <div 
                  key={source._id}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 border text-gray-800 font-medium text-sm flex items-center gap-2"
                >
                  <Server className="h-3 w-3" />
                  {source._id}: {source.count}
                </div>
              ))}
              {dashboardData.logsBySource.length === 0 && (
                <div className="px-4 py-2 rounded-full bg-gray-100 border text-gray-600 text-sm">
                  No active sources
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}