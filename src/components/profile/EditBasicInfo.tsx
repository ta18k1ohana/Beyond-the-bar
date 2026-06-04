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
        location: { city: data.city, state: data.state, country: data.country }
      });
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <div className="alert-error">{error}</div>}

      <div>
        <label htmlFor="bio" className="label">Bio</label>
        <textarea {...register('bio')} id="bio" rows={4} className="textarea" />
        <div className="flex justify-between mt-1.5 text-xs text-[var(--color-ink-soft)]">
          <span>{errors.bio?.message ?? 'Minimum 20 characters.'}</span>
          <span>{watch('bio')?.length || 0} / 500</span>
        </div>
      </div>

      <div>
        <label htmlFor="coffeePhilosophy" className="label">Philosophy</label>
        <textarea
          {...register('coffeePhilosophy')}
          id="coffeePhilosophy"
          rows={3}
          className="textarea"
          placeholder="One line. What do you believe a cup should be?"
        />
        <div className="flex justify-between mt-1.5 text-xs text-[var(--color-ink-soft)]">
          <span>{errors.coffeePhilosophy?.message ?? ''}</span>
          <span>{watch('coffeePhilosophy')?.length || 0} / 300</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="label">City</label>
          <input {...register('city')} type="text" id="city" className="input" />
          {errors.city && <p className="field-error">{errors.city.message}</p>}
        </div>
        <div>
          <label htmlFor="state" className="label">State</label>
          <input {...register('state')} type="text" id="state" className="input" />
          {errors.state && <p className="field-error">{errors.state.message}</p>}
        </div>
        <div>
          <label htmlFor="country" className="label">Country</label>
          <input {...register('country')} type="text" id="country" className="input" />
          {errors.country && <p className="field-error">{errors.country.message}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost flex-1">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-[2] disabled:opacity-50">
          {loading ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
};
