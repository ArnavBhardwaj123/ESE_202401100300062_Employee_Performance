import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import AddEmployeePage from './pages/AddEmployeePage';
import EditEmployeePage from './pages/EditEmployeePage';
import AIRecommendationPage from './pages/AIRecommendationPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/employees"
            element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>}
          />
          <Route
            path="/employees/add"
            element={<ProtectedRoute><AddEmployeePage /></ProtectedRoute>}
          />
          <Route
            path="/employees/edit/:id"
            element={<ProtectedRoute><EditEmployeePage /></ProtectedRoute>}
          />
          <Route
            path="/ai-recommendations"
            element={<ProtectedRoute><AIRecommendationPage /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
