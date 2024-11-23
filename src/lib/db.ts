import { createClient } from '@libsql/client';
import type { Agent, AgentFormData, AgentStatus } from '../types/agent';
import type { Notice, NoticeFormData } from '../types/notice';
import { AgentType } from '../pages/AgentManagementPage';
import { agentTypes } from '../pages/AgentManagementPage';

const client = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL as string,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN as string,
});

class Database {
  private static instance: Database;
  private initialized = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async initialize() {
    if (this.initialized) return;
    try {
      // Test connection
      await client.execute('SELECT 1');

      // Add rating column if it doesn't exist
      try {
        await client.execute(`
          ALTER TABLE agents ADD COLUMN rating INTEGER DEFAULT 5;
        `);
      } catch (error) {
        // Column might already exist, ignore the error
        console.log('Rating column might already exist');
      }

      this.initialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
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
        whatsapp: String(row.phone),
        type: row.type as AgentType,
        role: agentTypes[row.type as AgentType].title,
        status: (row.status || 'inactive') as AgentStatus,
        rating: Number(row.rating ?? 5),
        upline_id: row.upline_id ? String(row.upline_id) : null,
        created_at: Number(row.created_at),
        updated_at: Number(row.updated_at),
        actions: ['edit', 'delete'],
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
        whatsapp: String(row.phone),
        type: row.type as AgentType,
        role: agentTypes[row.type as AgentType].title,
        status: (row.status || 'inactive') as AgentStatus,
        rating: Number(row.rating ?? 5),
        upline_id: row.upline_id ? String(row.upline_id) : null,
        created_at: Number(row.created_at),
        updated_at: Number(row.updated_at),
        actions: ['edit', 'delete'],
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

  async createAgent(data: AgentFormData & { type: AgentType; status: AgentStatus }): Promise<Agent> {
    await this.initialize();
    try {
      const now = Date.now();
      const id = crypto.randomUUID();

      const insertData = {
        id,
        name: data.name,
        phone: data.phone,
        type: data.type,
        status: data.status,
        rating: 5,
        upline_id: data.upline_id || null,
        specialty: data.specialty || '',
        experience: data.experience || '',
        created_at: now,
        updated_at: now,
        success_rate: '100%'
      };

      const fields = Object.keys(insertData);
      const placeholders = fields.map(() => '?').join(', ');
      const values = Object.values(insertData);

      await client.execute({
        sql: `INSERT INTO agents (${fields.join(', ')}) VALUES (${placeholders})`,
        args: values
      });
      
      return {
        id,
        agentId: id,
        name: data.name,
        phone: data.phone,
        whatsapp: data.phone,
        type: data.type,
        role: agentTypes[data.type].title,
        status: data.status,
        rating: 5,
        upline_id: data.upline_id || null,
        created_at: now,
        updated_at: now,
        actions: ['edit', 'delete'],
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

      if (agent.rows.length === 0) {
        throw new Error('Agent not found');
      }

      // Filter out non-database fields
      const { actions, agentId, role, ...dbData } = data;

      const updates = Object.entries(dbData)
        .filter(([key, value]) => 
          value !== undefined && 
          key !== 'id' && 
          key !== 'created_at'
        )
        .map(([key]) => {
          const dbKey = key === 'upline_id' ? 'upline_id' :
                       key === 'success_rate' ? 'success_rate' : key;
          return `${dbKey} = ?`;
        });
      
      if (updates.length === 0) return;
      
      const values = Object.entries(dbData)
        .filter(([key, value]) => 
          value !== undefined && 
          key !== 'id' && 
          key !== 'created_at'
        )
        .map(([_, value]) => value);
      
      await client.execute({
        sql: `UPDATE agents 
              SET ${updates.join(', ')}, updated_at = ?
              WHERE id = ?`,
        args: [...values, Date.now(), id]
      });
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  }

  async deleteAgent(id: string): Promise<void> {
    await this.initialize();
    try {
      // First check if agent exists and if they have any downlines
      const [agent, downlines] = await Promise.all([
        client.execute({
          sql: 'SELECT id FROM agents WHERE id = ?',
          args: [id]
        }),
        client.execute({
          sql: 'SELECT id FROM agents WHERE upline_id = ?',
          args: [id]
        })
      ]);

      if (agent.rows.length === 0) {
        throw new Error('Agent not found');
      }

      if (downlines.rows.length > 0) {
        throw new Error('Cannot delete agent with active downlines');
      }

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
      const updates = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([key, _]) => `${key === 'isActive' ? 'is_active' : key} = ?`);
      
      if (updates.length === 0) return;
      
      const values = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => key === 'isActive' ? (value ? 1 : 0) : value);
      
      await client.execute({
        sql: `UPDATE notices 
               SET ${updates.join(', ')}, updated_at = ?
               WHERE id = ?`,
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

export const db = Database.getInstance();