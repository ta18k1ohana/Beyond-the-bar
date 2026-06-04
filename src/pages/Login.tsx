import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from '../services/auth.service';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setLoading(true);
      await signIn(data);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-8">
      <div className="card p-10">
        <p className="eyebrow mb-3">Return</p>
        <h1
          className="font-heading text-4xl mb-8 leading-none"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          Welcome back.
        </h1>

        {error && <div className="alert-error mb-5">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="input"
              placeholder="you@cafe.com"
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="input"
              placeholder="••••••••"
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t hairline text-center text-sm text-[var(--color-ink-soft)]">
          New here?{' '}
          <Link to="/signup" className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-accent)]">
            Begin a profile
          </Link>
        </div>
      </div>
    </div>
  );
};
