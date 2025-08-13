import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { expenseAPI, logout } from '../services/api';


ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Chart = () => {
  const [statsData, setStatsData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
  ];

  useEffect(() => {
    
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getStats();
      const { stats, totalExpenses } = response.data;
      
      setStatsData({ stats, totalExpenses });

      
      if (stats.length > 0) {
        setChartData({
          labels: stats.map(stat => stat.category),
          datasets: [{
            label: 'Expense Amount',
            data: stats.map(stat => stat.total),
            backgroundColor: colors.slice(0, stats.length),
            borderColor: colors.slice(0, stats.length).map(color => color + '80'),
            borderWidth: 2,
            hoverOffset: 10
          }]
        });
      }

    } catch (err) {
      setError('Failed to fetch expense statistics');
      console.error('Fetch stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Expense Distribution by Category',
        font: { size: 18, weight: 'bold' }
      },
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'INR'
            }).format(context.raw);
            const percentage = ((context.raw / statsData.totalExpenses) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Expense Analytics</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <nav className="nav-links">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/chart" className="nav-link active">Analytics</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="chart-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading">Loading analytics...</div>
          </div>
        ) : statsData?.stats?.length === 0 ? (
          <div className="no-data">
            <h3>No expense data available</h3>
            <p>Add some expenses to see your analytics.</p>
            <Link to="/dashboard" className="add-expense-link">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <section className="analytics-summary">
              <div className="summary-cards">
                <div className="summary-card">
                  <h3>Total Spent</h3>
                  <p className="summary-value">
                    ₹{statsData?.totalExpenses?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="summary-card">
                  <h3>Categories</h3>
                  <p className="summary-value">{statsData?.stats?.length || 0}</p>
                </div>
                <div className="summary-card">
                  <h3>Top Category</h3>
                  <p className="summary-value">
                    {statsData?.stats?.[0]?.category || 'N/A'}
                  </p>
                </div>
              </div>
            </section>

            
            <section className="chart-section">
              <div className="chart-wrapper">
                {chartData && (
                  <div className="pie-chart-container">
                    <Pie data={chartData} options={chartOptions} />
                  </div>
                )}
              </div>
            </section>

            
            <section className="stats-table-section">
              <h3>Category Breakdown</h3>
              <div className="table-responsive">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Amount</th>
                      <th>Percentage</th>
                      <th>Count</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsData?.stats?.map((stat, index) => (
                      <tr key={stat.category}>
                        <td>
                          <div className="category-row">
                            <span 
                              className="color-indicator" 
                              style={{ backgroundColor: colors[index] }}
                            ></span>
                            {stat.category}
                          </div>
                        </td>
                        <td className="amount-cell">
                          ₹{stat.total.toFixed(2)}
                        </td>
                        <td className="percentage-cell">
                          {stat.percentage}%
                        </td>
                        <td className="count-cell">
                          {stat.count}
                        </td>
                        <td className="average-cell">
                          ₹{(stat.total / stat.count).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Chart;