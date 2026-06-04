import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from '../services/auth.service';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  userType: z.enum(['barista', 'employer'])
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { userType: 'barista' }
  });

  const userType = watch('userType');

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError('');
      setLoading(true);
      await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        userType: data.userType
      });
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const typeOptions: { value: 'barista' | 'employer'; label: string; sub: string }[] = [
    { value: 'barista', label: 'Barista', sub: 'I work behind the bar.' },
    { value: 'employer', label: 'Café', sub: 'I hire and run a team.' },
  ];

  return (
    <div className="max-w-md mx-auto pt-8">
      <div className="card p-10">
        <p className="eyebrow mb-3">Begin</p>
        <h1
          className="font-heading text-4xl mb-2 leading-none"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          A page of your own.
        </h1>
        <p className="text-sm text-[var(--color-ink-soft)] mb-8">
          Takes a minute. You can edit anything later.
        </p>

        {error && <div className="alert-error mb-5">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input {...register('name')} type="text" id="name" className="input" placeholder="Ada Lovelace" />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="label">Email</label>
            <input {...register('email')} type="email" id="email" className="input" placeholder="you@cafe.com" />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="label">Password</label>
              <input {...register('password')} type="password" id="password" className="input" placeholder="••••••••" />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label">Confirm</label>
              <input {...register('confirmPassword')} type="password" id="confirmPassword" className="input" placeholder="••••••••" />
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <p className="label">I am</p>
            <div className="grid grid-cols-2 gap-3">
              {typeOptions.map((opt) => {
                const selected = userType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('userType', opt.value, { shouldValidate: true })}
                    className={[
                      'text-left rounded-[10px] px-4 py-3 border transition-colors',
                      selected
                        ? 'border-[var(--color-ink)] bg-[rgba(26,24,21,0.04)]'
                        : 'border-[var(--color-hairline)] hover:bg-[rgba(26,24,21,0.02)]',
                    ].join(' ')}
                  >
                    <div className="font-heading text-base">{opt.label}</div>
                    <div className="text-xs text-[var(--color-ink-soft)] mt-0.5">{opt.sub}</div>
                  </button>
                );
              })}
            </div>
            {errors.userType && <p className="field-error">{errors.userType.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-50">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t hairline text-center text-sm text-[var(--color-ink-soft)]">
          Already have one?{' '}
          <Link to="/login" className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-accent)]">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
