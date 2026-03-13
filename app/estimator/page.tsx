"use client";

import React, { useState } from 'react';
import { Button } from '@/app/ui/button';
import FeatureLinks from '@/app/ui/feature-links';
import CatalystLogo from '@/app/ui/catalyst-logo';

export default function EstimatorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setSelectedFile(f ?? null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    try {
      const dataUrl = await readFileAsDataUrl(selectedFile);
      const res = await fetch('/api/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: selectedFile.name, dataUrl }),
      });
      const data = await res.json();
      if (res.ok) setResult(data.result);
      else setResult({ error: data.error ?? 'Estimation failed' });
    } catch (err) {
      setResult({ error: 'Network error' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <CatalystLogo />
      </div>

      <h1 className="mb-4 text-2xl font-semibold">Estimator (Pilot)</h1>

      <FeatureLinks />

      <section className="mb-6 rounded-lg bg-gray-50 p-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Upload blueprint or measurements</label>
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFile}
          className="mb-4"
        />

        <div className="flex items-center gap-3">
          <Button onClick={handleSubmit} disabled={!selectedFile || processing}>
            {processing ? 'Processing…' : 'Run Estimation'}
          </Button>
          <span className="text-sm text-gray-600">{selectedFile?.name ?? 'No file selected'}</span>
        </div>
      </section>

      {result && (
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-3 text-lg font-medium">Draft Estimate</h2>
          {result.error ? (
            <div className="text-red-600">{result.error}</div>
          ) : (
            <>
              <div className="mb-4">
                <strong>Volume:</strong> {result.volume}
              </div>
              <div className="mb-4">
                <strong>Labor hours:</strong> {result.laborHours}
              </div>
              <div className="mb-4">
                <strong>Draft quote:</strong> {result.draftQuote}
              </div>

              <div>
                <strong>Materials</strong>
                <ul className="mt-2 list-disc pl-5">
                  {result.materials.map((m: any, i: number) => (
                    <li key={i}>{m.name}: {m.qty}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
