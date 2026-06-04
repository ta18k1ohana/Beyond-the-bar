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

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

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
      await addCertification(userId, {
        type: data.type,
        level: data.level,
        issueDate: new Date(data.issueDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined
      });
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
    if (!confirm('Remove this certification?')) return;
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Papers held</p>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs tracking-[0.12em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {error && <div className="alert-error text-sm">{error}</div>}

      {certifications.length === 0 && !isAdding && (
        <p className="text-sm text-[var(--color-ink-soft)] italic">
          No certifications recorded.
        </p>
      )}

      {certifications.length > 0 && (
        <ul className="divide-y hairline">
          {certifications.map((cert, index) => (
            <li key={index} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[var(--color-accent)] mb-1">{cert.level}</p>
                <h4 className="font-heading text-lg">{cert.type}</h4>
                <p className="text-xs text-[var(--color-ink-soft)] mt-1">
                  Issued {fmt(cert.issueDate)}
                  {cert.expiryDate && <> · Expires {fmt(cert.expiryDate)}</>}
                </p>
              </div>
              <button
                onClick={() => handleRemove(index)}
                disabled={loading}
                className="text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] disabled:opacity-50 shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit(handleAdd)} className="card-inset p-5 space-y-4">
          <p className="eyebrow">New paper</p>

          <div>
            <label htmlFor="type" className="label">Certification</label>
            <input {...register('type')} type="text" id="type" className="input" placeholder="SCA Barista Skills" />
            {errors.type && <p className="field-error">{errors.type.message}</p>}
          </div>

          <div>
            <label htmlFor="level" className="label">Level</label>
            <input {...register('level')} type="text" id="level" className="input" placeholder="Foundation · Intermediate · Professional" />
            {errors.level && <p className="field-error">{errors.level.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="issueDate" className="label">Issued</label>
              <input {...register('issueDate')} type="month" id="issueDate" className="input" />
              {errors.issueDate && <p className="field-error">{errors.issueDate.message}</p>}
            </div>
            <div>
              <label htmlFor="expiryDate" className="label">Expires <span className="normal-case tracking-normal font-normal text-[var(--color-ink-soft)]">(optional)</span></label>
              <input {...register('expiryDate')} type="month" id="expiryDate" className="input" />
              {errors.expiryDate && <p className="field-error">{errors.expiryDate.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setIsAdding(false); reset(); }}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-[2] disabled:opacity-50">
              {loading ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
