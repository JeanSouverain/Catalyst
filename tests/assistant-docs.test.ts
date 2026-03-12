import { GET as docsHandler } from '../app/api/assistant/docs/route';
import fs from 'fs/promises';
import path from 'path';

describe('Assistant docs endpoint', () => {
  it('returns empty array when no docs', async () => {
    const docsDir = path.join(process.cwd(), 'data', 'docs');
    await fs.rm(docsDir, { recursive: true, force: true });
    const res = await docsHandler();
    const json = await res.json();
    expect(Array.isArray(json.docs)).toBe(true);
    expect(json.docs.length).toBe(0);
  });
});