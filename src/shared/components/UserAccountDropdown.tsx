import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LogOut,
  Plus,
  Settings,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { Company } from "../store/AppReducer";

interface UserAccountDropdownProps {
  companies?: Array<Company>;
}

const UserAccountDropdown: React.FC<UserAccountDropdownProps> = ({
  companies,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state, changeCompanyAndReset, clearCurrentCompany, dispatch } =
    useApp();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
    clearCurrentCompany();
    logout();
    localStorage.removeItem("nessia_current_company");
    setIsOpen(false);
  };

  const handleCompanySelect = (company: Company) => {
    window.location.href = "/";
    changeCompanyAndReset(company);
    setIsOpen(false);
  };

  const getUserInitial = () => {
    return (
      user?.name?.charAt(0).toUpperCase() ||
      user?.email?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  // A réutiliser pour le formattage des accounts
  const mockAccounts: Company[] = [
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
            className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
          >
            {/* Header with current user email */}
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button
                  onClick={() => {
                    alert("NOT IMPLEMENTED YET");
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Accounts Section */}
            <div className="py-2">
              {companies?.map((company) => {
                const IconComponent = company.icon || User;
                const isActive = state.currentCompany?.id === company.id;

                return (
                  <button
                    key={company.id}
                    onClick={() => handleCompanySelect(company)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${
                        company.color || "bg-blue-500"
                      } flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {company.name}
                      </div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-2" />

            {/* Settings Section */}
            <div className="py-1">
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Paramètres</span>
              </Link>
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
            {state.currentCompany?.name || "Sélectionner une compagnie"}
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
