const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory state
let expenses = [];
let budgets = [];

// GET all expenses
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// POST add expense
app.post('/api/expenses', (req, res) => {
  const { amount, category, description, date } = req.body;
  if (!amount || !category) {
    return res.status(400).json({ error: 'Amount and category are required' });
  }
  const expense = {
    id: uuidv4(),
    amount: parseFloat(amount),
    category,
    description: description || '',
    date: date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
  expenses.push(expense);
  res.json(expense);
});

// DELETE expense
app.delete('/api/expenses/:id', (req, res) => {
  expenses = expenses.filter((e) => e.id !== req.params.id);
  res.json({ success: true });
});

// GET all budgets
app.get('/api/budgets', (req, res) => {
  res.json(budgets);
});

// POST set budget
app.post('/api/budgets', (req, res) => {
  const { category, amount } = req.body;
  if (!category || !amount) {
    return res.status(400).json({ error: 'Category and amount are required' });
  }
  const existing = budgets.find((b) => b.category === category);
  if (existing) {
    existing.amount = parseFloat(amount);
    res.json(existing);
  } else {
    const budget = { id: uuidv4(), category, amount: parseFloat(amount) };
    budgets.push(budget);
    res.json(budget);
  }
});

// GET spending summary
app.get('/api/summary', (req, res) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = {};
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });
  res.json({ total, byCategory, budget: budgets });
});

// Serve static frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Expense tracker server running on port ${PORT}`);
});

module.exports = app;
