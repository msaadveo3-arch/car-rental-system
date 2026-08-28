import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogIn, Lock } from 'lucide-react';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const { user, login } = useContext(AuthContext);
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
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="card card-border w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="text-primary-content" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-base-content">Car Rental Dubai</h1>
          <p className="text-base-content/60 text-sm">Admin Portal — سجل دخولك للمتابعة</p>
        </div>

        {error && (
          <div role="alert" className="alert alert-error text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="label"><span className="app-label">Username</span></label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="root"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label"><span className="app-label">Password</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full gap-2"
        >
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'Login'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
