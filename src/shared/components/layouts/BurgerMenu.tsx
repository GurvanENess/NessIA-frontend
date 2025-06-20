import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Settings,
  HelpCircle,
  LogOut,
  FilePenLine,
  MessageSquareText,
  FileText,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Library,
  Grid3X3,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const menuSections: MenuSection[] = [
    {
      id: "library",
      title: "Bibliothèque",
      icon: Library,
      items: [
        {
          label: "Posts",
          path: "/posts",
          icon: FileText,
        },
        {
          label: "Chats",
          path: "/chats",
          icon: MessageCircle,
        },
      ],
    },
    {
      id: "modules",
      title: "Modules",
      icon: Grid3X3,
      items: [
        {
          label: "Chat",
          path: "/",
          icon: MessageSquareText,
        },
        {
          label: "Editor",
          path: "/post/new",
          icon: FilePenLine,
        },
      ],
    },
    {
      id: "others",
      title: "Autres",
      icon: MoreHorizontal,
      items: [
        {
          label: "Paramètres",
          path: "/settings",
          icon: Settings,
        },
        {
          label: "Aide",
          path: "/help",
          icon: HelpCircle,
        },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleItemClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-0 left-0 w-80 h-full bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img
                  src="/assets/nessia_logo.svg"
                  alt="Nessia"
                  className="w-6 h-6"
                />
              </div>
              <div>
                <img
                  src="/assets/nessia_title.svg"
                  alt="Nessia"
                  className="h-6 brightness-0 invert"
                />
                <p className="text-xs text-purple-100 mt-1">Assistant IA</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {menuSections.map((section) => {
              const isExpanded = expandedSections.includes(section.id);
              const SectionIcon = section.icon;

              return (
                <div key={section.id} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <SectionIcon className="w-5 h-5 text-gray-500 group-hover:text-[#7C3AED] transition-colors" />
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </button>

                  {/* Section Items */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 space-y-1 border-l-2 border-gray-100 pl-4">
                          {section.items.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleItemClick}
                                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-[#7C3AED] hover:bg-purple-50 rounded-lg transition-colors group"
                              >
                                <ItemIcon className="w-4 h-4 group-hover:text-[#7C3AED] transition-colors" />
                                <span className="text-sm">{item.label}</span>
                              </Link>
                            );
                          })}
                          
                          {/* Special case for logout in "others" section */}
                          {section.id === "others" && isAuthenticated && (
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors group"
                            >
                              <LogOut className="w-4 h-4 group-hover:text-red-700 transition-colors" />
                              <span className="text-sm">Déconnexion</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">© 2024 Nessia</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BurgerMenu;