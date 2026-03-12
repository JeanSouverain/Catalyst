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

  // count docs
  const docsDir = path.join(process.cwd(), 'data', 'docs');
  let docsCount = 0;
  try {
    const files = await fs.readdir(docsDir);
    docsCount = files.length;
  } catch {}
  const stats = {
    estimatesCount: existing.length,
    lastEstimate: existing.length ? existing[existing.length-1].createdAt : null,
    docsCount,
  };
  return NextResponse.json(stats);
}
