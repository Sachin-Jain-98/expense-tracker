import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/adapters/date-fns';

export default function Summary() {
  const [data, setData] = useState({ total: 0, byCategory: {}, budget: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/summary')
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const chartData = {
    labels: Object.keys(data.byCategory),
    datasets: [{
      label: 'Spending by Category',
      data: Object.values(data.byCategory),
      backgroundColor: [
        '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#7c3aed', '#db2777', '#0891b2',
      ],
    }],
  };

  if (loading) return <div className="empty-state">Loading summary...</div>;

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Spending Summary</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-value">${data.total.toFixed(2)}</div>
          <div className="summary-label">Total Spent</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{Object.keys(data.byCategory).length}</div>
          <div className="summary-label">Categories</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">${data.budget.reduce((s, b) => s + b.amount, 0).toFixed(2)}</div>
          <div className="summary-label">Total Budget</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">${(data.budget.reduce((s, b) => s + b.amount, 0) - data.total).toFixed(2)}</div>
          <div className="summary-label">Remaining</div>
        </div>
      </div>
      <div className="chart-container">
        <Bar data={chartData} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link to="/add" className="btn">Add New Expense</Link>
        <Link to="/budgets" className="btn btn-outline" style={{ marginLeft: '10px' }}>Manage Budgets</Link>
      </div>
    </div>
  );
}
