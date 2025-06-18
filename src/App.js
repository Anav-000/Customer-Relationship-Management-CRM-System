import React from 'react';
// Add these imports at the top of App.js
import './App.css'; // Verify this file exists
import 'tailwindcss/tailwind.css'; // If using Tailwind
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard.js'; // dashboard component
// import Sidebar from './components/Sidebar.js'; // Sidebar component
import Parties from './pages/Parties.js';
import TableComponent from './components/TableComponent.js';
import SaleForm from './components/SaleForm.js';
import Quotation from './pages/Quotation.js';
import Setting from './pages/Setting.js';
import Payment from './pages/Payment.js';
import StaffAttendance from './pages/StaffAttendance.js';
import StaffSalary from './pages/StaffSalary.js';
import Users from './pages/Users.js';
import Reports from './pages/Reports.js';
import BankReport from './pages/BankReport.js';
import CashReport from './pages/Cash.js';
import ChequeReport from './pages/Cheque.js';
import SalesOrderForm from './components/SalesOrderForm.js';
import { AuthProvider } from './context/AuthContext';
import PrivateLayout from './components/PrivateLayout';
import Login from './pages/Login';
import PurchaseBill from './pages/PurchaseBills.js';

function App() {
  return (

    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* All protected routes */}
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/parties" element={<Parties />} />
            <Route path="/items" element={<TableComponent/>} />
            <Route path="/SaleForm" element={<SaleForm/>} />
            <Route path="/sale-order" element={<SalesOrderForm/>} />
            <Route path="/Quotation" element={<Quotation/>} />
            <Route path="/Settings" element={<Setting/>} />
            <Route path="/purchase-bills" element={<PurchaseBill/>} />
            <Route path="/payment-out" element={<PurchaseBill/>} />
            <Route path="/expense" element={<PurchaseBill/>} />
            <Route path="/payment-in" element={<Payment/>} />
            <Route path="/staffAttendance" element={<StaffAttendance/>} />
            <Route path="/staffSalary" element={<StaffSalary/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="/reports" element={<Reports/>} />
            <Route path="/bank-account" element={<BankReport/>} />
            <Route path="/cash-in-hand" element={<CashReport/>} />
            <Route path="/cheque" element={<ChequeReport/>} />
            {/* Add all other protected routes here */}
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
