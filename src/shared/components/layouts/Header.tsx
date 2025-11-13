import React from "react";

interface HeaderProps {
  onToggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleMenu }) => {
  return (
    <div className="md:hidden sticky top-0 left-0 right-0 z-30 bg-[#E7E9F2] border-b border-[rgba(0,0,0,0.4)] py-[8px] pb-[7px]">
      <div className="px-4 flex items-center justify-center w-full">
        <div className="h-12 flex items-center justify-start gap-3 w-full">
          {/* Bouton Burger */}
          <button
            onClick={onToggleMenu}
            className="flex items-center justify-start w-9 h-9 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
            title="Ouvrir le menu"
          >
            <img
              src="/assets/align-center.svg"
              alt="Menu"
              className="w-12 h-12"
            />
          </button>

          {/* Logo NessIA */}
          <img src="/assets/nessia_title.svg" alt="NessIA" className="h-5" />
        </div>
      </div>
    </div>
  );
};

export default Header;
