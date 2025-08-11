import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const UserAccountDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";
  };

  const mockAccounts = [
    {
      id: "current",
      name: "e-Ness",
      email: user?.email || "user@example.com",
      isActive: true,
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      id: "personal",
      name: "Compte personnel",
      email: "personnel@example.com",
      isActive: false,
      icon: User,
      color: "bg-pink-500",
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
          >
            {/* Header with current user email */}
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Plus className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Accounts Section */}
            <div className="py-2">
              {mockAccounts.map((account) => {
                const IconComponent = account.icon;
                return (
                  <button
                    key={account.id}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-6 h-6 rounded-full ${account.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {account.name}
                      </div>
                    </div>
                    {account.isActive && (
                      <Check className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-2" />

            {/* Settings Section */}
            <div className="py-1">
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Paramètres</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left">
                <HelpCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Aide</span>
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-2" />

            {/* Logout Section */}
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Se déconnecter</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-t border-gray-200"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">
            {getUserInitial()}
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-medium text-gray-900 truncate">
            {user?.name || "Utilisateur"}
          </div>
          <div className="text-xs text-gray-500 truncate">
            e-Ness
          </div>
        </div>

        {/* Chevron */}
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>
    </div>
  );
};

export default UserAccountDropdown;