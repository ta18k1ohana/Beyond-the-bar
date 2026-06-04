import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/userStore';
import { updateUserProfile, updateCurrentWorkplace } from '../services/user.service';
import type { Workplace } from '../types';

const locationSchema = z.object({
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required')
});

const bioSchema = z.object({
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(500, 'Bio must be less than 500 characters'),
  coffeePhilosophy: z.string().max(300, 'Coffee philosophy must be less than 300 characters').optional()
});

const workplaceSchema = z.object({
  cafeName: z.string().min(2, 'Café name is required'),
  position: z.string().min(2, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  current: z.boolean()
});

type LocationFormData = z.infer<typeof locationSchema>;
type BioFormData = z.infer<typeof bioSchema>;
type WorkplaceFormData = z.infer<typeof workplaceSchema>;

const STEP_LABELS = ['Place', 'Voice', 'Bar'];

export const ProfileOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile, fetchUserProfile } = useUserStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) fetchUserProfile(user.uid);
  }, [user, fetchUserProfile]);

  const locationForm = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      city: userProfile?.location.city || '',
      state: userProfile?.location.state || '',
      country: userProfile?.location.country || 'USA'
    }
  });

  const bioForm = useForm<BioFormData>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: userProfile?.bio || '',
      coffeePhilosophy: userProfile?.coffeePhilosophy || ''
    }
  });

  const workplaceForm = useForm<WorkplaceFormData>({
    resolver: zodResolver(workplaceSchema),
    defaultValues: { cafeName: '', position: '', startDate: '', current: true }
  });

  const handleLocationSubmit = async (data: LocationFormData) => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      await updateUserProfile(user.uid, { location: data });
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const handleBioSubmit = async (data: BioFormData) => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      await updateUserProfile(user.uid, {
        bio: data.bio,
        coffeePhilosophy: data.coffeePhilosophy || ''
      });
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Failed to update bio');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkplaceSubmit = async (data: WorkplaceFormData) => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      const workplace: Workplace = {
        cafeId: '',
        cafeName: data.cafeName,
        position: data.position,
        startDate: new Date(data.startDate),
        current: data.current
      };
      await updateCurrentWorkplace(user.uid, workplace);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to update workplace');
    } finally {
      setLoading(false);
    }
  };

  const skipWorkplace = () => navigate('/profile');

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="mb-10">
        <p className="eyebrow mb-3">Begin · No. 001</p>
        <h1
          className="font-heading text-4xl md:text-5xl leading-none"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          Lay out the page.
        </h1>
        <p className="text-[var(--color-ink-soft)] mt-3 max-w-md">
          Three short questions. You can revise anything later.
        </p>
      </div>

      {/* Step indicator */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {STEP_LABELS.map((label, idx) => {
          const n = idx + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} className="border-t hairline pt-3">
              <div className="flex items-baseline gap-2">
                <span
                  className={[
                    'font-heading italic text-lg',
                    active || done ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink-soft)]',
                  ].join(' ')}
                  style={{ fontVariationSettings: '"opsz" 144' }}
                >
                  {['I', 'II', 'III'][idx]}
                </span>
                <span className={active ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-soft)]'}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-10">
        {error && <div className="alert-error mb-6">{error}</div>}

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={locationForm.handleSubmit(handleLocationSubmit)} className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl mb-1">Where do you pour?</h2>
              <p className="text-sm text-[var(--color-ink-soft)]">
                So cafés and peers nearby can find you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="label">City</label>
                <input {...locationForm.register('city')} type="text" id="city" className="input" placeholder="Portland" />
                {locationForm.formState.errors.city && (
                  <p className="field-error">{locationForm.formState.errors.city.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className="label">State / Region</label>
                <input {...locationForm.register('state')} type="text" id="state" className="input" placeholder="Oregon" />
                {locationForm.formState.errors.state && (
                  <p className="field-error">{locationForm.formState.errors.state.message}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="country" className="label">Country</label>
                <input {...locationForm.register('country')} type="text" id="country" className="input" placeholder="USA" />
                {locationForm.formState.errors.country && (
                  <p className="field-error">{locationForm.formState.errors.country.message}</p>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Saving…' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={bioForm.handleSubmit(handleBioSubmit)} className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl mb-1">A few lines about you.</h2>
              <p className="text-sm text-[var(--color-ink-soft)]">
                Plain words. Specifics over adjectives.
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="label">Bio</label>
              <textarea
                {...bioForm.register('bio')}
                id="bio"
                rows={5}
                className="textarea"
                placeholder="Five years on bar, mostly natural process Ethiopians. Lead training at two openings."
              />
              <div className="flex justify-between mt-1.5 text-xs text-[var(--color-ink-soft)]">
                <span>{bioForm.formState.errors.bio?.message ?? 'Minimum 20 characters.'}</span>
                <span>{bioForm.watch('bio')?.length || 0} / 500</span>
              </div>
            </div>

            <div>
              <label htmlFor="coffeePhilosophy" className="label">Philosophy <span className="normal-case tracking-normal text-[var(--color-ink-soft)] font-normal">(optional)</span></label>
              <textarea
                {...bioForm.register('coffeePhilosophy')}
                id="coffeePhilosophy"
                rows={3}
                className="textarea"
                placeholder="What do you believe a cup should be?"
              />
              <div className="flex justify-between mt-1.5 text-xs text-[var(--color-ink-soft)]">
                <span>{bioForm.formState.errors.coffeePhilosophy?.message ?? ''}</span>
                <span>{bioForm.watch('coffeePhilosophy')?.length || 0} / 300</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1">Back</button>
              <button type="submit" disabled={loading} className="btn-primary flex-[2] disabled:opacity-50">
                {loading ? 'Saving…' : 'Continue'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={workplaceForm.handleSubmit(handleWorkplaceSubmit)} className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl mb-1">The current bar.</h2>
              <p className="text-sm text-[var(--color-ink-soft)]">
                Where you stand now. You can skip and add later.
              </p>
            </div>

            <div>
              <label htmlFor="cafeName" className="label">Café</label>
              <input {...workplaceForm.register('cafeName')} type="text" id="cafeName" className="input" placeholder="The corner shop" />
              {workplaceForm.formState.errors.cafeName && (
                <p className="field-error">{workplaceForm.formState.errors.cafeName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="position" className="label">Position</label>
                <input {...workplaceForm.register('position')} type="text" id="position" className="input" placeholder="Lead barista" />
                {workplaceForm.formState.errors.position && (
                  <p className="field-error">{workplaceForm.formState.errors.position.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="startDate" className="label">Since</label>
                <input {...workplaceForm.register('startDate')} type="month" id="startDate" className="input" />
                {workplaceForm.formState.errors.startDate && (
                  <p className="field-error">{workplaceForm.formState.errors.startDate.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-ghost flex-1">Back</button>
              <button type="button" onClick={skipWorkplace} className="btn-ghost flex-1">Skip</button>
              <button type="submit" disabled={loading} className="btn-primary flex-[2] disabled:opacity-50">
                {loading ? 'Saving…' : 'Finish'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
