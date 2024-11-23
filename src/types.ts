export interface Agent {
  id: string;
  name: string;
  role: string;
  agentId: string;
  whatsapp: string;
  phone: string;
  rating: number;
  actions: string[];
  avatar: string;
  status: 'active' | 'inactive' | 'on-mission';
  specialty: string;
  experience: string;
  successRate: string;
  created_at: string;
}

export type AgentType = 'admin' | 'ss-admin' | 'sub-admin' | 'super-agent' | 'master-agent';

export interface AdminUser {
  id: string;
  name: string;
  role: AgentType;
  avatar: string;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
  lastActive: string;
}

export interface NavItem {
  text: string;
  href: string;
}