import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const estimatesFile = path.join(process.cwd(), 'data', 'estimates.json');
  let existing: any[] = [];
  try {
    const txt = await fs.readFile(estimatesFile, 'utf8');
    existing = JSON.parse(txt || '[]');
  } catch (e) {
    existing = [];
  }
  const summary = `Pilot Case Study\n
Total estimates: ${existing.length}\n`;
  return new NextResponse(summary, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
