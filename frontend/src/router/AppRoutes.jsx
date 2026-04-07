import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Login from '../features/auth/Login';
import Profile from '../features/auth/Profile';
import Dashboard from '../features/dashboard/Dashboard';
import CompaniesList from '../features/companies/CompaniesList';
import ServicesList from '../features/services/ServicesList';
import ReportsList from '../features/reports/ReportsList';
import FinanceList from '../features/finance/FinanceList';
import ContractsList from '../features/contracts/ContractsList';
import Settings from '../features/settings/Settings';
import PublicReport from '../features/reports/PublicReport';
import SubscriptionsList from '../features/subscriptions/SubscriptionsList';
import ReceiptVouchersList from '../features/finance/ReceiptVouchersList';
import PaymentVouchersList from '../features/finance/PaymentVouchersList';
import EmployeesManagement from '../features/employees/EmployeesManagement';
import CommissionsList from '../features/employees/CommissionsList';
import EmployeeRequestsList from '../features/employees/EmployeeRequestsList';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reports/share/:token" element={<PublicReport />} />

      {/* Internal Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'manager', 'employee']} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="companies" element={<CompaniesList />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="reports" element={<ReportsList />} />
          <Route path="finance" element={<FinanceList />} />
          <Route path="contracts" element={<ContractsList />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        <Route path="reports/share/:token" element={<PublicReport />} />
        <Route path="subscriptions" element={<SubscriptionsList />} />
        
        {/* Finance */}
        <Route path="finance/receipts" element={<ReceiptVouchersList />} />
        <Route path="finance/payments" element={<PaymentVouchersList />} />
        
        {/* Employees */}
        <Route path="employees" element={<EmployeesManagement />} />
        <Route path="employees/commissions" element={<CommissionsList />} />
        <Route path="employees/requests" element={<EmployeeRequestsList />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
