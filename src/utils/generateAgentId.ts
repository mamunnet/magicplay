import { db } from '../lib/db';

const prefixMap = {
  'admin': 'ADMIN',
  'ss-admin': 'SS-ADMIN',
  'sub-admin': 'SUB-ADMIN',
  'super': 'SUPER',
  'master': 'MASTER'
};

export async function generateAgentId(type: string): Promise<string> {
  const agents = await db.getAgents(type);
  
  // Get the highest ID number for this agent type
  const existingIds = agents
    .map(agent => parseInt(agent.id.split('-')[1], 10))
    .filter(id => !isNaN(id));
  
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newId = maxId + 1;

  // Format: TYPE-NUMBER (e.g., ADMIN-1, SS-ADMIN-1)
  return `${prefixMap[type]}-${newId}`;
}