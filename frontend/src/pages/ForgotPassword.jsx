import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending password reset instructions
    setTimeout(() => {
      setLoading(false);
      setMessage(`Password reset link has been sent to ${email}!`);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
        
        <h2 className="text-3xl font-extrabold text-center text-[#0A1128] mb-2">Forgot Password?</h2>
        <p className="text-sm text-gray-500 text-center mb-8 font-medium">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3.5 bg-[#E5E7EB] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0A1128] hover:bg-[#1B2580] text-white font-bold rounded-xl text-sm transition-colors shadow-md disabled:opacity-70"
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 font-medium">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold hover:underline transition-colors">
              Back to Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}