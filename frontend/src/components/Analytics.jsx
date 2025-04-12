import React, { useState, useEffect } from 'react';
import supabase from '../config/superbaseClient';
import { useAuth } from '../components/authcontext';
import '../styles/Analytics.css'; // 👈 Import the custom CSS
import '../styles/Dashboard.css'; // 👈 Import the custom CSS for dashboard

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setInvoices(data);
        calculateStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invoices:', err.message);
        setError('Failed to fetch invoice data');
        setLoading(false);
      }
    };

    if (user?.id) fetchInvoices();
  }, [user]);

  const calculateStats = (data) => {
    const totalInvoices = data.length;
    const paidInvoices = data.filter(inv => inv.status === 'Paid').length;
    const pendingInvoices = data.filter(inv => inv.status === 'Pending').length;
    const totalAmount = data.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);

    setStats({
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalAmount
    });
  };

  const COLORS = ['#00C49F', '#FFBB28'];

  const prepareStatusData = () => ([
    { name: 'Paid', value: stats.paidInvoices },
    { name: 'Pending', value: stats.pendingInvoices }
  ]);

  const prepareMonthlyData = () => {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('default', { month: 'long' })
    );
    const monthly = {};

    invoices.forEach(inv => {
      const month = new Date(inv.date).getMonth();
      monthly[month] = (monthly[month] || 0) + (parseFloat(inv.amount) || 0);
    });

    return months.map((name, idx) => ({
      name,
      amount: monthly[idx] || 0
    }));
  };

  const prepareDayOfWeekData = () => {
    const dayMap = {};
    invoices.forEach(inv => {
      const day = new Date(inv.date).toLocaleString('default', { weekday: 'long' });
      dayMap[day] = (dayMap[day] || 0) + (parseFloat(inv.amount) || 0);
    });
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days.map(name => ({
      name,
      amount: dayMap[name] || 0
    }));
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <button className="back-button" onClick={() => window.history.back()}>Back</button>
      <h1 className="dashboard-title">Analytics Dashboard</h1>

      <div className="grid">
        <StatCard title="Total Invoices" value={stats.totalInvoices} color="text-blue-600" />
        <StatCard title="Paid" value={stats.paidInvoices} color="text-green-600" />
        <StatCard title="Pending" value={stats.pendingInvoices} color="text-orange-600" />
        <StatCard title="Total Amount" value={`₹${stats.totalAmount.toFixed(2)}`} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
      
        <ChartCard title="Monthly Spending">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Spending by Day">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareDayOfWeekData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="stat-card">
    <h3 className="stat-title">{title}</h3>
    <p className={`stat-value ${color}`}>{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="chart-card">
    <h2 className="chart-title">{title}</h2>
    {children}
  </div>
);

export default Analytics;
