import { Plus, X } from "lucide-react";
import React, { useState } from "react";

interface MandatoryMentionsFieldProps {
  value: string[];
  onChange: (mentions: string[]) => void;
}

const MandatoryMentionsField: React.FC<MandatoryMentionsFieldProps> = ({
  value,
  onChange,
}) => {
  const [currentMention, setCurrentMention] = useState("");

  const addMention = () => {
    if (currentMention.trim()) {
      onChange([...value, currentMention.trim()]);
      setCurrentMention("");
    }
  };

  const removeMention = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMention();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Mentions obligatoires
      </label>

      {/* Zone d'ajout */}
      <div className="border-2 border-dashed border-[#7C3AED]/20 rounded-lg p-4 bg-white">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={currentMention}
            onChange={(e) => setCurrentMention(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: SARL au capital de 10 000€"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={addMention}
            className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Appuyez sur Entrée ou cliquez sur Ajouter
        </p>
      </div>

      {/* Liste des mentions */}
      {value.length > 0 && (
        <div>
          <p className="text-xs text-gray-600 mb-2">
            {value.length} mention{value.length > 1 ? "s" : ""} ajoutée
            {value.length > 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {value.map((mention, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-[#7C3AED]/30 transition-colors group"
              >
                <div className="flex-1 text-gray-700 text-sm">{mention}</div>
                <button
                  type="button"
                  onClick={() => removeMention(index)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {value.length === 0 && (
        <div className="text-center py-6 text-gray-400 text-sm">
          Aucune mention ajoutée
        </div>
      )}
    </div>
  );
};

export default MandatoryMentionsField;
