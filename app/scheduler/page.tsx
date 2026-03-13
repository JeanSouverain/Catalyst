"use client";

import React, { useState } from 'react';
import { Button } from '@/app/ui/button';
import FeatureLinks from '@/app/ui/feature-links';
import CatalystLogo from '@/app/ui/catalyst-logo';

interface Job {
  id: string;
  name: string;
  duration: number; // in days
  crewSize: number;
  priority: 'low' | 'medium' | 'high';
  dependencies: string[]; // job IDs this depends on
  location: string;
  startDate?: string;
}

interface Crew {
  id: string;
  name: string;
  size: number;
  skills: string[];
  availability: string[]; // days available
}

interface ScheduleResult {
  schedule: string;
  jobs: Job[];
  crews: Crew[];
  warnings: string[];
}

export default function SchedulerPage() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      name: 'Foundation Pour',
      duration: 2,
      crewSize: 4,
      priority: 'high',
      dependencies: [],
      location: '123 Main St'
    }
  ]);

  const [crews, setCrews] = useState<Crew[]>([
    {
      id: 'crew1',
      name: 'Concrete Crew A',
      size: 4,
      skills: ['concrete', 'forming'],
      availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }
  ]);

  const [constraints, setConstraints] = useState({
    weatherConsiderations: true,
    equipmentAvailability: true,
    subcontractorLeadTime: 3, // days
    startDate: '',
    endDate: ''
  });

  const [schedule, setSchedule] = useState<ScheduleResult | null>(null);
  const [loading, setLoading] = useState(false);

  const addJob = () => {
    const newJob: Job = {
      id: Date.now().toString(),
      name: '',
      duration: 1,
      crewSize: 2,
      priority: 'medium',
      dependencies: [],
      location: ''
    };
    setJobs([...jobs, newJob]);
  };

  const updateJob = (id: string, field: keyof Job, value: any) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  const removeJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const addCrew = () => {
    const newCrew: Crew = {
      id: Date.now().toString(),
      name: '',
      size: 2,
      skills: [],
      availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    };
    setCrews([...crews, newCrew]);
  };

  const updateCrew = (id: string, field: keyof Crew, value: any) => {
    setCrews(crews.map(crew =>
      crew.id === id ? { ...crew, [field]: value } : crew
    ));
  };

  const removeCrew = (id: string) => {
    setCrews(crews.filter(crew => crew.id !== id));
  };

  const generateSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs, crews, constraints }),
      });
      const data = await res.json();
      setSchedule(data);
    } catch (error) {
      console.error('Error generating schedule:', error);
      setSchedule({
        schedule: 'Error generating schedule. Please try again.',
        jobs: [],
        crews: [],
        warnings: ['Failed to generate schedule']
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <CatalystLogo />
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Scheduling Assistant</h1>
        <p className="text-gray-600">Automatically optimize crew schedules, job timelines, and resource allocation</p>
      </div>

      <FeatureLinks />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jobs Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Jobs</h2>
            <Button onClick={addJob} className="bg-blue-600 hover:bg-blue-700">
              Add Job
            </Button>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded p-4 space-y-3">
                <div className="flex justify-between">
                  <input
                    type="text"
                    placeholder="Job name"
                    value={job.name}
                    onChange={(e) => updateJob(job.id, 'name', e.target.value)}
                    className="flex-1 mr-2 px-3 py-2 border rounded"
                  />
                  <Button
                    onClick={() => removeJob(job.id)}
                    className="bg-red-600 hover:bg-red-700 px-3"
                  >
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                    <input
                      type="number"
                      value={job.duration}
                      onChange={(e) => updateJob(job.id, 'duration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crew Size</label>
                    <input
                      type="number"
                      value={job.crewSize}
                      onChange={(e) => updateJob(job.id, 'crewSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={job.priority}
                      onChange={(e) => updateJob(job.id, 'priority', e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="Job location"
                      value={job.location}
                      onChange={(e) => updateJob(job.id, 'location', e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crews Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Crews</h2>
            <Button onClick={addCrew} className="bg-green-600 hover:bg-green-700">
              Add Crew
            </Button>
          </div>

          <div className="space-y-4">
            {crews.map((crew) => (
              <div key={crew.id} className="border rounded p-4 space-y-3">
                <div className="flex justify-between">
                  <input
                    type="text"
                    placeholder="Crew name"
                    value={crew.name}
                    onChange={(e) => updateCrew(crew.id, 'name', e.target.value)}
                    className="flex-1 mr-2 px-3 py-2 border rounded"
                  />
                  <Button
                    onClick={() => removeCrew(crew.id)}
                    className="bg-red-600 hover:bg-red-700 px-3"
                  >
                    ×
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crew Size</label>
                  <input
                    type="number"
                    value={crew.size}
                    onChange={(e) => updateCrew(crew.id, 'size', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="concrete, forming, finishing"
                    value={crew.skills.join(', ')}
                    onChange={(e) => updateCrew(crew.id, 'skills', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Constraints Section */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Schedule Constraints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={constraints.weatherConsiderations}
                onChange={(e) => setConstraints({...constraints, weatherConsiderations: e.target.checked})}
                className="mr-2"
              />
              Weather Considerations
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={constraints.equipmentAvailability}
                onChange={(e) => setConstraints({...constraints, equipmentAvailability: e.target.checked})}
                className="mr-2"
              />
              Equipment Availability
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcontractor Lead Time (days)</label>
            <input
              type="number"
              value={constraints.subcontractorLeadTime}
              onChange={(e) => setConstraints({...constraints, subcontractorLeadTime: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Start Date</label>
            <input
              type="date"
              value={constraints.startDate}
              onChange={(e) => setConstraints({...constraints, startDate: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-8 text-center">
        <Button
          onClick={generateSchedule}
          disabled={loading || jobs.length === 0 || crews.length === 0}
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg"
        >
          {loading ? 'Generating AI Schedule...' : 'Generate AI Schedule'}
        </Button>
      </div>

      {/* Results */}
      {schedule && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Schedule</h2>

          {schedule.warnings && schedule.warnings.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
              <h3 className="font-medium text-yellow-800">Warnings:</h3>
              <ul className="list-disc list-inside text-yellow-700">
                {schedule.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded border">
            <pre className="whitespace-pre-wrap font-mono text-sm">{schedule.schedule}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
