import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyTab: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-[#7C3AED]/10 rounded-full flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-[#7C3AED]" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Confidentialité
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        Cette section contiendra les conditions générales et les paramètres de confidentialité. 
        Fonctionnalité à venir prochainement.
      </p>
    </div>
  );
};

export default PrivacyTab;