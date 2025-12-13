// components/Header.tsx
import Link from 'next/link';
import { Zap, LayoutDashboard, ScrollText } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-indigo-600 fill-indigo-200" />
          <span className="text-xl font-bold text-gray-900">SOC-AI Platform</span>
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/logs" passHref>
            <Button variant="ghost" className="flex items-center">
              <ScrollText className="h-4 w-4 mr-2" />
              Logs
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;