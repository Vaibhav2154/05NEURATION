import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, LogOut, User, Settings, FileText, CreditCard, Home } from 'lucide-react';
import FileUpload from './Fileupload';
import supabase from '../config/superbaseClient';
import '../styles/Dashboard.css'; // Import your CSS file for styling
import logo from '../assets/ico2.png'; // Import your logo image

function Dashboard() {
  const [fullName, setFullName] = useState('');
  const [totalBills, setTotalBills] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [topVendors, setTopVendors] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', email: '', phone: '', company: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profile')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setFullName(data.username);
          setProfile(data);
          setProfileForm({
            username: data.username || '',
            email: data.email || '',
            phone: data.phone || '',
            company: data.company || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      }
    };

    const fetchTotalBills = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { count, error } = await supabase
            .from('invoices')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id);

          if (error) throw error;
          setTotalBills(count);
        }
      } catch (error) {
        console.error('Error fetching total bills:', error.message);
      }
    };

    const fetchTotalSpending = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('invoices')
            .select('amount')
            .eq('user_id', user.id);

          if (error) throw error;

          const total = data.filter(b => b.amount !== null && !isNaN(Number(b.amount)))
            .reduce((sum, b) => sum + Number(b.amount), 0);

          setTotalSpending(total);
        }
      } catch (error) {
        console.error('Error fetching total spending:', error.message);
      }
    };

    const fetchTopVendors = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('invoices')
            .select('vendor, amount')
            .eq('user_id', user.id);

          if (error) throw error;

          const vendorTotals = data.reduce((acc, b) => {
            if (b.vendor && b.amount) {
              acc[b.vendor] = (acc[b.vendor] || 0) + Number(b.amount);
            }
            return acc;
          }, {});

          const top = Object.entries(vendorTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);
          setTopVendors(top);
        }
      } catch (error) {
        console.error('Error fetching top vendors:', error.message);
      }
    };

    fetchProfile();
    fetchTotalBills();
    fetchTotalSpending();
    fetchTopVendors();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profile').update(profileForm).eq('id', user.id);
      if (!error) {
        setEditingProfile(false);
        setShowProfile(false);
        window.location.reload();
      } else {
        console.error('Profile update error:', error);
      }
    } catch (err) {
      console.error('Error updating profile:', err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className='sidebar-logo-container'>
            <img src={logo} alt="" className="sidebar-logo" />
            <span className="logo-text">InvoSync</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">
            <Home className="w-5 h-5" /><span>Home</span>
          </Link>
          <Link to="/documents" className="sidebar-link">
            <FileText className="w-5 h-5" /><span>Documents</span>
          </Link>
          <Link to="/analytics" className="sidebar-link">
            <CreditCard className="w-5 h-5" /><span>Analytics</span>
          </Link>
          <Link to="/getinvoices" className="sidebar-link">
            <Settings className="w-5 h-5" /><span>Bills</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link">
            <LogOut className="w-5 h-5" /><span>Logout</span>
          </Link>
        </div>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="text-2xl font-bold">Welcome, {fullName || 'User'}!</h1>
          <div className="user-profile">
            <div className="user-info" onClick={() => setShowProfile(!showProfile)}>
              <div className="user-avatar">{fullName?.[0]?.toUpperCase() || 'U'}</div>
              <span className="user-name">{fullName || 'User'}</span>
            </div>

            {showProfile && (
              <div className="profile-dropdown">
                {!editingProfile ? (
                  <>
                    <h3>Profile</h3>
                    <p><strong>Username:</strong> {profile?.username}</p>
                    <p><strong>Email:</strong> {profile?.email}</p>
                    <p><strong>Phone:</strong> {profile?.phone}</p>
                    <p><strong>Company:</strong> {profile?.company}</p>
                    <button className="edit-btn" onClick={() => setEditingProfile(true)}>Edit Profile</button>
                    <Link to="/" className="sidebar-link logout-btn">
                      <LogOut className="w-5 h-7" />
                      <span>Logout</span>
                    </Link>
                  </>
                ) : (
                  <div className="edit-profile-form">
                    <input name="username" value={profileForm.username} onChange={handleProfileChange} placeholder="Username" />
                    <input name="email" value={profileForm.email} onChange={handleProfileChange} placeholder="Email" />
                    <input name="phone" value={profileForm.phone} onChange={handleProfileChange} placeholder="Phone" />
                    <input name="company" value={profileForm.company} onChange={handleProfileChange} placeholder="Company" />
                    <button className="save-btn" onClick={handleProfileSave}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingProfile(false)}>Cancel</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <div className="dashboard-content">
          <div className="stats-grid-home">
            <div className="stat-card-home" style={{ width: '200%' }}>
              <h3 className="stat-title">Top vendors</h3>
              <ul className="stat-value">
                {topVendors.map(([vendor], index) => (
                  <li key={index}>{vendor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="upload-title">
          <h2>Upload Your Bills</h2>
        </div>
        <div>
          <FileUpload className="w-6 h-6 text-blue-600" />
        </div>


      </div>
    </div>
  );
}

export default Dashboard;
