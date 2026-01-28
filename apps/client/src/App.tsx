import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { SignIn } from "./pages/SignIn";
import { Admin } from "./pages/Admin/Admin";
import { Settings } from "./pages/Settings/Settings";
import { authLocalStorage } from "./utils/authLocalStorage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authLocalStorage.isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authLocalStorage.isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  if (!authLocalStorage.isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (authLocalStorage.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
