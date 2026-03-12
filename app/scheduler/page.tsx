"use client";

import React, { useState } from 'react';
import { Button } from '@/app/ui/button';

export default function SchedulerPage() {
  const [jobs, setJobs] = useState('');
  const [schedule, setSchedule] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ jobs }),
      });
      const data = await res.json();
      setSchedule(data.schedule);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Scheduler</h1>
      <div className="mb-4">
        <textarea
          className="w-full rounded border p-2"
          rows={4}
          placeholder="Enter jobs, crew availability, etc."
          value={jobs}
          onChange={(e)=>setJobs(e.target.value)}
        />
      </div>
      <Button onClick={generate} disabled={loading}>{loading?'Generating…':'Generate Schedule'}</Button>
      {schedule && (
        <div className="mt-6 space-y-2">
          {schedule.split('\n').filter(Boolean).map((line,i)=>(
            <div key={i} className="rounded bg-gray-100 p-2">{line}</div>
          ))}
        </div>
      )}
    </main>
  );
}
