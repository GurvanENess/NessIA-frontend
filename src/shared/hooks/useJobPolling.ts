import { useEffect, useCallback, useState } from "react";
import { db } from "../services/db";
import { useApp } from "../contexts/AppContext";

// Type pour les jobs
interface Job {
  id: string;
  status: string;
  current_msg?: string;
  need_user_input?: any;
}

// On garde pour le moment le long polling local. Mais à terme il sera rendu global pour garder le
// state des tâches courantes dans toute l'application

export function useJobPolling() {
  const sessionId = useApp().state.chat.sessionId;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (sessionId: string) => {
    try {
      console.log("fetch jobs", sessionId);
      const data = await db.getRunningJobs(sessionId);
      console.log(data);
      setJobs((_) => data || []);
      setError(null);
      return data || [];
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs");
      return [];
    }
  }, []);

  // Fonction pour démarrer le polling manuellement
  const startPolling = useCallback(
    async (sessionId: string) => {
      console.log("Starting polling for session:", sessionId);
      setIsPolling(true);
      await fetchJobs(sessionId);
      console.log(jobs, hasRunningJobs);
    },
    [fetchJobs]
  );

  // Fonction pour arrêter le polling
  const stopPolling = useCallback(() => {
    console.log("Stopping polling");
    setIsPolling(false);
    setJobs((_) => []);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchJobs(sessionId!);
      } catch (err) {
        console.error("Error during initial fetch:", err);
        setError("Failed to fetch jobs");
      }
    };

    if (!sessionId) return;

    fetch();
  }, [sessionId, fetchJobs]);

  const hasRunningJobs = jobs.some((j) =>
    ["running", "waiting_user"].includes(j.status)
  );

  // Polling automatique quand il y a des jobs en cours
  useEffect(() => {
    if (!hasRunningJobs || !isPolling) return;

    console.log("Starting automatic polling for running jobs");
    const id = setInterval(async () => {
      await fetchJobs(sessionId!);
      console.log(jobs);
    }, 2000);

    return () => {
      console.log("Clearing polling interval");
      clearInterval(id);
    };
  }, [hasRunningJobs, isPolling, sessionId, fetchJobs]);

  // Arrêter le polling si plus de jobs en cours
  useEffect(() => {
    if (!hasRunningJobs && isPolling) {
      console.log("No more running jobs, stopping polling");
      setIsPolling(false);
    }
  }, [hasRunningJobs, isPolling]);

  return {
    jobs,
    isPolling,
    error,
    fetchJobs,
    startPolling,
    stopPolling,
    hasRunningJobs,
  };
}
