export interface ComponentItem {
  name: string;
  qty: number;
  purpose: string;
}

export interface Blueprint {
  id: string;
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string;
  description: string;
  componentCount: number;
  timeToBuild: string;
  suppliersNearby: number;
  image: string;
  bom: ComponentItem[];
}

export interface SupplierOption {
  supplierId: string;
  supplierName: string;
  stockedPart: string;
  distance: number;
  rating: number;
  trusted: boolean;
}

export interface PartMatch {
  part: string;
  available: boolean;
  options: SupplierOption[];
}

export interface Supplier {
  id: string;
  name: string;
  distance: number;
  rating: number;
  trusted: boolean;
  category: string;
  address: string;
  phone: string;
  email: string;
  stock: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  offline?: boolean;
}
