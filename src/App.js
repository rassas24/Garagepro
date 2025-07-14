import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from './theme/theme';
import GlobalStyles from './styles/GlobalStyles';

// Layout Components
import Layout from './components/Layout/Layout';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Recordings from './pages/Recordings';
import Customers from './pages/Customers';
import Cameras from './pages/Cameras';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SettingsConsole from './pages/SettingsConsole';
import AddBranchPage from './pages/AddBranchPage';
import AddCameraPage from './pages/AddCameraPage';
import AddJobPage from './pages/AddJobPage';
import JobDetailsPage from './pages/JobDetailsPage';
import HistoryJobsPage from './pages/HistoryJobsPage';
import BranchCameras from './pages/BranchCameras';
import PublicStreamView from './pages/PublicStreamView';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { BranchProvider } from './context/BranchContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App Content
function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <AuthProvider>
          <BranchProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/stream/:jobId/:cameraId" element={<PublicStreamView />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Sidebar />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Header />
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/dashboard/branch/:branchId" element={<Dashboard />} />
                          <Route path="/dashboard/branch/:branchId/jobs/new" element={<AddJobPage />} />
                          <Route path="/dashboard/jobs/new" element={<AddJobPage />} />
                          <Route path="/dashboard/jobs/:jobId" element={<JobDetailsPage />} />
                          <Route path="/dashboard/branch/:branchId/jobs/:jobId" element={<JobDetailsPage />} />
                          <Route path="/dashboard/history" element={<HistoryJobsPage />} />
                          <Route path="/dashboard/branch/:branchId/history" element={<HistoryJobsPage />} />
                          <Route path="/recordings" element={<Recordings />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/cameras" element={<Cameras />} />
                          <Route path="/cameras/new" element={<AddCameraPage />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/branches/new" element={<AddBranchPage />} />
                          <Route path="/settings-console" element={<SettingsConsole />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/branch-cameras" element={<BranchCameras />} />
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BranchProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;