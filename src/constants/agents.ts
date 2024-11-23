import { AgentType } from '../types/agent';

export const agentTypes: Record<AgentType, {
  title: string;
  uplineType: AgentType | null;
  level: number;
  addTitle: string;
}> = {
  'master': { 
    title: 'Admin',
    addTitle: 'Add Admin',
    uplineType: null, // Admin has no upline
    level: 1
  },
  'super': { 
    title: 'Senior Sub Admin',
    addTitle: 'Add Senior Sub Admin',
    uplineType: 'master', // Senior Sub Admin reports to Admin
    level: 2
  },
  'admin': { 
    title: 'Sub Admin',
    addTitle: 'Add Sub Admin',
    uplineType: 'super', // Sub Admin reports to Senior Sub Admin
    level: 3
  },
  'super-agent': { 
    title: 'Super Agent',
    addTitle: 'Add Super Agent',
    uplineType: 'admin', // Super Agent reports to Sub Admin
    level: 4
  },
  'master-agent': { 
    title: 'Master Agent',
    addTitle: 'Add Master Agent',
    uplineType: 'super-agent', // Master Agent reports to Super Agent
    level: 5
  }
};
