import { POST as estimatorHandler } from '../app/api/estimator/route';

describe('Estimator parsing', () => {
  it('adjusts quantities based on text content', async () => {
    const sample = 'cement cement aggregate rebar';
    const dataUrl = 'data:text/plain;base64,' + Buffer.from(sample).toString('base64');
    const req = new Request('http://localhost/api/estimator', { method: 'POST', body: JSON.stringify({ fileName: 'test.txt', dataUrl }) });
    const res = await estimatorHandler(req);
    const json = await res.json();
    expect(json.result.materials[0].qty).toBeGreaterThan(20);
    expect(json.result.materials[1].qty).toBeGreaterThan(3);
  });
});