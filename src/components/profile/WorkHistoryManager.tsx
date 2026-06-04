import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addWorkHistory, removeWorkHistory, updateCurrentWorkplace } from '../../services/user.service';
import type { WorkHistory, Workplace } from '../../types';

const workHistorySchema = z.object({
  cafeName: z.string().min(2, 'Café name is required'),
  position: z.string().min(2, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required')
});

type WorkHistoryFormData = z.infer<typeof workHistorySchema>;

interface WorkHistoryManagerProps {
  userId: string;
  workHistory: WorkHistory[];
  currentWorkplace?: Workplace;
  onUpdate: () => void;
}

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export const WorkHistoryManager = ({ userId, workHistory, currentWorkplace, onUpdate }: WorkHistoryManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<WorkHistoryFormData>({
    resolver: zodResolver(workHistorySchema)
  });

  const handleAdd = async (data: WorkHistoryFormData) => {
    try {
      setLoading(true);
      setError('');
      await addWorkHistory(userId, {
        cafeId: '',
        cafeName: data.cafeName,
        position: data.position,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      });
      reset();
      setIsAdding(false);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to add work history');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (index: number) => {
    if (!confirm('Remove this entry?')) return;
    try {
      setLoading(true);
      await removeWorkHistory(userId, index);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to remove work history');
    } finally {
      setLoading(false);
    }
  };

  const handleSetAsCurrent = async (workplace: WorkHistory) => {
    try {
      setLoading(true);
      await updateCurrentWorkplace(userId, {
        cafeId: workplace.cafeId,
        cafeName: workplace.cafeName,
        position: workplace.position,
        startDate: new Date(),
        current: true
      });
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to set as current workplace');
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = !currentWorkplace && workHistory.length === 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Bars worked</p>
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

      {isEmpty && !isAdding && (
        <p className="text-sm text-[var(--color-ink-soft)] italic">
          Nothing here yet.
        </p>
      )}

      {/* Timeline */}
      <ol className="relative">
        {currentWorkplace && (
          <li className="relative pl-6 pb-6 border-l hairline">
            <span
              className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--color-accent)' }}
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-heading text-lg">{currentWorkplace.cafeName}</h4>
                  <span className="eyebrow text-[var(--color-accent)]">Now</span>
                </div>
                <p className="text-sm text-[var(--color-ink)]">{currentWorkplace.position}</p>
                <p className="text-xs text-[var(--color-ink-soft)] mt-1">
                  Since {fmt(currentWorkplace.startDate)}
                </p>
              </div>
            </div>
          </li>
        )}

        {workHistory.map((work, index) => (
          <li key={index} className="relative pl-6 pb-6 border-l hairline last:pb-0 last:border-l-0">
            <span className="absolute -left-[4px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-hairline)]" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-heading text-lg">{work.cafeName}</h4>
                <p className="text-sm text-[var(--color-ink)]">{work.position}</p>
                <p className="text-xs text-[var(--color-ink-soft)] mt-1">
                  {fmt(work.startDate)} – {fmt(work.endDate)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <button
                  onClick={() => handleSetAsCurrent(work)}
                  disabled={loading}
                  className="text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] disabled:opacity-50"
                >
                  Set current
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  disabled={loading}
                  className="text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {isAdding && (
        <form onSubmit={handleSubmit(handleAdd)} className="card-inset p-5 space-y-4">
          <p className="eyebrow">New entry</p>

          <div>
            <label htmlFor="cafeName" className="label">Café</label>
            <input {...register('cafeName')} type="text" id="cafeName" className="input" placeholder="The corner shop" />
            {errors.cafeName && <p className="field-error">{errors.cafeName.message}</p>}
          </div>

          <div>
            <label htmlFor="position" className="label">Position</label>
            <input {...register('position')} type="text" id="position" className="input" placeholder="Barista" />
            {errors.position && <p className="field-error">{errors.position.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="startDate" className="label">From</label>
              <input {...register('startDate')} type="month" id="startDate" className="input" />
              {errors.startDate && <p className="field-error">{errors.startDate.message}</p>}
            </div>
            <div>
              <label htmlFor="endDate" className="label">To</label>
              <input {...register('endDate')} type="month" id="endDate" className="input" />
              {errors.endDate && <p className="field-error">{errors.endDate.message}</p>}
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
