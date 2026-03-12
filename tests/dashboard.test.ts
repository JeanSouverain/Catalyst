import { GET as dashboardHandler } from '../app/api/dashboard/route';

describe('Dashboard API', () => {
  it('returns stats object with counts', async () => {
    const res = await dashboardHandler();
    const json = await res.json();
    expect(json).toHaveProperty('estimatesCount');
    expect(json).toHaveProperty('lastEstimate');
  });
});
