import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For demo purposes, we'll just redirect to dashboard
    // In a real app, you would authenticate with a backend
    setError('');
    console.log('Signing in with:', email);
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="flex items-center text-blue-500 mb-6 hover:text-blue-700">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {/* Back to Home */}
        </Link>
        
        {/* <div className="flex justify-center mb-6">
          <Brain className="w-10 h-10 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800 ml-2">InvoSync</h1>
        </div> */}
        
        <h2 className="text-black">Sign In to Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>
          
          {/* <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
          </div> */}
          
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;