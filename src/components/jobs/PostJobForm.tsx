import { useState } from 'react';
import { BADGES } from '../../constants/badges';
import type {
  JobPosting,
  PositionType,
  EmploymentType,
  ShiftType
} from '../../types';

interface PostJobFormProps {
  employerId: string;
  cafeId: string;
  cafeName: string;
  onSubmit: (jobData: Omit<JobPosting, 'id' | 'employerId' | 'applications' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<JobPosting>;
}

export const PostJobForm = ({
  cafeId,
  cafeName,
  onSubmit,
  onCancel,
  initialData
}: PostJobFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [positionType, setPositionType] = useState<PositionType>(
    initialData?.positionType || 'barista'
  );
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    initialData?.employmentType || 'full_time'
  );

  // Location
  const [address, setAddress] = useState(initialData?.location?.address || '');
  const [city, setCity] = useState(initialData?.location?.city || '');
  const [state, setState] = useState(initialData?.location?.state || '');
  const [zipCode, setZipCode] = useState(initialData?.location?.zipCode || '');

  // Pay
  const [payMin, setPayMin] = useState(initialData?.payRate?.min.toString() || '');
  const [payMax, setPayMax] = useState(initialData?.payRate?.max.toString() || '');
  const [payPeriod, setPayPeriod] = useState<'hourly' | 'salary'>(
    initialData?.payRate?.period || 'hourly'
  );

  // Hours
  const [hoursMin, setHoursMin] = useState(initialData?.hoursPerWeek?.min.toString() || '');
  const [hoursMax, setHoursMax] = useState(initialData?.hoursPerWeek?.max.toString() || '');

  // Requirements
  const [minExperience, setMinExperience] = useState(
    initialData?.minExperience?.toString() || '0'
  );
  const [requiredBadges, setRequiredBadges] = useState<string[]>(
    initialData?.requiredBadges || []
  );
  const [requiredSkills, setRequiredSkills] = useState(
    initialData?.requiredSkills?.join(', ') || ''
  );

  // Benefits & Shifts
  const [benefits, setBenefits] = useState(initialData?.benefits?.join(', ') || '');
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>(
    initialData?.shiftTypes || []
  );

  // Expiry (default 30 days)
  const defaultExpiry = new Date();
  defaultExpiry.setDate(defaultExpiry.getDate() + 30);
  const [expiresAt, setExpiresAt] = useState(
    initialData?.expiresAt
      ? new Date(initialData.expiresAt).toISOString().split('T')[0]
      : defaultExpiry.toISOString().split('T')[0]
  );

  const toggleBadge = (badgeId: string) => {
    if (requiredBadges.includes(badgeId)) {
      setRequiredBadges(requiredBadges.filter(id => id !== badgeId));
    } else {
      setRequiredBadges([...requiredBadges, badgeId]);
    }
  };

  const toggleShift = (shift: ShiftType) => {
    if (shiftTypes.includes(shift)) {
      setShiftTypes(shiftTypes.filter(s => s !== shift));
    } else {
      setShiftTypes([...shiftTypes, shift]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title || !description || !address || !city || !state || !zipCode) {
      setError('Please fill in all required fields');
      return;
    }

    if (!payMin || !payMax || parseFloat(payMin) > parseFloat(payMax)) {
      setError('Please enter valid pay range');
      return;
    }

    if (!hoursMin || !hoursMax || parseInt(hoursMin) > parseInt(hoursMax)) {
      setError('Please enter valid hours range');
      return;
    }

    try {
      setLoading(true);

      const jobData: Omit<JobPosting, 'id' | 'employerId' | 'applications' | 'createdAt'> = {
        title,
        cafeId,
        cafeName,
        location: {
          address,
          city,
          state,
          zipCode
        },
        positionType,
        employmentType,
        payRate: {
          min: parseFloat(payMin),
          max: parseFloat(payMax),
          currency: 'USD',
          period: payPeriod
        },
        hoursPerWeek: {
          min: parseInt(hoursMin),
          max: parseInt(hoursMax)
        },
        description,
        requiredBadges,
        minExperience: parseInt(minExperience),
        requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        benefits: benefits.split(',').map(b => b.trim()).filter(b => b),
        shiftTypes,
        status: 'active',
        expiresAt: new Date(expiresAt)
      };

      await onSubmit(jobData);
    } catch (err) {
      setError('Failed to post job. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Experienced Barista"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description * (max 2000 characters)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
          placeholder="Describe the role, responsibilities, and what makes your cafe special..."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {description.length}/2000 characters
        </p>
      </div>

      {/* Position & Employment Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Position Type *
          </label>
          <select
            value={positionType}
            onChange={(e) => setPositionType(e.target.value as PositionType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
            required
          >
            <option value="barista">Barista</option>
            <option value="lead_barista">Lead Barista</option>
            <option value="shift_supervisor">Shift Supervisor</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Employment Type *
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
            required
          >
            <option value="full_time">Full-Time</option>
            <option value="part_time">Part-Time</option>
            <option value="casual">Casual</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading">
          Location
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Seattle"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              placeholder="WA"
              maxLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="98101"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading">
          Compensation
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Min Pay *
            </label>
            <input
              type="number"
              step="0.01"
              value={payMin}
              onChange={(e) => setPayMin(e.target.value)}
              placeholder="15.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Pay *
            </label>
            <input
              type="number"
              step="0.01"
              value={payMax}
              onChange={(e) => setPayMax(e.target.value)}
              placeholder="20.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pay Period *
            </label>
            <select
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value as 'hourly' | 'salary')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              required
            >
              <option value="hourly">Hourly</option>
              <option value="salary">Salary</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Benefits (comma-separated)
          </label>
          <input
            type="text"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="Health insurance, Free coffee, Employee discounts"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          />
        </div>
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading">
          Schedule
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Min Hours/Week *
            </label>
            <input
              type="number"
              value={hoursMin}
              onChange={(e) => setHoursMin(e.target.value)}
              placeholder="20"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Hours/Week *
            </label>
            <input
              type="number"
              value={hoursMax}
              onChange={(e) => setHoursMax(e.target.value)}
              placeholder="40"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Shift Types
          </label>
          <div className="flex flex-wrap gap-2">
            {(['opening', 'mid', 'closing', 'weekend'] as ShiftType[]).map(shift => (
              <button
                key={shift}
                type="button"
                onClick={() => toggleShift(shift)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  shiftTypes.includes(shift)
                    ? 'bg-[var(--color-coffee-accent)] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {shift.charAt(0).toUpperCase() + shift.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading">
          Requirements
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Experience (months)
          </label>
          <input
            type="number"
            value={minExperience}
            onChange={(e) => setMinExperience(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Required Skills (comma-separated)
          </label>
          <input
            type="text"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
            placeholder="Espresso extraction, Milk steaming, POS systems"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Required Badges (optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
            {BADGES.map(badge => (
              <button
                key={badge.id}
                type="button"
                onClick={() => toggleBadge(badge.id)}
                className={`flex items-center gap-2 p-2 rounded transition-colors text-left ${
                  requiredBadges.includes(badge.id)
                    ? 'bg-[var(--color-coffee-accent)] bg-opacity-20 border-2 border-[var(--color-coffee-accent)]'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{badge.emoji}</span>
                <span className="text-xs">{badge.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expiry Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Posting Expires On *
        </label>
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[var(--color-coffee-accent)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Posting...' : initialData ? 'Update Job' : 'Post Job'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
