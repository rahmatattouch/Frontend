import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mdp: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nom || !formData.prenom || !formData.email || !formData.mdp) {
      setError('All fields are required');
      return;
    }

    if (formData.mdp !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.mdp.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        mdp: formData.mdp,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-xl rounded-lg overflow-hidden">

        {/* Welcome Section */}
        <div className="hidden md:flex md:w-3/5 flex-col justify-center items-center p-12" style={{ backgroundColor: '#10b981', color: 'white' }}>
          <h1 className="text-4xl font-bold mb-6">Join Us</h1>
          <p className="mb-8 text-center text-lg">Create an account and start exploring our platform</p>
          <Link
            to="/login"
            className="bg-white text-[#10b981] font-semibold px-8 py-3 rounded hover:bg-gray-100 transition"
          >
            SIGN IN
          </Link>
        </div>

        {/* Register Section */}
        <div className="w-full md:w-2/5 bg-white p-10 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                name="nom"
                placeholder="Last Name"
                value={formData.nom}
                onChange={handleChange}
                required
                className="flex-1 px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
              />
              <input
                type="text"
                name="prenom"
                placeholder="First Name"
                value={formData.prenom}
                onChange={handleChange}
                required
                className="flex-1 px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
            />

            <input
              type="password"
              name="mdp"
              placeholder="Password"
              value={formData.mdp}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: '#10b981' }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#10b981] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}