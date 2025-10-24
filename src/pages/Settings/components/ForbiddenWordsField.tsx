import { Plus, X } from "lucide-react";
import React, { useState } from "react";

interface ForbiddenWordsFieldProps {
  value: string[];
  onChange: (words: string[]) => void;
}

const ForbiddenWordsField: React.FC<ForbiddenWordsFieldProps> = ({
  value,
  onChange,
}) => {
  const [currentWord, setCurrentWord] = useState("");

  const addWord = () => {
    const trimmedWord = currentWord.trim().toLowerCase();
    if (trimmedWord && !value.includes(trimmedWord)) {
      onChange([...value, trimmedWord]);
      setCurrentWord("");
    }
  };

  const removeWord = (wordToRemove: string) => {
    onChange(value.filter((word) => word !== wordToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWord();
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Liste de mots interdits
      </label>

      {/* Zone d'ajout */}
      <div className="border-2 border-dashed border-red-200 rounded-lg p-4 bg-white">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: concurrent, marque, mot-clé..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={addWord}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Appuyez sur Entrée ou cliquez sur Ajouter
        </p>
      </div>

      {/* Liste des tags */}
      {value.length > 0 ? (
        <div>
          <p className="text-xs text-gray-600 mb-3">
            {value.length} mot{value.length > 1 ? "s" : ""} interdit
            {value.length > 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((word, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-full border border-red-200 hover:border-red-300 transition-colors group"
              >
                <span className="text-sm font-medium">{word}</span>
                <button
                  type="button"
                  onClick={() => removeWord(word)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  title="Supprimer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 text-sm">
          Aucun mot interdit ajouté
        </div>
      )}

      <p className="text-xs text-gray-500">
        Ces mots seront automatiquement filtrés lors de la génération de contenu
      </p>
    </div>
  );
};

export default ForbiddenWordsField;
