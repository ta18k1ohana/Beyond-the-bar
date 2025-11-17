/**
 * User types for Beyond The Bar
 * Based on PRD Section 5.1
 */

export type UserType = 'barista' | 'employer';

export interface Location {
  city: string;
  state: string;
  country: string;
}

export interface Workplace {
  cafeId: string;
  cafeName: string;
  position: string;
  startDate: Date;
  current: boolean;
}

export interface WorkHistory {
  cafeId: string;
  cafeName: string;
  position: string;
  startDate: Date;
  endDate: Date;
}

export interface UserBadge {
  badgeId: string;
  level: 'bronze' | 'silver' | 'gold' | 'legendary';
  tagCount: number;
  earnedDate: Date;
}

export interface Certification {
  type: string;
  level: string;
  issueDate: Date;
  expiryDate?: Date;
}

export interface PrivacySettings {
  showAverageRating: boolean;
  acceptTier3Reviews: boolean;
  showReviewCount: boolean;
}

export interface User {
  id: string;
  type: UserType;

  // Basic Info
  name: string;
  email: string;
  profilePhoto?: string;
  location: Location;

  // Barista-specific
  currentWorkplace?: Workplace;
  workHistory: WorkHistory[];

  // Badges & Recognition
  badges: UserBadge[];
  certifications: Certification[];

  // Stats
  reviewCount: number;
  averageRating: number;
  tier1ReviewCount: number;

  // Settings
  privacySettings: PrivacySettings;

  // Social
  bio?: string;
  coffeePhilosophy?: string;
  portfolio: string[];

  createdAt: Date;
  updatedAt: Date;
}
