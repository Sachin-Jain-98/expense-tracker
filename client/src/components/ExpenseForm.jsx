import { useState } from 'react';

export default function ExpenseForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), category, description, date }),
      });
      if (res.ok) {
        setMessage('Expense added successfully!');
        setAmount('');
        setCategory('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to add expense.');
      }
    } catch (err) {
      setMessage('Error adding expense.');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px' }}>
      <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount ($)</label>
          <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select category</option>
            {categories.map((c) => ( <option key={c} value={c}>{c}</option> ))}
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button className="btn" type="submit" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
          Add Expense
        </button>
      </form>
      {message && <div style={{ marginTop: '16px', padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '6px' }}>{message}</div>}
    </div>
  );
}
