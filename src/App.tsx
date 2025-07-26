import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GameProvider, useGame } from './contexts/GameContext';
import Header from './components/layout/Header';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import AuthPage from './pages/AuthPage';
import TeamCreationPage from './pages/TeamCreationPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useGame();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!state.user) {
    return <Navigate to="/auth" replace />;
  }

  if (!state.team) {
    return <Navigate to="/create-team" replace />;
  }

  return <>{children}</>;
}

// Auth Guard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useGame();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (state.user) {
    if (!state.team) {
      return <Navigate to="/create-team" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Team Creation Guard
function TeamCreationGuard({ children }: { children: React.ReactNode }) {
  const { state } = useGame();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!state.user) {
    return <Navigate to="/auth" replace />;
  }

  if (state.team) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// App Layout Component
function AppLayout({ children }: { children: React.ReactNode }) {
  const { state } = useGame();

  return (
    <div className="min-h-screen bg-gray-50">
      {state.user && state.team && <Header />}
      <main>{children}</main>
    </div>
  );
}

// Main App Routes Component
function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/auth"
          element={
            <AuthGuard>
              <AuthPage />
            </AuthGuard>
          }
        />

        {/* Team Creation Route */}
        <Route
          path="/create-team"
          element={
            <TeamCreationGuard>
              <TeamCreationPage />
            </TeamCreationGuard>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tournament"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Tournament</h2>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </AppLayout>
  );
}

// Main App Component
function App() {
  return (
    <GameProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </Router>
    </GameProvider>
  );
}

export default App;