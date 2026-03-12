import { POST as assistantHandler } from '../app/api/assistant/route';
import fs from 'fs/promises';
import path from 'path';

describe('Assistant search', () => {
  it('returns no results when index empty', async () => {
    // ensure empty index
    const docsDir = path.join(process.cwd(), 'data', 'docs');
    await fs.mkdir(docsDir, { recursive: true });
    const idxPath = path.join(docsDir, 'index.json');
    await fs.writeFile(idxPath, '[]', 'utf8');

    const req = new Request('http://localhost/api/assistant', { method: 'POST', body: JSON.stringify({ query: 'anything' }) });
    const res = await assistantHandler(req);
    const json = await res.json();
    expect(json.answer).toContain('couldn\'t find');
  });
});