import { Calendar, Clock } from "lucide-react";
import React, { useRef } from "react";

interface DateTimePickerProps {
  selectedDate: Date | null;
  onDateTimeChange: (date: Date) => void;
  className?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  selectedDate,
  onDateTimeChange,
  className = "",
}) => {
  const now = new Date();
  const minDateTime = new Date(now.getTime() + 5 * 60 * 1000);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return (
      date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      " à " +
      date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const newDate = new Date(value);
      onDateTimeChange(newDate);
    }
  };

  const handleDivClick = () => {
    inputRef.current?.focus();
    inputRef.current?.showPicker?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Date et heure de publication
        </h3>
      </div>

      <div className="relative cursor-pointer" onClick={handleDivClick}>
        <div className="w-full p-4 border-2 border-gray-200 rounded-lg text-base bg-white hover:border-purple-300 focus-within:border-purple-700 focus-within:ring-1 focus-within:ring-purple-700 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
          <div className="flex-1">
            <span
              className={`block ${
                selectedDate ? "text-gray-900 font-medium" : "text-gray-500"
              }`}
            >
              {selectedDate
                ? formatDisplayDate(selectedDate)
                : "Sélectionner une date et heure"}
            </span>
            {selectedDate && (
              <span className="text-sm text-gray-500 mt-1 block">
                Cliquez pour modifier
              </span>
            )}
          </div>
          <div className="ml-3 p-2 bg-purple-50 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <input
          ref={inputRef}
          type="datetime-local"
          value={selectedDate ? formatDateTimeLocal(selectedDate) : ""}
          onChange={handleDateTimeChange}
          min={formatDateTimeLocal(minDateTime)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
