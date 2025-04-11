import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/authcontext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const Analytics = () => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalAmount: 0,
    userStats: []
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/invoices', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInvoices(response.data);
        calculateStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('Failed to fetch invoice data');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [token]);

  const calculateStats = (invoicesData) => {
    const totalInvoices = invoicesData.length;
    const paidInvoices = invoicesData.filter(inv => inv.status === 'Paid').length;
    const pendingInvoices = invoicesData.filter(inv => inv.status === 'Pending').length;
    const totalAmount = invoicesData.reduce((sum, inv) => sum + inv.amount, 0);

    // Calculate user stats
    const userStatsMap = {};
    invoicesData.forEach(inv => {
      // Ensure we have user info
      const userId = inv.userId || inv.user?.id || 'unknown';
      const userName = inv.userName || inv.user?.name || 'Unknown User';
      
      if (!userStatsMap[userId]) {
        userStatsMap[userId] = {
          id: userId,
          name: userName,
          count: 0,
          amount: 0,
          paid: 0,
          pending: 0
        };
      }
      userStatsMap[userId].count += 1;
      userStatsMap[userId].amount += inv.amount;
      
      if (inv.status === 'Paid') {
        userStatsMap[userId].paid += 1;
      } else if (inv.status === 'Pending') {
        userStatsMap[userId].pending += 1;
      }
    });

    const userStats = Object.values(userStatsMap).sort((a, b) => b.amount - a.amount);

    setStats({
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      totalAmount,
      userStats
    });
  };

  // Prepare data for charts
  const prepareStatusData = () => {
    return [
      { name: 'Paid', value: stats.paidInvoices },
      { name: 'Pending', value: stats.pendingInvoices }
    ];
  };

  const prepareMonthlyData = () => {
    const monthlyData = {};
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.date);
      const month = months[date.getMonth()];
      
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += invoice.amount;
    });

    return months.map(month => ({
      name: month,
      amount: monthlyData[month] || 0
    }));
  };

  // Group by day of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekData = invoices.reduce((acc, invoice) => {
    const day = new Date(invoice.date).getDay();
    const dayName = daysOfWeek[day];
    
    if (!acc[dayName]) {
      acc[dayName] = 0;
    }
    acc[dayName] += invoice.amount;
    
    return acc;
  }, {});

  const prepareDayOfWeekData = () => {
    return daysOfWeek.map(day => ({
      name: day,
      amount: dayOfWeekData[day] || 0
    }));
  };

  // Top users chart data
  const prepareTopUsersData = () => {
    // Take top 5 users by amount
    return stats.userStats.slice(0, 5).map(user => ({
      name: user.name,
      amount: user.amount
    }));
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#FF8042'];
  const USER_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

  if (loading) return <div className="flex justify-center items-center h-screen">Loading analytics...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Invoice Analytics</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total Invoices</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.totalInvoices}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Paid Invoices</h2>
          <p className="text-2xl font-bold text-green-600">{stats.paidInvoices}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Pending Invoices</h2>
          <p className="text-2xl font-bold text-orange-600">{stats.pendingInvoices}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total Amount</h2>
          <p className="text-2xl font-bold text-purple-600">${stats.totalAmount.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Monthly Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareMonthlyData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Amount ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Day of Week Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue by Day of Week</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareDayOfWeekData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" name="Amount ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Users Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Users by Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareTopUsersData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Amount ($)">
                  {prepareTopUsersData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* User Analytics Table */}
      <div className="bg-white p-4 rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">User Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">User</th>
                <th className="py-2 px-4 border-b">Invoices Count</th>
                <th className="py-2 px-4 border-b">Paid</th>
                <th className="py-2 px-4 border-b">Pending</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.userStats.map((user, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b text-center">{user.count}</td>
                  <td className="py-2 px-4 border-b text-center">{user.paid}</td>
                  <td className="py-2 px-4 border-b text-center">{user.pending}</td>
                  <td className="py-2 px-4 border-b text-right">${user.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;