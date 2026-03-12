"use client";

import React, { useState } from 'react';
import { Button } from '@/app/ui/button';

export default function SafetyPage() {
  const [images, setImages] = useState<File[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
    setResults([]);
  };

  const analyze = async () => {
    if (!images.length) return;
    setLoading(true);
    try {
      const form = new FormData();
      images.forEach((f) => form.append('files', f));
      const res = await fetch('/api/safety', { method: 'POST', body: form });
      const data = await res.json();
      setResults(data.flags);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Safety Monitoring</h1>
      <div className="mb-4">
        <input type="file" multiple accept="image/*" onChange={handleFiles} />
      </div>
      <Button onClick={analyze} disabled={loading || !images.length}>{loading?'Analyzing…':'Analyze Images'}</Button>
      <div className="mt-6 space-y-4">
        {results.map((r,i)=>(
          <div key={i} className="border p-2">
            <div><strong>{r.file}</strong></div>
            <div>{r.flag ? 'Flagged: missing PPE' : 'OK'}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
