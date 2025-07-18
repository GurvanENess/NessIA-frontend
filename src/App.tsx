import React, { useState } from "react";
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
import ChatsDisplay from "./pages/Chats";
import FileSelectModal from "./shared/components/FileSelectModal";
import ChatAI from "./pages/Home/components/ChatAI";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

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
                  <Route path="/posts/:postId" element={<PostEditor />} />
                  <Route path="/chats" element={<ChatsDisplay />} />
                  <Route
                    path="/modal"
                    element={
                      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                        <FileSelectModal
                          onValidate={true}
                          isOpen={isModalOpen}
                          onFileSelect={(file) =>
                            console.log("File selected:", file)
                          }
                          onClose={() => {
                            setIsModalOpen(false);
                          }}
                        />
                        {!isModalOpen && (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6D28D9] transition-colors"
                          >
                            Ouvrir la modale
                          </button>
                        )}
                      </div>
                    }
                  />
                  <Route path="/chats/:chatId" element={<ChatAI />} />
                  <Route
                    path="/settings"
                    element={<div>Settings Page - Coming Soon</div>}
                  />
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
