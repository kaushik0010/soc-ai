import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 pt-16 pb-8 overflow-hidden">
            {/* Top gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1]"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="relative">
                                <Zap className="h-8 w-8 text-indigo-400 fill-indigo-200 group-hover:rotate-12 transition-transform duration-300" />
                                <div className="absolute -inset-3 bg-indigo-500/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                                SOC-AI Platform
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-xs">
                            The Human-in-the-Loop SOC Platform combining AI intelligence with automated execution.
                        </p>
                    </div>
                    
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/logs" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                                    Incident Logs
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/security" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                                    Security
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Social */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-[#6366f1] transition-all duration-300 cursor-pointer group">
                                <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-500 transition-all duration-300 cursor-pointer group">
                                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-all duration-300 cursor-pointer group">
                                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Bottom bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} SOC-AI Platform. Built for the Hackathon.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="text-gray-500 hover:text-gray-300 transition-colors duration-200 cursor-pointer">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;