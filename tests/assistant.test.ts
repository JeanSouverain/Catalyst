import { POST as assistantHandler } from '../app/api/assistant/route';

describe('Assistant API', () => {
  it('searches indexed docs', async () => {
    // create an index entry containing hello
    const fs = require('fs/promises');
    const path = require('path');
    const docsDir = path.join(process.cwd(), 'data', 'docs');
    await fs.mkdir(docsDir, { recursive: true });
    const idxPath = path.join(docsDir, 'index.json');
    await fs.writeFile(idxPath, JSON.stringify([{ file: 'test.txt', text: 'hello world' }]), 'utf8');

    const req = new Request('http://localhost/api/assistant', { method: 'POST', body: JSON.stringify({ query: 'hello' }) });
    const res = await assistantHandler(req);
    const json = await res.json();
    expect(json.answer).toContain('hello');
  });
});
