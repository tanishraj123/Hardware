import React, { useState } from "react";
import { Supplier } from "../types";
import { MapPin, Phone, Mail, Award, CheckCircle2, Navigation, Star, Radio } from "lucide-react";

interface LocalRadarProps {
  suppliers: Supplier[];
}

export default function LocalRadar({ suppliers }: LocalRadarProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(suppliers[0] || null);
  const [hoveredSupplier, setHoveredSupplier] = useState<Supplier | null>(null);

  // Distribute suppliers visually around the coordinate grid for the radar
  // (x, y coordinates ranging from 10% to 90%)
  const supplierPositions: Record<string, { x: number; y: number }> = {
    "sup-1": { x: 38, y: 35 }, // MetroTech, 8.4km
    "sup-2": { x: 65, y: 28 }, // Alpha Circuit, 14.2km
    "sup-3": { x: 25, y: 70 }, // Node-X, 23.7km
    "sup-4": { x: 80, y: 75 }, // Summit, 31.1km
    "sup-5": { x: 48, y: 55 }, // Pioneer Robotics, 5.1km (Center node)
  };

  return (
    <div id="radar" className="relative overflow-hidden bg-gray-950 py-20 px-4 text-white sm:px-6 lg:px-8 tech-grid-bg">
      {/* Absolute Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 h-[350px] w-[350px] rounded-full bg-google-blue/10 blur-[130px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-google-green/10 blur-[150px]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Column: Descriptions & Details */}
          <div className="space-y-6 lg:col-span-5">
            <div className="inline-flex items-center space-x-2 rounded-full bg-google-green/15 px-3 py-1 font-mono text-xs font-semibold text-google-green">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>Real-time local inventory matching</span>
            </div>
            
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Local Product <span className="text-google-green">BOM Radar</span>
            </h2>
            
            <p className="text-gray-400 text-base leading-relaxed">
              Skip global supply-chain bottlenecks. Scan inventory levels from authorized electronics laboratories, custom fab machines, and developer component stocks located directly in your city.
            </p>

            {/* Micro details panel of selected Supplier */}
            {selectedSupplier && (
              <div 
                className="rounded-2xl border border-gray-800 bg-gray-900/85 p-6 shadow-xl backdrop-blur-md transition-all duration-300"
                id="selected-supplier-card"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-display text-lg font-bold text-white transition hover:text-google-green">
                        {selectedSupplier.name}
                      </h3>
                      {selectedSupplier.trusted && (
                        <Award className="h-4.5 w-4.5 text-google-yellow" title="Certified Trusted" />
                      )}
                    </div>
                    <p className="text-xs text-google-green font-mono mt-1">{selectedSupplier.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300">
                      {selectedSupplier.distance} km away
                    </span>
                  </div>
                </div>

                {/* Rating / Meta */}
                <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                  <div className="flex items-center text-google-yellow">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="ml-1 font-bold">{selectedSupplier.rating}</span>
                  </div>
                  <span>•</span>
                  <span>Contact Fast</span>
                </div>

                {/* Extended info */}
                <div className="mt-4 space-y-2 border-t border-gray-800 pt-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3.5 w-3.5 text-google-blue" />
                    <span className="truncate">{selectedSupplier.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3.5 w-3.5 text-google-green" />
                    <span>{selectedSupplier.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-3.5 w-3.5 text-google-red" />
                    <span>{selectedSupplier.email}</span>
                  </div>
                </div>

                {/* Stock Chips */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Stocked Components:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {selectedSupplier.stock.map((part, idx) => (
                      <span 
                        key={idx} 
                        className="rounded bg-gray-800/90 px-2 py-0.5 text-[11px] font-mono text-gray-300 hover:text-white hover:bg-google-blue/30 transition duration-150"
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Beautiful Interactive Radar Visualizer */}
          <div className="flex justify-center lg:col-span-7">
            <div 
              className="relative aspect-square w-full max-w-[500px] rounded-full border border-gray-850 bg-gray-900/40 p-1 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden"
              id="radar-scope-container"
            >
              {/* Outer boundary circles */}
              <div className="absolute inset-0 rounded-full border border-gray-800/60 pointer-events-none" />
              <div className="absolute inset-[12%] rounded-full border border-gray-800/40 pointer-events-none" />
              <div className="absolute inset-[24%] rounded-full border border-gray-850/60 pointer-events-none" />
              <div className="absolute inset-[36%] rounded-full border border-gray-850/30 pointer-events-none" />
              <div className="absolute inset-[48%] rounded-full border border-gray-850/20 pointer-events-none" />

              {/* Grid Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-full w-[1px] bg-gray-800/30" />
                <div className="absolute w-full h-[1px] bg-gray-800/30" />
              </div>

              {/* Center point node */}
              <div className="z-10 absolute flex flex-col items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-google-blue border-4 border-white animate-ping-slow shadow-lg shadow-blue-500/80" />
                <span className="mt-1 bg-gray-950/80 text-[10px] font-bold font-mono px-1.5 rounded border border-gray-850 text-google-blue">
                  YOU
                </span>
              </div>

              {/* Radar Sweeping Overlay */}
              <div className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none mix-blend-screen opacity-15">
                <div className="h-1/2 w-full left-0 top-0 bg-gradient-to-tr from-transparent via-green-500/10 to-green-500" />
              </div>

              {/* 40km circle boundary indicator tag */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-gray-600 text-[11px] font-mono pointer-events-none uppercase tracking-widest bg-gray-950/40 px-2 rounded">
                40km search boundary
              </div>

              {/* Distinguish radial lines */}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-700 pointer-events-none">30km</span>
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-700 pointer-events-none">40km</span>
              <span className="absolute left-[36%] top-1/2 -translate-y-1/2 text-[9px] font-mono text-gray-700 pointer-events-none font-bold text-google-green">20km</span>

              {/* Supplier Plot Pins */}
              {suppliers.map((supplier) => {
                const coord = supplierPositions[supplier.id] || { x: 50, y: 50 };
                const isSelected = selectedSupplier?.id === supplier.id;
                const isHovered = hoveredSupplier?.id === supplier.id;

                return (
                  <button
                    key={supplier.id}
                    onClick={() => setSelectedSupplier(supplier)}
                    onMouseEnter={() => setHoveredSupplier(supplier)}
                    onMouseLeave={() => setHoveredSupplier(null)}
                    style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                    className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 flex flex-col items-center focus:outline-none"
                    id={`radar-pin-${supplier.id}`}
                  >
                    {/* Ring indicator */}
                    <span className={`absolute -inset-3.5 rounded-full border transition-all duration-300 ${
                      isSelected 
                        ? "border-google-green/40 bg-google-green/10 scale-120 opacity-100" 
                        : isHovered 
                        ? "border-google-blue/30 bg-google-blue/5 scale-110 opacity-80" 
                        : "border-transparent scale-50 opacity-0"
                    }`} />

                    {/* Ping Node */}
                    <div className={`relative flex items-center justify-center h-8 w-8 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-125 ${
                      isSelected 
                        ? "bg-google-green border-2 border-white scale-110" 
                        : "bg-gray-800 border-2 border-gray-600 hover:border-google-blue"
                    }`}>
                      <MapPin className={`h-4.5 w-4.5 ${
                        isSelected ? "text-white" : "text-google-blue font-bold"
                      }`} />
                    </div>

                    {/* Overlay Tag */}
                    <span className={`absolute top-9 uppercase tracking-wide whitespace-nowrap text-[10px] font-bold font-mono px-2 py-0.5 rounded border shadow-2xl transition-all duration-300 ${
                      isSelected 
                        ? "bg-google-green/90 border-google-green text-white z-30" 
                        : isHovered 
                        ? "bg-google-blue/90 border-google-blue text-white z-30 opacity-100" 
                        : "bg-gray-950/80 border-gray-850 text-gray-400 opacity-60 group-hover:opacity-100"
                    }`}>
                      {supplier.name.split(" ")[0]} ({supplier.distance}km)
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
