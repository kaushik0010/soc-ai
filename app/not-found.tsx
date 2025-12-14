import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Home, Search, Shield, AlertTriangle, ArrowLeft, Server, Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      {/* Animated floating elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200 rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-red-200 rounded-full opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-4xl w-full mx-auto text-center space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
            <div className="absolute -inset-4 bg-red-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
          </div>
          
          <div className="space-y-2">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-medium animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-red-600 mr-2 animate-pulse"></span>
              Security Alert: Page Not Found
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tight">
              <span className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent animate-gradient">
                404
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Security Protocol Breach Detected
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="space-y-4">
            <p className="text-xl text-gray-700">
              The requested security resource could not be located in our threat intelligence database.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
              <Server className="h-4 w-4 mr-2" />
              Status: <span className="font-bold ml-1">Endpoint Unreachable</span>
            </div>
          </div>

          {/* Incident Analysis */}
          <div className="grid md:grid-cols-3 gap-4 py-6">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Possible Causes</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                  <span>Incorrect URL path</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                  <span>Resource moved or deleted</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0"></div>
                  <span>Access permissions changed</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Recommended Actions</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <span>Verify the URL for typos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <span>Check your access permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <span>Navigate using main menu</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Security Status</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                  <span>No security threat detected</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                  <span>All systems operational</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                  <span>Connection encrypted</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-indigo-600" />
              Quick Navigation
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/" passHref>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Return to Dashboard
                </Button>
              </Link>
              
              <Link href="/dashboard" passHref>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 px-8 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Security Dashboard
                </Button>
              </Link>
              
              <Link href="/logs" passHref>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 hover:border-blue-300 hover:bg-blue-50 text-gray-700 px-8 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  <Server className="h-5 w-5 mr-2" />
                  View Security Logs
                </Button>
              </Link>
            </div>
          </div>

          {/* Incident Report */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Incident Report ID:</span> 
                <span className="font-mono ml-2 bg-gray-100 px-2 py-1 rounded">404-PNF-{new Date().getTime().toString().slice(-6)}</span>
              </div>
              <form action={goBack}>
                <Button 
                  type="submit"
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>
            If you believe this is an error, please contact your 
            <span className="font-medium text-gray-700 ml-1">SOC Administrator</span>
          </p>
          <div className="flex items-center justify-center gap-6">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              System Status: <span className="font-medium text-green-600">Operational</span>
            </span>
            <span>•</span>
            <span>Security Level: <span className="font-medium text-gray-700">Maximum</span></span>
            <span>•</span>
            <span>Response Time: <span className="font-medium text-gray-700">&lt;50ms</span></span>
          </div>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600"></div>
    </div>
  );
}

// Server Action for going back
async function goBack() {
  'use server';
  // This would normally use redirect, but for not-found we can't redirect
  // Instead, we'll let the client handle it
  // In a real implementation, you might want to handle this differently
}