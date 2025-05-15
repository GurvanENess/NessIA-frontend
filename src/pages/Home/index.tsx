import React, { useState, useRef, useEffect } from 'react';
import { Bot, Menu, Bell, X, Settings, HelpCircle, LogOut } from 'lucide-react';
import Chat from '../../components/Chat';

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center px-4 h-16">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-[#7C3AED]" />
            <img src="/assets/nessia_logo.svg" alt="Nessia" className="h-8" />
            <span className="text-xl font-coolvetica text-[#7C3AED]">Nessia</span>
          </div>
          <div className="ml-auto">
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Burger Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 w-64 h-full bg-white transform transition-transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-8 h-8 text-[#7C3AED]" />
                <span className="text-xl font-coolvetica text-[#7C3AED]">Menu</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-5 h-5" />
                  <span>Paramètres</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <HelpCircle className="w-5 h-5" />
                  <span>Aide</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Chat />
    </div>
  );
};

export default Home;