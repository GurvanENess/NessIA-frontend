import { Calendar, Check, Clock } from "lucide-react";
import React, { useState } from "react";
import { Post } from "../../../Posts/entities/PostTypes";
import { DateTimePicker } from "./DateTimePicker";

interface ScheduleTabProps {
  post: Post;
  onSchedule: (date: Date) => Promise<void>;
  onCancel: () => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({
  post,
  onSchedule,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async () => {
    if (!selectedDate) return;
    setIsScheduling(true);
    await onSchedule(selectedDate);
    setIsScheduling(false);
  };

  const formatScheduledDate = (date: Date): string => {
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

  return (
    <div className="space-y-8">
      {/* État actuel de la programmation */}
      <div className="bg-[#E7E9F2] rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            État actuel de la programmation
          </h3>
        </div>

        {post.scheduledAt ? (
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Check className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium">
                Ce post est programmé pour :
              </p>
              <p className="text-blue-700 text-lg">
                {formatScheduledDate(post.scheduledAt)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="w-5 h-5 text-gray-500" />
            <p className="text-gray-600">Ce post n'est pas encore programmé</p>
          </div>
        )}
      </div>

      {/* Section de programmation */}
      <div className="bg-[#E7E9F2] rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {post.scheduledAt
              ? "Modifier la programmation"
              : "Programmer ce post"}
          </h3>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          {post.scheduledAt
            ? "Sélectionnez une nouvelle date et heure pour reprogrammer ce post. La nouvelle date remplacera l'ancienne programmation."
            : "Sélectionnez la date et l'heure à laquelle vous souhaitez publier ce post. Une fois programmé, le post sera automatiquement publié à l'heure fixée."}
        </p>

        <DateTimePicker
          selectedDate={selectedDate}
          onDateTimeChange={setSelectedDate}
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSchedule}
          disabled={
            !selectedDate || isScheduling || selectedDate === post.scheduledAt
          }
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isScheduling
            ? "Programmation..."
            : post.scheduledAt
            ? "Reprogrammer"
            : "Programmer"}
        </button>
      </div>
    </div>
  );
};

export default ScheduleTab;
