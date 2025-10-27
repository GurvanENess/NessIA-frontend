import React from "react";

interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  id,
  className = "",
  rows = 4,
  ...props
}) => {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mb-4">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-vertical ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextAreaField;
