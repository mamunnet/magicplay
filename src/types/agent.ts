import { AgentType } from '../pages/AgentManagementPage';

export type AgentStatus = 'active' | 'inactive' | 'on-mission';

export interface BaseAgent {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  whatsapp: string;
  type: AgentType;
  role: string;
  status: AgentStatus;
  rating: number;
  upline_id: string;
  created_at: number;
  updated_at: number;
  actions: string[];
  avatar: string;
  specialty: string;
  experience: string;
  successRate: string;  
}

export interface Agent {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  whatsapp: string;
  type: AgentType;
  role: string;
  status: AgentStatus;
  rating: number;
  upline_id: string | null;
  created_at: number;
  updated_at: number;
  actions: string[];
  avatar: string;
  specialty: string;
  experience: string;
  successRate: string;
}

export interface AgentFormData {
  name: string;
  phone: string;
  upline_id: string | null;
  specialty: string;
  experience: string;
  type?: AgentType;
  status?: AgentStatus;
}
