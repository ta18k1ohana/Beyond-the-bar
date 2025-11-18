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

      const newWorkHistory: WorkHistory = {
        cafeId: '',
        cafeName: data.cafeName,
        position: data.position,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      };

      await addWorkHistory(userId, newWorkHistory);
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
    if (!confirm('Are you sure you want to remove this work history entry?')) {
      return;
    }

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
      const currentWorkplace: Workplace = {
        cafeId: workplace.cafeId,
        cafeName: workplace.cafeName,
        position: workplace.position,
        startDate: new Date(),
        current: true
      };
      await updateCurrentWorkplace(userId, currentWorkplace);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to set as current workplace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[var(--color-coffee-primary)] font-heading">
          Work History
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-[var(--color-coffee-accent)] hover:underline text-sm font-semibold"
          >
            + Add Work Experience
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Current Workplace */}
      {currentWorkplace && (
        <div className="bg-[var(--color-coffee-accent)] bg-opacity-10 border-l-4 border-[var(--color-coffee-accent)] p-4 rounded">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-[var(--color-coffee-text)]">
                  {currentWorkplace.cafeName}
                </h4>
                <span className="bg-[var(--color-coffee-accent)] text-white text-xs px-2 py-1 rounded">
                  Current
                </span>
              </div>
              <p className="text-sm text-gray-700">{currentWorkplace.position}</p>
              <p className="text-sm text-gray-600">
                Since {new Date(currentWorkplace.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Past Work History */}
      {workHistory.length > 0 ? (
        <div className="space-y-3">
          {workHistory.map((work, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-[var(--color-coffee-text)]">{work.cafeName}</h4>
                  <p className="text-sm text-gray-700">{work.position}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(work.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })} - {new Date(work.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSetAsCurrent(work)}
                    disabled={loading}
                    className="text-[var(--color-coffee-accent)] hover:underline text-sm disabled:opacity-50"
                  >
                    Set as Current
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    disabled={loading}
                    className="text-red-600 hover:underline text-sm disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No work history added yet.</p>
      )}

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleSubmit(handleAdd)} className="border border-gray-300 p-4 rounded-lg space-y-4 bg-gray-50">
          <h4 className="font-bold text-[var(--color-coffee-text)]">Add Work Experience</h4>

          <div>
            <label htmlFor="cafeName" className="block text-sm font-medium mb-1">
              Café Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('cafeName')}
              type="text"
              id="cafeName"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              placeholder="Blue Bottle Coffee"
            />
            {errors.cafeName && <p className="text-red-500 text-sm mt-1">{errors.cafeName.message}</p>}
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              {...register('position')}
              type="text"
              id="position"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              placeholder="Barista"
            />
            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register('startDate')}
                type="month"
                id="startDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register('endDate')}
                type="month"
                id="endDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
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
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
