'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import type { ISystemConfigValue } from '@mas/types';

export default function SettingsPage() {
  const [config, setConfig] = useState<ISystemConfigValue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/config/system`,
        );
        setConfig(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch config:', error);
        setError('Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/config/system`,
        config,
      );
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save config:', error);
      setError('Failed to save configuration');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800">Failed to load configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800">Settings saved successfully!</p>
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        {/* Authentication Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Authentication</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.auth.pin}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    auth: { ...config.auth, pin: e.target.checked },
                  })
                }
                className="rounded"
              />
              <span className="ml-3">PIN Authentication</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.auth.otp}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    auth: { ...config.auth, otp: e.target.checked },
                  })
                }
                className="rounded"
              />
              <span className="ml-3">OTP Authentication</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.auth.face}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    auth: { ...config.auth, face: e.target.checked },
                  })
                }
                className="rounded"
              />
              <span className="ml-3">Face Recognition</span>
            </label>
          </div>
        </div>

        {/* Detection Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Detection</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Detection Level</label>
              <select
                value={config.detection.level}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    detection: {
                      ...config.detection,
                      level: e.target.value as 'low' | 'medium' | 'high',
                    },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">Location Validation</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Validation Mode</label>
              <select
                value={config.geo.mode}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    geo: {
                      ...config.geo,
                      mode: e.target.value as 'hybrid' | 'gps' | 'network',
                    },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="hybrid">Hybrid (GPS + Network)</option>
                <option value="gps">GPS Only</option>
                <option value="network">Network Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Radius (meters): {config.geo.radius}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={config.geo.radius}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    geo: { ...config.geo, radius: parseInt(e.target.value) },
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg">
            Configuration saved successfully!
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}
