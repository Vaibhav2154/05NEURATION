import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, LogOut, User, Settings, FileText, CreditCard, Home } from 'lucide-react';

function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <Brain className="w-8 h-8 text-white" />
          <h1 className="text-xl font-bold text-white">InvoSync</h1>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/documents" className="sidebar-link">
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </Link>
          <Link to="/analytics" className="sidebar-link">
            <CreditCard className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
          <Link to="#" className="sidebar-link">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link to="#" className="sidebar-link">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
          <div className="user-profile">
            <span className="user-name">John Doe</span>
            <div className="user-avatar">JD</div>
          </div>
        </header>
        
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Total Bills</h3>
              <p className="stat-value">12</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Upcoming Payments</h3>
              <p className="stat-value">3</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Monthly Spending</h3>
              <p className="stat-value">$1,245</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Saved This Month</h3>
              <p className="stat-value">$320</p>
            </div>
          </div>
          
          <div className="recent-section">
            <h2 className="section-title">Recent Bills</h2>
            <div className="bills-list">
              <div className="bill-item">
                <FileText className="w-6 h-6 text-blue-600" />
                <div className="bill-details">
                  <h4 className="bill-title">Electricity Bill</h4>
                  <p className="bill-date">Due: Apr 15, 2025</p>
                </div>
                <p className="bill-amount">$128.45</p>
              </div>
              <div className="bill-item">
                <FileText className="w-6 h-6 text-blue-600" />
                <div className="bill-details">
                  <h4 className="bill-title">Internet Service</h4>
                  <p className="bill-date">Due: Apr 20, 2025</p>
                </div>
                <p className="bill-amount">$89.99</p>
              </div>
              <div className="bill-item">
                <FileText className="w-6 h-6 text-blue-600" />
                <div className="bill-details">
                  <h4 className="bill-title">Water Bill</h4>
                  <p className="bill-date">Due: Apr 25, 2025</p>
                </div>
                <p className="bill-amount">$45.30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;