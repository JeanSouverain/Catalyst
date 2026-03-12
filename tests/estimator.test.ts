import { POST as estimatorHandler } from '../app/api/estimator/route';

describe('Estimator API', () => {
  it('returns error when missing dataUrl', async () => {
    const req = new Request('http://localhost/api/estimator', { method: 'POST', body: JSON.stringify({}) });
    const res = await estimatorHandler(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe('Missing dataUrl');
  });
});
