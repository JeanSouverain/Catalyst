import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const { query } = await req.json();
  const docsDir = path.join(process.cwd(), 'data', 'docs');
  const indexPath = path.join(docsDir, 'index.json');
  let index: Array<{file:string;text:string}> = [];
  try {
    const idxTxt = await fs.readFile(indexPath, 'utf8');
    index = JSON.parse(idxTxt || '[]');
  } catch {}

  // simple substring search
  const hits = index.filter(d => d.text.toLowerCase().includes(query.toLowerCase()));
  let answer;
  if (hits.length) {
    answer = `Found ${hits.length} docs. Example from ${hits[0].file}: ` +
      hits[0].text.substring(0, 200) + '...';
  } else {
    answer = "Sorry, I couldn't find anything relevant.";
  }
  return NextResponse.json({ answer });
}
