import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addCertification, removeCertification } from '../../services/user.service';
import type { Certification } from '../../types';

const certificationSchema = z.object({
  type: z.string().min(2, 'Certification type is required'),
  level: z.string().min(2, 'Level is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional()
});

type CertificationFormData = z.infer<typeof certificationSchema>;

interface CertificationManagerProps {
  userId: string;
  certifications: Certification[];
  onUpdate: () => void;
}

export const CertificationManager = ({ userId, certifications, onUpdate }: CertificationManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema)
  });

  const handleAdd = async (data: CertificationFormData) => {
    try {
      setLoading(true);
      setError('');

      const newCertification: Certification = {
        type: data.type,
        level: data.level,
        issueDate: new Date(data.issueDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined
      };

      await addCertification(userId, newCertification);
      reset();
      setIsAdding(false);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to add certification');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (index: number) => {
    if (!confirm('Are you sure you want to remove this certification?')) {
      return;
    }

    try {
      setLoading(true);
      await removeCertification(userId, index);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to remove certification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading">
          Certifications
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-[var(--color-coffee-accent)] hover:underline text-sm font-semibold"
          >
            + Add Certification
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Certifications List */}
      {certifications.length > 0 ? (
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <h4 className="font-bold text-[var(--color-coffee-text)]">
                      {cert.type}
                    </h4>
                    <p className="text-sm text-gray-700">{cert.level}</p>
                    <p className="text-sm text-gray-600">
                      Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                      {cert.expiryDate && (
                        <> • Expires: {new Date(cert.expiryDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}</>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  disabled={loading}
                  className="text-red-600 hover:underline text-sm disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No certifications added yet.</p>
      )}

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleSubmit(handleAdd)} className="border border-gray-300 p-4 rounded-lg space-y-4 bg-gray-50">
          <h4 className="font-bold text-[var(--color-coffee-text)]">Add Certification</h4>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Certification Type <span className="text-red-500">*</span>
            </label>
            <input
              {...register('type')}
              type="text"
              id="type"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              placeholder="e.g., SCA Barista Skills"
            />
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-1">
              Level <span className="text-red-500">*</span>
            </label>
            <input
              {...register('level')}
              type="text"
              id="level"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              placeholder="e.g., Foundation, Intermediate, Professional"
            />
            {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium mb-1">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register('issueDate')}
                type="month"
                id="issueDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              />
              {errors.issueDate && <p className="text-red-500 text-sm mt-1">{errors.issueDate.message}</p>}
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
                Expiry Date (Optional)
              </label>
              <input
                {...register('expiryDate')}
                type="month"
                id="expiryDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                reset();
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Certification'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
