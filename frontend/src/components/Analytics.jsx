import React, { useState, useEffect } from 'react';
import supabase from '../config/superbaseClient';
import { useAuth } from '../components/authcontext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
  const { user } = useAuth(); // Assumes useAuth gives you `user`
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

  if (loading) return <div className="text-center p-10">Loading analytics...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Analytics Dashboard</h1>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Invoices" value={stats.totalInvoices} color="text-blue-600" />
        <StatCard title="Paid" value={stats.paidInvoices} color="text-green-600" />
        <StatCard title="Pending" value={stats.pendingInvoices} color="text-orange-600" />
        <StatCard title="Total Amount" value={`₹${stats.totalAmount.toFixed(2)}`} color="text-purple-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Invoice Status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareStatusData()}
                dataKey="value"
                outerRadius={100}
                label
              >
                {prepareStatusData().map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

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
  <div className="bg-white shadow rounded-lg p-4 text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default Analytics;
