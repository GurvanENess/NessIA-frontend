import { motion } from "framer-motion";
import { Building2, Link, Shield, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AccountTab from "./components/AccountTab";
import ConnectorsTab from "./components/ConnectorsTab";
import PrivacyTab from "./components/PrivacyTab";
import ProfileTab from "./components/ProfileTab";

type TabId = "profile" | "account" | "billing" | "privacy" | "connectors";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const tabs: Tab[] = [
  { id: "profile", label: "Profil", icon: Building2, component: ProfileTab },
  { id: "account", label: "Compte", icon: User, component: AccountTab },
  {
    id: "privacy",
    label: "Confidentialité",
    icon: Shield,
    component: PrivacyTab,
  },
  {
    id: "connectors",
    label: "Connecteurs",
    icon: Link,
    component: ConnectorsTab,
  },
];

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Handle URL path changes
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const tabFromPath = pathSegments[pathSegments.length - 1] as TabId;

    if (tabs.find((tab) => tab.id === tabFromPath)) {
      setActiveTab(tabFromPath);
    } else {
      // Default to profile if no valid tab in URL
      setActiveTab("profile");
      navigate("/settings/profile", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    navigate(`/settings/${tabId}`);
  };

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || ProfileTab;

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
          <h1 className="text-3xl font-coolvetica text-gray-900 lg:pl-5">
            Paramètres
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row p-5 bg-[#E7E9F2]">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
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
                          ? "bg-[#7C3AED]/10 text-[#7C3AED] font-medium border border-[#7C3AED]/20"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-[#7C3AED]" : "text-gray-500"
                        }`}
                      />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden bg-white rounded-t-xl shadow-lg">
            <div className="flex overflow-x-auto px-4 flex-nowrap custom-scrollbar pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      isActive
                        ? "border-[#7C3AED] text-[#7C3AED]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
          <div className="flex-1 lg:border-l lg:border-gray-200">
            <div className="bg-white lg:m-6 lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-200 rounded-b-xl shadow-lg">
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
