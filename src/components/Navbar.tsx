import React from "react";
import { Search, Compass, ShieldCheck, Layers, HelpCircle, MessageSquareCode, Users } from "lucide-react";

interface NavbarProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenAssistant: () => void;
  onOpenSourcingRadar: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentView?: 'home' | 'info';
  onNavigate?: (view: 'home' | 'info', sectionId?: string) => void;
}

export default function Navbar({
  onScrollToSection,
  onOpenAssistant,
  onOpenSourcingRadar,
  searchQuery,
  setSearchQuery,
  currentView = 'home',
  onNavigate,
}: NavbarProps) {
  const handleNavClick = (sectionId: string) => {
    if (onNavigate && currentView === 'info') {
      onNavigate('home', sectionId);
    } else {
      onScrollToSection(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-gray-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <div 
          className="flex cursor-pointer items-center"
          onClick={() => {
            if (onNavigate) {
              onNavigate('home');
            } else {
              onScrollToSection("hero");
            }
          }}
        >
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-gray-900" id="nav-logo-text">
            Semiconk
          </span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-normal text-[#5f6368]">
          <button 
            onClick={() => handleNavClick("categories")}
            className="transition hover:text-[#4285F4] py-1"
            id="nav-link-categories"
          >
            Categories
          </button>
          
          <button 
            onClick={() => handleNavClick("blueprints")}
            className="transition hover:text-[#4285F4] py-1"
            id="nav-link-blueprints"
          >
            Blueprints
          </button>

          <button 
            onClick={() => handleNavClick("radar")}
            className="transition hover:text-[#4285F4] py-1"
            id="nav-link-suppliers"
          >
            Suppliers
          </button>

          <button 
            onClick={() => handleNavClick("bom-parser")}
            className="transition hover:text-[#4285F4] py-1"
            id="nav-link-compare"
          >
            BOM Matcher
          </button>

          <button 
            onClick={onOpenAssistant}
            className="transition hover:text-[#4285F4] py-1"
            id="nav-link-ai"
          >
            Ask AI
          </button>
        </nav>

        {/* Right Side: CTA Buttons */}
        <div className="flex items-center space-x-3">
          <button
            className="cursor-pointer border border-gray-300 text-gray-700 hover:text-google-blue hover:border-google-blue/80 bg-transparent px-4 py-1.5 inline-flex items-center justify-center font-sans font-semibold tracking-wide rounded-full transition-all text-sm active:scale-95"
            id="nav-signin-btn"
          >
            Sign In
          </button>
          <button
            className="cursor-pointer px-5 py-1.5 inline-flex items-center justify-center font-sans font-semibold tracking-wide text-white bg-[#4285F4] hover:bg-blue-600 rounded-full shadow-sm transition-all text-sm active:scale-95"
            id="nav-getstarted-btn"
          >
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
}
