import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome, {user?.name || 'User'}
        </h1>
        <p className="text-gray-600">
          This is your dashboard. You can start building your application from here.
        </p>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Card {item}
              </h3>
              <p className="text-gray-600">
                This is a sample card for your dashboard. Replace with actual content.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;