import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';

async function extractText(buffer: Buffer, fileName: string): Promise<string> {
  if (/\.pdf$/i.test(fileName)) {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch {
      return '';
    }
  }
  return buffer.toString('utf8');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fileName: string = body?.fileName ?? `upload-${Date.now()}`;
    const dataUrl: string | undefined = body?.dataUrl;

    if (!dataUrl) {
      return NextResponse.json({ error: 'Missing dataUrl' }, { status: 400 });
    }

    const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid dataUrl' }, { status: 400 });
    }

    const buffer = Buffer.from(match[2], 'base64');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const destPath = path.join(uploadsDir, fileName);
    await fs.writeFile(destPath, buffer);

    const text = await extractText(buffer, fileName);
    // Naive estimate based on text
    const cementCount = (text.match(/cement/gi) || []).length;
    const aggregateCount = (text.match(/aggregate/gi) || []).length;
    const rebarCount = (text.match(/rebar/gi) || []).length;

    const result = {
      materials: [
        { name: 'Portland Cement (bags)', qty: cementCount * 5 + 20 },
        { name: 'Aggregate (tons)', qty: aggregateCount * 2 + 3 },
        { name: 'Rebar (ft)', qty: rebarCount * 10 + 120 },
      ],
      volume: cementCount ? `${(cementCount * 0.5).toFixed(1)} m3` : '4.8 m3',
      laborHours: 16 + cementCount,
      draftQuote: `$${2950 + cementCount * 100}`,
      sourceFile: `/uploads/${fileName}`,
      ocrText: text.slice(0, 200),
    };

    // Persist estimate to data/estimates.json for simple storage
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    const estimatesFile = path.join(dataDir, 'estimates.json');
    let existing: any[] = [];
    try {
      const txt = await fs.readFile(estimatesFile, 'utf8');
      existing = JSON.parse(txt || '[]');
    } catch (e) {
      existing = [];
    }

    const record = { id: Date.now(), fileName, createdAt: new Date().toISOString(), result };
    existing.push(record);
    await fs.writeFile(estimatesFile, JSON.stringify(existing, null, 2), 'utf8');

    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
