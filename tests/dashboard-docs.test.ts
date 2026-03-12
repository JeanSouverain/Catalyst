import { GET as dashboardHandler } from '../app/api/dashboard/route';

describe('Dashboard docs count', () => {
  it('returns docsCount property', async () => {
    const res = await dashboardHandler();
    const json = await res.json();
    expect(json).toHaveProperty('docsCount');
    expect(typeof json.docsCount).toBe('number');
  });
});