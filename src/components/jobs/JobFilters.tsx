import { useState } from 'react';
import type { PositionType, EmploymentType } from '../../types';

export interface JobFilterOptions {
  search: string;
  positionType: PositionType | 'all';
  employmentType: EmploymentType | 'all';
  city: string;
  state: string;
}

interface JobFiltersProps {
  filters: JobFilterOptions;
  onFilterChange: (filters: JobFilterOptions) => void;
}

export const JobFilters = ({ filters, onFilterChange }: JobFiltersProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (key: keyof JobFilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      positionType: 'all',
      employmentType: 'all',
      city: '',
      state: ''
    });
  };

  const hasActiveFilters = filters.search ||
    filters.positionType !== 'all' ||
    filters.employmentType !== 'all' ||
    filters.city ||
    filters.state;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Search Bar */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search Jobs
        </label>
        <input
          type="text"
          placeholder="Search by title, cafe name, or keyword..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
        />
      </div>

      {/* Toggle Advanced Filters */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[var(--color-coffee-accent)] font-medium hover:underline text-sm"
      >
        {expanded ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Advanced Filters */}
      {expanded && (
        <div className="space-y-4 pt-2">
          {/* Position Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Position Type
            </label>
            <select
              value={filters.positionType}
              onChange={(e) => handleChange('positionType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
            >
              <option value="all">All Positions</option>
              <option value="barista">Barista</option>
              <option value="lead_barista">Lead Barista</option>
              <option value="shift_supervisor">Shift Supervisor</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Employment Type
            </label>
            <select
              value={filters.employmentType}
              onChange={(e) => handleChange('employmentType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="full_time">Full-Time</option>
              <option value="part_time">Part-Time</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          {/* Location Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="e.g., Seattle"
                value={filters.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                placeholder="e.g., WA"
                value={filters.state}
                onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                maxLength={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
