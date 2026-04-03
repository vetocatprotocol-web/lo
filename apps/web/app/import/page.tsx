'use client';

import { useState } from 'react';
import axios from 'axios';
import type { IBulkUserData, ImportMode } from '@mas/types';

export default function ImportPage() {
  const [mode, setMode] = useState<ImportMode>('skip_duplicates');
  const [users, setUsers] = useState<IBulkUserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Check file type
      if (!['text/csv', '.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type) && !file.name.endsWith('.csv')) {
        setMessage({ type: 'error', text: 'Please upload a CSV or XLSX file' });
        return;
      }

      // Basic CSV parsing
      const text = await file.text();
      const lines = text.trim().split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setMessage({ type: 'error', text: 'CSV file must have header row and at least one data row' });
        return;
      }

      const header = lines[0].toLowerCase().split(',');
      const parsed: IBulkUserData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === header.length && values.some(v => v)) {
          parsed.push({
            nrp: values[0] || '',
            name: values[1] || '',
            rank: values[2] || '',
            unit: values[3] || '',
            pin: values[4] || '',
          });
        }
      }

      if (parsed.length === 0) {
        setMessage({ type: 'error', text: 'No valid records found in CSV' });
        return;
      }

      setUsers(parsed);
      setMessage({ type: 'success', text: `Loaded ${parsed.length} records` });
    } catch (error) {
      console.error('File upload error:', error);
      setMessage({ type: 'error', text: 'Failed to parse CSV file' });
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/import/users`,
        { users, mode, userId: 'admin' },
      );

      setMessage({
        type: 'success',
        text: `Import completed: ${response.data.successCount} success, ${response.data.failureCount} failed`,
      });
      setUsers([]);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Import failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Bulk Import</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Import Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ImportMode)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="skip_duplicates">Skip Duplicates</option>
            <option value="overwrite">Overwrite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">CSV File</label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {users.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">Preview ({users.length} records)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">NRP</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((user, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2">{user.nrp}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.rank}</td>
                      <td className="px-4 py-2">{user.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length > 5 && (
                <p className="text-xs text-gray-500 mt-2">... and {users.length - 5} more</p>
              )}
            </div>
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading || users.length === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Import Users'}
        </button>
      </div>
    </div>
  );
}
