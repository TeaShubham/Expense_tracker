import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import { expenseAPI, logout } from '../services/api';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll();
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to fetch expenses');
      console.error('Fetch expenses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await expenseAPI.create(expenseData);
      setExpenses([response.data.expense, ...expenses]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
      throw err;
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    try {
      const response = await expenseAPI.update(editingExpense.id, expenseData);
      const updatedExpenses = expenses.map(exp => 
        exp.id === editingExpense.id ? response.data.expense : exp
      );
      setExpenses(updatedExpenses);
      setEditingExpense(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update expense');
      throw err;
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(expenseId);
        setExpenses(expenses.filter(exp => exp.id !== expenseId));
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete expense');
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Expense Tracker</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <nav className="nav-links">
              <Link to="/dashboard" className="nav-link active">Dashboard</Link>
              <Link to="/chart" className="nav-link">Analytics</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>
          </div>
        </div>
      </header>

      
      <main className="dashboard-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

        
        <section className="form-section">
          <ExpenseForm 
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            editingExpense={editingExpense}
            onCancel={handleCancelEdit}
          />
        </section>

        
        <section className="table-section">
          <ExpenseTable 
            expenses={expenses}
            loading={loading}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </section>

        
        {expenses.length > 0 && (
          <section className="stats-section">
            <div className="stats-card">
              <h3>Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Expenses</span>
                  <span className="stat-value">{expenses.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Amount</span>
                  <span className="stat-value">
                    ₹{expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Categories</span>
                  <span className="stat-value">
                    {new Set(expenses.map(exp => exp.category)).size}
                  </span>
                </div>
              </div>
              <Link to="/chart" className="view-analytics-link">
                View Detailed Analytics →
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;