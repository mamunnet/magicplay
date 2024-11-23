import { createClient } from '@libsql/client';
import { Agent, AgentFormData } from '../types/agent';

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface NoticeFormData {
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
}

const TURSO_URL = import.meta.env.VITE_TURSO_DATABASE_URL;
const TURSO_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN;

// Validate environment variables
if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('Missing Turso credentials:', {
    hasUrl: !!TURSO_URL,
    hasToken: !!TURSO_TOKEN
  });
  throw new Error('Database configuration missing');
}

console.log('Initializing Turso client with URL:', TURSO_URL);

// Create client with retries
const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

// Create tables if they don't exist
async function initializeDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection first
    await client.execute('SELECT 1');
    
    console.log('Database connection successful, creating tables...');
    
    // Create tables
    await client.execute(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        upline_id TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS notices (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        priority TEXT NOT NULL,
        is_active BOOLEAN NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    console.log('Database initialized successfully');
  } catch (error: any) {
    console.error('Database initialization error:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    });
    throw error;
  }
}

// Initialize database
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
});

export const db = {
  // Agent-related functions
  async getAgents(type: string): Promise<Agent[]> {
    const result = await client.execute({
      sql: "SELECT * FROM agents WHERE type = ? ORDER BY created_at DESC",
      args: [type]
    });
    
    return result.rows.map(row => ({
      id: row.id as string,
      name: row.name as string,
      phone: row.phone as string,
      type: row.type as string,
      status: row.status as string,
      uplineId: row.upline_id as string | undefined,
      createdAt: row.created_at as number,
      updatedAt: row.updated_at as number
    }));
  },

  async createAgent(data: AgentFormData): Promise<Agent> {
    const now = Date.now();
    const id = crypto.randomUUID();
    
    await client.execute({
      sql: `
        INSERT INTO agents (id, name, phone, type, status, upline_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [id, data.name, data.phone, data.type, data.status, data.uplineId || null, now, now]
    });

    return {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    };
  },

  async updateAgent(id: string, data: Partial<AgentFormData>): Promise<void> {
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key === 'uplineId' ? 'upline_id' : key} = ?`);
    
    if (updates.length === 0) return;

    const values = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([_, value]) => value);

    await client.execute({
      sql: `
        UPDATE agents 
        SET ${updates.join(', ')}, updated_at = ?
        WHERE id = ?
      `,
      args: [...values, Date.now(), id]
    });
  },

  async deleteAgent(id: string): Promise<void> {
    await client.execute({
      sql: "DELETE FROM agents WHERE id = ?",
      args: [id]
    });
  },

  async getUplineAgents(type: string): Promise<Agent[]> {
    const uplineType = type === 'master' ? 'super' :
                      type === 'super' ? 'sub-admin' :
                      type === 'sub-admin' ? 'ss-admin' :
                      type === 'ss-admin' ? 'admin' : null;
    
    if (!uplineType) return [];

    const result = await client.execute({
      sql: "SELECT * FROM agents WHERE type = ? ORDER BY name ASC",
      args: [uplineType]
    });
    
    return result.rows.map(row => ({
      id: row.id as string,
      name: row.name as string,
      phone: row.phone as string,
      type: row.type as string,
      status: row.status as string,
      uplineId: row.upline_id as string | undefined,
      createdAt: row.created_at as number,
      updatedAt: row.updated_at as number
    }));
  },

  // Notice-related functions
  async getNotices(): Promise<Notice[]> {
    const result = await client.execute({
      sql: "SELECT * FROM notices ORDER BY created_at DESC"
    });
    
    return result.rows.map(row => ({
      id: row.id as string,
      title: row.title as string,
      content: row.content as string,
      priority: row.priority as 'high' | 'medium' | 'low',
      isActive: Boolean(row.is_active),
      createdAt: row.created_at as number,
      updatedAt: row.updated_at as number
    }));
  },

  async createNotice(data: NoticeFormData): Promise<Notice> {
    const now = Date.now();
    const id = crypto.randomUUID();
    
    await client.execute({
      sql: `
        INSERT INTO notices (id, title, content, priority, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [id, data.title, data.content, data.priority, data.isActive ? 1 : 0, now, now]
    });

    return {
      id,
      ...data,
      createdAt: now,
      updatedAt: now
    };
  },

  async updateNotice(id: string, data: Partial<NoticeFormData>): Promise<void> {
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key === 'isActive' ? 'is_active' : key} = ?`);
    
    if (updates.length === 0) return;

    const values = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => key === 'isActive' ? (value ? 1 : 0) : value);

    await client.execute({
      sql: `
        UPDATE notices 
        SET ${updates.join(', ')}, updated_at = ?
        WHERE id = ?
      `,
      args: [...values, Date.now(), id]
    });
  },

  async deleteNotice(id: string): Promise<void> {
    await client.execute({
      sql: "DELETE FROM notices WHERE id = ?",
      args: [id]
    });
  }
};
