import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LocalRadar from "./components/LocalRadar";
import AiAssistant from "./components/AiAssistant";
import ProductIntelligence from "./components/ProductIntelligence";
import { Blueprint, Supplier, PartMatch, ComponentItem } from "./types";
import { 
  Search, Cpu, HardDrive, Smartphone, Radio, BatteryCharging, 
  Tv, ClipboardCheck, ArrowRight, MapPin, Sparkles, Star, CheckCircle, 
  HelpCircle, Upload, Check, AlertCircle, Info, ExternalLink, Box, Award
} from "lucide-react";

const CATEGORIES = [
  { name: "Smartwatch Kit", count: "12 Blueprints", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80" },
  { name: "Arduino Modules", count: "38 Blueprints", image: "https://images.unsplash.com/photo-1608564697071-ddf911d8a37e?auto=format&fit=crop&w=400&q=80" },
  { name: "Raspberry Pi", count: "24 Blueprints", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80" },
  { name: "Phone Components", count: "8 Blueprints", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80" },
  { name: "IoT Sensors", count: "41 Blueprints", image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=400&q=80" },
  { name: "Battery Packs", count: "15 Blueprints", image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80" },
  { name: "Display Screens", count: "19 Blueprints", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80" },
  { name: "Circuit Boards", count: "32 Blueprints", image: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&w=400&q=80" }
];

export default function App() {
  // Routing views state
  const [currentView, setCurrentView] = useState<'home' | 'info'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === '/info' || window.location.pathname.startsWith('/info') ? 'info' : 'home';
    }
    return 'home';
  });
  const [infoSearchQuery, setInfoSearchQuery] = useState("iPhone 15");

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === '/info' || window.location.pathname.startsWith('/info')) {
        setCurrentView('info');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (view: 'home' | 'info', query?: string) => {
    setCurrentView(view);
    if (view === 'info') {
      setInfoSearchQuery(query || "iPhone 15");
      window.history.pushState({}, '', '/info');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSearchSubmit = (q: string) => {
    const cleanQ = q.trim();
    if (cleanQ) {
      navigateTo('info', cleanQ);
    } else {
      navigateTo('info', "iPhone 15");
    }
  };

  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredBlueprints, setFilteredBlueprints] = useState<Blueprint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // Custom BOM Parsing state
  const [pastedBom, setPastedBom] = useState("");
  const [isParsingBom, setIsParsingBom] = useState(false);
  const [parsedBomResults, setParsedBomResults] = useState<any[]>([]);
  const [bomMatches, setBomMatches] = useState<Record<string, PartMatch>>({});
  const [isBomParsedSuccessfully, setIsBomParsedSuccessfully] = useState(false);

  // Active blueprint modal viewer
  const [viewingBlueprint, setViewingBlueprint] = useState<Blueprint | null>(null);
  const [blueprintMatches, setBlueprintMatches] = useState<Record<string, PartMatch>>({});

  // Fetch initial blueprints and suppliers
  useEffect(() => {
    const loadPlatformData = async () => {
      try {
        const response = await fetch(`/api/search?q=`);
        if (response.ok) {
          const data = await response.json();
          setBlueprints(data.blueprints || []);
          setSuppliers(data.suppliers || []);
          setFilteredBlueprints(data.blueprints || []);
        }
      } catch (err) {
        console.error("Error fetching hardware database:", err);
      }
    };
    loadPlatformData();
  }, []);

  // Handle dynamic filtering (Search & Category selection)
  useEffect(() => {
    let result = [...blueprints];
    
    if (selectedCategory) {
      // Map category cards to actual blueprint metadata filters
      const catKeywords: Record<string, string> = {
        "Smartwatch Kit": "Wearables",
        "Phone Components": "Mobile",
        "IoT Sensors": "IoT Sourcing",
        "Circuit Boards": "custom",
      };
      const filterTerm = catKeywords[selectedCategory] || selectedCategory;
      result = result.filter(bp => 
        bp.category.toLowerCase().includes(filterTerm.toLowerCase()) ||
        bp.name.toLowerCase().includes(filterTerm.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(bp => 
        bp.name.toLowerCase().includes(q) ||
        bp.description.toLowerCase().includes(q) ||
        bp.category.toLowerCase().includes(q) ||
        bp.bom.some(item => item.name.toLowerCase().includes(q))
      );
    }

    setFilteredBlueprints(result);
  }, [searchQuery, selectedCategory, blueprints]);

  // Handle Quick search suggestions inside hero
  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    handleSearchSubmit(query);
  };

  // Helper trigger to scroll to sections of the page nicely
  const handleScrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Analyze specific blueprint components using matchmaking back-end
  const handleViewBlueprint = async (blueprint: Blueprint) => {
    setViewingBlueprint(blueprint);
    
    // Extract part names
    const partNames = blueprint.bom.map(item => item.name);
    try {
      const resp = await fetch("/api/sourcer/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parts: partNames })
      });
      if (resp.ok) {
        const matchData = await resp.json();
        const matchMap: Record<string, PartMatch> = {};
        matchData.matches.forEach((m: any) => {
          matchMap[m.part] = m;
        });
        setBlueprintMatches(matchMap);
      }
    } catch (err) {
      console.error("Error matching blueprint components:", err);
    }
  };

  // Paste custom raw Bill of Materials parsing via Gemini AI & matching
  const handleParseRawBomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedBom.trim()) return;

    setIsParsingBom(true);
    setParsedBomResults([]);
    setIsBomParsedSuccessfully(false);

    try {
      const resp = await fetch("/api/ai/parse-bom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bomText: pastedBom })
      });

      if (!resp.ok) throw new Error("Could not contact the BOM AI text extractor.");
      const parsedData = await resp.json();
      
      const parts = parsedData.parts || [];
      setParsedBomResults(parts);
      setIsBomParsedSuccessfully(true);

      if (parts.length > 0) {
        // Query local supplier stock matches
        const itemNames = parts.map((p: any) => p.name);
        const matchResp = await fetch("/api/sourcer/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parts: itemNames })
        });
        
        if (matchResp.ok) {
          const matchedData = await matchResp.json();
          const matchMap: Record<string, PartMatch> = {};
          matchedData.matches.forEach((m: any) => {
            matchMap[m.part] = m;
          });
          setBomMatches(matchMap);
        }
      }
    } catch (error) {
      console.error("BOM analysis failure:", error);
    } finally {
      setIsParsingBom(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 font-sans selection:bg-google-blue/20 selection:text-google-blue" id="root-container">
      
      {/* 1. TOP NAVBAR */}
      <Navbar 
        onScrollToSection={handleScrollToSection}
        onOpenAssistant={() => setIsAiOpen(true)}
        onOpenSourcingRadar={() => handleScrollToSection("radar")}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentView={currentView}
        onNavigate={(view, sectionId) => {
          navigateTo(view);
          if (sectionId) {
            setTimeout(() => {
              handleScrollToSection(sectionId);
            }, 150);
          }
        }}
      />

      {currentView === 'info' ? (
        <ProductIntelligence 
          initialSearchQuery={infoSearchQuery}
          onNavigateHome={(sectionId) => {
            navigateTo('home');
            if (sectionId) {
              setTimeout(() => {
                handleScrollToSection(sectionId);
              }, 150);
            }
          }}
        />
      ) : (
        <>
          {/* 2. HERO SECTION (Clean White Minimal Style) */}
          <section 
            className="relative overflow-hidden bg-white pt-10 pb-20 lg:pt-10 lg:pb-28 text-gray-900 border-b border-gray-100"
            id="hero"
          >
        {/* Colorful Ambient Blurs */}
        <div className="absolute top-10 right-10 h-72 w-52 rounded-full bg-google-red/5 blur-[120px]" />
        <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-google-blue/5 blur-[150px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 items-start lg:grid-cols-12">
            
            {/* Hero Left Content */}
            <div className="space-y-8 lg:col-span-7">
              
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-6xl leading-tight">
                Search Any Product.<br />
                Find Every Component.<br />
                <span className="text-[#4285F4]">Source It Near You.</span>
              </h1>
              
              <p className="max-w-xl text-base text-[#5f6368] sm:text-lg leading-relaxed">
                Tell us any product — a phone, shampoo, smartwatch, or laptop. Our AI instantly breaks it down into every raw material and component needed to build it, then finds local suppliers within 40km.
              </p>

              {/* Dynamic Action Search Bar */}
              <div className="relative max-w-xl" id="hero-interactive-search">
                <div className="flex items-center bg-white border border-[#dadce0] rounded-full p-2 shadow-sm shadow-gray-100/30">
                  <div className="flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Try: iPhone, Shampoo, Smartwatch, Solar Panel..."
                    className="w-full bg-transparent pl-3 pr-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchSubmit(searchQuery);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleSearchSubmit(searchQuery)}
                    className="cursor-pointer rounded-full bg-google-blue px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition tracking-wide"
                  >
                    Search
                  </button>
                </div>
                
                {/* Hero Popular Tags recommendations */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 px-1">
                  <span className="text-xs font-mono text-gray-500 font-medium">Try pasting:</span>
                  {["ESP32", "Smartwatch", "Raspberry Pi Zero", "PCB Fabricators"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleHeroSearch(tag)}
                      className="cursor-pointer rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:text-google-blue hover:border-[#4285F4] transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Statistics */}
              <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-6 sm:gap-12" id="hero-stats-panel">
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a]">1M+</div>
                  <div className="text-xs text-[#4285F4] font-medium mt-0.5">Products Searchable</div>
                </div>
                <div className="hidden sm:block h-8 w-[1px] bg-gray-200" />
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a]">500K+</div>
                  <div className="text-xs text-[#4285F4] font-medium mt-0.5">Components Tracked</div>
                </div>
                <div className="hidden sm:block h-8 w-[1px] bg-gray-200" />
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a]">40km Radius</div>
                  <div className="text-xs text-[#4285F4] font-medium mt-0.5">Sourcing Proximity Limit</div>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Mockup Card */}
            <div className="lg:col-span-5 relative">
              <div 
                className="relative mx-auto max-w-[420px] rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-100/50"
                id="hero-mockup-wrapper"
              >
                {/* Image layout representing watch blueprint */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1542496658-0f0a8c2f1e6f?auto=format&fit=crop&w=500&q=80" 
                    alt="Smartwatch kit" 
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-google-red px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                    OpenWatch V2 BOM
                  </span>
                </div>

                <div className="mt-5 space-y-3.5">
                  <h3 className="font-display text-lg font-bold text-gray-900 flex items-center justify-between">
                    <span>Smartwatch Core Board</span>
                    <span className="text-xs text-google-green font-mono font-semibold">100% Stocked Nearby</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    BOM elements mapped instantly from localized databases within your city.
                  </p>

                  {/* Micro chips representative of BOM parts */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-xs text-gray-700 flex items-center space-x-1.5 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-google-blue" />
                      <span>STM32 MCU <span className="text-[10px] text-gray-400">(1x)</span></span>
                    </span>
                    <span className="rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-xs text-gray-700 flex items-center space-x-1.5 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-google-green" />
                      <span>Round LCD <span className="text-[10px] text-gray-400">(1x)</span></span>
                    </span>
                    <span className="rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1 text-xs text-gray-700 flex items-center space-x-1.5 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-google-yellow" />
                      <span>350mAh LiPo <span className="text-[10px] text-gray-400">(1x)</span></span>
                    </span>
                  </div>

                  {/* Supplier proximity rating badge mockup */}
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="bg-google-green/10 h-8.5 w-8.5 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4.5 w-4.5 text-google-green" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">MetroTech Electronics</p>
                        <p className="text-[10px] text-gray-500">8.4 km away • In Stock</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-google-green/15 px-2 py-0.5 text-[10px] font-mono font-bold text-google-green">
                      FASTEST
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES SECTION */}
      <section 
        className="bg-white py-16 border-b border-gray-100"
        id="categories"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-google-yellow/10 px-3 py-1 text-xs font-semibold text-google-yellow/90">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Product Hub Categories</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
                Popular Product Categories
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Filter blueprints and component sets instantly. Click any card to browse.
              </p>
            </div>
            
            {/* Filter Reset Button */}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-4 md:mt-0 cursor-pointer text-xs font-semibold text-google-blue border border-google-blue/20 bg-blue-50/50 hover:bg-blue-50 px-4 py-2 rounded-full flex items-center space-x-1.5"
              >
                <span>Reset View Filters</span>
                <span className="rounded-full bg-google-blue text-white px-1.5 py-0.2 text-[10px]">Active</span>
              </button>
            )}
          </div>

          {/* Horizontally Scrollable Grid container (inspired by TechJockey.com card loops) */}
          <div className="flex overflow-x-auto gap-5 pb-6 pt-1 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat, idx) => {
              const isActive = selectedCategory === cat.name;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCategory(isActive ? null : cat.name)}
                  className={`group relative flex-none w-[170px] sm:w-[200px] aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 transform ${
                    isActive 
                      ? "ring-4 ring-google-blue scale-95" 
                      : "hover:-translate-y-1.5"
                  }`}
                  id={`category-card-${idx}`}
                >
                  {/* Image with Dark Cover Overlay */}
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25 transition-opacity" />

                  {/* Label Text Card bottom overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-mono leading-none font-bold uppercase tracking-widest text-google-yellow">
                      {cat.count}
                    </span>
                    <h4 className="font-display font-bold text-sm sm:text-base mt-1.5 tracking-tight group-hover:text-google-blue transition">
                      {cat.name}
                    </h4>
                  </div>
                  
                  {/* Mini check badge when selected */}
                  {isActive && (
                    <div className="absolute top-3 right-3 bg-google-blue text-white rounded-full p-1 shadow-md">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (Light Blue/Google Brand Background) */}
      <section 
        className="bg-blue-50/40 py-16 border-b border-gray-100 tech-grid-light-bg"
        id="how-it-works"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-[11px] font-mono font-bold tracking-widest text-google-blue uppercase">
              Simplified Fabrication Delivery
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
              From Blueprint to Build in 3 Steps
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Our automated city-wide inventory pipeline replaces semanas of sourcing delays with local pick-up or six-hour delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-350 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-google-red/10 text-google-red mb-5 shadow-inner">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-gray-900">1. Upload or Browse Blueprint</h3>
              <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
                Choose from hundreds of verified community schemas, or paste your custom Bill of Materials (BOM) text below.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-350 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-google-yellow/10 text-google-yellow mb-5 shadow-inner">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-gray-900">2. AI Reads & Maps Your BOM</h3>
              <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
                Gemini processes the ingredients, matches serial names, recommends component alternatives, and verifies active local stock counts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-350 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-google-green/10 text-google-green mb-5 shadow-inner">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-gray-900">3. Procure in 40 Kilometers</h3>
              <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">
                Identify which neighboring electronic stores or robotic fabricators carry the supplies. Pick up in hours.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE BOM PARSER & UPLOADER SCREENPLAY (NEW UNIQUE VALUE ADD) */}
      <section 
        className="bg-white py-16 border-b border-gray-100"
        id="bom-parser"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Input Board: pasted lists */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-google-blue font-mono text-xs font-bold uppercase tracking-wider">Interactive Terminal</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-1">
                  Have a custom blueprint BOM?
                </h2>
                <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">
                  Paste raw text from a README file, repository, or datasheet into the terminal below. Gemini AI will analyze, parse, and verify real stock levels around you within seconds!
                </p>
              </div>

              <form onSubmit={handleParseRawBomSubmit} className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm focus-within:ring-2 focus-within:ring-google-blue/30 transition-all">
                  <span className="text-[10px] font-bold text-gray-400 font-mono block mb-1.5">PASTE YOUR COMPONENT TEXT LIST:</span>
                  <textarea
                    rows={6}
                    value={pastedBom}
                    onChange={(e) => setPastedBom(e.target.value)}
                    placeholder="Example: &#10;1x ESP32 controller &#10;1x DHT22 humidity sensor module &#10;2x LiPo rechargeable battery packs"
                    className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none font-mono leading-relaxed"
                  />
                  
                  {/* Preset Paste Quick Buttons */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPastedBom("1x Raspberry Pi Zero 2 W\n1x DHT22 Humidty Sensor\n1x LiPo 3.7V 350mAh\n1x OLED 0.96 inch Shield")}
                      className="cursor-pointer text-[11px] font-sans font-semibold text-google-blue bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded"
                    >
                      Use IoT Sample BOM
                    </button>
                    <span className="text-[10px] text-gray-400 font-mono">{pastedBom.length} chars</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!pastedBom.trim() || isParsingBom}
                  className="w-full cursor-pointer py-3 px-6 rounded-full bg-google-blue text-white font-semibold text-sm hover:bg-blue-600 disabled:opacity-55 active:scale-95 transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-200"
                >
                  {isParsingBom ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>AI Parsing with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4.5 w-4.5 text-google-yellow" />
                      <span>Extract & Match Ingredients</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Output Panel: Mapped Inventory */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm min-h-[350px] flex flex-col" id="bom-output-screen">
                
                {/* Visual Header */}
                <div className="border-b border-gray-100 pb-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-google-green animate-pulse" />
                    <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                      Matched Local Pipeline
                    </span>
                  </div>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono font-medium text-gray-600">
                    Proximity Limit: 40km
                  </span>
                </div>

                {isParsingBom && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="relative h-12 w-12 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full border-4 border-google-blue/20" />
                      <span className="absolute inset-0 rounded-full border-4 border-google-blue border-t-transparent animate-spin" />
                    </div>
                    <div className="text-center font-sans">
                      <p className="text-sm font-bold text-gray-800">Reading pasted dataset schemas...</p>
                      <p className="text-xs text-gray-400 mt-1">Extracting components & checking near electronics stock</p>
                    </div>
                  </div>
                )}

                {!isParsingBom && !isBomParsedSuccessfully && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                    <ClipboardCheck className="h-10 w-10 text-gray-200 mb-3" />
                    <p className="text-sm font-semibold text-gray-600">No BOM List Processed Yet</p>
                    <p className="text-xs text-gray-400 max-w-xs mt-1">
                      Paste text on the left or click the IoT sample button to extract stock availability.
                    </p>
                  </div>
                )}

                {/* Parsed Output List */}
                {!isParsingBom && isBomParsedSuccessfully && (
                  <div className="flex-1 space-y-4">
                    
                    <div className="flex items-center justify-between bg-google-green/10 border border-google-green/20 rounded-xl p-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4.5 w-4.5 text-google-green" />
                        <span className="text-xs font-semibold text-gray-800">Successful Extraction</span>
                      </div>
                      <span className="text-[10px] font-mono text-google-green font-bold">
                        {parsedBomResults.length} unique parts matched
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto pr-1">
                      {parsedBomResults.map((part, index) => {
                        const parsedName = part.name;
                        const match = bomMatches[parsedName];
                        const available = match?.available;
                        const closestOption = available && match?.options?.[0];

                        return (
                          <div key={index} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0">
                            
                            {/* Part description */}
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                                <span className="inline-block rounded bg-blue-50 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-google-blue">
                                  Qty: {part.qty || 1}
                                </span>
                                <span className="truncate max-w-[190px]">{part.name}</span>
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono">
                                Extract confidence: {part.confidence || "High"}
                              </p>
                            </div>

                            {/* Local supplier proximity match details */}
                            <div className="mt-2 sm:mt-0 text-right">
                              {available && closestOption ? (
                                <div className="inline-flex flex-col items-end">
                                  <div className="flex items-center space-x-1.5 rounded-full bg-google-green/10 px-2.5 py-0.5 text-[11px] font-semibold text-google-green">
                                    <MapPin className="h-3 w-3" />
                                    <span>{closestOption.supplierName.split(" ")[0]} ({closestOption.distance}km)</span>
                                  </div>
                                  <span className="text-[10px] text-gray-400 mt-1 font-mono">
                                    Rating: ★ {closestOption.rating}
                                  </span>
                                </div>
                              ) : (
                                <div className="inline-flex flex-col items-end">
                                  <span className="rounded-full bg-google-red/10 px-2.5 py-0.5 text-[11px] font-semibold text-google-red">
                                    Not Stocked Nearby
                                  </span>
                                  <span className="text-[10px] text-google-blue cursor-pointer hover:underline mt-1 font-semibold" onClick={() => setIsAiOpen(true)}>
                                    Ask AI for an alternative?
                                  </span>
                                </div>
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FEATURED BLUEPRINTS GRID SECTION */}
      <section 
        className="bg-gray-50 py-16 border-b border-gray-100"
        id="blueprints"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" id="blueprints-list">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-[11px] font-mono font-bold tracking-widest text-google-blue uppercase">
              Free Community Repositories
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
              Trending Open-Source Blueprints
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Explore step-by-step schematics verified locally. Filtered blueprints adjust automatically based on your search queries or category choices.
            </p>
          </div>

          {filteredBlueprints.length === 0 ? (
            <div className="text-center bg-white rounded-3xl p-12 border border-gray-200 shadow-sm max-w-md mx-auto">
              <AlertCircle className="h-10 w-10 text-google-red mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-800">No blueprints matched your queries</p>
              <p className="text-xs text-gray-400 mt-1.5">
                We couldn't locate any matching blueprints for "{searchQuery}". Try modifying your filters or search keywords.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                className="mt-4 cursor-pointer text-xs font-semibold text-google-blue bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full"
              >
                Clear Sourcing Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBlueprints.map((blueprint) => (
                <div 
                  key={blueprint.id}
                  className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                  id={`blueprint-grid-card-${blueprint.id}`}
                >
                  
                  {/* Image with Tag badge */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img 
                      src={blueprint.image} 
                      alt={blueprint.name} 
                      className="object-cover h-full w-full hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Level Badge */}
                    <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-white ${
                      blueprint.difficulty === "Beginner" 
                        ? "bg-google-green" 
                        : blueprint.difficulty === "Intermediate" 
                        ? "bg-google-yellow" 
                        : "bg-google-red"
                    }`}>
                      {blueprint.difficulty}
                    </span>

                    {/* Proximity local supplies indicator tag */}
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-[9px] font-mono text-white text-google-green flex items-center space-x-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-google-green" />
                      <span>{blueprint.suppliersNearby} Suppliers Nearby</span>
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col space-y-3.5">
                    
                    <div>
                      <span className="text-[10px] font-mono font-bold text-google-blue uppercase tracking-wide">
                        {blueprint.category}
                      </span>
                      <h3 className="font-display font-medium text-base text-gray-900 leading-tight mt-1 hover:text-google-blue transition">
                        {blueprint.name}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed flex-1">
                      {blueprint.description}
                    </p>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono text-gray-400">
                      <span>{blueprint.componentCount} components</span>
                      <span>Build time: {blueprint.timeToBuild}</span>
                    </div>

                    <button
                      onClick={() => handleViewBlueprint(blueprint)}
                      className="w-full cursor-pointer py-2.5 px-4 rounded-full bg-google-blue text-white text-xs font-semibold hover:bg-blue-600 active:scale-95 transition-all text-center"
                    >
                      View Blueprint BOM
                    </button>

                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 7. SUPPLIER PROXIMITY INTERACTIVE RADAR (Dark background, full map visualization) */}
      <LocalRadar suppliers={suppliers} />

      {/* 8. EXPERT HELP PROMO BANNER (Black Background like TechJockey) */}
      <section 
        className="bg-black py-20 px-4 text-center text-white tech-grid-bg border-t border-gray-900"
        id="expert-promo"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-3xl space-y-6 relative">
          
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-google-blue/20 text-google-blue hover:text-white border border-google-blue/35">
            <Sparkles className="h-5 w-5 text-google-yellow animate-spin" />
          </div>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Need Sourcing Alternatives? Our AI is Here!
          </h2>
          
          <p className="max-w-xl mx-auto text-sm text-gray-400 leading-relaxed">
            Can't find an exact resistor value or controller model listed? Get instant AI recommendations on product substitutions, impedance matching, and pin-out configurations instantly.
          </p>

          <button
            onClick={() => setIsAiOpen(true)}
            className="cursor-pointer px-8 py-3 rounded-full bg-google-blue hover:bg-blue-600 text-sm font-semibold text-white inline-flex items-center space-x-2.5 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            <span>Ask the AI Assistant</span>
            <ArrowRight className="h-4 w-4" />
          </button>

        </div>
      </section>

      {/* 9. FLOATING CHAT ASSISTANT PANEL */}
      <AiAssistant 
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onOpen={() => setIsAiOpen(true)}
      />

      {/* 10. SYSTEM BLUEPRINT OVERLAY MODAL */}
      {viewingBlueprint && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300"
          id="blueprint-modal-overlay"
        >
          {/* Main frame box */}
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
            id="blueprint-modal-frame"
          >
            
            {/* Modal Header banner */}
            <div className="relative aspect-video w-full bg-slate-900 shrink-0">
              <img 
                src={viewingBlueprint.image} 
                alt={viewingBlueprint.name} 
                className="object-cover w-full h-full opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <button 
                onClick={() => setViewingBlueprint(null)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
              >
                ✕
              </button>

              <div className="absolute bottom-6 left-6 text-white text-left">
                <span className="inline-block rounded-full bg-google-blue px-3 py-0.5 text-[10px] uppercase font-mono tracking-widest text-white mb-2">
                  {viewingBlueprint.category}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                  {viewingBlueprint.name}
                </h3>
              </div>
            </div>

            {/* Modal Scrollable Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Overview Specification</span>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {viewingBlueprint.description}
                </p>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col justify-center">
                  <span className="text-[10px] font-mono text-gray-400 block mb-0.5">EST. TIME TO BUILD</span>
                  <span className="text-sm font-bold text-gray-800">{viewingBlueprint.timeToBuild}</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col justify-center">
                  <span className="text-[10px] font-mono text-gray-400 block mb-0.5">COMPONENTS REC.</span>
                  <span className="text-sm font-bold text-gray-800">{viewingBlueprint.componentCount} Unique items</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex flex-col justify-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-gray-400 block mb-0.5">DIFFICULTY RANK</span>
                  <span className="text-sm font-bold text-google-yellow">{viewingBlueprint.difficulty}</span>
                </div>
              </div>

              {/* Sourcing components listing table */}
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                    BOM Component Ingredients & Real Proximity Search
                  </span>
                  <span className="text-[10px] text-google-green font-mono font-bold">
                    Proximity scanner updated
                  </span>
                </div>

                <div className="space-y-2">
                  {viewingBlueprint.bom.map((item, idx) => {
                    const match = blueprintMatches[item.name];
                    const hasMatch = match?.available;
                    const topChoice = hasMatch && match?.options?.[0];

                    return (
                      <div 
                        key={idx}
                        className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between whitespace-normal"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                            <span className="inline-block rounded bg-blue-50 text-google-blue font-mono font-bold text-[11px] px-2 py-0.2">
                              {item.qty}x
                            </span>
                            <span className="font-sans font-semibold text-sm leading-tight text-gray-900">{item.name}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 font-medium">BOM usage: {item.purpose}</p>
                        </div>

                        {/* Local Proximity Scanner Status */}
                        <div className="mt-2.5 sm:mt-0 text-left sm:text-right shrink-0">
                          {hasMatch && topChoice ? (
                            <div className="inline-flex flex-col items-start sm:items-end">
                              <span className="inline-flex items-center space-x-1 font-mono text-xs font-bold text-google-green bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-google-green animate-pulse" />
                                <span>{topChoice.supplierName.split(" ")[0]} ({topChoice.distance}km)</span>
                              </span>
                              <span className="text-[10px] text-gray-400 mt-1">In stock • Instant collection</span>
                            </div>
                          ) : (
                            <div className="inline-flex flex-col items-start sm:items-end">
                              <span className="inline-flex items-center font-mono text-xs font-bold text-google-red bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                                <span>Out of stock locally</span>
                              </span>
                              <span className="text-[10px] text-google-blue hover:underline cursor-pointer font-semibold mt-1" onClick={() => { setViewingBlueprint(null); setIsAiOpen(true); }}>
                                Settle alternative MCU?
                              </span>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer triggers */}
            <div className="border-t border-gray-100 bg-gray-50 p-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center justify-between shrink-0">
              <span className="text-xs text-gray-500 font-medium">
                Verify specs dynamically utilizing nearby product channels.
              </span>
              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => { setViewingBlueprint(null); setIsAiOpen(true); }}
                  className="flex-1 cursor-pointer py-2 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition"
                >
                  Ask AI About Assembly
                </button>
                <button
                  onClick={() => {
                    setViewingBlueprint(null);
                    handleScrollToSection("radar");
                  }}
                  className="flex-1 cursor-pointer py-2 px-5 rounded-full bg-google-blue hover:bg-blue-600 text-xs font-semibold text-white transition shadow-md shadow-blue-200"
                >
                  Locate Supplier Map
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 11. FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-16" id="footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
            
            {/* Logo Column */}
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-display text-xl font-bold tracking-tight text-gray-900">Semiconk</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                The AI-powered "Shopify for Products" sourcing pipeline. Read local schematics, scan inventory in Real-Time, and assemble within hours.
              </p>
            </div>

            {/* Popular Categories column */}
            <div>
              <h4 className="font-display text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-4">
                Popular Categories
              </h4>
              <ul className="space-y-2 text-xs text-gray-500 font-medium">
                <li><a href="#categories" className="hover:text-google-blue transition">Smartwatch Kits</a></li>
                <li><a href="#categories" className="hover:text-google-blue transition">Arduino Modules</a></li>
                <li><a href="#categories" className="hover:text-google-blue transition">Raspberry Pi</a></li>
                <li><a href="#categories" className="hover:text-google-blue transition">IoT Sensors</a></li>
              </ul>
            </div>

            {/* Top Blueprints column */}
            <div>
              <h4 className="font-display text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-4">
                Top Blueprints
              </h4>
              <ul className="space-y-2 text-xs text-gray-500 font-medium">
                <li><a href="#blueprints" className="hover:text-google-blue transition">OpenWatch Smartwatch V2</a></li>
                <li><a href="#blueprints" className="hover:text-google-blue transition">Budget Hacker Phone</a></li>
                <li><a href="#blueprints" className="hover:text-google-blue transition">Asset Radar GPS Tracker</a></li>
                <li><a href="#blueprints" className="hover:text-google-blue transition">BLE gateway Smart Hub</a></li>
              </ul>
            </div>

            {/* Corporate Columns */}
            <div>
              <h4 className="font-display text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-4">
                About Us
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed leading-normal">
                Semiconk is committed to local, decentralized product prototyping. We empower makers to find local inventory within 40km.
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 font-medium">
            <p>© 2026 Semiconk Inc. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:underline hover:text-gray-600 transition">Privacy Policy</a>
              <a href="#" className="hover:underline hover:text-gray-600 transition">Terms of Use</a>
              <a href="#" className="hover:underline hover:text-gray-600 transition">Supplier Application</a>
            </div>
          </div>

        </div>
      </footer>
      </>
      )}

    </div>
  );
}
