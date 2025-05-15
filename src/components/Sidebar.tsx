import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Hash, ChevronDown, ChevronRight, Users, Bell } from 'lucide-react';
import { RootState } from '../store';
import { setCurrentTopic } from '../store/slices/uiSlice';

interface Topic {
  id: string;
  name: string;
  unread: number;
}

const topics: Topic[] = [
  { id: '1', name: 'general', unread: 0 },
  { id: '2', name: 'announcements', unread: 2 },
  { id: '3', name: 'development', unread: 5 },
];

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const dispatch = useDispatch();
  const currentTopic = useSelector((state: RootState) => state.ui.currentTopic);
  const [expandedSections, setExpandedSections] = useState({
    topics: true,
    members: false,
    notifications: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isOpen) return null;

  return (
    <aside className="w-72 bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Topics Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('topics')}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700"
          >
            <div className="flex items-center">
              {expandedSections.topics ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <span className="font-medium">Topics</span>
            </div>
          </button>

          {expandedSections.topics && (
            <div className="mt-1">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => dispatch(setCurrentTopic(topic.id))}
                  className={`flex items-center justify-between w-full px-6 py-2 hover:bg-gray-700 ${
                    currentTopic === topic.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    <span>{topic.name}</span>
                  </div>
                  {topic.unread > 0 && (
                    <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                      {topic.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Members Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('members')}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700"
          >
            <div className="flex items-center">
              {expandedSections.members ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <Users className="w-4 h-4 mr-2" />
              <span className="font-medium">Members</span>
            </div>
          </button>

          {expandedSections.members && (
            <div className="mt-1">
              {/* Add member list here */}
            </div>
          )}
        </div>

        {/* Notifications Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('notifications')}
            className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-700"
          >
            <div className="flex items-center">
              {expandedSections.notifications ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-2" />
              )}
              <Bell className="w-4 h-4 mr-2" />
              <span className="font-medium">Notifications</span>
            </div>
          </button>

          {expandedSections.notifications && (
            <div className="mt-1">
              {/* Add notifications list here */}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar