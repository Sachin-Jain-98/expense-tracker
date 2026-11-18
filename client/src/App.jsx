import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import BudgetForm from './components/BudgetForm';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <Link to="/" style={{ fontSize: '20px', fontWeight: '700' }}>
              Expense Tracker
            </Link>
            <div>
              <Link to="/">Dashboard</Link>
              <Link to="/add">Add Expense</Link>
              <Link to="/budgets">Budgets</Link>
            </div>
          </div>
        </nav>
        <div className="container" style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="/add" element={<ExpenseForm />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/budgets" element={<BudgetForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
