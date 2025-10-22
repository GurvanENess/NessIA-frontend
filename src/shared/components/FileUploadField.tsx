import { FileText, Link as LinkIcon, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface FileUploadFieldProps {
  label: string;
  value: {
    type: "file" | "link";
    value: string;
    fileName?: string;
  } | null;
  onChange: (
    value: {
      type: "file" | "link";
      value: string;
      fileName?: string;
    } | null
  ) => void;
  error?: string;
  className?: string;
  id?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  value,
  onChange,
  error,
  className = "",
  id,
}) => {
  const [inputType, setInputType] = useState<"file" | "link">(
    value?.type || "link"
  );
  const [linkInput, setLinkInput] = useState(
    value?.type === "link" ? value.value : ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simuler un upload de fichier (en production, on enverrait au serveur)
      const fakeUrl = URL.createObjectURL(file);
      onChange({
        type: "file",
        value: fakeUrl,
        fileName: file.name,
      });
    }
  };

  const handleLinkSubmit = () => {
    if (linkInput.trim()) {
      onChange({
        type: "link",
        value: linkInput.trim(),
      });
    }
  };

  const handleClear = () => {
    onChange(null);
    setLinkInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTypeChange = (type: "file" | "link") => {
    setInputType(type);
    handleClear();
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>

      {/* Type selector */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => handleTypeChange("link")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            inputType === "link"
              ? "bg-[#7C3AED] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <LinkIcon className="w-4 h-4 inline mr-2" />
          Lien
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("file")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            inputType === "file"
              ? "bg-[#7C3AED] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Fichier
        </button>
      </div>

      {/* Input area */}
      {inputType === "link" ? (
        <div className="flex gap-2">
          <input
            type="url"
            id={fieldId}
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onBlur={handleLinkSubmit}
            placeholder="https://exemple.com/mentions-legales"
            className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            id={fieldId}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full px-4 py-3 border-2 border-dashed rounded-md hover:border-[#7C3AED] hover:bg-[#7C3AED]/5 transition-colors ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <span className="text-sm text-gray-600">
              Cliquez pour sélectionner un fichier
            </span>
          </button>
        </div>
      )}

      {/* Display uploaded file or link */}
      {value && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            {value.type === "file" ? (
              <>
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{value.fileName}</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4 text-gray-600" />
                <a
                  href={value.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate max-w-xs"
                >
                  {value.value}
                </a>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUploadField;
