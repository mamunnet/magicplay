import { AgentType } from '../pages/AgentManagementPage';

export interface Agent {
  id: string;
  agentId: string;  // For display purposes
  name: string;
  phone: string;
  whatsapp: string;
  type: AgentType;
  role: string;
  status: string;
  rating: number;
  upline_id?: string;
  created_at: number;
  updated_at: number;
  actions?: string[];
}

export type { AgentType } from '../pages/AgentManagementPage';
