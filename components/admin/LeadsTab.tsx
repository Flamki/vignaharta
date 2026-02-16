import React from 'react';
import { Download } from 'lucide-react';
import { LeadRecord } from '../../services/contentService';

interface LeadsTabProps {
  leads: LeadRecord[];
  isLeadsLoading: boolean;
  leadsError: string;
  onRefresh: () => void;
  onDownloadCsv: () => void;
}

export const LeadsTab: React.FC<LeadsTabProps> = ({
  leads,
  isLeadsLoading,
  leadsError,
  onRefresh,
  onDownloadCsv
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-gray-800">Submitted Leads</h3>
          <p className="text-sm text-gray-500 mt-1">All enquiries, brochure requests, and price sheet requests.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
          >
            Refresh Leads
          </button>
          <button
            onClick={onDownloadCsv}
            className="inline-flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black"
          >
            <Download size={16} className="mr-2" /> Download CSV
          </button>
        </div>
      </div>

      {isLeadsLoading && <div className="text-sm text-gray-500">Loading leads...</div>}
      {leadsError && <div className="text-sm text-red-600">{leadsError}</div>}

      {!isLeadsLoading && !leadsError && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm text-gray-900">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Source</th>
                <th className="text-left p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={6}>No leads yet.</td>
                </tr>
              )}
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-gray-100 align-top">
                  <td className="p-3 whitespace-nowrap text-gray-800">{new Date(lead.created_at).toLocaleString()}</td>
                  <td className="p-3 text-gray-900 font-medium">{lead.name}</td>
                  <td className="p-3 whitespace-nowrap text-gray-800">{lead.phone}</td>
                  <td className="p-3 text-gray-800">{lead.email || '-'}</td>
                  <td className="p-3 capitalize whitespace-nowrap text-gray-800">{lead.source.replace('_', ' ')}</td>
                  <td className="p-3 text-gray-700">{lead.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
