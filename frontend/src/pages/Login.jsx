import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import loginImage from '../assets/login-bg.jpeg'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  
  // States for handling errors and loading
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send login request to the backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user details to local storage upon successful login
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name || email.split('@')[0]);
        
        // Redirect to Dashboard
        navigate('/'); 
      } else {
        // Handle invalid credentials
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Server connection failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#1e1e1e] p-4 lg:p-8">
      
      <div className="flex w-full max-w-[1300px] h-full max-h-[850px] bg-white p-4 shadow-2xl rounded-2xl">
        
        <div className="hidden lg:flex lg:w-1/2 bg-[#0A1128] flex-col justify-center items-center text-white p-12 rounded-xl">
          <div className="max-w-2xl text-center flex flex-col items-center">
            <h1 className="text-[36px] xl:text-[42px] font-bold tracking-wide mb-6 leading-tight">
              STUDENT ATTENDANCE & <br /> PAYMENT TRACKER
            </h1>
            <p className="text-gray-100 text-xl mb-12">
              Manage Students, Track Attendance, <br /> Simplify Payments.
            </p>
            <div className="w-full max-w-lg overflow-hidden flex justify-center items-center">
              <img 
                src={loginImage} 
                alt="Login Illustration" 
                className="w-full h-auto object-contain mix-blend-lighten scale-[1.03]"
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white rounded-xl">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-extrabold text-black mb-2">Welcome Back!</h2>
              <p className="text-gray-800 text-lg">Sign in to access your dashboard.</p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-700">
                    <Mail size={20} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#E5E7EB] border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1128] text-gray-900 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-700">
                    <Lock size={20} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 bg-[#E5E7EB] border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1128] text-gray-900 text-base"
                  />
                  <span 
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-base mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-800">Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-3.5 bg-[#0A1128] hover:bg-[#16234d] text-white font-bold rounded-lg text-xl text-center transition-colors disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}