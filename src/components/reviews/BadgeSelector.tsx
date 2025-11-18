import { useState } from 'react';
import { BADGES, getBadgesByCategory } from '../../constants/badges';
import type { BadgeCategory } from '../../types';

interface BadgeSelectorProps {
  selectedBadges: string[];
  onChange: (badges: string[]) => void;
  maxSelections?: number;
}

export const BadgeSelector = ({ selectedBadges, onChange, maxSelections = 5 }: BadgeSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | 'all'>('all');

  const categories: Array<{ id: BadgeCategory | 'all'; name: string; emoji: string }> = [
    { id: 'all', name: 'All', emoji: '🏆' },
    { id: 'technique', name: 'Technique', emoji: '🎨' },
    { id: 'speed', name: 'Speed', emoji: '⚡' },
    { id: 'service', name: 'Service', emoji: '💬' },
    { id: 'teamwork', name: 'Teamwork', emoji: '🤝' },
    { id: 'knowledge', name: 'Knowledge', emoji: '🧠' },
    { id: 'special', name: 'Special', emoji: '🌟' },
    { id: 'personality', name: 'Personality', emoji: '🎭' }
  ];

  const displayedBadges = activeCategory === 'all'
    ? BADGES.filter(b => b.category !== 'legendary')
    : getBadgesByCategory(activeCategory);

  const toggleBadge = (badgeId: string) => {
    if (selectedBadges.includes(badgeId)) {
      onChange(selectedBadges.filter(id => id !== badgeId));
    } else if (selectedBadges.length < maxSelections) {
      onChange([...selectedBadges, badgeId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[var(--color-coffee-text)]">
          Select Badges ({selectedBadges.length}/{maxSelections})
        </h3>
        {selectedBadges.length === maxSelections && (
          <span className="text-sm text-[var(--color-coffee-accent)]">Maximum reached</span>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-[var(--color-coffee-accent)] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.emoji} {category.name}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-lg">
        {displayedBadges.map(badge => {
          const isSelected = selectedBadges.includes(badge.id);
          const isDisabled = !isSelected && selectedBadges.length >= maxSelections;

          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => toggleBadge(badge.id)}
              disabled={isDisabled}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                isSelected
                  ? 'border-[var(--color-coffee-accent)] bg-[var(--color-coffee-accent)] bg-opacity-10'
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-[var(--color-coffee-accent)] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">{badge.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[var(--color-coffee-text)] truncate">
                    {badge.name}
                  </div>
                  <div className="text-xs text-gray-600 line-clamp-2">
                    {badge.description}
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[var(--color-coffee-accent)] flex-shrink-0">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Badges Preview */}
      {selectedBadges.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Selected Badges:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedBadges.map(badgeId => {
              const badge = BADGES.find(b => b.id === badgeId);
              if (!badge) return null;

              return (
                <div
                  key={badgeId}
                  className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[var(--color-coffee-accent)]"
                >
                  <span>{badge.emoji}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleBadge(badgeId)}
                    className="text-gray-500 hover:text-red-600 ml-1"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
