import { useState, useEffect } from 'react';

export default function BudgetForm() {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

  useEffect(() => {
    fetch('/api/budgets')
      .then((r) => r.json())
      .then((data) => {
        setBudgets(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount: parseFloat(amount) }),
      });
      if (res.ok) {
        const budget = await res.json();
        setBudgets([...budgets.filter((b) => b.category !== category), budget]);
        setMessage('Budget set successfully!');
        setCategory('');
        setAmount('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to set budget.');
      }
    } catch (err) {
      setMessage('Error setting budget.');
    }
  };

  if (loading) return <div className="empty-state">Loading budgets...</div>;

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Set Budgets</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            {categories.map((c) => ( <option key={c} value={c}>{c}</option> ))}
          </select>
        </div>
        <div className="form-group">
          <label>Monthly Budget ($)</label>
          <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <button className="btn" type="submit" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
          Set Budget
        </button>
      </form>
      {message && <div style={{ marginTop: '16px', padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '6px' }}>{message}</div>}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>Current Budgets</h3>
        {budgets.length === 0 ? (
          <p style={{ color: '#64748b' }}>No budgets set yet.</p>
        ) : (
          <ul>
            {budgets.map((b) => (
              <li key={b.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{b.category}</span>
                <span>${b.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
