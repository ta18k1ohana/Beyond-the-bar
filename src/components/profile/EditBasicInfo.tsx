import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserProfile } from '../../services/user.service';
import type { Location } from '../../types';

const basicInfoSchema = z.object({
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(500),
  coffeePhilosophy: z.string().max(300).optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required')
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface EditBasicInfoProps {
  userId: string;
  initialData: {
    bio: string;
    coffeePhilosophy: string;
    location: Location;
  };
  onSave: () => void;
  onCancel: () => void;
}

export const EditBasicInfo = ({ userId, initialData, onSave, onCancel }: EditBasicInfoProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      bio: initialData.bio,
      coffeePhilosophy: initialData.coffeePhilosophy,
      city: initialData.location.city,
      state: initialData.location.state,
      country: initialData.location.country
    }
  });

  const onSubmit = async (data: BasicInfoFormData) => {
    try {
      setLoading(true);
      setError('');

      await updateUserProfile(userId, {
        bio: data.bio,
        coffeePhilosophy: data.coffeePhilosophy || '',
        location: {
          city: data.city,
          state: data.state,
          country: data.country
        }
      });

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('bio')}
          id="bio"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">{watch('bio')?.length || 0}/500 characters</p>
        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
      </div>

      <div>
        <label htmlFor="coffeePhilosophy" className="block text-sm font-medium mb-1">
          Coffee Philosophy
        </label>
        <textarea
          {...register('coffeePhilosophy')}
          id="coffeePhilosophy"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          placeholder="What's your approach to coffee?"
        />
        <p className="text-sm text-gray-500 mt-1">{watch('coffeePhilosophy')?.length || 0}/300 characters</p>
        {errors.coffeePhilosophy && (
          <p className="text-red-500 text-sm mt-1">{errors.coffeePhilosophy.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            {...register('city')}
            type="text"
            id="city"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            {...register('state')}
            type="text"
            id="state"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          />
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            {...register('country')}
            type="text"
            id="country"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
