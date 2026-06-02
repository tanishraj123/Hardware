import React, { useState, useEffect } from "react";
import { 
  Search, Sparkles, Download, X, Send 
} from "lucide-react";

interface MaterialItem {
  id: number;
  name: string;
  category: "Display" | "Chemical" | "Metal" | "Plastic" | "Semiconductor" | "Power" | "Optics" | "Glass" | "Electronics" | "Audio" | "Organic" | "Packaging";
  supplier: string;
  distance: number;
  status: "In Stock" | "Low Stock";
}

// Map of category colors
const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Display: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  Semiconductor: { bg: "bg-purple-50 border-purple-200", text: "text-purple-700", dot: "bg-purple-500" },
  Power: { bg: "bg-green-50 border-green-200", text: "text-green-700", dot: "bg-green-500" },
  Metal: { bg: "bg-gray-100 border-gray-200", text: "text-gray-700", dot: "bg-gray-500" },
  Optics: { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-500" },
  Glass: { bg: "bg-cyan-50 border-cyan-200", text: "text-cyan-700", dot: "bg-cyan-500" },
  Electronics: { bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500" },
  Audio: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", dot: "bg-orange-500" },
  Chemical: { bg: "bg-pink-50 border-pink-200", text: "text-pink-700", dot: "bg-pink-500" },
  Plastic: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  Organic: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  Packaging: { bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-700", dot: "bg-indigo-500" },
};

// Static mock addresses mapping for each supplier 
const SUPPLIER_ADDRESSES: Record<string, string> = {
  "MetroTech Electronics": "Building 4, Sector 18, Industrial Hub, Region 401",
  "Silicon Valley Tech": "100 Innovation Way, Suite B, Technology Park",
  "Everlast Power Cell": "72 Power Grid Lane, Energy District",
  "Precision Alloy Labs": "Plot 15, Metallurgy Zone, Heavy Engineering Block",
  "Apex Optoelectronic": "88 Horizon Plaza, Optics Boulevard",
  "OptiMirror Precision Glass": "Glassworks Estate, Phase 3, Industrial Area",
  "RF Connex": "Connector Plaza, Telecom District, North Wing",
  "Aura Decibels Co": "34 Frequency Lane, Audio Systems Block",
  "Apex Chem Source": "Chemical Highway, Tank Complex 9, Port Sector",
  "BioOrganic Solutions": "Greenfields Lab Compound, Sector 4, Biotech Valley",
  "Flora Essence Distillers": "12 Botanist Row, Botanical Gardens Block",
  "HydraPure Water Works": "4 Water Line Road, Reservoir Zone",
  "Northern Acids & Salts": "Salt Lake Junction, Processing Zone D",
  "FormPlastic Molding": "Polymer Way, Zone 8, Plastics Estate",
  "Macro Mechanicals": "6 Gearshaft Avenue, Robotics Division"
};

// Default high-fidelity datasets depending on what the user searches
const PRODUCT_TEMPLATES: Record<string, MaterialItem[]> = {
  iphone: [
    { id: 1, name: "OLED Display Panel", category: "Display", supplier: "MetroTech Electronics", distance: 8.2, status: "In Stock" },
    { id: 2, name: "A17 Bionic Chip", category: "Semiconductor", supplier: "Silicon Valley Tech", distance: 14.5, status: "In Stock" },
    { id: 3, name: "Lithium Battery Cell", category: "Power", supplier: "Everlast Power Cell", distance: 3.1, status: "In Stock" },
    { id: 4, name: "Titanium Frame", category: "Metal", supplier: "Precision Alloy Labs", distance: 22.7, status: "Low Stock" },
    { id: 5, name: "Camera Lens Module", category: "Optics", supplier: "Apex Optoelectronic", distance: 6.8, status: "In Stock" },
    { id: 6, name: "Sapphire Glass Cover", category: "Glass", supplier: "OptiMirror Precision Glass", distance: 11.2, status: "In Stock" },
    { id: 7, name: "NFC Antenna Module", category: "Electronics", supplier: "RF Connex", distance: 5.4, status: "In Stock" },
    { id: 8, name: "Speaker Mesh Component", category: "Audio", supplier: "Aura Decibels Co", distance: 9.3, status: "In Stock" }
  ],
  shampoo: [
    { id: 1, name: "Sodium Laureth Sulfate", category: "Chemical", supplier: "Apex Chem Source", distance: 12.1, status: "In Stock" },
    { id: 2, name: "Cocamidopropyl Betaine", category: "Chemical", supplier: "BioOrganic Solutions", distance: 6.2, status: "In Stock" },
    { id: 3, name: "Argan Oil Extract", category: "Organic", supplier: "Flora Essence Distillers", distance: 24.3, status: "Low Stock" },
    { id: 4, name: "Purified Water (Aqua)", category: "Chemical", supplier: "HydraPure Water Works", distance: 2.8, status: "In Stock" },
    { id: 5, name: "Citric Acid Tester", category: "Chemical", supplier: "Northern Acids & Salts", distance: 18.5, status: "In Stock" },
    { id: 6, name: "Glycerin Compound", category: "Chemical", supplier: "Apex Chem Source", distance: 12.1, status: "In Stock" },
    { id: 7, name: "Lavender Oil Scent", category: "Organic", supplier: "Flora Essence Distillers", distance: 24.3, status: "In Stock" },
    { id: 8, name: "PET Recycled Bottle 500ml", category: "Plastic", supplier: "FormPlastic Molding", distance: 9.7, status: "In Stock" }
  ],
  laptop: [
    { id: 1, name: "14-inch IPS Display Matrix", category: "Display", supplier: "MetroTech Electronics", distance: 8.2, status: "In Stock" },
    { id: 2, name: "ARM-based OctaCore CPU", category: "Semiconductor", supplier: "Silicon Valley Tech", distance: 14.5, status: "In Stock" },
    { id: 3, name: "Lithium Polymer Pack (70Wh)", category: "Power", supplier: "Everlast Power Cell", distance: 3.1, status: "In Stock" },
    { id: 4, name: "Anodized Aluminum Case", category: "Metal", supplier: "Precision Alloy Labs", distance: 22.7, status: "Low Stock" },
    { id: 5, name: "Gorilla Glass Trackpad", category: "Glass", supplier: "OptiMirror Precision Glass", distance: 11.2, status: "In Stock" },
    { id: 6, name: "LED Backlit Key Switch matrix", category: "Electronics", supplier: "RF Connex", distance: 5.4, status: "In Stock" },
    { id: 7, name: "High-Freq Subwoofers", category: "Audio", supplier: "Aura Decibels Co", distance: 9.3, status: "In Stock" },
    { id: 8, name: "Dual-Fan Cooling Pipe", category: "Metal", supplier: "Macro Mechanicals", distance: 15.1, status: "In Stock" }
  ],
  smartwatch: [
    { id: 1, name: "AMOLED Circular Display Panel", category: "Display", supplier: "MetroTech Electronics", distance: 8.2, status: "In Stock" },
    { id: 2, name: "Ultra-Low Power Cortex SoC", category: "Semiconductor", supplier: "Silicon Valley Tech", distance: 14.5, status: "In Stock" },
    { id: 3, name: "300mAh LiPo Cell", category: "Power", supplier: "Everlast Power Cell", distance: 3.1, status: "In Stock" },
    { id: 4, name: "Stainless Steel Case Dial", category: "Metal", supplier: "Precision Alloy Labs", distance: 22.7, status: "In Stock" },
    { id: 5, name: "Optical Heart Rate Photodetector", category: "Optics", supplier: "Apex Optoelectronic", distance: 6.8, status: "In Stock" },
    { id: 6, name: "Circular Sapphire Watchglass", category: "Glass", supplier: "OptiMirror Precision Glass", distance: 11.2, status: "In Stock" },
    { id: 7, name: "Bluetooth LE RF Transceiver", category: "Electronics", supplier: "RF Connex", distance: 5.4, status: "Low Stock" },
    { id: 8, name: "Piezo buzz feedback module", category: "Audio", supplier: "Aura Decibels Co", distance: 9.3, status: "In Stock" }
  ]
};

interface ProductIntelligenceProps {
  initialSearchQuery?: string;
  onNavigateHome: (sectionId?: string) => void;
}

export default function ProductIntelligence({
  initialSearchQuery = "iPhone 15",
  onNavigateHome
}: ProductIntelligenceProps) {
  const [searchVal, setSearchVal] = useState(initialSearchQuery);
  const [productName, setProductName] = useState(initialSearchQuery);
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [isBotChatOpen, setIsBotChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant', text: string }>>([
    { sender: 'assistant', text: "Hi there! I'm the Semiconk Sourcing Assistant. Ask me anything about raw materials, logistics, pricing margins or local stock proximity." }
  ]);
  const [userInput, setUserInput] = useState("");

  // Dynamic state generator based on input
  useEffect(() => {
    const term = productName.toLowerCase();
    let selectedTemplate: MaterialItem[] = [];

    if (term.includes("shampoo") || term.includes("soap") || term.includes("cosmetic")) {
      selectedTemplate = PRODUCT_TEMPLATES.shampoo;
    } else if (term.includes("laptop") || term.includes("desktop") || term.includes("computer") || term.includes("macbook")) {
      selectedTemplate = PRODUCT_TEMPLATES.laptop;
    } else if (term.includes("watch") || term.includes("smartwatch") || term.includes("wearable")) {
      selectedTemplate = PRODUCT_TEMPLATES.smartwatch;
    } else {
      // Default to iphone list
      selectedTemplate = PRODUCT_TEMPLATES.iphone;
    }

    setMaterials(selectedTemplate);
  }, [productName]);

  const handleSearchClick = () => {
    if (searchVal.trim()) {
      setProductName(searchVal);
    }
  };

  const handlePdfDownload = () => {
    alert(`Generating high-fidelity Semiconk AI Sourcing Bill of Materials PDF for "${productName}"...\nIncludes 8 identified regional raw materials, logistics analysis, and 12 local verified suppliers.`);
  };

  const handleBotChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const query = userInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserInput("");

    setTimeout(() => {
      // Custom AI Assistant generator answers based on context
      let responseText = `Regarding your quote request for "${query}" on "${productName}" items: we found localized providers within 40km. You can schedule rapid same-day dispatch using the "Source Link" or open Google Maps.`;
      if (query.toLowerCase().includes("price") || query.toLowerCase().includes("cost")) {
        responseText = `Estimated localized bulk price for "${productName}" raw materials averages 12-18% lower than overseas standard shipping when calculated against immediate transit time and courier metrics.`;
      } else if (query.toLowerCase().includes("lead") || query.toLowerCase().includes("time") || query.toLowerCase().includes("fast")) {
        responseText = `Sourced items are stocked within a 40km perimeter. Transit timeline from our verified regional distributors is under 4-6 hours.`;
      }
      setChatMessages(prev => [...prev, { sender: 'assistant', text: responseText }]);
    }, 850);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans animate-fade-in" id="product-intel-view">
      
      {/* 1. PRODUCT SEARCH BAR PANEL (slim, under header) */}
      <div className="bg-white border-b border-gray-150 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          
          <div className="w-full">
            <div className="flex items-center bg-white border border-gray-200 rounded-full p-1.5 shadow-xs focus-within:shadow-md focus-within:border-blue-400 transition">
              <div className="flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Analyze another product (phone, shampoo, laptop, smartwatch, etc)..."
                className="w-full bg-transparent pl-3 pr-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchClick();
                }}
              />
              <button 
                onClick={handleSearchClick}
                className="cursor-pointer rounded-full bg-[#4285F4] px-6 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition tracking-wide shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-start">
            <span className="inline-flex items-center text-xs font-medium text-gray-600 leading-normal">
              <span className="text-[#4285F4] mr-2 font-bold text-sm">✦</span>
              AI analyzed 48 raw materials • 12 local sources found • Click <span className="inline-block align-text-bottom mx-0.5" style={{ color: 'inherit' }}><svg className="inline" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span> to open supplier in Google Maps
            </span>
          </div>

        </div>
      </div>

      {/* 2. BOM LIST PANELS (FULL WIDTH SINGLE COLUMN) */}
      <div className="flex-1 bg-white min-h-[calc(100vh-140px)] overflow-y-auto pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Header */}
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Bill of Materials
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                  Live Proximity Verified
                </span>
              </h2>
              <p className="text-sm text-gray-500">AI Sourced regional materials for <span className="font-semibold text-gray-700">{productName}</span></p>
            </div>
          </div>

          {/* Supplier Proximity Radar Sourcing Notification Note (CHANGE 2) */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 text-left">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 text-[#4285F4] rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                i
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  Showing suppliers within 40km radius. If fewer than 3 suppliers found, we'll show the nearest available.
                </p>
                <div className="flex flex-col gap-1.5 mt-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
                    <span>✓</span> 5 suppliers found within 40km
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <span>⚠</span> Only 2 suppliers within 40km. Showing nearest 3 available within 65km
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-4">
            {materials.map((m) => {
              const catTheme = CATEGORY_COLORS[m.category] || { bg: "bg-gray-150 border-gray-300", text: "text-gray-700", dot: "bg-gray-500" };
              const supplierAddress = SUPPLIER_ADDRESSES[m.supplier] || "Regional Manufacturing Hub Sector, Complex 40B, Zone 4";

              return (
                <div 
                  key={m.id}
                  id={`material-card-${m.id}`}
                  className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs hover:border-blue-200 hover:shadow-xs transition-all duration-200 text-left"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    
                    {/* Left/Middle Content Info */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-base md:text-lg">
                          {m.id}. {m.name}
                        </h4>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catTheme.bg} ${catTheme.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${catTheme.dot} mr-1.5`} />
                          {m.category}
                        </span>

                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          ~{m.distance} km away
                        </span>

                        <span className="inline-flex items-center text-xs space-x-1.5">
                          <span className={`h-2 w-2 rounded-full ${m.status === "In Stock" ? "bg-green-500" : "bg-red-500"}`} />
                          <span className={m.status === "In Stock" ? "text-green-600 font-medium" : "text-red-500 font-semibold"}>
                            {m.status}
                          </span>
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold text-gray-800 text-sm">
                          {m.supplier}
                        </p>
                        <p className="text-xs text-gray-500 font-normal">
                          {supplierAddress}
                        </p>
                      </div>
                    </div>

                    {/* Right actions: Two buttons side by side */}
                    <div className="flex items-center gap-2.5 w-full md:w-auto mt-2 md:mt-0 justify-start md:justify-end shrink-0">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Navigating to the verified supplier website of ${m.supplier}...`);
                        }}
                        className="cursor-pointer text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200 transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          Supplier Website
                        </span>
                      </a>
                      
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(m.supplier + " " + supplierAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-xs font-semibold text-white bg-[#4285F4] hover:bg-blue-600 px-3.5 py-2 rounded-xl shadow-2xs hover:shadow-xs transition flex items-center gap-1.5"
                      >
                        <span className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          Open in Google Maps
                        </span>
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* PDF Download Footer */}
          <div className="pt-6 border-t border-gray-100">
            <button 
              onClick={handlePdfDownload}
              className="w-full cursor-pointer bg-[#4285F4] hover:bg-blue-600 text-white font-bold flex items-center justify-center gap-2 py-3.5 rounded-2xl transition shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 text-sm tracking-wide"
            >
              <Download className="h-4.5 w-4.5" />
              ⬇ Download Full BOM as PDF
            </button>
          </div>

        </div>
      </div>

      {/* 3. FLOAT ASK AI CHAT ASSISTANT BUTTON (Sparkle widget in the bottom right corner) */}
      <div className="fixed bottom-6 right-6 z-40">
        
        {isBotChatOpen ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-85 max-w-[92vw] overflow-hidden flex flex-col h-110 mb-2">
            
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-[#4285F4] p-1.5 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Ask AI Sourcing Bot</h3>
                  <p className="text-[10px] text-gray-400">Semiconk Local Intelligence</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBotChatOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-xl p-3 shadow-xs leading-relaxed ${
                      msg.sender === 'user' 
                      ? 'bg-[#4285F4] text-white rounded-br-none font-medium' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleBotChatSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about bulk prices, lead times..."
                className="flex-1 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-blue-400 placeholder-gray-400"
              />
              <button 
                type="submit"
                className="cursor-pointer bg-[#4285F4] text-white p-2.5 rounded-lg hover:bg-blue-600 transition active:scale-95 flex items-center justify-center"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

          </div>
        ) : (
          <button 
            onClick={() => setIsBotChatOpen(true)}
            className="cursor-pointer flex items-center space-x-2.5 bg-gray-900 hover:bg-[#4285F4] text-white px-5 py-3.5 rounded-full shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            id="floating-ask-ai-widget"
          >
            <Sparkles className="h-4.5 w-4.5 text-yellow-400 animate-pulse" />
            <span className="text-xs font-bold font-sans tracking-wide">Ask AI Sourcing Bot</span>
          </button>
        )}

      </div>

    </div>
  );
}
