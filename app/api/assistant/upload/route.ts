import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';

async function extractText(fileName: string, buffer: Buffer): Promise<string> {
  if (/\.pdf$/i.test(fileName)) {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch {
      return '';
    }
  }
  // assume utf-8 text otherwise
  return buffer.toString('utf8');
}

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file') as File;
  if (!file) return NextResponse.json({ error: 'no file' }, { status: 400 });
  const arrayBuf = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);
  const docsDir = path.join(process.cwd(), 'data', 'docs');
  await fs.mkdir(docsDir, { recursive: true });
  const dest = path.join(docsDir, file.name);
  await fs.writeFile(dest, buffer);

  // parse text and update index
  const text = await extractText(file.name, buffer);
  const indexPath = path.join(docsDir, 'index.json');
  let index: Array<{file:string;text:string}> = [];
  try {
    const idxTxt = await fs.readFile(indexPath, 'utf8');
    index = JSON.parse(idxTxt || '[]');
  } catch {}
  index.push({ file: file.name, text });
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');

  return NextResponse.json({ ok: true });
}
