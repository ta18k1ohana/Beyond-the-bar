import { useState } from 'react';
import { BADGES } from '../../constants/badges';
import type { JobPosting } from '../../types';

interface JobCardProps {
  job: JobPosting;
  onApply?: (jobId: string) => void;
  showEmployerActions?: boolean;
  onEdit?: (jobId: string) => void;
  onClose?: (jobId: string) => void;
}

export const JobCard = ({ job, onApply, showEmployerActions, onEdit, onClose }: JobCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatPayRate = (job: JobPosting) => {
    const { payRate } = job;
    const minFormatted = payRate.min.toFixed(2);
    const maxFormatted = payRate.max.toFixed(2);
    const period = payRate.period === 'hourly' ? '/hr' : '/yr';

    return `$${minFormatted} - $${maxFormatted}${period}`;
  };

  const formatPositionType = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatEmploymentType = (type: string) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
  };

  const getBadgeInfo = (badgeId: string) => {
    return BADGES.find(b => b.id === badgeId);
  };

  const isExpired = new Date(job.expiresAt) < new Date();
  const daysUntilExpiry = Math.ceil(
    (new Date(job.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={`border rounded-lg p-6 transition-all hover:shadow-md ${
      job.status === 'active' ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-[var(--color-coffee-primary)] font-heading">
              {job.title}
            </h3>
            {job.status !== 'active' && (
              <span className={`text-xs px-2 py-1 rounded capitalize font-bold ${
                job.status === 'filled' ? 'bg-green-100 text-green-800' : 'bg-gray-300 text-gray-700'
              }`}>
                {job.status}
              </span>
            )}
          </div>
          <p className="text-lg text-gray-700 font-semibold">{job.cafeName}</p>
          <p className="text-sm text-gray-600">
            {job.location.city}, {job.location.state}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[var(--color-coffee-accent)]">
            {formatPayRate(job)}
          </p>
          <p className="text-sm text-gray-600">
            {job.hoursPerWeek.min}-{job.hoursPerWeek.max} hrs/week
          </p>
        </div>
      </div>

      {/* Position & Employment Type */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="bg-[var(--color-coffee-primary)] text-white px-3 py-1 rounded-full text-sm font-medium">
          {formatPositionType(job.positionType)}
        </span>
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          {formatEmploymentType(job.employmentType)}
        </span>
        {job.shiftTypes.length > 0 && (
          <span className="bg-[var(--color-coffee-accent)] bg-opacity-20 text-[var(--color-coffee-text)] px-3 py-1 rounded-full text-sm font-medium">
            {job.shiftTypes.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')} shifts
          </span>
        )}
      </div>

      {/* Description Preview */}
      <p className={`text-gray-700 mb-4 ${expanded ? '' : 'line-clamp-2'}`}>
        {job.description}
      </p>

      {/* Required Badges */}
      {job.requiredBadges.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Required Badges:</p>
          <div className="flex flex-wrap gap-2">
            {job.requiredBadges.map(badgeId => {
              const badge = getBadgeInfo(badgeId);
              return badge ? (
                <div
                  key={badgeId}
                  className="flex items-center gap-1 bg-[var(--color-coffee-accent)] bg-opacity-10 px-2 py-1 rounded"
                >
                  <span className="text-lg">{badge.emoji}</span>
                  <span className="text-xs text-gray-700">{badge.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
          {/* Required Skills */}
          {job.requiredSkills.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {job.minExperience > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700">Minimum Experience:</p>
              <p className="text-sm text-gray-600">
                {job.minExperience >= 12
                  ? `${Math.floor(job.minExperience / 12)} year${job.minExperience >= 24 ? 's' : ''}`
                  : `${job.minExperience} months`}
              </p>
            </div>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Benefits:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Address */}
          <div>
            <p className="text-sm font-semibold text-gray-700">Location:</p>
            <p className="text-sm text-gray-600">
              {job.location.address}<br />
              {job.location.city}, {job.location.state} {job.location.zipCode}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{job.applications} application{job.applications !== 1 ? 's' : ''}</span>
          {!isExpired && daysUntilExpiry <= 7 && (
            <span className="text-orange-600 font-medium">
              {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''} left
            </span>
          )}
          {isExpired && (
            <span className="text-red-600 font-medium">Expired</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!showEmployerActions && job.status === 'active' && !isExpired && (
            <button
              onClick={() => onApply?.(job.id)}
              className="bg-[var(--color-coffee-accent)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Apply Now
            </button>
          )}

          {showEmployerActions && (
            <>
              <button
                onClick={() => onEdit?.(job.id)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Edit
              </button>
              {job.status === 'active' && (
                <button
                  onClick={() => onClose?.(job.id)}
                  className="bg-[var(--color-coffee-primary)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              )}
            </>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[var(--color-coffee-accent)] font-medium hover:underline text-sm"
          >
            {expanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
    </div>
  );
};
