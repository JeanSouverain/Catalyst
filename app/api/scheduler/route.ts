import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { jobs } = await req.json();
  // split jobs by comma or newline
  const list: string[] = typeof jobs === 'string' ? jobs.split(/[\n,]+/).map(j=>j.trim()).filter(Boolean) : [];
  let scheduleStr = '';
  let day = 1;
  for (let i = 0; i < list.length; i += 2) {
    const chunk = list.slice(i, i + 2);
    scheduleStr += `Day ${day}: ${chunk.join(', ')}\n`;
    day++;
  }
  return NextResponse.json({ schedule: scheduleStr || 'No jobs provided' });
}
