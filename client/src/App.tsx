import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as AppThemeProvider, useAppTheme } from './contexts/ThemeContext';
import { themes } from './theme';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AIAdvisor } from './components/AIAdvisor';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AppContent() {
  const { themeId } = useAppTheme();
  const currentTheme = themes[themeId];

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <AIAdvisor />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppThemeProvider>
          <AppContent />
        </AppThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
