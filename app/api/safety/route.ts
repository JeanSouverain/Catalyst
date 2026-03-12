import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // simplistic stub: parse form data, return random flags
  const form = await req.formData();
  const files = form.getAll('files') as File[];
  const flags = files.map((f) => ({ file: f.name, flag: Math.random() < 0.3 }));
  return NextResponse.json({ flags });
}
