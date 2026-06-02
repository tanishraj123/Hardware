import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock database for local sourcing
const SUPPLIERS = [
  {
    id: "sup-1",
    name: "MetroTech Electronics Ltd.",
    distance: 8.4,
    rating: 4.8,
    trusted: true,
    category: "Sensors & MCUs",
    address: "102 Technology Drive, Sector 4",
    phone: "+1 (555) 782-9011",
    email: "orders@metrotech-el.com",
    stock: ["STM32 microcontroller", "ESP32-D0WDQ6-V3", "LiPo 3.7V 350mAh", "ADXL345 Accelerometer", "DHT22 Humidty Sensor", "1.28 inch Round LCD Screen", "OLED 0.96 inch Shield"],
  },
  {
    id: "sup-2",
    name: "Alpha Circuit Labs & Parts",
    distance: 14.2,
    rating: 4.9,
    trusted: true,
    category: "PCBs & Components",
    address: "48 Innovation Parkway, Suite B",
    phone: "+1 (555) 345-8902",
    email: "sourcing@alphacircuitleb.com",
    stock: ["Custom FR4 2-layer PCB", "MT6739 System-on-Chip", "LPDDR3 2GB RAM", "16GB eMMC Drive", "SIM7600G 4G Module", "Quectel L86 GPS Receiver", "GNSS Active Patch Antenna", "SMD Resistors Kit 0805", "SMD Capacitors Kit 0603"],
  },
  {
    id: "sup-3",
    name: "Node-X IoT Supplies",
    distance: 23.7,
    rating: 4.6,
    trusted: false,
    category: "Wireless & IoT",
    address: "900 Wireless Boulevard",
    phone: "+1 (555) 890-2134",
    email: "hello@nodex-iot.io",
    stock: ["ESP32-D0WDQ6-V3", "MFRC522 RFID module", "Raspberry Pi Zero 2 W", "RP2040 Microcontroller", "HC-SR04 Ultrasonic", "Servo Motor SG90"],
  },
  {
    id: "sup-4",
    name: "Summit Hardware Sourcing",
    distance: 31.1,
    rating: 4.7,
    trusted: true,
    category: "Enclosures & Fasteners",
    address: "15 Industrial Road",
    phone: "+1 (555) 123-4567",
    email: "contact@summithardware.co",
    stock: ["CNC Aluminum Housing (Smartwatch size)", "ABS Plastic Case 100x60x25mm", "Tempered Cover Glass 36mm", "3D Printing Filament PLA/PETG", "Neodymium Ring Magnets", "M2 Screws Assortment Kit", "Stainless Steel Buckle", "Leather Strap 22mm"],
  },
  {
    id: "sup-5",
    name: "Pioneer Robotics & Dev Kits",
    distance: 5.1,
    rating: 4.9,
    trusted: true,
    category: "Dev Boards & Prototyping",
    address: "7 Pioneer Circle, Tech Hub",
    phone: "+1 (555) 901-4433",
    email: "support@pioneerrobotics.com",
    stock: ["Arduino Nano Every", "Arduino Uno R4 Wifi", "Raspberry Pi 4 Model B (4GB)", "Breadboard Half-size", "Jumper Wire Kit M/M, F/F", "1.28 inch Round LCD Screen", "LiPo 3.7V 350mAh", "DHT22 Humidty Sensor", "DHT11 Sensor"],
  }
];

const BLUEPRINTS = [
  {
    id: "smartwatch",
    name: "OpenWatch Smartwatch V2",
    category: "Wearables",
    difficulty: "Intermediate",
    description: "An open-source custom smartwatch with heart rate monitoring, step tracking, Bluetooth alerts, and a gorgeous circular color screen.",
    componentCount: 7,
    timeToBuild: "4-6 Hours",
    suppliersNearby: 3,
    image: "https://images.unsplash.com/photo-1542496658-0f0a8c2f1e6f?auto=format&fit=crop&w=600&q=80",
    bom: [
      { name: "STM32 microcontroller", qty: 1, purpose: "Main processor" },
      { name: "1.28 inch Round LCD Screen", qty: 1, purpose: "Display" },
      { name: "LiPo 3.7V 350mAh", qty: 1, purpose: "Power" },
      { name: "ADXL345 Accelerometer", qty: 1, purpose: "Step tracker" },
      { name: "CNC Aluminum Housing (Smartwatch size)", qty: 1, purpose: "Enclosure" },
      { name: "Leather Strap 22mm", qty: 1, purpose: "Watch band" },
      { name: "Tempered Cover Glass 36mm", qty: 1, purpose: "Screen protector" }
    ]
  },
  {
    id: "smartphone",
    name: "Budget Hacker Phone Kit",
    category: "Mobile",
    difficulty: "Advanced",
    description: "Build your own privacy-respecting custom smartphone. Runs open-source Linux with calling, SMS, and simple applications.",
    componentCount: 9,
    timeToBuild: "12-16 Hours",
    suppliersNearby: 2,
    image: "https://images.unsplash.com/photo-1511749887010-439ecac98cb0?auto=format&fit=crop&w=600&q=80",
    bom: [
      { name: "MT6739 System-on-Chip", qty: 1, purpose: "Application processor" },
      { name: "LPDDR3 2GB RAM", qty: 1, purpose: "System Memory" },
      { name: "16GB eMMC Drive", qty: 1, purpose: "Internal Storage" },
      { name: "SIM7600G 4G Module", qty: 1, purpose: "LTE cellular communication" },
      { name: "ABS Plastic Case 100x60x25mm", qty: 1, purpose: "Standard protective shell" },
      { name: "Quectel L86 GPS Receiver", qty: 1, purpose: "Location tracking" },
      { name: "GNSS Active Patch Antenna", qty: 1, purpose: "Satelite signal" },
      { name: "SMD Resistors Kit 0805", qty: 1, purpose: "Circuit wiring & pullups" },
      { name: "Custom FR4 2-layer PCB", qty: 1, purpose: "Component mainboard" }
    ]
  },
  {
    id: "gps-tracker",
    name: "Asset Radar GPS Tracker",
    category: "IoT Sourcing",
    difficulty: "Beginner",
    description: "A compact asset tracker that reports geographical coordinates over long-range wireless networks, with deep-sleep power savings.",
    componentCount: 5,
    timeToBuild: "2-3 Hours",
    suppliersNearby: 4,
    image: "https://images.unsplash.com/photo-1528318686235-968b5711c2a1?auto=format&fit=crop&w=600&q=80",
    bom: [
      { name: "ESP32-D0WDQ6-V3", qty: 1, purpose: "Wi-Fi, Bluetooth & core controller" },
      { name: "Quectel L86 GPS Receiver", qty: 1, purpose: "Read precision coordinates" },
      { name: "GNSS Active Patch Antenna", qty: 1, purpose: "Boost GPS positioning" },
      { name: "LiPo 3.7V 350mAh", qty: 1, purpose: "Rechargeable internal battery" },
      { name: "ABS Plastic Case 100x60x25mm", qty: 1, purpose: "Industrial protective shell" }
    ]
  },
  {
    id: "smarthome-hub",
    name: "BLE gateway Smart Home Hub",
    category: "Smart Home",
    difficulty: "Intermediate",
    description: "An open-source hub that connects to BLE and Wi-Fi peripheral smart devices, forwarding telemetry directly to HomeAssistant.",
    componentCount: 6,
    timeToBuild: "3-5 Hours",
    suppliersNearby: 5,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    bom: [
      { name: "Raspberry Pi Zero 2 W", qty: 1, purpose: "Main gateway controller" },
      { name: "ESP32-D0WDQ6-V3", qty: 1, purpose: "Co-processor for BLE sniffing" },
      { name: "DHT22 Humidty Sensor", qty: 1, purpose: "Monitor local temperature" },
      { name: "M2 Screws Assortment Kit", qty: 1, purpose: "Assembling structural panels" },
      { name: "Servo Motor SG90", qty: 1, purpose: "Actuator simulation panel" },
      { name: "OLED 0.96 inch Shield", qty: 1, purpose: "Quick status overlay module" }
    ]
  }
];

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes

// Sourcing endpoint to match parts against suppliers
app.post("/api/sourcer/match", (req, res) => {
  const { parts } = req.body;
  
  if (!parts || !Array.isArray(parts) || parts.length === 0) {
    return res.json({ matches: [], unmatched: [] });
  }

  const matches: any[] = [];
  const unmatched: string[] = [];

  parts.forEach((partName: string) => {
    const formattedQuery = partName.toLowerCase().trim();
    const matchesForPart: any[] = [];

    SUPpliers_loop:
    for (const supplier of SUPPLIERS) {
      for (const stockedPart of supplier.stock) {
        if (stockedPart.toLowerCase().includes(formattedQuery) || formattedQuery.includes(stockedPart.toLowerCase())) {
          matchesForPart.push({
            supplierId: supplier.id,
            supplierName: supplier.name,
            stockedPart,
            distance: supplier.distance,
            rating: supplier.rating,
            trusted: supplier.trusted
          });
        }
      }
    }

    if (matchesForPart.length > 0) {
      // Sort matches by distance
      matchesForPart.sort((a, b) => a.distance - b.distance);
      matches.push({
        part: partName,
        available: true,
        options: matchesForPart
      });
    } else {
      unmatched.push(partName);
      matches.push({
        part: partName,
        available: false,
        options: []
      });
    }
  });

  res.json({ matches, unmatched });
});

// Search API (matches keywords in blueprints, categories, suppliers or parts)
app.get("/api/search", (req, res) => {
  const query = (req.query.q || "").toString().toLowerCase().trim();
  
  if (!query) {
    return res.json({ blueprints: BLUEPRINTS, suppliers: SUPPLIERS });
  }

  const matchedBlueprints = BLUEPRINTS.filter(bp => 
    bp.name.toLowerCase().includes(query) || 
    bp.description.toLowerCase().includes(query) || 
    bp.category.toLowerCase().includes(query) ||
    bp.bom.some(item => item.name.toLowerCase().includes(query))
  );

  const matchedSuppliers = SUPPLIERS.filter(sup => 
    sup.name.toLowerCase().includes(query) || 
    sup.category.toLowerCase().includes(query) ||
    sup.stock.some(p => p.toLowerCase().includes(query))
  );

  res.json({
    blueprints: matchedBlueprints,
    suppliers: matchedSuppliers
  });
});

// AI endpoints

// Full Chat bot interface for Ask AI support
app.post("/api/ai/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request. messages list is required." });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Elegant fallback simulation in case API key is not yet set
    const lastMessage = messages[messages.length - 1]?.content || "";
    let fallbackText = "I'm your Local Sourcing Assistant! It looks like your GEMINI_API_KEY secret hasn't been added to the application secrets yet, so I am running in Offline Mode.\n\nHere is what I can tell you: we have active parts databases for wearable microcontrollers, custom cellular nodes, sensors within 40km, and standard Open-Source BOM listings! Let me know if you would like me to map them for you.";
    
    if (lastMessage.toLowerCase().includes("smartwatch") || lastMessage.toLowerCase().includes("watch")) {
      fallbackText = "Offline response: For the **OpenWatch Smartwatch V2**, you need components like the STM32 MCU, 1.28\" round screen, and 3.7V battery. In our database, these are fully stocked at **MetroTech Electronics** (8.4km) and **Pioneer Robotics** (5.1km). All parts are within your local 40km circle and can be purchased today.";
    } else if (lastMessage.toLowerCase().includes("supplier") || lastMessage.toLowerCase().includes("near me")) {
      fallbackText = "Offline response: I can see 5 registered local component labs nearby! **MetroTech Electronics Ltd.** is closest at 8.4km with deep stock of Microcontrollers and displays, followed by **Alpha Circuit Labs** at 14.2km who can print custom double-sided 2-layer FR4 boards in 6 hours.";
    }
    
    return res.json({ content: fallbackText, offline: true });
  }

  try {
    // Parse chat messages format to GoogleGenAI formats
    // The chat history format should map user messages and model outputs
    const conversationHistory: any[] = [];
    
    // Setup initial prompt
    const systemPrompt = `You are the Expert Hardware Sourcing AI for a local peer-to-peer parts finder platform. 
    You are professional, deeply knowledgeable about electronics design, Raspberry Pi, Arduino, surface mount (SMD) and custom printed circuit boards (PCBs).
    You have direct knowledge of our local supplier database:
    1. MetroTech Electronics (8.4km, specializes in STM32 MCUs, Circular LCD Displays, and LiPo batteries)
    2. Alpha Circuit Labs & Parts (14.2km, prints custom FR4 2-layer PCBs within 6 hours, stocks LTE chips like SIM7600G)
    3. Node-X IoT Supplies (23.7km, stocks ESP32 controllers, RFID, HC-SR04, and R-Pi Zero 2)
    4. Summit Hardware Sourcing (31.1km, specializes in smartwatch cases, CNC aluminium casing, customized structural plastic covers, leather watch straps)
    5. Pioneer Robotics & Dev Kits (5.1km, stocks Arduino boards, Raspberry Pi 4s, jumper wires/breadboards, and LCD shields)

    When asked about sourcing hardware or designing blueprints, always cross-reference these suppliers and explain how the builder can compile their customized Bill of Materials (BOM) within hours. Suggest alternatives if a component isn't listed, or provide smart assembly advice. Keep responses helpful and styled with markdown.`;

    // Package the history
    const contents: any[] = [];
    
    // Add history
    messages.forEach((msg: any) => {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({
      content: response.text || "I was unable to formulate a response. Please check your query.",
      offline: false
    });
  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI assistant." });
  }
});

// Endpoint to parse text BOM list e.g. from pasted clipboard and match to suppliers
app.post("/api/ai/parse-bom", async (req, res) => {
  const { bomText } = req.body;
  if (!bomText || typeof bomText !== "string") {
    return res.status(400).json({ error: "No raw BOM input text was provided." });
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Offline parser fallback
    const mockParsed = [
      { name: "ESP32 Controller Unit", qty: 1, confidence: "High" },
      { name: "3.7V Battery Pack", qty: 2, confidence: "Medium" },
      { name: "DHT22 Humidty Sensor", qty: 1, confidence: "High" }
    ];
    return res.json({ parts: mockParsed, offline: true });
  }

  try {
    const prompt = `Analyze this pasted text representing a Bill of Materials (BOM) or hardware ingredient list and extract a structured JSON list of individual electronic components. Return an array of components with exact name and quantity required.
    
    Pasted BOM text:
    """
    ${bomText}
    """
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            parts: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING", description: "Standard component name" },
                  qty: { type: "INTEGER", description: "Quantity required" },
                  confidence: { type: "STRING", description: "Confidence rating (High, Medium, Low)" }
                },
                required: ["name", "qty", "confidence"]
              }
            }
          },
          required: ["parts"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"parts":[]}');
    res.json({ parts: data.parts, offline: false });
  } catch (err: any) {
    console.error("error parsing BOM with Gemini", err);
    res.status(500).json({ error: err.message || "Could not parse Bill of Materials list." });
  }
});

// Serve Vite frontend
async function startServer() {
  // Direct direct static page routing for absolute crawler friendliness
  app.get("/info", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = isProd 
      ? path.join(process.cwd(), "dist/info.html")
      : path.join(process.cwd(), "info.html");
    res.sendFile(filePath);
  });

  app.get("/signin", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = isProd 
      ? path.join(process.cwd(), "dist/signin.html")
      : path.join(process.cwd(), "signin.html");
    res.sendFile(filePath);
  });

  app.get("/register-user", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = isProd 
      ? path.join(process.cwd(), "dist/register-user.html")
      : path.join(process.cwd(), "register-user.html");
    res.sendFile(filePath);
  });

  app.get("/profile", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = isProd 
      ? path.join(process.cwd(), "dist/profile.html")
      : path.join(process.cwd(), "profile.html");
    res.sendFile(filePath);
  });

  app.get("/location", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = isProd 
      ? path.join(process.cwd(), "dist/location.html")
      : path.join(process.cwd(), "location.html");
    res.sendFile(filePath);
  });

  app.get("/register-company", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = isProd 
      ? path.join(process.cwd(), "dist/register-company.html")
      : path.join(process.cwd(), "register-company.html");
    res.sendFile(filePath);
  });

  app.get("/", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const filePath = isProd 
      ? path.join(process.cwd(), "dist/index.html")
      : path.join(process.cwd(), "index.html");
    res.sendFile(filePath);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hardware Sourcing Platform Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
