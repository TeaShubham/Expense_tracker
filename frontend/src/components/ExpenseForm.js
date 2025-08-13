import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ onSubmit, editingExpense, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    comments: ''
  });
  const [loading, setLoading] = useState(false);

 
  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Groceries',
    'Other'
  ];

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        category: editingExpense.category,
        amount: editingExpense.amount.toString(),
        comments: editingExpense.comments || ''
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      if (!editingExpense) {
        // Reset form only for new expenses
        setFormData({
          category: '',
          amount: '',
          comments: ''
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            disabled={loading}
            placeholder="0.00"
          />
        </div>
        
        <div className="form-group">
          <label>Comments (optional):</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            disabled={loading}
            placeholder="Add any notes about this expense..."
            rows="3"
          />
        </div>
        
        <div className="form-buttons">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Add Expense')}
          </button>
          
          {editingExpense && (
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;