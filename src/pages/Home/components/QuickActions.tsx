import React from "react";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

interface QuickActionsProps {
  onSelect: (text: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onSelect }) => (
  <div className="flex space-x-2 w-max">
    <button
      type="button"
      onClick={() => onSelect("Créer un post Instagram")}
      className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-lg border border-gray-300 transition-colors shadow-sm whitespace-nowrap"
    >
      <Instagram className="w-5 h-5 text-[#1A201B]" />
      <span className="text-sm text-[#1A201B]">Créer un post Instagram</span>
    </button>
    <button
      type="button"
      onClick={() => onSelect("Créer un post Facebook")}
      className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-lg border border-gray-300 transition-colors shadow-sm whitespace-nowrap"
    >
      <Facebook className="w-5 h-5 text-[#1A201B]" />
      <span className="text-sm text-[#1A201B]">Créer un post Facebook</span>
    </button>
    <button
      type="button"
      onClick={() => onSelect("Créer un post TikTok")}
      className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-lg border border-gray-300 transition-colors shadow-sm whitespace-nowrap"
    >
      <MessageCircle className="w-5 h-5 text-[#1A201B]" />
      <span className="text-sm text-[#1A201B]">Créer un post TikTok</span>
    </button>
  </div>
);

export default QuickActions;
