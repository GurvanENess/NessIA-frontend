import React from "react";
import { Loader2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Job } from "../../../shared/entities/JobTypes";

interface JobStatusProps {
  jobs: Job[];
  className?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

/**
 * Exemple de structure de job avec waiting_user :
 * {
 *   id: "job-123",
 *   status: "waiting_user",
 *   need_user_input: {
 *       question: "Quel type de post souhaitez-vous créer ?",
 *       suggested: ["Post Instagram", "Post Facebook", "Post LinkedIn"]
 *     }
 *   }
 * }
 */

const JobStatus: React.FC<JobStatusProps> = ({
  jobs,
  className = "",
  onSuggestionClick,
}) => {
  if (!jobs || jobs.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "waiting_user":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "NessIA travaille sur votre demande...";
      case "waiting_user":
        return "En attente de votre réponse...";
      case "completed":
        return "Tâche terminée";
      case "failed":
        return "Erreur lors du traitement";
      default:
        return "En cours...";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "border-blue-200 bg-blue-50/90";
      case "waiting_user":
        return "border-amber-200 bg-amber-50/90";
      case "completed":
        return "border-green-200 bg-green-50/90";
      case "failed":
        return "border-red-200 bg-red-50/90";
      default:
        return "border-gray-200 bg-gray-50/90";
    }
  };

  const getProgressDots = (status: string) => {
    if (status !== "running") return null;

    return (
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    );
  };

  const renderWaitingUserContent = (job: Job) => {
    const needUserInput = job.need_user_input;

    if (!needUserInput) {
      return (
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">
            {getStatusText(job.status)}
          </p>
          {job.message && (
            <p className="text-xs text-gray-600 mt-1">{job.message}</p>
          )}
        </div>
      );
    }

    return (
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">
          {getStatusText(job.status)}
        </p>

        {/* Question */}
        {needUserInput.question && (
          <p className="text-sm text-gray-700 mt-2 font-medium">
            {needUserInput.question}
          </p>
        )}

        {/* Suggestions */}
        {needUserInput.suggested && needUserInput.suggested.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-600 font-medium">Suggestions :</p>
            <div className="flex flex-wrap gap-2">
              {needUserInput.suggested.map(
                (suggestion: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick?.(suggestion)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {job.message && (
          <p className="text-xs text-gray-600 mt-2">{job.message}</p>
        )}
      </div>
    );
  };

  const renderJobContent = (job: Job) => {
    if (job.status === "waiting_user") {
      return renderWaitingUserContent(job);
    }

    return (
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">
          {getStatusText(job.status)}
        </p>
        {job.message && (
          <p className="text-xs text-gray-600 mt-1">{job.message}</p>
        )}
        {job.type && (
          <p className="text-xs text-gray-500 mt-1 capitalize">
            Type: {job.type.replace("_", " ")}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed bottom-40 left-0 right-0 z-20 px-4 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className={`mb-3 p-4 rounded-xl border-2 ${getStatusColor(
              job.status
            )} shadow-lg backdrop-blur-sm bg-white/80 transform transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl animate-fade-in-up`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(job.status)}
              {renderJobContent(job)}
              {getProgressDots(job.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobStatus;
