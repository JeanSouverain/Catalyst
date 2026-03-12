import { GET as caseStudyHandler } from '../app/api/case-study/route';

describe('Case Study API', () => {
  it('returns a plain text summary', async () => {
    const res = await caseStudyHandler();
    const text = await res.text();
    expect(text).toMatch(/Pilot Case Study/);
  });
});
