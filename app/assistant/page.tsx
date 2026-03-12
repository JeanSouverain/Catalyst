"use client";

import React, { useState } from 'react';
import { Button } from '@/app/ui/button';

export default function AssistantPage() {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<Array<{question:string,answer:string}>>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docs, setDocs] = useState<string[]>([]);

  React.useEffect(() => {
    fetch('/api/assistant/docs').then(r=>r.json()).then(d=>setDocs(d.docs || []));
  }, []);

  const send = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setChat([...chat, { question: query, answer: data.answer }]);
      setQuery('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Project Assistant</h1>
      <div className="mb-4">
        <label className="block mb-2">Upload project document (txt/pdf,image):</label>
        <input type="file" onChange={(e)=>setFile(e.target.files ? e.target.files[0] : null)} />
        <Button
          className="mt-2"
          onClick={async () => {
            if (!file) return;
            setUploading(true);
            const form = new FormData();
            form.append('file', file);
            await fetch('/api/assistant/upload', { method: 'POST', body: form });
            setUploading(false);
            alert('Uploaded');
            const res = await fetch('/api/assistant/docs');
            const d = await res.json();
            setDocs(d.docs || []);
          }}
          disabled={uploading}
        >{uploading ? 'Uploading…' : 'Upload'}</Button>
        {docs.length > 0 && (
          <div className="mt-3 text-sm">
            <strong>Documents:</strong> {docs.join(', ')}
          </div>
        )}
      </div>
      <div className="mb-4">
        <textarea
          className="w-full rounded border p-2"
          rows={3}
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Ask a question about the project..."
        />
      </div>
      <Button onClick={send} disabled={loading}>{loading?'Thinking…':'Send'}</Button>
      <div className="mt-6 space-y-4">
        {chat.map((c,i)=>(
          <div key={i} className="space-y-1">
            <div className="font-semibold">Q: {c.question}</div>
            <div>A: {c.answer}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
