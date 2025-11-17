/**
 * Job types for Beyond The Bar
 * Based on PRD Section 5.4
 */

export type PositionType =
  | 'barista'
  | 'lead_barista'
  | 'shift_supervisor'
  | 'manager';

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'casual';

export type JobStatus = 'active' | 'filled' | 'closed';

export type ShiftType = 'opening' | 'mid' | 'closing' | 'weekend';

export interface JobLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PayRate {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'salary';
}

export interface HoursPerWeek {
  min: number;
  max: number;
}

export interface JobPosting {
  id: string;
  employerId: string;

  // Job Details
  title: string;
  cafeId: string;
  cafeName: string;
  location: JobLocation;

  // Position
  positionType: PositionType;
  employmentType: EmploymentType;

  // Compensation
  payRate: PayRate;
  benefits: string[];

  // Requirements
  requiredBadges: string[];
  minExperience: number; // months
  requiredSkills: string[];

  // Schedule
  shiftTypes: ShiftType[];
  hoursPerWeek: HoursPerWeek;

  // Description
  description: string; // max 2000 chars

  // Status
  status: JobStatus;
  applications: number;

  createdAt: Date;
  expiresAt: Date;
}
