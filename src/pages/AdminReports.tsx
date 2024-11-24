import React, { useEffect, useState } from 'react';
import { reportsDb } from '../lib/reports';
import type { ReportFormData } from '../components/ReportFormModal';

export const AdminReports = () => {
  const [reports, setReports] = useState<ReportFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportsDb.getReports();
        setReports(data.map(report => ({
          agentId: report.agent_id,
          agentName: report.agent_name,
          uplineName: report.upline_name,
          whatsappNumber: report.whatsapp_number,
          reason: report.reason,
          timestamp: report.timestamp
        })));
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#FFB800]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-6">
        Error loading reports: {error}
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Reports</h2>
          <p className="text-sm text-gray-400">View and manage agent reports</p>
        </div>
        <span className="text-gray-400 text-sm">Total Reports: {reports.length}</span>
      </div>

      <div className="bg-[#1F1D1B] rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1A1816] text-[#FFB800] uppercase text-xs">
              <tr>
                <th className="py-4 px-4 text-left">Date</th>
                <th className="py-4 px-4 text-left">Agent Name</th>
                <th className="py-4 px-4 text-left">Agent ID</th>
                <th className="py-4 px-4 text-left">Upline Agent</th>
                <th className="py-4 px-4 text-left">Reporter's WhatsApp</th>
                <th className="py-4 px-4 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-[#2A2725] transition-colors">
                    <td className="py-4 px-4 text-gray-300">{formatDate(report.timestamp)}</td>
                    <td className="py-4 px-4 text-gray-300">{report.agentName}</td>
                    <td className="py-4 px-4 text-gray-300">{report.agentId}</td>
                    <td className="py-4 px-4 text-gray-300">{report.uplineName}</td>
                    <td className="py-4 px-4 text-gray-300">{report.whatsappNumber}</td>
                    <td className="py-4 px-4 text-gray-300">
                      <div className="max-w-xs overflow-hidden text-ellipsis">
                        {report.reason}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
