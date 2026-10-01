import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import AppShell from './layouts/AppShell';
import type { UserRole } from './types';

function ProtectedRoute({ role }: { role?: UserRole }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) return <Navigate to={`/${currentUser.role}`} replace />;
  return null;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to={`/${currentUser.role}`} replace /> : <LoginPage />}
      />
      <Route
        path="/admin/*"
        element={
          currentUser?.role === 'admin'
            ? <AppShell initialPage="dashboard" />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/examiner/*"
        element={
          currentUser?.role === 'examiner'
            ? <AppShell initialPage="dashboard" />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/moderator/*"
        element={
          currentUser?.role === 'moderator'
            ? <AppShell initialPage="dashboard" />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/student/*"
        element={
          currentUser?.role === 'student'
            ? <AppShell initialPage="dashboard" />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/"
        element={
          currentUser
            ? <Navigate to={`/${currentUser.role}`} replace />
            : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
