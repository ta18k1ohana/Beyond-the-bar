/**
 * Badge types for Beyond The Bar
 * Based on PRD Section 5.3
 */

export type BadgeCategory =
  | 'technique'
  | 'speed'
  | 'service'
  | 'teamwork'
  | 'knowledge'
  | 'special'
  | 'personality'
  | 'legendary';

export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'legendary';

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface BadgeLevelConfig {
  threshold: number;
  emoji: string;
}

export interface BadgeLevels {
  bronze: BadgeLevelConfig;
  silver: BadgeLevelConfig;
  gold: BadgeLevelConfig;
}

export interface SpecialRequirements {
  requiredBadges: string[];
  minExperience: number;
  minReviewCount: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  category: BadgeCategory;
  description: string;
  levels: BadgeLevels;
  rarity: BadgeRarity;
  tier1Weight: number;
  specialRequirements?: SpecialRequirements;
}
