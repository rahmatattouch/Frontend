import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [mdp, setmdp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, mdp);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-xl rounded-lg overflow-hidden">
        
        {/* Welcome Section */}
        <div className="hidden md:flex md:w-3/5 flex-col justify-center items-center p-12" style={{ backgroundColor: '#10b981', color: 'white' }}>
          <h1 className="text-4xl font-bold mb-6">Welcome</h1>
          <p className="mb-8 text-center text-lg">
            Join Our Usage Platform. Explore a New Experience
          </p>
          <Link 
            to="/register" 
            className="bg-white text-[#10b981] font-semibold px-8 py-3 rounded hover:bg-gray-100 transition"
          >
            REGISTER
          </Link>
        </div>

        {/* Sign In Section */}
        <div className="w-full md:w-2/5 bg-white p-10 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign In</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={mdp}
                onChange={(e) => setmdp(e.target.value)}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#10b981] focus:ring-[#10b981] border-gray-300 rounded"
                />
                <span>Remember me</span>
              </label>
              <Link to="#" className="hover:text-[#10b981]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: '#10b981' }}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#10b981] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}