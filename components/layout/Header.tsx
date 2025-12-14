'use client'

import Link from 'next/link';
import { Zap, LayoutDashboard, ScrollText, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 border-b shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Zap className="h-7 w-7 text-[#6366f1] fill-[#c7d2fe] transition-transform group-hover:scale-110 duration-300" />
            <div className="absolute -inset-2 bg-indigo-100 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
          <span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
            SOC-AI Platform
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/dashboard" passHref>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#6366f1] hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/logs" passHref>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#6366f1] hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <ScrollText className="h-4 w-4" />
              Logs
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden p-2 cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white animate-slide-in">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#6366f1] hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href="/logs" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#6366f1] hover:bg-indigo-50 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              <ScrollText className="h-4 w-4" />
              Logs
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;