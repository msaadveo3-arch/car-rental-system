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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-5"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="text-white" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Car Rental Dubai</h1>
          <p className="text-gray-500 text-sm">Admin Portal — سجل دخولك للمتابعة</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="root"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;