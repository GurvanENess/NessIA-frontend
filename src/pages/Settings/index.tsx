import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, User, CreditCard, Shield, Link } from 'lucide-react';
import ProfileTab from './components/ProfileTab';
import AccountTab from './components/AccountTab';
import BillingTab from './components/BillingTab';
import PrivacyTab from './components/PrivacyTab';
import ConnectorsTab from './components/ConnectorsTab';

type TabId = 'profile' | 'account' | 'billing' | 'privacy' | 'connectors';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  { id: 'profile', label: 'Profil', icon: Building2, component: ProfileTab },
  { id: 'account', label: 'Compte', icon: User, component: AccountTab },
  { id: 'billing', label: 'Facturation', icon: CreditCard, component: BillingTab },
  { id: 'privacy', label: 'Confidentialité', icon: Shield, component: PrivacyTab },
  { id: 'connectors', label: 'Connecteurs', icon: Link, component: ConnectorsTab },
];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as TabId;
      if (tabs.find(tab => tab.id === hash)) {
        setActiveTab(hash);
      }
    };

    // Set initial tab from URL hash
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ProfileTab;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-[#E7E9F2]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="p-6 pb-0">
          <h1 className="text-3xl font-coolvetica text-gray-900">
            Paramètres
          </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 p-6">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-gray-200 text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden border-b border-gray-200 bg-white">
            <div className="flex overflow-x-auto scrollbar-hide px-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      isActive
                        ? 'border-[#7C3AED] text-[#7C3AED]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 md:border-l md:border-gray-200">
            <div className="bg-white md:m-6 md:rounded-xl md:shadow-sm md:border md:border-gray-200 min-h-[600px]">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <ActiveComponent />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;