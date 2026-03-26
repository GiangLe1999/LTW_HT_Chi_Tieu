import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Profile from './pages/Profile';
import SavingGoals from './pages/SavingGoals';
import DebtTracker from './pages/DebtTracker';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/goals" element={<SavingGoals />} />
          <Route path="/debts" element={<DebtTracker />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
