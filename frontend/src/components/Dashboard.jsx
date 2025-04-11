import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, LogOut, User, Settings, FileText, CreditCard, Home } from 'lucide-react';
import FileUpload from './Fileupload'; 
import supabase from '../config/superbaseClient';
import { useEffect, useState } from 'react';

function Dashboard() {
  const [fullName, setFullName] = useState('');
  const [totalBills, setTotalBills] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [topVendors, setTopVendors] = useState([]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); // Get the current user
        if (user) {
          const { data, error } = await supabase
            .from('profile') // Replace 'profile' with your actual table name
            .select('username') // Replace 'username' with the column storing the full name
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setFullName(data.username); // Set the fetched name
        }
      } catch (error) {
        console.error('Error fetching user name:', error.message);
      }
    };

    const fetchTotalBills = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); // Get the current user
        if (user) {
          const { count, error } = await supabase
            .from('invoices') // Replace 'invoices' with your actual table name
            .select('*', { count: 'exact' }) // Fetch the count of rows
            .eq('user_id', user.id); // Filter by the user's ID
    
          if (error) throw error;
          setTotalBills(count); // Set the total number of bills for the user
        }
      } catch (error) {
        console.error('Error fetching total bills:', error.message);
      }
    };

    const fetchTotalSpending = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); // Get the current user
        if (user) {
          const { data, error } = await supabase
            .from('invoices') // Replace 'invoices' with your actual table name
            .select('amount') // Replace 'amount' with the column storing the bill amount
            .eq('user_id', user.id); // Filter by the user's ID
    
          if (error) throw error;
    
          // Filter out invalid or null amounts and calculate the total spending
          const totalSpending = data
            .filter(bill => bill.amount !== null && !isNaN(Number(bill.amount))) // Ensure valid numbers
            .reduce((sum, bill) => sum + Number(bill.amount), 0);
    
          setTotalSpending(totalSpending); // Set the total spending
        }
      } catch (error) {
        console.error('Error fetching total spending:', error.message);
      }
    };

    const fetchTopVendors = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); // Get the current user
        if (user) {
          const { data, error } = await supabase
            .from('invoices') // Replace 'invoices' with your actual table name
            .select('vendor, amount') // Replace 'vendor' and 'amount' with your actual column names
            .eq('user_id', user.id); // Filter by the user's ID
    
          if (error) throw error;
    
          // Group by vendor and calculate total spending per vendor
          const vendorTotals = data.reduce((acc, bill) => {
            if (bill.vendor && bill.amount) {
              acc[bill.vendor] = (acc[bill.vendor] || 0) + Number(bill.amount);
            }
            return acc;
          }, {});
    
          // Sort vendors by total spending and get the top 3
          const topVendors = Object.entries(vendorTotals)
            .sort((a, b) => b[1] - a[1]) // Sort by total spending (descending)
            .slice(0, 3); // Get the top 3 vendors
    
          setTopVendors(topVendors); // Set the top vendors in state
        }
      } catch (error) {
        console.error('Error fetching top vendors:', error.message);
      }
    };
    

    fetchUserName();
    fetchTotalBills();
    fetchTotalSpending();
    fetchTopVendors(); // Call the function to fetch total spending
  }, []); 




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
          <Link to="/documents" className="sidebar-link" >
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </Link>
          <Link to="#" className="sidebar-link">
            <Settings className="w-5 h-5" />
            <span>Bills</span>
          </Link>
          <Link to="/analytics" className="sidebar-link">
            <CreditCard className="w-5 h-5" />
            <span>Analytics</span>
          </Link>
          {/* <Link to="#" className="sidebar-link">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link to="#" className="sidebar-link">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link> */}

        
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
          <h1 className="text-2xl font-bold">Welcome, {fullName || 'User'}!</h1>
          {/* <div className="user-profile">
            <span className="user-name">John Doe</span>
            <div className="user-avatar">JD</div>
          </div> */}
        </header>
        <div>
          <FileUpload className="w-6 h-6 text-blue-600" />
          <h2 className="upload-title">Upload Your Bills</h2>
        </div>
        
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Total Bills</h3>
              <p className="stat-value">{totalBills}</p>
            </div>
            {/* <div className="stat-card">
              <h3 className="stat-title">Upcoming Payments</h3>
              <p className="stat-value">3</p>
            </div> */}
            <div className="stat-card">
              <h3 className="stat-title">Total Spending</h3>
              <p className="stat-value">{totalSpending}</p>
            </div>
            <div className="stat-card" style={{ width: '200%' }}>
              <h3 className="stat-title">Top vendors</h3>
              <p className="stat-value"></p>
              <ul className="stat-value">
                {topVendors.map(([vendor, total], index) => (
                <li key={index}>
                {vendor}
                </li>
                ))}
            </ul>
            </div>
            {/* <div className="stat-card">
              <h3 className="stat-title">Saved This Month</h3>
              <p className="stat-value">$320</p>
            </div> */}
          </div>
          
          {/* <div className="recent-section">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;