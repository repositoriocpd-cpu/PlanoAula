import { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { DailyLessons } from './pages/DailyLessons';
import { AnnualPlan } from './pages/AnnualPlan';
import { DidacticSequence } from './pages/DidacticSequence';
import { Assessments } from './pages/Assessments';
import { Reports } from './pages/Reports';
import { Resources } from './pages/Resources';
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

function AdminRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

import { isConfigured } from './services/supabase';

function App() {
  if (!isConfigured) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-100 rounded-full">
              <Loader2 className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuração Necessária</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            O sistema está rodando, mas não encontrou as chaves do Supabase.
            Por favor, verifique o arquivo <code className="bg-gray-100 px-2 py-1 rounded">.env</code> na raiz do projeto e insira as credenciais reais.
          </p>
          <div className="bg-amber-50 rounded-lg p-4 text-left border border-amber-100 mb-6">
            <p className="text-sm text-amber-800 font-medium mb-2">Variáveis faltantes:</p>
            <ul className="text-xs text-amber-700 space-y-1 font-mono">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-purple-200"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

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
              <Route path="resources" element={<Resources />} />
              <Route path="library" element={<Library />} />
              <Route path="library/bncc-info" element={<BNCCInfo />} />
              <Route path="settings" element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              } />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
