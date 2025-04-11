import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // For demo purposes, we'll just redirect to dashboard
    // In a real app, you would register with a backend
    setError('');
    console.log('Signing up with:', { name, email });
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
        </div>
         */}
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="form-input"
            />
          </div>
          
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>
          
          {/* <div className="flex items-center mb-6">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
            </label>
          </div> */}
          
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account? <Link to="/signin" className="text-blue-600 hover:text-blue-800">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;