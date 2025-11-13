import { Loader2, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Job } from "../../../../shared/entities/JobTypes";

interface LoadingCreationProps {
  jobs: Job[];
}

const LoadingCreation: React.FC<LoadingCreationProps> = ({ jobs }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Récupérer le premier job en cours
  const currentJob = jobs.find(
    (job) => job.status === "running" || job.status === "waiting_user"
  );

  console.log(jobs);

  const currentMessage =
    currentJob?.current_msg ||
    currentJob?.message ||
    "Création de votre conversation...";

  // Animation de typing effect
  useEffect(() => {
    if (currentMessage !== displayedText) {
      setIsTyping(true);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= currentMessage.length) {
          setDisplayedText(currentMessage.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);

      return () => clearInterval(typingInterval);
    }
  }, [currentMessage]);

  return (
    <div className="transition-all duration-500 ease-in-out">
      {/* Icône animée */}
      <div className="relative mb-8 flex justify-center">
        {/* Cercle pulsant en arrière-plan */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-purple-500/20 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 bg-purple-500/30 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Icône principale */}
        <div className="relative z-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full p-5 shadow-lg">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>

      {/* Message principal */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-coolvetica text-black mb-4 min-h-[3rem] flex items-center justify-center">
        {displayedText}
        {isTyping && (
          <span className="inline-block w-0.5 h-8 bg-black ml-1 animate-blink"></span>
        )}
      </h2>

      {/* Barre de progression animée */}
      <div className="max-w-md mx-auto mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-full animate-progress"></div>
        </div>
      </div>

      {/* Points de chargement */}
      <div className="flex justify-center items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
        <p className="font-coolvetica text-sm sm:text-base text-black opacity-70">
          NessIA travaille pour vous
        </p>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></div>
          <div
            className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {/* Information supplémentaire si le job a un type */}
      {currentJob?.type && (
        <div className="mt-6 opacity-60">
          <p className="font-coolvetica text-xs text-black capitalize">
            {currentJob.type.replace(/_/g, " ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingCreation;
