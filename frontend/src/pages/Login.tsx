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
    <div className="min-h-screen flex items-center justify-center bg-apple-dark-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-apple-dark-800/80 backdrop-blur-xs rounded-2xl shadow-xl w-full max-w-md p-8 space-y-5 border border-apple-dark-700/50"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-apple-accent-blue to-apple-accent-purple rounded-2xl flex items-center justify-center mx-auto shadow-apple">
            <Lock className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-apple-dark-50">Car Rental Dubai</h1>
          <p className="text-apple-dark-400 text-sm">Admin Portal — سجل دخولك للمتابعة</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-apple text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-apple-dark-300 mb-1">Username</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="root"
            className="w-full px-4 py-2.5 border border-apple-dark-600 bg-apple-dark-700/50 rounded-apple focus:ring-2 focus:ring-apple-accent-blue focus:bg-apple-dark-600 outline-none text-apple-dark-50 placeholder-apple-dark-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-apple-dark-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-apple-dark-600 bg-apple-dark-700/50 rounded-apple focus:ring-2 focus:ring-apple-accent-blue focus:bg-apple-dark-600 outline-none text-apple-dark-50 placeholder-apple-dark-400 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-apple-accent-blue hover:bg-apple-accent-blue/90 text-white rounded-apple font-semibold flex items-center justify-center gap-2 disabled:opacity-70 shadow-apple transition-colors"
        >
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;