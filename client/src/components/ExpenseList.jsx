import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/expenses')
      .then((r) => r.json())
      .then((data) => {
        setExpenses(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteExpense = (id) => {
    if (!confirm('Delete this expense?')) return;
    fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      .then(() => setExpenses(expenses.filter((e) => e.id !== id)));
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  if (loading) return <div className="empty-state">Loading expenses...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ color: '#1e293b' }}>All Expenses</h2>
        <Link to="/add" className="btn">Add Expense</Link>
      </div>
      <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Total: ${total.toFixed(2)}</div>
      {expenses.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 20px' }}>No expenses yet.</div>
      ) : (
        <div>
          {expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((e) => (
              <div key={e.id} className="expense-item">
                <div className="expense-info">
                  <div className="expense-name">{e.description || e.category}</div>
                  <div className="expense-meta">{e.category} &bull; {e.date}</div>
                </div>
                <div>
                  <div className="expense-amount">-${e.amount.toFixed(2)}</div>
                  <button
                    onClick={() => deleteExpense(e.id)}
                    style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
