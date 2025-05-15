import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Bell, User, X } from 'lucide-react';
import { RootState } from '../store';
import { toggleSidebar } from '../store/slices/uiSlice';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';

const ChatLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, notifications } = useSelector((state: RootState) => state.ui);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="text-xl font-bold text-blue-600">Enterprise Chat</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Post
            </button>
            
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </div>
            
            <div className="relative group">
              <User className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer" />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                <a href="#profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                <hr className="my-2" />
                <a href="#logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          <MessageList />
          <ChatInput />
        </main>
      </div>
    </div>
  );
};