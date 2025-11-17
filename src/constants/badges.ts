import type { Badge } from '../types';

/**
 * Badge definitions for Beyond The Bar
 * Based on PRD Section 3.3
 */

export const BADGES: Badge[] = [
  // TECHNIQUE (9 badges)
  {
    id: 'latte_art_wizard',
    name: 'Latte Art Wizard',
    emoji: '🧙‍♂️',
    category: 'technique',
    description: 'Mastery of latte art from rosettas to swans',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'espresso_alchemist',
    name: 'Espresso Alchemist',
    emoji: '⚗️',
    category: 'technique',
    description: 'Perfect extraction through precise control of variables',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'pour_over_perfectionist',
    name: 'Pour Over Perfectionist',
    emoji: '💧',
    category: 'technique',
    description: 'Artisan-level manual brewing',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'milk_maestro',
    name: 'Milk Maestro',
    emoji: '🥛',
    category: 'technique',
    description: 'Perfect microfoam texture and temperature',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'bean_whisperer',
    name: 'Bean Whisperer',
    emoji: '🌱',
    category: 'technique',
    description: 'Deep knowledge of origins and flavor profiles',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'grind_guru',
    name: 'Grind Guru',
    emoji: '⚙️',
    category: 'technique',
    description: 'Expert grinder calibration and troubleshooting',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },

  // SPEED & EFFICIENCY (4 badges)
  {
    id: 'rush_hour_hero',
    name: 'Rush Hour Hero',
    emoji: '🦸',
    category: 'speed',
    description: 'Thrives during peak hours',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'flow_state_master',
    name: 'Flow State Master',
    emoji: '🌊',
    category: 'speed',
    description: 'Efficient, waste-free movement',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'multi_order_juggler',
    name: 'Multi-Order Juggler',
    emoji: '🤹',
    category: 'speed',
    description: 'Handles multiple orders flawlessly',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'setup_sorcerer',
    name: 'Setup Sorcerer',
    emoji: '🔧',
    category: 'speed',
    description: 'Perfect opening/closing procedures',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },

  // CUSTOMER SERVICE (5 badges)
  {
    id: 'regular_whisperer',
    name: 'Regular Whisperer',
    emoji: '☕',
    category: 'service',
    description: 'Remembers names and orders',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'first_timers_friend',
    name: "First Timer's Friend",
    emoji: '👋',
    category: 'service',
    description: 'Excellent at guiding newcomers',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'vibe_curator',
    name: 'Vibe Curator',
    emoji: '✨',
    category: 'service',
    description: 'Creates welcoming atmosphere',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'problem_solver',
    name: 'Problem Solver',
    emoji: '🛠️',
    category: 'service',
    description: 'Expert conflict resolution',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'mood_lifter',
    name: 'Mood Lifter',
    emoji: '🌞',
    category: 'service',
    description: 'Positive energy that uplifts everyone',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },

  // TEAMWORK (5 badges)
  {
    id: 'new_hire_mentor',
    name: 'New Hire Mentor',
    emoji: '🎓',
    category: 'teamwork',
    description: 'Exceptional at training new team members',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'shift_coordinator',
    name: 'Shift Coordinator',
    emoji: '📋',
    category: 'teamwork',
    description: 'Strong leadership during shifts',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'silent_communicator',
    name: 'Silent Communicator',
    emoji: '🤫',
    category: 'teamwork',
    description: 'Perfect bar communication and teamwork',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'barback_guardian_angel',
    name: 'Barback Guardian Angel',
    emoji: '👼',
    category: 'teamwork',
    description: 'Excellent support work',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'conflict_mediator',
    name: 'Conflict Mediator',
    emoji: '⚖️',
    category: 'teamwork',
    description: 'Maintains team harmony',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },

  // KNOWLEDGE (5 badges)
  {
    id: 'origin_storyteller',
    name: 'Origin Storyteller',
    emoji: '🗺️',
    category: 'knowledge',
    description: 'Expert on coffee origins and stories',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'brewing_method_encyclopedia',
    name: 'Brewing Method Encyclopedia',
    emoji: '📚',
    category: 'knowledge',
    description: 'Mastery of multiple brew methods',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'roast_profile_decoder',
    name: 'Roast Profile Decoder',
    emoji: '🔬',
    category: 'knowledge',
    description: 'Deep understanding of roasting',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'rare',
    tier1Weight: 2.0
  },
  {
    id: 'equipment_technician',
    name: 'Equipment Technician',
    emoji: '🔨',
    category: 'knowledge',
    description: 'Can maintain and repair machines',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'rare',
    tier1Weight: 2.0
  },
  {
    id: 'sca_certified_pro',
    name: 'SCA Certified Pro',
    emoji: '🏆',
    category: 'knowledge',
    description: 'Auto-awarded for certifications',
    levels: {
      bronze: { threshold: 1, emoji: '🥉' },
      silver: { threshold: 2, emoji: '🥈' },
      gold: { threshold: 3, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },

  // SPECIAL SITUATIONS (5 badges)
  {
    id: 'solo_bar_survivor',
    name: 'Solo Bar Survivor',
    emoji: '🏝️',
    category: 'special',
    description: 'Can run entire bar alone',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'catering_champion',
    name: 'Catering Champion',
    emoji: '🎪',
    category: 'special',
    description: 'Excels at events and pop-ups',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'closers_pride',
    name: "Closer's Pride",
    emoji: '🌙',
    category: 'special',
    description: 'Perfect closing procedures',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'openers_glory',
    name: "Opener's Glory",
    emoji: '☀️',
    category: 'special',
    description: 'Excellent opening procedures',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'inventory_master',
    name: 'Inventory Master',
    emoji: '📦',
    category: 'special',
    description: 'Expert stock management',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },

  // PERSONALITY (5 badges)
  {
    id: 'coffee_philosopher',
    name: 'Coffee Philosopher',
    emoji: '💭',
    category: 'personality',
    description: 'Deep understanding of coffee culture',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'detail_obsessed',
    name: 'Detail Obsessed',
    emoji: '🔍',
    category: 'personality',
    description: 'Perfectionist attention to detail',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'adaptability_ninja',
    name: 'Adaptability Ninja',
    emoji: '🥷',
    category: 'personality',
    description: 'Quick learner, flexible',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'common',
    tier1Weight: 2.0
  },
  {
    id: 'calm_under_pressure',
    name: 'Calm Under Pressure',
    emoji: '🧘',
    category: 'personality',
    description: 'Excellent stress management',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },
  {
    id: 'creative_experimenter',
    name: 'Creative Experimenter',
    emoji: '🧪',
    category: 'personality',
    description: 'Innovative with recipes and ideas',
    levels: {
      bronze: { threshold: 3, emoji: '🥉' },
      silver: { threshold: 8, emoji: '🥈' },
      gold: { threshold: 20, emoji: '🥇' }
    },
    rarity: 'uncommon',
    tier1Weight: 2.0
  },

  // LEGENDARY (4 badges)
  {
    id: 'barista_sensei',
    name: 'Barista Sensei',
    emoji: '🥋',
    category: 'legendary',
    description: 'Community mentor figure',
    levels: {
      bronze: { threshold: 30, emoji: '🥉' },
      silver: { threshold: 50, emoji: '🥈' },
      gold: { threshold: 100, emoji: '🥇' }
    },
    rarity: 'legendary',
    tier1Weight: 2.0,
    specialRequirements: {
      requiredBadges: ['new_hire_mentor', 'shift_coordinator'],
      minExperience: 5,
      minReviewCount: 50
    }
  },
  {
    id: 'coffee_sommelier',
    name: 'Coffee Sommelier',
    emoji: '🍷',
    category: 'legendary',
    description: 'Complete coffee mastery',
    levels: {
      bronze: { threshold: 30, emoji: '🥉' },
      silver: { threshold: 50, emoji: '🥈' },
      gold: { threshold: 100, emoji: '🥇' }
    },
    rarity: 'legendary',
    tier1Weight: 2.0,
    specialRequirements: {
      requiredBadges: ['bean_whisperer', 'origin_storyteller', 'roast_profile_decoder'],
      minExperience: 5,
      minReviewCount: 50
    }
  },
  {
    id: 'bar_architect',
    name: 'Bar Architect',
    emoji: '🏛️',
    category: 'legendary',
    description: 'Operations excellence',
    levels: {
      bronze: { threshold: 30, emoji: '🥉' },
      silver: { threshold: 50, emoji: '🥈' },
      gold: { threshold: 100, emoji: '🥇' }
    },
    rarity: 'legendary',
    tier1Weight: 2.0,
    specialRequirements: {
      requiredBadges: ['flow_state_master', 'setup_sorcerer', 'inventory_master'],
      minExperience: 5,
      minReviewCount: 50
    }
  },
  {
    id: 'community_pillar',
    name: 'Community Pillar',
    emoji: '🌳',
    category: 'legendary',
    description: 'Long-term community impact',
    levels: {
      bronze: { threshold: 30, emoji: '🥉' },
      silver: { threshold: 50, emoji: '🥈' },
      gold: { threshold: 100, emoji: '🥇' }
    },
    rarity: 'legendary',
    tier1Weight: 2.0,
    specialRequirements: {
      requiredBadges: ['vibe_curator', 'mood_lifter', 'regular_whisperer'],
      minExperience: 5,
      minReviewCount: 100
    }
  }
];

// Helper functions
export const getBadgeById = (id: string): Badge | undefined => {
  return BADGES.find(badge => badge.id === id);
};

export const getBadgesByCategory = (category: string): Badge[] => {
  return BADGES.filter(badge => badge.category === category);
};

export const getLegendaryBadges = (): Badge[] => {
  return BADGES.filter(badge => badge.category === 'legendary');
};
