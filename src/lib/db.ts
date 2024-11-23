import { createClient } from '@libsql/client';
import type { Agent, AgentStatus, AgentType } from '../types/agent';
import type { Notice, NoticeFormData } from '../types/notice';
import { agentTypes } from '../constants/agents';

const client = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL as string,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN as string,
});

export class Database {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Create the base table if it doesn't exist
      await client.execute(`
        CREATE TABLE IF NOT EXISTS agents (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          type TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'active',
          rating INTEGER DEFAULT 5,
          upline_id TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          whatsapp TEXT,
          messenger TEXT,
          avatar TEXT,
          success_rate TEXT DEFAULT '100%'
        )
      `);

      // Add specialty column if it doesn't exist
      try {
        await client.execute('ALTER TABLE agents ADD COLUMN specialty TEXT');
      } catch (e) {
        // Column might already exist, ignore the error
      }

      // Add experience column if it doesn't exist
      try {
        await client.execute('ALTER TABLE agents ADD COLUMN experience TEXT');
      } catch (e) {
        // Column might already exist, ignore the error
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async getAgents(type: AgentType): Promise<Agent[]> {
    await this.initialize();
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM agents WHERE type = ? ORDER BY created_at DESC',
        args: [type]
      });
      
      return result.rows.map(row => ({
        id: String(row.id),
        agentId: String(row.id),
        name: String(row.name),
        phone: String(row.phone),
        whatsapp: String(row.whatsapp || row.phone),
        messenger: String(row.messenger || ''),
        type: row.type as AgentType,
        role: agentTypes[row.type as AgentType].title,
        status: (row.status || 'inactive') as AgentStatus,
        rating: Number(row.rating ?? 5),
        upline_id: row.upline_id ? String(row.upline_id) : null,
        created_at: Number(row.created_at),
        updated_at: Number(row.updated_at),
        actions: ['view', 'edit', 'delete'],
        avatar: row.avatar ? String(row.avatar) : '',
        specialty: row.specialty ? String(row.specialty) : '',
        experience: row.experience ? String(row.experience) : '',
        successRate: String(row.success_rate ?? '100%')
      }));
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  async getUplineAgents(type: AgentType): Promise<Agent[]> {
    await this.initialize();
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM agents WHERE type = ? ORDER BY created_at DESC',
        args: [type]
      });

      return result.rows.map(row => ({
        id: String(row.id),
        agentId: String(row.id),
        name: String(row.name),
        phone: String(row.phone),
        whatsapp: String(row.whatsapp || row.phone),
        messenger: String(row.messenger || ''),
        type: row.type as AgentType,
        role: agentTypes[row.type as AgentType].title,
        status: (row.status || 'inactive') as AgentStatus,
        rating: Number(row.rating ?? 5),
        upline_id: row.upline_id ? String(row.upline_id) : null,
        created_at: Number(row.created_at),
        updated_at: Number(row.updated_at),
        actions: ['view', 'edit', 'delete'],
        avatar: row.avatar ? String(row.avatar) : '',
        specialty: row.specialty ? String(row.specialty) : '',
        experience: row.experience ? String(row.experience) : '',
        successRate: String(row.success_rate ?? '100%')
      }));
    } catch (error) {
      console.error('Error fetching upline agents:', error);
      throw error;
    }
  }

  async getDownlineAgents(agentId: string): Promise<Agent[]> {
    await this.initialize();
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM agents WHERE upline_id = ? ORDER BY created_at DESC',
        args: [agentId]
      });
      
      return result.rows.map(row => ({
        id: String(row.id),
        agentId: String(row.id),
        name: String(row.name),
        phone: String(row.phone),
        whatsapp: String(row.whatsapp || row.phone),
        messenger: String(row.messenger || ''),
        type: row.type as AgentType,
        role: agentTypes[row.type as AgentType].title,
        status: (row.status || 'inactive') as AgentStatus,
        rating: Number(row.rating ?? 5),
        upline_id: row.upline_id ? String(row.upline_id) : null,
        created_at: Number(row.created_at),
        updated_at: Number(row.updated_at),
        actions: ['view', 'edit', 'delete'],
        avatar: row.avatar ? String(row.avatar) : '',
        specialty: row.specialty ? String(row.specialty) : '',
        experience: row.experience ? String(row.experience) : '',
        successRate: String(row.success_rate ?? '100%')
      }));
    } catch (error) {
      console.error('Error fetching downline agents:', error);
      throw error;
    }
  }

  async getAgentById(id: string): Promise<Agent | null> {
    await this.initialize();
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM agents WHERE id = ?',
        args: [id]
      });

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: String(row.id),
        agentId: String(row.id),
        name: String(row.name),
        phone: String(row.phone),
        whatsapp: String(row.whatsapp || row.phone),
        messenger: String(row.messenger || ''),
        type: row.type as AgentType,
        role: agentTypes[row.type as AgentType].title,
        status: (row.status || 'inactive') as AgentStatus,
        rating: Number(row.rating ?? 5),
        upline_id: row.upline_id ? String(row.upline_id) : null,
        created_at: Number(row.created_at),
        updated_at: Number(row.updated_at),
        actions: ['view', 'edit', 'delete'],
        avatar: row.avatar ? String(row.avatar) : '',
        specialty: row.specialty ? String(row.specialty) : '',
        experience: row.experience ? String(row.experience) : '',
        successRate: String(row.success_rate ?? '100%')
      };
    } catch (error) {
      console.error('Error fetching agent by ID:', error);
      throw error;
    }
  }

  private async generateAgentId(type: AgentType): Promise<string> {
    try {
      // Get the count of existing agents of this type
      const result = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM agents WHERE type = ?',
        args: [type]
      });
      
      // Safely type the result and extract count
      const count = Number(result.rows[0]?.count || 0) + 1;
      
      // Format: [type prefix][5-digit number]
      let prefix;
      switch (type) {
        case 'master':
          prefix = 'MGPAD'; // Admin
          break;
        case 'super':
          prefix = 'MGPSSA'; // Senior Sub Admin
          break;
        case 'admin':
          prefix = 'MGPSA'; // Sub Admin
          break;
        case 'super-agent':
          prefix = 'MGPSPA'; // Super Agent
          break;
        case 'master-agent':
          prefix = 'MGPMA'; // Master Agent
          break;
        default:
          prefix = 'MGPA';
      }
      return `${prefix}${count.toString().padStart(5, '0')}`;
    } catch (error) {
      console.error('Error generating agent ID:', error);
      throw error;
    }
  }

  async createAgent(data: Omit<Agent, 'id' | 'agentId' | 'role' | 'rating' | 'actions' | 'avatar' | 'successRate'>): Promise<Agent> {
    await this.initialize();
    try {
      const now = Date.now();
      const id = await this.generateAgentId(data.type);

      const agentData = {
        id,
        name: data.name,
        phone: data.phone,
        type: data.type,
        status: data.status,
        rating: 5,
        upline_id: data.upline_id || null,
        created_at: now,
        updated_at: now,
        whatsapp: data.whatsapp || data.phone,
        messenger: data.messenger || '',
        avatar: '',
        specialty: data.specialty || '',
        experience: data.experience || '',
        success_rate: '100%'
      };

      const fields = Object.keys(agentData);
      const placeholders = fields.map(() => '?').join(', ');
      const values = Object.values(agentData);

      await client.execute({
        sql: `INSERT INTO agents (${fields.join(', ')}) VALUES (${placeholders})`,
        args: values
      });
      
      return {
        id,
        agentId: id,
        name: data.name,
        phone: data.phone,
        whatsapp: data.whatsapp || data.phone,
        messenger: data.messenger || '',
        type: data.type,
        role: agentTypes[data.type].title,
        status: data.status,
        rating: 5,
        upline_id: data.upline_id,
        created_at: now,
        updated_at: now,
        actions: ['view', 'edit', 'delete'],
        avatar: '',
        specialty: data.specialty || '',
        experience: data.experience || '',
        successRate: '100%'
      };
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<void> {
    await this.initialize();
    try {
      const agent = await client.execute({
        sql: 'SELECT id FROM agents WHERE id = ?',
        args: [id]
      });

      if (!agent) {
        throw new Error('Agent not found');
      }

      const updateData = {
        ...data,
        updated_at: Date.now()
      };

      const updates = Object.entries(updateData)
        .filter(([key, value]) => 
          value !== undefined && 
          key !== 'id' && 
          key !== 'agentId' &&
          key !== 'role' &&
          key !== 'actions' &&
          key !== 'successRate'
        );

      if (updates.length === 0) return;

      const setClause = updates.map(([key]) => `${key} = ?`).join(', ');
      const values = updates.map(([, value]) => 
        Array.isArray(value) ? JSON.stringify(value) : value
      );

      await client.execute({
        sql: `UPDATE agents SET ${setClause} WHERE id = ?`,
        args: [...values, id]
      });
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  }

  async deleteAgent(id: string): Promise<void> {
    await this.initialize();
    try {
      await client.execute({
        sql: 'DELETE FROM agents WHERE id = ?',
        args: [id]
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  }

  async getNotices(): Promise<Notice[]> {
    await this.initialize();
    try {
      const result = await client.execute('SELECT * FROM notices ORDER BY created_at DESC');
      return result.rows.map(row => ({
        id: String(row.id),
        title: String(row.title),
        content: String(row.content),
        priority: String(row.priority) as 'high' | 'medium' | 'low',
        isActive: Boolean(row.is_active),
        createdAt: Number(row.created_at),
        updatedAt: Number(row.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching notices:', error);
      throw error;
    }
  }

  async createNotice(data: NoticeFormData): Promise<Notice> {
    await this.initialize();
    try {
      const now = Date.now();
      const id = crypto.randomUUID();

      await client.execute({
        sql: 'INSERT INTO notices (id, title, content, priority, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [id, data.title, data.content, data.priority, data.isActive, now, now]
      });

      return {
        id,
        title: data.title,
        content: data.content,
        priority: data.priority,
        isActive: data.isActive,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error creating notice:', error);
      throw error;
    }
  }

  async updateNotice(id: string, data: Partial<NoticeFormData>): Promise<void> {
    await this.initialize();
    try {
      const updateFields = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([key, _]) => `${key === 'isActive' ? 'is_active' : key} = ?`);

      if (updateFields.length === 0) return;

      const values = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => {
          if (key === 'isActive') return value ? 1 : 0;
          if (Array.isArray(value)) return value.join(',');
          return value;
        });

      await client.execute({
        sql: `UPDATE notices SET ${updateFields.join(', ')}, updated_at = ? WHERE id = ?`,
        args: [...values, Date.now(), id]
      });
    } catch (error) {
      console.error('Error updating notice:', error);
      throw error;
    }
  }

  async deleteNotice(id: string): Promise<void> {
    await this.initialize();
    try {
      await client.execute({
        sql: 'DELETE FROM notices WHERE id = ?',
        args: [id]
      });
    } catch (error) {
      console.error('Error deleting notice:', error);
      throw error;
    }
  }
}

export const db = new Database();