import { POST as schedulerHandler } from '../app/api/scheduler/route';

describe('Scheduler API', () => {
  it('generates schedule text', async () => {
    const req = new Request('http://localhost/api/scheduler', { method: 'POST', body: JSON.stringify({ jobs: 'a,b' }) });
    const res = await schedulerHandler(req);
    const json = await res.json();
    expect(json.schedule).toContain('a, b');
  });
});
