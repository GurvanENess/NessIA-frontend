import React, { useState } from "react";
import { Bell, X, Settings, HelpCircle, LogOut, Info } from "lucide-react";
import Chat from "../../components/Chat";
import { useAuth } from "../../contexts/AuthContext";

const Home: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-[#E7E9F2] flex">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#E7E9F2] z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p2 hover:bg-[#E7E9F2] rounded-full"
            >
              <img src="/assets/align-center.svg" alt="Menu" className="w-9" />
            </button>
            <img src="/assets/nessia_title.svg" alt="Nessia" className="" />
          </div>

          <div className="flex items-center">
            <button className="p-2 hover:bg-[#E7E9F2] rounded-full">
              <Info className="w-5 text-[#1A201B]" />
            </button>
            <button
              className="p-2 hover:bg-[#E7E9F2] rounded-full relative"
              onClick={() => {
                setHasNotifications(!hasNotifications);
              }}
            >
              <Bell className="w-5 text-[#1A201B]" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
        <div className="mx-4 border-t border-[rgb(0,0,0,.4)]"></div>
      </div>

      {/* Burger Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 w-64 h-full bg-[#E7E9F2] transform transition-transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="/assets/nessia_title.svg"
                  alt="Nessia"
                  className="h-8"
                />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-[#E7E9F2] rounded-full"
              >
                <X className="w-6 h-6 text-[#1A201B]" />
              </button>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-[#1A201B] hover:bg-[#E7E9F2] rounded-lg">
                  <Settings className="w-5 h-5" />
                  <span>Paramètres</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-[#1A201B] hover:bg-[#E7E9F2] rounded-lg">
                  <HelpCircle className="w-5 h-5" />
                  <span>Aide</span>
                </button>
              </li>
              {isAuthenticated && (
                <li>
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-[#E7E9F2] rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
      <Chat />
    </div>
  );
};

export default Home;
