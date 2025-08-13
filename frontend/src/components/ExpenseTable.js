import React from 'react';

const ExpenseTable = ({ expenses, onEdit, onDelete, loading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return (
      <div className="no-expenses">
        <h3>No expenses yet</h3>
        <p>Add your first expense using the form above.</p>
      </div>
    );
  }

  return (
    <div className="expense-table-container">
      <h3>Your Expenses</h3>
      
      <div className="table-responsive">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Comments</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <span className="category-tag">{expense.category}</span>
                </td>
                <td className="amount-cell">
                  {formatAmount(expense.amount)}
                </td>
                <td className="comments-cell">
                  {expense.comments || '-'}
                </td>
                <td className="date-cell">
                  {formatDate(expense.createdAt)}
                </td>
                <td className="date-cell">
                  {formatDate(expense.updatedAt)}
                </td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => onEdit(expense)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => onDelete(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="expense-summary">
        <strong>
          Total Expenses: {formatAmount(
            expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
          )}
        </strong>
      </div>
    </div>
  );
};

export default ExpenseTable;