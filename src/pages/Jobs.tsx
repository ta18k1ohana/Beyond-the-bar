import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/userStore';
import {
  getJobPostings,
  searchJobPostings,
  getRecommendedJobs,
  createJobPosting,
  closeJobPosting,
  type JobFilters as ServiceJobFilters
} from '../services/job.service';
import { JobCard, JobFilters, PostJobForm, type JobFilterOptions } from '../components/jobs';
import type { JobPosting, PositionType, EmploymentType } from '../types';

export const Jobs = () => {
  const { user } = useAuth();
  const { userProfile } = useUserStore();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');

  // Filter state
  const [filters, setFilters] = useState<JobFilterOptions>({
    search: '',
    positionType: 'all',
    employmentType: 'all',
    city: '',
    state: ''
  });

  // Load jobs
  useEffect(() => {
    loadJobs();
  }, [filters, activeTab, userProfile]);

  const loadJobs = async () => {
    try {
      setLoading(true);

      if (activeTab === 'recommended' && user && userProfile) {
        // Load recommended jobs based on user's badges and experience
        const userBadgeIds = userProfile.badges.map(b => b.badgeId);
        const totalExperience = calculateTotalExperience();
        const recommended = await getRecommendedJobs(
          userBadgeIds,
          totalExperience,
          userProfile.location?.city
        );
        setJobs(recommended);
      } else {
        // Load all jobs with filters
        const serviceFilters: ServiceJobFilters = {
          status: 'active'
        };

        if (filters.positionType !== 'all') {
          serviceFilters.positionType = filters.positionType as PositionType;
        }

        if (filters.employmentType !== 'all') {
          serviceFilters.employmentType = filters.employmentType as EmploymentType;
        }

        if (filters.city) {
          serviceFilters.city = filters.city;
        }

        if (filters.state) {
          serviceFilters.state = filters.state;
        }

        let fetchedJobs: JobPosting[];

        if (filters.search) {
          fetchedJobs = await searchJobPostings(filters.search, serviceFilters);
        } else {
          fetchedJobs = await getJobPostings(serviceFilters);
        }

        setJobs(fetchedJobs);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalExperience = (): number => {
    if (!userProfile?.workHistory) return 0;

    let totalMonths = 0;
    userProfile.workHistory.forEach(work => {
      const start = new Date(work.startDate);
      const end = new Date(work.endDate);
      const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
      totalMonths += months;
    });

    return totalMonths;
  };

  const handlePostJob = async (
    jobData: Omit<JobPosting, 'id' | 'employerId' | 'applications' | 'createdAt'>
  ) => {
    if (!user) return;

    try {
      await createJobPosting(user.uid, jobData);
      setShowPostForm(false);
      loadJobs();
    } catch (error) {
      console.error('Error posting job:', error);
      throw error;
    }
  };

  const handleCloseJob = async (jobId: string) => {
    try {
      await closeJobPosting(jobId, 'closed');
      loadJobs();
    } catch (error) {
      console.error('Error closing job:', error);
    }
  };

  const handleApply = (_jobId: string) => {
    // TODO: Implement application flow in future
    alert('Application feature coming soon! For now, please contact the employer directly.');
  };

  const isEmployer = userProfile?.type === 'employer';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-coffee-primary)] font-heading mb-2">
            Job Board
          </h1>
          <p className="text-gray-600">
            {isEmployer
              ? 'Post positions and find talented baristas'
              : 'Find your next coffee career opportunity'}
          </p>
        </div>

        {isEmployer && !showPostForm && (
          <button
            onClick={() => setShowPostForm(true)}
            className="bg-[var(--color-coffee-accent)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            + Post a Job
          </button>
        )}
      </div>

      {/* Post Job Form */}
      {showPostForm && isEmployer && userProfile && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-coffee-primary)] font-heading mb-6">
            Post a New Job
          </h2>
          <PostJobForm
            employerId={user!.uid}
            cafeId={user!.uid} // TODO: Link to actual cafe entity
            cafeName={userProfile.name}
            onSubmit={handlePostJob}
            onCancel={() => setShowPostForm(false)}
          />
        </div>
      )}

      {!showPostForm && (
        <>
          {/* Tabs (for baristas) */}
          {!isEmployer && user && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[var(--color-coffee-accent)] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => setActiveTab('recommended')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'recommended'
                    ? 'bg-[var(--color-coffee-accent)] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Recommended for You
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {activeTab !== 'recommended' && (
              <div className="lg:col-span-1">
                <JobFilters filters={filters} onFilterChange={setFilters} />
              </div>
            )}

            {/* Job Listings */}
            <div className={activeTab === 'recommended' ? 'lg:col-span-4' : 'lg:col-span-3'}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-xl text-gray-600">Loading jobs...</div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <div className="text-5xl mb-3">💼</div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    {activeTab === 'recommended'
                      ? 'No recommended jobs yet'
                      : 'No jobs found'}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'recommended'
                      ? 'Complete your profile and earn more badges to get personalized recommendations!'
                      : filters.search || filters.city || filters.state
                      ? 'Try adjusting your filters to see more results.'
                      : 'Check back soon for new opportunities!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Results count */}
                  <div className="text-sm text-gray-600 mb-4">
                    {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
                    {activeTab === 'recommended' && ' - sorted by relevance'}
                  </div>

                  {/* Job cards */}
                  {jobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={handleApply}
                      showEmployerActions={isEmployer}
                      onClose={handleCloseJob}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
