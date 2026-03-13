import { POST as schedulerHandler } from '../app/api/scheduler/route';

describe('Scheduler API', () => {
  it('generates basic schedule with job list', async () => {
    const req = new Request('http://localhost/api/scheduler', {
      method: 'POST',
      body: JSON.stringify({
        jobs: 'Foundation work, Framing, Electrical'
      })
    });
    const res = await schedulerHandler(req);
    const json = await res.json();
    expect(json.schedule).toBeDefined();
    expect(typeof json.schedule).toBe('string');
  });

  it('generates AI schedule with structured job data', async () => {
    const jobs = [
      {
        id: '1',
        name: 'Foundation Pour',
        duration: 2,
        crewSize: 4,
        priority: 'high',
        dependencies: [],
        location: '123 Main St'
      },
      {
        id: '2',
        name: 'Framing',
        duration: 3,
        crewSize: 3,
        priority: 'medium',
        dependencies: ['1'],
        location: '123 Main St'
      }
    ];

    const crews = [
      {
        id: 'crew1',
        name: 'Concrete Crew',
        size: 4,
        skills: ['concrete', 'foundation'],
        availability: ['monday', 'tuesday', 'wednesday']
      }
    ];

    const constraints = {
      weatherConsiderations: true,
      equipmentAvailability: true,
      subcontractorLeadTime: 2,
      startDate: '2024-01-15',
      endDate: ''
    };

    const req = new Request('http://localhost/api/scheduler', {
      method: 'POST',
      body: JSON.stringify({ jobs, crews, constraints })
    });

    const res = await schedulerHandler(req);
    const json = await res.json();

    expect(json.schedule).toBeDefined();
    expect(json.jobs).toEqual(jobs);
    expect(json.crews).toEqual(crews);
    expect(Array.isArray(json.warnings)).toBe(true);
  });

  it('handles empty job list', async () => {
    const req = new Request('http://localhost/api/scheduler', {
      method: 'POST',
      body: JSON.stringify({ jobs: [], crews: [], constraints: {} })
    });

    const res = await schedulerHandler(req);
    const json = await res.json();

    expect(json.schedule).toContain('No jobs provided');
    expect(json.warnings).toBeDefined();
  });

  it('generates fallback schedule when AI fails', async () => {
    // Mock OpenAI to fail
    const originalEnv = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const jobs = [
      {
        id: '1',
        name: 'Test Job',
        duration: 1,
        crewSize: 2,
        priority: 'medium',
        dependencies: [],
        location: 'Test Location'
      }
    ];

    const req = new Request('http://localhost/api/scheduler', {
      method: 'POST',
      body: JSON.stringify({ jobs, crews: [], constraints: {} })
    });

    const res = await schedulerHandler(req);
    const json = await res.json();

    expect(json.schedule).toContain('FALLBACK SCHEDULE');
    expect(json.warnings).toContain('Using fallback scheduling - OpenAI API key not configured');

    // Restore env
    process.env.OPENAI_API_KEY = originalEnv;
  });
});
