export interface Agent {
  id: string;
  name: string;
  role: string;
  agentId: string;
  whatsapp: string;
  phone: string;
  rating: number;
  actions: string[];
}

export interface NavItem {
  text: string;
  href: string;
}