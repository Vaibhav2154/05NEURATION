import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/authcontext';
import LandingPage from './components/LandingPage';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import Dashboard from './components/Dashboard';
import Documents from './components/Documents';
import Templates from './components/Templates';
import Analytics from './components/Analytics';
import FileUpload from './components/Fileupload';
import InvoiceFileAccess from './components/Getallinvoice';

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fileupload"
            element={
              <ProtectedRoute>
                <FileUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/getinvoices"
            element={
              <ProtectedRoute>
                <InvoiceFileAccess />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to the landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;