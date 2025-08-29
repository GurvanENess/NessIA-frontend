import React, { useState } from "react";
import { DateTimePicker } from "./DateTimePicker";

interface ScheduleTabProps {
  onSchedule: (date: Date) => Promise<void>;
  onCancel: () => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ onSchedule, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async () => {
    if (!selectedDate) return;
    setIsScheduling(true);
    await onSchedule(selectedDate);
    setIsScheduling(false);
  };

  return (
    <div className="space-y-6">
      <DateTimePicker selectedDate={selectedDate} onDateTimeChange={setSelectedDate} />
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          onClick={handleSchedule}
          disabled={!selectedDate || isScheduling}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isScheduling ? "Programmation..." : "Programmer"}
        </button>
      </div>
    </div>
  );
};

export default ScheduleTab;
