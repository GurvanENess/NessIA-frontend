import { useEffect, useCallback, useState } from "react";
import { db } from "../services/db";
import { useApp } from "../contexts/AppContext";

// On garde pour le moment le long polling local. Mais à terme il sera rendu global pour garder le
// state des tâches courantes dans toute l'application

export function useJobPolling() {
  const sessionId = useApp().state.chat.sessionId;
  const [jobs, setJobs] = useState<unknown[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (sessionId: string) => {
    try {
      console.log("fetch jobs", sessionId);
      const data = await db.getRunningJobs(sessionId!);
      setJobs((_) => data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs");
    }
  }, []);

  useEffect(() => {
    setJobs([]);
    setError(null);

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

  useEffect(() => {
    if (!hasRunningJobs || isPolling) return;
    const id = setInterval(async () => {
      await fetchJobs(sessionId!);
    }, 2000);
    setIsPolling(true);

    return () => clearInterval(id);
  }, [hasRunningJobs, sessionId, fetchJobs]);

  return {
    jobs,
    isPolling,
    error,
    fetchJobs,
  };
}

// Lorsque la page démarre :
//  On lance un premier fetchjobs pour voir s'il n'y avait pas des jobs en cours
// ...
// Lorsqu'un message est envoyé :
//  On lance aussi un fetchjobs, pour voir s'il n'y a pas de jobs en cours
// ...
// SI lors de ces opérations IL Y A un job running ou en attente d'intéraction utilisateur, on lance le polling :
//  qui consiste en un setInterval qui toutes les 2 secondes va faire un fetchJobs et redemander l'état du job
