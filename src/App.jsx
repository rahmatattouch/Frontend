import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from "./context/GlobalContext";
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

// ── Lazy-loaded pages (code splitting – reduces initial bundle) ──────────────
const Home            = lazy(() => import('./pages/Home'));
const Login           = lazy(() => import('./pages/Login'));
const Register        = lazy(() => import('./pages/Register'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const Statistics      = lazy(() => import('./pages/Statistics'));
const Labs            = lazy(() => import('./pages/Labs'));
const Settings        = lazy(() => import('./pages/Settings'));
const UsersPage       = lazy(() => import('./pages/UsersPage'));
const AdminAudits     = lazy(() => import('./pages/AdminAudits'));
const AdminUsers      = lazy(() => import('./pages/AdminUsers'));
const AdminSettings   = lazy(() => import('./pages/AdminSettings'));

// ── Loading fallback ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GlobalProvider>
        <Router>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/login"          element={<Login />} />
                <Route path="/register"       element={<Register />} />
                <Route path="/dashboard"      element={<ClientDashboard />} />
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                <Route path="/statistics"     element={<Statistics />} />
                <Route path="/labs"           element={<Labs />} />
                <Route path="/settings"       element={<Settings />} />
                <Route path="/users"          element={<UsersPage />} />
                <Route path="/AdminAudits"    element={<AdminAudits />} />
                <Route path="/AdminUsers"     element={<AdminUsers />} />
                <Route path="/AdminSettings"  element={<AdminSettings />} />
                <Route path="*"              element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </Router>
      </GlobalProvider>
    </ErrorBoundary>
  );
}

export default App;