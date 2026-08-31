import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CarFront, CheckCircle2, LogIn, Lock, Moon, Sun } from 'lucide-react';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const Login: React.FC = () => {
  const { user, login } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // لو داخل بالفعل، خده على الداشبورد على طول
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(identifier.trim(), password);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-base-200 lg:grid-cols-[minmax(22rem,0.9fr)_minmax(32rem,1.1fr)]">
      <section className="redwood-login-pattern relative hidden overflow-hidden p-10 text-neutral-content lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-btn bg-neutral-content/10">
            <CarFront size={24} aria-hidden />
          </span>
          <div>
            <p className="font-semibold">Car Rental</p>
            <p className="text-xs text-neutral-content/60">Fleet operations</p>
          </div>
        </div>

        <div className="max-w-lg space-y-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-content/65">Dubai operations</p>
          <h1 className="font-serif text-5xl font-normal leading-[1.08] tracking-tight xl:text-6xl">Move every journey forward.</h1>
          <p className="max-w-md text-base leading-7 text-neutral-content/70">One calm workspace for customers, fleet availability, rental contracts, and vehicle inspections.</p>
          <ul className="space-y-3 text-sm text-neutral-content/80">
            {['See fleet activity at a glance', 'Create contracts with guided steps', 'Keep inspections and operations aligned'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-warning" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-neutral-content/45">Secure operations portal</p>
      </section>

      <section className="relative flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <label
          className="swap swap-rotate btn btn-ghost btn-square btn-sm absolute right-5 top-5"
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          <Sun className="swap-on" size={18} aria-hidden />
          <Moon className="swap-off" size={18} aria-hidden />
        </label>

        <form
          onSubmit={handleSubmit}
          className="card card-border w-full max-w-md bg-base-100 shadow-redwood-lg"
        >
          <div className="card-body space-y-6 p-7 sm:p-9">
            <div className="space-y-3">
              <div className="flex size-11 items-center justify-center rounded-btn bg-primary/10 text-primary lg:hidden">
                <Lock size={22} aria-hidden />
              </div>
              <p className="redwood-kicker">Operations portal</p>
              <h2 className="font-serif text-3xl font-normal tracking-tight text-base-content">Welcome back</h2>
              <p className="text-sm leading-6 text-base-content/65">Sign in to manage today’s rental operations.</p>
            </div>

            {error && (
              <div role="alert" className="alert alert-error text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-identifier" className="label"><span className="app-label">Username or email</span></label>
              <input
                id="login-identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter your username"
                className="input input-bordered w-full bg-base-100"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="label"><span className="app-label">Password</span></label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="input input-bordered w-full bg-base-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full gap-2"
            >
              {loading ? <span className="loading loading-spinner loading-sm" aria-hidden /> : <LogIn size={18} aria-hidden />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
