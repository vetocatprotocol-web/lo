'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import type { IAttendanceStats } from '@mas/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<IAttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/attendance`,
        );
        setStats(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError('Failed to load dashboard stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers || 0}
          color="blue"
        />
        <StatCard title="Present" value={stats?.presentCount || 0} color="green" />
        <StatCard title="Absent" value={stats?.absentCount || 0} color="red" />
        <StatCard title="Late" value={stats?.lateCount || 0} color="yellow" />
      </div>

      <div className="mt-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="font-bold text-red-900">Security Alerts</h2>
          <p>Suspicious: {stats?.suspiciousCount || 0}</p>
          <p>Blocked: {stats?.blockedCount || 0}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600' },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${classes.bg} p-6 rounded-lg border ${classes.border}`}>
      <p className={`${classes.text} text-sm`}>{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
