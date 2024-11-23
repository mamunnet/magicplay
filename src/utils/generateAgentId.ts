import { db } from '../lib/db';
import { AgentType } from '../pages/AgentManagementPage';

const prefixMap: Record<AgentType, string> = {
  'admin': 'ADM',
  'ss-admin': 'SSA',
  'sub-admin': 'SBA',
  'super': 'SUP',
  'master': 'MST'
};

export async function generateAgentId(type: AgentType): Promise<string> {
  const agents = await db.getAgents(type);
  
  // Get the highest ID number for this agent type
  const existingIds = agents
    .map(agent => {
      const match = agent.id.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter(id => !isNaN(id));
  
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newId = maxId + 1;

  // Format: MGP-[TYPE]-[NUMBER] (e.g., MGP-ADM-1, MGP-SSA-1)
  return `MGP-${prefixMap[type]}-${String(newId).padStart(4, '0')}`;
}