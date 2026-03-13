import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI only when API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface Job {
  id: string;
  name: string;
  duration: number;
  crewSize: number;
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[];
  location: string;
  startDate?: string;
}

interface Crew {
  id: string;
  name: string;
  size: number;
  skills: string[];
  availability: string[];
}

interface Constraints {
  weatherConsiderations: boolean;
  equipmentAvailability: boolean;
  subcontractorLeadTime: number;
  startDate: string;
  endDate: string;
}

export async function POST(req: Request) {
  let requestData: { jobs: Job[], crews: Crew[], constraints: Constraints };

  try {
    requestData = await req.json();
    let { jobs, crews, constraints } = requestData;

    // Normalize inputs for backward compatibility (string job list vs structured job objects)
    if (typeof jobs === 'string') {
      const jobLines = jobs.split(/[\n,]+/).map((j: string) => j.trim()).filter(Boolean);
      jobs = jobLines.map((name: string, index: number) => ({
        id: `${index + 1}`,
        name,
        duration: 1,
        crewSize: 1,
        priority: 'medium' as const,
        location: '',
        dependencies: [],
      }));
    }

    if (!Array.isArray(jobs)) {
      jobs = [];
    }

    if (!Array.isArray(crews)) {
      crews = [];
    }

    if (!constraints || typeof constraints !== 'object') {
      constraints = {
        weatherConsiderations: false,
        equipmentAvailability: false,
        subcontractorLeadTime: 0,
        startDate: '',
        endDate: '',
      };
    }

    if (!openai) {
      // Fallback response if no API key
      return NextResponse.json({
        schedule: generateFallbackSchedule(jobs, crews, constraints),
        jobs,
        crews,
        warnings: ['Using fallback scheduling - OpenAI API key not configured']
      });
    }

    // Create a comprehensive prompt for the AI
    const prompt = createSchedulingPrompt(jobs, crews, constraints);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert construction project scheduler. Create detailed, realistic schedules that consider crew availability, job dependencies, weather, and resource constraints. Provide practical timelines and clear assignments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const schedule = completion.choices[0]?.message?.content || 'Unable to generate schedule';

    // Analyze for potential issues
    const warnings = analyzeScheduleForIssues(jobs, crews, constraints);

    return NextResponse.json({
      schedule,
      jobs,
      crews,
      warnings
    });

  } catch (error) {
    console.error('Error in scheduler API:', error);

    // Use the already parsed data or defaults
    const { jobs = [], crews = [], constraints = {} } = requestData || {};

    return NextResponse.json({
      schedule: generateFallbackSchedule(jobs, crews, constraints),
      jobs,
      crews,
      warnings: ['Error occurred, using basic scheduling algorithm']
    });
  }
}

function createSchedulingPrompt(jobs: Job[], crews: Crew[], constraints: Constraints): string {
  return `
Create a detailed construction schedule for the following project:

JOBS:
${jobs.map(job => `
- ${job.name} (ID: ${job.id})
  Duration: ${job.duration} days
  Crew Size Needed: ${job.crewSize}
  Priority: ${job.priority}
  Location: ${job.location}
  Dependencies: ${job.dependencies.length > 0 ? job.dependencies.join(', ') : 'None'}
  ${job.startDate ? `Must start by: ${job.startDate}` : ''}
`).join('')}

CREWS AVAILABLE:
${crews.map(crew => `
- ${crew.name} (ID: ${crew.id})
  Size: ${crew.size} workers
  Skills: ${crew.skills.join(', ')}
  Available Days: ${crew.availability.join(', ')}
`).join('')}

CONSTRAINTS:
- Weather Considerations: ${constraints.weatherConsiderations ? 'Yes - avoid scheduling outdoor work during bad weather' : 'No'}
- Equipment Availability: ${constraints.equipmentAvailability ? 'Yes - consider equipment scheduling conflicts' : 'No'}
- Subcontractor Lead Time: ${constraints.subcontractorLeadTime} days
- Project Start Date: ${constraints.startDate || 'As soon as possible'}
- Project End Date: ${constraints.endDate || 'No specific deadline'}

Please create a detailed schedule that includes:
1. Day-by-day breakdown of work
2. Crew assignments to specific jobs
3. Consideration of job dependencies (jobs with dependencies cannot start until their prerequisites are complete)
4. Weather-appropriate scheduling (avoid outdoor concrete work in rain, etc.)
5. Equipment and resource conflicts
6. Realistic work pacing (don't over-assign crews)
7. Any potential bottlenecks or delays
8. Total project duration estimate

Format the response as a clear, professional schedule that a construction manager could use.
`;
}

function generateFallbackSchedule(jobs: Job[], crews: Crew[], constraints: Constraints): string {
  if (!jobs || jobs.length === 0) return 'No jobs provided for scheduling.';

  let schedule = 'FALLBACK SCHEDULE (Basic Algorithm)\n\n';
  schedule += `Project Overview: ${jobs.length} jobs, ${crews?.length || 0} crews available\n\n`;

  // Sort jobs by priority and dependencies
  const sortedJobs = [...jobs].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  let currentDay = 1;
  const assignedJobs = new Set<string>();

  for (const job of sortedJobs) {
    // Check dependencies
const deps = job.dependencies ?? [];
  const hasUnmetDeps = deps.some(depId => !assignedJobs.has(depId));
  if (hasUnmetDeps) {
    schedule += `Day ${currentDay}: ${job.name} - DELAYED (waiting for dependencies: ${deps.join(', ')})\n`;
      currentDay++;
      continue;
    }

    // Find suitable crew
const crewList = crews || [];
  const suitableCrew = crewList.find(crew =>
    crew.size >= job.crewSize &&
    crew.skills.some(skill => job.name.toLowerCase().includes(skill.toLowerCase()))
  ) || crewList[0];

    schedule += `Day ${currentDay}-${currentDay + job.duration - 1}: ${job.name}\n`;
    schedule += `  - Assigned Crew: ${suitableCrew?.name || 'No crew available'}\n`;
    schedule += `  - Location: ${job.location}\n`;
    schedule += `  - Duration: ${job.duration} days\n\n`;

    assignedJobs.add(job.id);
    currentDay += job.duration;
  }

  schedule += `Total Estimated Duration: ${currentDay - 1} days\n`;
  schedule += `Note: This is a basic schedule. For optimal results, configure OpenAI API key.`;

  return schedule;
}

function analyzeScheduleForIssues(jobs: Job[], crews: Crew[], constraints: Constraints): string[] {
  const warnings: string[] = [];

  // Check for crew capacity issues
  const totalCrewCapacity = crews.reduce((sum, crew) => sum + crew.size, 0);
  const maxCrewNeeded = Math.max(...jobs.map(job => job.crewSize));

  if (maxCrewNeeded > totalCrewCapacity) {
    warnings.push(`Crew capacity issue: Largest job needs ${maxCrewNeeded} workers, but total available is ${totalCrewCapacity}`);
  }

  // Check for dependency cycles (simplified check)
  const jobMap = new Map(jobs.map(job => [job.id, job]));
  for (const job of jobs) {
    for (const depId of job.dependencies) {
      const depJob = jobMap.get(depId);
      if (depJob && depJob.dependencies.includes(job.id)) {
        warnings.push(`Circular dependency detected between ${job.name} and ${depJob.name}`);
      }
    }
  }

  // Check for weather constraints without start date
  if (constraints.weatherConsiderations && !constraints.startDate) {
    warnings.push('Weather considerations enabled but no start date specified - weather optimization may be limited');
  }

  // Check for high priority jobs with long durations
  const highPriorityLongJobs = jobs.filter(job => job.priority === 'high' && job.duration > 5);
  if (highPriorityLongJobs.length > 0) {
    warnings.push(`High priority jobs with long durations: ${highPriorityLongJobs.map(j => j.name).join(', ')}`);
  }

  return warnings;
}
