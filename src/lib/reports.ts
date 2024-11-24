import { createClient } from '@libsql/client';
import type { ReportFormData } from '../components/ReportFormModal';

const client = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL as string,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN as string,
});

export class ReportsDatabase {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS agent_reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          agent_id TEXT NOT NULL,
          agent_name TEXT NOT NULL,
          upline_name TEXT,
          whatsapp_number TEXT NOT NULL,
          reason TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        )
      `);
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing reports table:', error);
      throw error;
    }
  }

  async addReport(report: ReportFormData) {
    await this.initialize();
    
    try {
      const result = await client.execute({
        sql: `
          INSERT INTO agent_reports (
            agent_id,
            agent_name,
            upline_name,
            whatsapp_number,
            reason,
            timestamp
          ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          report.agentId,
          report.agentName,
          report.uplineName,
          report.whatsappNumber,
          report.reason,
          report.timestamp
        ]
      });
      return result;
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  }

  async getReports() {
    await this.initialize();
    
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM agent_reports ORDER BY timestamp DESC'
      });
      return result.rows as Array<{
        id: number;
        agent_id: string;
        agent_name: string;
        upline_name: string;
        whatsapp_number: string;
        reason: string;
        timestamp: number;
      }>;
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  }
}

export const reportsDb = new ReportsDatabase();
