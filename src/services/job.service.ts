/**
 * Job Service
 * Handles job posting CRUD operations and search functionality
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { JobPosting, JobStatus, PositionType, EmploymentType } from '../types';

const JOBS_COLLECTION = 'jobs';

// Helper to convert Firestore document to JobPosting
const docToJobPosting = (id: string, data: DocumentData): JobPosting => ({
  id,
  employerId: data.employerId,
  title: data.title,
  cafeId: data.cafeId,
  cafeName: data.cafeName,
  location: data.location,
  positionType: data.positionType,
  employmentType: data.employmentType,
  payRate: data.payRate,
  benefits: data.benefits || [],
  requiredBadges: data.requiredBadges || [],
  minExperience: data.minExperience || 0,
  requiredSkills: data.requiredSkills || [],
  shiftTypes: data.shiftTypes || [],
  hoursPerWeek: data.hoursPerWeek,
  description: data.description,
  status: data.status,
  applications: data.applications || 0,
  createdAt: data.createdAt?.toDate() || new Date(),
  expiresAt: data.expiresAt?.toDate() || new Date()
});

/**
 * Create a new job posting (employers only)
 */
export const createJobPosting = async (
  employerId: string,
  jobData: Omit<JobPosting, 'id' | 'employerId' | 'applications' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      employerId,
      ...jobData,
      applications: 0,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(jobData.expiresAt)
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating job posting:', error);
    throw error;
  }
};

/**
 * Get a single job posting by ID
 */
export const getJobPosting = async (jobId: string): Promise<JobPosting | null> => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docToJobPosting(docSnap.id, docSnap.data());
    }

    return null;
  } catch (error) {
    console.error('Error getting job posting:', error);
    throw error;
  }
};

/**
 * Get all active job postings with optional filters
 */
export interface JobFilters {
  status?: JobStatus;
  positionType?: PositionType;
  employmentType?: EmploymentType;
  city?: string;
  state?: string;
  employerId?: string;
  requiredBadges?: string[];
  maxResults?: number;
}

export const getJobPostings = async (filters: JobFilters = {}): Promise<JobPosting[]> => {
  try {
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    } else {
      // Default to active jobs
      constraints.push(where('status', '==', 'active'));
    }

    if (filters.positionType) {
      constraints.push(where('positionType', '==', filters.positionType));
    }

    if (filters.employmentType) {
      constraints.push(where('employmentType', '==', filters.employmentType));
    }

    if (filters.city) {
      constraints.push(where('location.city', '==', filters.city));
    }

    if (filters.state) {
      constraints.push(where('location.state', '==', filters.state));
    }

    if (filters.employerId) {
      constraints.push(where('employerId', '==', filters.employerId));
    }

    // Sort by creation date (newest first)
    constraints.push(orderBy('createdAt', 'desc'));

    if (filters.maxResults) {
      constraints.push(limit(filters.maxResults));
    }

    const q = query(collection(db, JOBS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);

    let jobs = querySnapshot.docs.map(doc => docToJobPosting(doc.id, doc.data()));

    // Client-side filtering for badge requirements (can't efficiently query arrays)
    if (filters.requiredBadges && filters.requiredBadges.length > 0) {
      jobs = jobs.filter(job => {
        // Check if job requires any of the specified badges
        return job.requiredBadges.some(badge => filters.requiredBadges!.includes(badge));
      });
    }

    return jobs;
  } catch (error) {
    console.error('Error getting job postings:', error);
    throw error;
  }
};

/**
 * Update a job posting
 */
export const updateJobPosting = async (
  jobId: string,
  updates: Partial<Omit<JobPosting, 'id' | 'employerId' | 'createdAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, jobId);

    // Convert Date to Timestamp if expiresAt is being updated
    const updateData: any = { ...updates };
    if (updates.expiresAt) {
      updateData.expiresAt = Timestamp.fromDate(updates.expiresAt);
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating job posting:', error);
    throw error;
  }
};

/**
 * Close a job posting (mark as filled or closed)
 */
export const closeJobPosting = async (
  jobId: string,
  status: 'filled' | 'closed'
): Promise<void> => {
  try {
    await updateJobPosting(jobId, { status });
  } catch (error) {
    console.error('Error closing job posting:', error);
    throw error;
  }
};

/**
 * Delete a job posting (hard delete - use cautiously)
 */
export const deleteJobPosting = async (jobId: string): Promise<void> => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting job posting:', error);
    throw error;
  }
};

/**
 * Increment application count for a job
 */
export const incrementApplicationCount = async (jobId: string): Promise<void> => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentCount = docSnap.data().applications || 0;
      await updateDoc(docRef, { applications: currentCount + 1 });
    }
  } catch (error) {
    console.error('Error incrementing application count:', error);
    throw error;
  }
};

/**
 * Get job postings by employer
 */
export const getEmployerJobPostings = async (employerId: string): Promise<JobPosting[]> => {
  return getJobPostings({ employerId });
};

/**
 * Search jobs by keyword (searches title, description, cafe name)
 */
export const searchJobPostings = async (
  keyword: string,
  filters: JobFilters = {}
): Promise<JobPosting[]> => {
  try {
    // Get all jobs matching the filters
    const jobs = await getJobPostings(filters);

    // Client-side search across title, description, and cafe name
    const searchTerm = keyword.toLowerCase();
    return jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.cafeName.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching job postings:', error);
    throw error;
  }
};

/**
 * Get recommended jobs based on user's badges and experience
 */
export const getRecommendedJobs = async (
  userBadgeIds: string[],
  userExperienceMonths: number,
  userCity?: string
): Promise<JobPosting[]> => {
  try {
    const filters: JobFilters = {
      status: 'active',
      maxResults: 50
    };

    // Prioritize local jobs
    if (userCity) {
      filters.city = userCity;
    }

    const jobs = await getJobPostings(filters);

    // Score jobs based on badge match and experience fit
    const scoredJobs = jobs.map(job => {
      let score = 0;

      // Score for badge matches
      const badgeMatches = job.requiredBadges.filter(badgeId =>
        userBadgeIds.includes(badgeId)
      );
      score += badgeMatches.length * 10;

      // Score for experience fit (prefer jobs matching experience level)
      const experienceDiff = Math.abs(job.minExperience - userExperienceMonths);
      if (experienceDiff <= 6) score += 5; // Within 6 months
      else if (experienceDiff <= 12) score += 3; // Within 1 year
      else if (experienceDiff <= 24) score += 1; // Within 2 years

      // Bonus for meeting all badge requirements
      if (job.requiredBadges.length > 0 &&
          badgeMatches.length === job.requiredBadges.length) {
        score += 15;
      }

      return { job, score };
    });

    // Sort by score and return top jobs
    return scoredJobs
      .sort((a, b) => b.score - a.score)
      .map(item => item.job)
      .slice(0, 20);
  } catch (error) {
    console.error('Error getting recommended jobs:', error);
    throw error;
  }
};
