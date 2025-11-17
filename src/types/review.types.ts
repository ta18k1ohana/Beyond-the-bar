/**
 * Review types for Beyond The Bar
 * Based on PRD Section 5.2
 */

export type ReviewTier = 'tier1' | 'tier2' | 'tier3';

export type RelationshipType =
  | 'colleague'
  | 'manager'
  | 'owner'
  | 'industry_peer'
  | 'customer';

export interface WorkplacePeriod {
  start: Date;
  end?: Date;
}

export interface Relationship {
  type: RelationshipType;
  workplace: string;
  workplacePeriod: WorkplacePeriod;
  verified: boolean;
}

export interface Review {
  id: string;

  // Parties
  reviewerId: string;
  revieweeId: string;

  // Relationship
  tier: ReviewTier;
  relationship: Relationship;

  // Content
  starRating: number; // 1-5
  badgeTags: string[]; // max 5 badge IDs
  comment?: string; // max 500 chars

  // Metadata
  isVisible: boolean;
  flagCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewFormData {
  relationshipType: RelationshipType;
  workplace: string;
  workplacePeriod: WorkplacePeriod;
  starRating: number;
  badgeTags: string[];
  comment?: string;
}
