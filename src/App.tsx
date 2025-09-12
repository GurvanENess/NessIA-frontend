import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatsDisplay from "./pages/Chats";
import CompanySelectionPage from "./pages/CompanySelection/index";
import Home from "./pages/Home";
import ChatPage from "./pages/Home/components/ChatPage";
import Login from "./pages/Login";
import PostEditor from "./pages/PostEditor";
import PostsDisplay from "./pages/Posts";
import PrivacyPolicy from "./pages/PrivacyPolicy/index";
import Register from "./pages/Register";
import SettingsPage from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import NotFound from "./shared/components/errors/NotFound";
import FileSelectModal from "./shared/components/FileSelectModal";
import AppLayout from "./shared/components/layouts/AppLayout";
import { AppProvider } from "./shared/contexts/AppContext";
import { AuthProvider } from "./shared/contexts/AuthContext";

// Il y a quelque chose qui est fucked ici avec
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                {/* Route de sélection de compagnie - n'exige pas de compagnie */}
                <Route
                  path="/company-selection"
                  element={<CompanySelectionPage />}
                />

                {/* Routes nécessitant une compagnie sélectionnée */}
                <Route element={<ProtectedRoute requireCompany={true} />}>
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
                            onValidate={() => true}
                            isOpen={isModalOpen}
                            onFileSelect={(file) => {
                              // File selected
                            }}
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
                    <Route path="/chats/:chatId" element={<ChatPage />} />
                    <Route path="/chats/:chatId/post/" element={<ChatPage />} />
                    <Route path="/settings/*" element={<SettingsPage />} />
                    <Route path="/post/new" element={<PostEditor />} />
                  </Route>
                </Route>
                {/* Add more protected routes here */}
              </Route>

              {/* Fallback for unknown routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
