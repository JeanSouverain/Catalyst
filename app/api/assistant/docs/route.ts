import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const indexPath = path.join(process.cwd(), 'data', 'docs', 'index.json');
  let index: Array<{file:string;text:string}> = [];
  try {
    const txt = await fs.readFile(indexPath, 'utf8');
    index = JSON.parse(txt || '[]');
  } catch {
    index = [];
  }
  // return only names
  return NextResponse.json({ docs: index.map(d => d.file) });
}
