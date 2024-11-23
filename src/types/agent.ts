import { AgentType } from '../pages/AgentManagementPage';

export interface Agent {
  id: string;
  name: string;
  phone: string;
  type: AgentType;
  status: string;
  upline_id?: string;
  created_at: number;
  updated_at: number;
}

export interface AgentFormData {
  name: string;
  phone: string;
  uplineId?: string;
}
