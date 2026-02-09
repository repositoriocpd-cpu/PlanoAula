import { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { DailyLessons } from './pages/DailyLessons';
import { AnnualPlan } from './pages/AnnualPlan';
import { DidacticSequence } from './pages/DidacticSequence';
import { Assessments } from './pages/Assessments';
import { Reports } from './pages/Reports';
import { Library } from './pages/Library';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BNCCInfo } from './pages/BNCCInfo';
import { InstallBanner } from './components/InstallBanner';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <InstallBanner />
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }>
              <Route index element={<Home />} />
              <Route path="daily-lessons" element={<DailyLessons />} />
              <Route path="annual-plan" element={<AnnualPlan />} />
              <Route path="didactic-sequence" element={<DidacticSequence />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="reports" element={<Reports />} />
              <Route path="library" element={<Library />} />
              <Route path="library/bncc-info" element={<BNCCInfo />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
