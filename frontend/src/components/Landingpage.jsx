import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { Brain, FileText, Zap, Shield, ArrowRight, Bot } from 'lucide-react';

function LandingPage() {
  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">

            <img src={logo} className="logo-icon" id='alpha_logo'/>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container">
        <div className="hero-section">
          {/* <div className="logo-container"> */}
            <h1 className="logo-text">InvoSync</h1>
          {/* </div> */}
          <h2 className="hero-subtitle">
            AI-Powered Bill Management Made Simple
          </h2>
          <p className="hero-description">
            Let our AI handle your bills while you focus on what matters most. Smart, automated, and efficient bill management for everyone.
          </p>

          <Link to="/signup" className="primary-button">
            Get Started Free <ArrowRight className="button-icon" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <FeatureCard
            icon={<Bot className="feature-icon" />}
            title="AI-Powered Analysis"
            description="Our advanced AI analyzes your bills, identifies patterns, and provides smart insights to help you save money."
          />
          <FeatureCard
            icon={<FileText className="feature-icon" />}
            title="Automated Bill Tracking"
            description="Never miss a payment with automated bill tracking and smart reminders tailored to your schedule."
          />
          <FeatureCard
            icon={<Zap className="feature-icon" />}
            title="Quick Processing"
            description="Upload any bill and get instant analysis and categorization powered by cutting-edge AI technology."
          />
          <FeatureCard
            icon={<Shield className="feature-icon" />}
            title="Secure Storage"
            description="Your financial data is protected with bank-level encryption and security measures."
          />
          <FeatureCard
            icon={<Brain className="feature-icon" />}
            title="Smart Predictions"
            description="Predict future expenses and get personalized recommendations for better financial planning."
          />
          <FeatureCard
            icon={<FileText className="feature-icon" />}
            title="Digital Organization"
            description="Keep all your bills organized in one place with smart categorization and easy access."
          />
        </div>
        
        {/* CTA Section */}
        <div className="cta-section">
          <h3 className="cta-title">
            Ready to Transform Your Bill Management?
          </h3>
          <p className="cta-description">
            Join thousands of users who have simplified their financial life with InvoSync.
          </p>
          <Link to="/signup" className="primary-button">
            Start Using InvoSync Free <ArrowRight className="button-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon-container">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

export default LandingPage;