"use client";

import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r=>r.json()).then(setStats);
  }, []);

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      {stats ? (
        <div className="space-y-4">
          <div>Estimates created: {stats.estimatesCount}</div>
          <div>Last estimate: {stats.lastEstimate}</div>
          <div>Documents uploaded: {stats.docsCount}</div>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={async () => {
              const res = await fetch('/api/case-study');
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'case-study.txt';
              a.click();
            }}
          >Export Case Study</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}
