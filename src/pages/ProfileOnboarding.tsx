import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/userStore';
import { updateUserProfile, updateCurrentWorkplace } from '../services/user.service';
import type { Workplace } from '../types';

// Step 1: Location
const locationSchema = z.object({
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required')
});

// Step 2: Bio
const bioSchema = z.object({
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(500, 'Bio must be less than 500 characters'),
  coffeePhilosophy: z.string().max(300, 'Coffee philosophy must be less than 300 characters').optional()
});

// Step 3: Current Workplace
const workplaceSchema = z.object({
  cafeName: z.string().min(2, 'Café name is required'),
  position: z.string().min(2, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  current: z.boolean()
});

type LocationFormData = z.infer<typeof locationSchema>;
type BioFormData = z.infer<typeof bioSchema>;
type WorkplaceFormData = z.infer<typeof workplaceSchema>;

export const ProfileOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile, fetchUserProfile } = useUserStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.uid);
    }
  }, [user, fetchUserProfile]);

  // Location form
  const locationForm = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      city: userProfile?.location.city || '',
      state: userProfile?.location.state || '',
      country: userProfile?.location.country || 'USA'
    }
  });

  // Bio form
  const bioForm = useForm<BioFormData>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: userProfile?.bio || '',
      coffeePhilosophy: userProfile?.coffeePhilosophy || ''
    }
  });

  // Workplace form
  const workplaceForm = useForm<WorkplaceFormData>({
    resolver: zodResolver(workplaceSchema),
    defaultValues: {
      cafeName: '',
      position: '',
      startDate: '',
      current: true
    }
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
        cafeId: '', // Will be set if café exists in system
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

  const skipWorkplace = () => {
    navigate('/profile');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--color-coffee-text)]">
              Step {step} of 3
            </span>
            <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--color-coffee-accent)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-[var(--color-coffee-primary)] font-heading">
          Complete Your Profile
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Let's set up your profile so the coffee community can find you!
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <form onSubmit={locationForm.handleSubmit(handleLocationSubmit)} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 text-[var(--color-coffee-primary)] font-heading">
                Where are you located?
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                This helps cafés and other baristas in your area find you.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...locationForm.register('city')}
                    type="text"
                    id="city"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                    placeholder="San Francisco"
                  />
                  {locationForm.formState.errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {locationForm.formState.errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...locationForm.register('state')}
                    type="text"
                    id="state"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                    placeholder="California"
                  />
                  {locationForm.formState.errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {locationForm.formState.errors.state.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...locationForm.register('country')}
                    type="text"
                    id="country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                    placeholder="USA"
                  />
                  {locationForm.formState.errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {locationForm.formState.errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 2: Bio */}
        {step === 2 && (
          <form onSubmit={bioForm.handleSubmit(handleBioSubmit)} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 text-[var(--color-coffee-primary)] font-heading">
                Tell us about yourself
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Share your story and what coffee means to you.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium mb-1">
                    Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...bioForm.register('bio')}
                    id="bio"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                    placeholder="Share your background, experience, and what makes you passionate about coffee..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {bioForm.watch('bio')?.length || 0}/500 characters (minimum 20)
                  </p>
                  {bioForm.formState.errors.bio && (
                    <p className="text-red-500 text-sm mt-1">
                      {bioForm.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="coffeePhilosophy" className="block text-sm font-medium mb-1">
                    Coffee Philosophy (Optional)
                  </label>
                  <textarea
                    {...bioForm.register('coffeePhilosophy')}
                    id="coffeePhilosophy"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                    placeholder="What's your approach to coffee? What do you believe in?"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {bioForm.watch('coffeePhilosophy')?.length || 0}/300 characters
                  </p>
                  {bioForm.formState.errors.coffeePhilosophy && (
                    <p className="text-red-500 text-sm mt-1">
                      {bioForm.formState.errors.coffeePhilosophy.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Current Workplace */}
        {step === 3 && (
          <form onSubmit={workplaceForm.handleSubmit(handleWorkplaceSubmit)} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 text-[var(--color-coffee-primary)] font-heading">
                Where do you work?
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Add your current workplace (you can skip this and add it later).
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="cafeName" className="block text-sm font-medium mb-1">
                    Café Name
                  </label>
                  <input
                    {...workplaceForm.register('cafeName')}
                    type="text"
                    id="cafeName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                    placeholder="Blue Bottle Coffee"
                  />
                  {workplaceForm.formState.errors.cafeName && (
                    <p className="text-red-500 text-sm mt-1">
                      {workplaceForm.formState.errors.cafeName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium mb-1">
                    Position
                  </label>
                  <input
                    {...workplaceForm.register('position')}
                    type="text"
                    id="position"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                    placeholder="Barista, Lead Barista, Shift Supervisor, etc."
                  />
                  {workplaceForm.formState.errors.position && (
                    <p className="text-red-500 text-sm mt-1">
                      {workplaceForm.formState.errors.position.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    {...workplaceForm.register('startDate')}
                    type="month"
                    id="startDate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-coffee-accent)] focus:border-transparent"
                  />
                  {workplaceForm.formState.errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {workplaceForm.formState.errors.startDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={skipWorkplace}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[var(--color-coffee-accent)] text-[var(--color-coffee-text)] py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Complete'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
