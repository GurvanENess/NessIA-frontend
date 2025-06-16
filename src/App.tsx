import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./shared/contexts/AuthContext";
import { AppProvider } from "./shared/contexts/AppContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PublicRoute from "./routes/PublicRoute";
import AppLayout from "./shared/components/layouts/AppLayout";
import PostEditor from "./pages/PostEditor";
import PostsDisplay from "./pages/Posts";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/posts" element={<PostsDisplay />} />
                  <Route path="/post/new" element={<PostEditor />} />
                </Route>
                {/* Add more protected routes here */}
              </Route>

              {/* Redirect to home for any other routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
