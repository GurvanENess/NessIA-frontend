import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useApp } from "../../../../shared/contexts/AppContext";
import { useAuth } from "../../../../shared/contexts/AuthContext";
import { Job, UserInputField } from "../../../../shared/entities/JobTypes";
import MediaSelector from "./MediaSelector";

interface JobStatusProps {
  jobs: Job[];
  className?: string;
  onSuggestionClick?: (
    job: unknown,
    answer: string | Record<string, unknown> | Array<{ name: string; value: unknown }>
  ) => Promise<void>;
  onCancel?: (job: unknown) => Promise<void>;
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
  onCancel,
}) => {
  const { state } = useApp();
  const { user } = useAuth();

  if (!jobs || jobs.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "waiting_user":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (job: Job) => {
    switch (job.status) {
      case "running":
        return (
          job.current_msg ||
          job.message ||
          "NessIA travaille sur votre demande..."
        );
      case "waiting_user":
        return (
          job.current_msg || job.message || "En attente de votre réponse..."
        );
      case "completed":
        return job.current_msg || job.message || "Tâche terminée";
      case "error":
        return (
          job.current_msg ||
          job.message ||
          "Erreur lors du traitement du message."
        );
      default:
        return job.current_msg || job.message || "En cours...";
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
      case "error":
        return "border-red-200 bg-red-50/90";
      default:
        return "border-gray-200 bg-gray-50/90";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-blue-700 font-semibold";
      case "waiting_user":
        return "text-amber-700 font-semibold";
      case "completed":
        return "text-green-700 font-semibold";
      case "error":
        return "text-red-700 font-semibold";
      default:
        return "text-gray-800 font-semibold";
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

  const renderFieldInput = (
    field: UserInputField,
    value: string | boolean | number | null | Array<{ id: string; url: string }>,
    onChange: (value: string | boolean | number | null | Array<{ id: string; url: string }>) => void,
    job: Job
  ) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
        );
      case "textarea":
        return (
          <textarea
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent resize-none"
          />
        );
      case "boolean":
        const labels = field.labels || { true: "Oui", false: "Non" };
        return (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                value === true
                  ? "bg-[#7C3AED] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {labels["true"] || "Oui"}
            </button>
            <button
              type="button"
              onClick={() => onChange(false)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                value === false
                  ? "bg-[#7C3AED] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {labels["false"] || "Non"}
            </button>
          </div>
        );
      case "number":
        return (
          <input
            type="number"
            value={value as number || ""}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
        );
      case "select":
        return (
          <select
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          >
            <option value="">Sélectionnez une option</option>
            {field.options?.map((option) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "media_selector":
        const mediaValue = Array.isArray(value) ? value : [];
        return (
          <MediaSelector
            selectedMedias={mediaValue}
            onMediasChange={(medias) => onChange(medias)}
            sessionId={job.session_id || state.chat.sessionId || undefined}
            userToken={user?.token}
            companyId={state.currentCompany?.id}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
        );
    }
  };

  const WaitingUserForm: React.FC<{ job: Job }> = ({ job }) => {
    const needUserInput = job.need_user_input;
    if (!needUserInput) return null;

    const [fieldValues, setFieldValues] = useState<Record<string, string | boolean | number | null | Array<{ id: string; url: string }>>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialiser les valeurs des champs
    useEffect(() => {
      const initialValues: Record<string, string | boolean | number | null | Array<{ id: string; url: string }>> = {};
      needUserInput.fields?.forEach((field) => {
        // Pour media_selector, initialiser avec un tableau vide si value est null/undefined
        if (field.type === "media_selector") {
          initialValues[field.name] = Array.isArray(field.value) ? field.value : [];
        } else {
          initialValues[field.name] = field.value;
        }
      });
      setFieldValues(initialValues);
    }, [needUserInput]);

    const handleFieldChange = (fieldName: string, value: string | boolean | number | null | Array<{ id: string; url: string }>) => {
      setFieldValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      // Effacer l'erreur du champ modifié
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    };

    const validateFields = (): boolean => {
      const newErrors: Record<string, string> = {};
      
      needUserInput.fields?.forEach((field) => {
        if (field.required) {
          const value = fieldValues[field.name];
          if (value === null || value === undefined || value === "") {
            newErrors[field.name] = "Ce champ est requis";
          } else if (field.type === "media_selector" && Array.isArray(value) && value.length === 0) {
            newErrors[field.name] = "Au moins un média doit être sélectionné";
          }
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateFields()) {
        return;
      }

      // Créer un tableau d'objets avec name et value pour chaque champ
      const answers: Array<{ name: string; value: unknown }> = [];
      needUserInput.fields?.forEach((field) => {
        answers.push({
          name: field.name,
          value: fieldValues[field.name],
        });
      });

      await onSuggestionClick?.(job, answers);
    };

    const handleCancel = async () => {
      await onCancel?.(job);
    };

    return (
      <div className="w-full">
        {/* Titre */}
        {needUserInput.title && (
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            {needUserInput.title}
          </h3>
        )}

        {/* Description */}
        {needUserInput.description && (
          <p className="text-sm text-gray-600 mb-4">
            {needUserInput.description}
          </p>
        )}

        {/* Champs */}
        {needUserInput.fields && needUserInput.fields.length > 0 && (
          <div className="space-y-4 mb-4">
            {needUserInput.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.label || field.name}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderFieldInput(
                  field,
                  fieldValues[field.name] ?? field.value,
                  (value) => handleFieldChange(field.name, value),
                  job
                )}
                {errors[field.name] && (
                  <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Support de l'ancienne structure pour compatibilité */}
        {needUserInput.question && !needUserInput.fields && (
          <p className="text-sm text-gray-700 mt-2 font-medium mb-3">
            {needUserInput.question}
          </p>
        )}
        {needUserInput.suggested && needUserInput.suggested.length > 0 && (
          <div className="mt-3 space-y-2 mb-4">
            <p className="text-xs text-gray-600 font-medium">Suggestions :</p>
            <div className="flex flex-wrap gap-2">
              {needUserInput.suggested.map((suggestion: string, index: number) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick?.(job, suggestion)}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        {(needUserInput.fields && needUserInput.fields.length > 0) && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Répondre
            </button>
            {onCancel && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Annuler
              </button>
            )}
          </div>
        )}

        {job.message && (
          <p className="text-xs text-gray-600 mt-3">{job.message}</p>
        )}
      </div>
    );
  };

  const renderWaitingUserContent = (job: Job) => {
    const needUserInput = job.need_user_input;

    if (!needUserInput) {
      return (
        <div className="flex-1">
          <p className={`text-sm ${getStatusTextColor(job.status)}`}>
            {getStatusText(job)}
          </p>
          {job.message && job.message !== getStatusText(job) && (
            <p className="text-xs text-gray-600 mt-1">{job.message}</p>
          )}
        </div>
      );
    }

    return <WaitingUserForm job={job} />;
  };

  const renderJobContent = (job: Job) => {
    if (job.status === "waiting_user") {
      return renderWaitingUserContent(job);
    }

    return (
      <div className="flex-1">
        <p className={`text-sm ${getStatusTextColor(job.status)}`}>
          {getStatusText(job)}
        </p>
        {job.message && job.message !== getStatusText(job) && (
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

  if (jobs.some((job) => job.status === "error")) return null;

  return (
    <div className={`sticky bottom-40 left-0 z-20 px-4 ${className}`}>
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
            <div className={`flex ${job.status === "waiting_user" && job.need_user_input?.fields ? "flex-col" : "items-center"} ${job.status === "waiting_user" && job.need_user_input?.fields ? "space-y-3" : "space-x-3"}`}>
              {job.status === "waiting_user" && job.need_user_input?.fields ? (
                <>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <p className={`text-sm ${getStatusTextColor(job.status)}`}>
                      {getStatusText(job)}
                    </p>
                    {getProgressDots(job.status)}
                  </div>
                  {renderJobContent(job)}
                </>
              ) : (
                <>
                  {getStatusIcon(job.status)}
                  {renderJobContent(job)}
                  {getProgressDots(job.status)}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobStatus;
