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
    <header className="sticky top-0 z-50 w-full h-[64px] max-w-full m-0 bg-white/75 backdrop-blur-[10px] border-b border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all font-sans">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* Left Side: Logo */}
        <div 
          className="flex cursor-pointer items-center gap-3"
          onClick={() => {
            if (onNavigate) {
              onNavigate('home');
            } else {
              onScrollToSection("hero");
            }
          }}
        >
          <img 
            src="https://res.cloudinary.com/duh9wvgzu/image/upload/q_auto/f_auto/v1781335895/seedream-4.0_A_flat_2D_app_icon_of_a_cardboard_box_front-facing_view_warm_kraft_brown_color_b-0_1_ikduxs.jpg" 
            alt="GrabRaw Logo" 
            className="h-[40px] md:h-[45px] lg:h-[50px] w-auto object-contain" 
            referrerPolicy="no-referrer" 
            loading="lazy"
          />
          <span className="font-sans text-2xl font-bold text-[#1a1a1a] tracking-tight" id="nav-logo-text">
            GrabRaw
          </span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#1a1a1a] flex-1 ml-10">
          <button 
            onClick={() => handleNavClick("categories")}
            className="transition hover:text-[#4285F4] hover:bg-[#f0f0f0] px-3 py-2 rounded-lg duration-200"
            id="nav-link-categories"
          >
            Categories
          </button>

          <button 
            onClick={() => handleNavClick("radar")}
            className="transition hover:text-[#4285F4] hover:bg-[#f0f0f0] px-3 py-2 rounded-lg duration-200"
            id="nav-link-suppliers"
          >
            Suppliers
          </button>

          <button 
            onClick={() => handleNavClick("bom-parser")}
            className="transition hover:text-[#1a1a1a] font-medium bg-transparent hover:bg-[#f0f0f0] hover:text-[#4285F4] px-4 py-2 rounded-lg cursor-pointer duration-200 text-sm"
            id="nav-link-compare"
          >
            GrabRaw +
          </button>

          <button 
            onClick={onOpenAssistant}
            className="transition hover:text-[#4285F4] hover:bg-[#f0f0f0] px-3 py-2 rounded-lg duration-200"
            id="nav-link-ai"
          >
            Ask AI
          </button>
        </nav>

        {/* Right Side: CTA Buttons */}
        <div className="flex items-center space-x-4 ml-auto">
          <button
            className="cursor-pointer border border-gray-300 text-gray-700 hover:text-google-blue hover:border-google-blue/80 bg-transparent px-4 py-1.5 inline-flex items-center justify-center font-sans font-semibold tracking-wide rounded-full transition-all text-sm active:scale-95"
            id="nav-signin-btn"
          >
            Sign In
          </button>
          <button
            className="cursor-pointer px-5 py-2 inline-flex items-center justify-center font-sans font-semibold tracking-wide text-white bg-[#4285F4] hover:bg-[#3367D6] hover:-translate-y-0.5 rounded-full shadow-xs transition-all text-sm active:scale-95"
            id="nav-getstarted-btn"
          >
            Get Started
          </button>
        </div>

      </div>
    </header>
  );
}
