import { useRef, useState } from "react";
import { Job } from "../entities/JobTypes";
import { db } from "../services/db";

// Que fait useJobPolling ?
// Pour une session donnée, useJobPolling cherche les jobs qui sont en cours à intervalle fixe (arbitraire)
// Son state est mis à jour par rapport à ces données de job
// En sortie, on a accès aux jobs, à une fonction pour démarrer le polling et à une autre pour l'arrêter,
// ainsi qu'à un "isPolling" qui dit si le polling est en cours ou non

const POLLING_INTERVAL = 2000;

export default function useJobPolling() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resolveRef = useRef<((value: Job[]) => void) | null>(null);

  const fetchRunningJobs = async (sessionId: string) => {
    try {
      const data = await db.getRunningJobs(sessionId);
      return data;
    } catch (err) {
      return [];
    }
  };

  const poll = async (sessionId: string) => {
    try {
      const runningJobs = await fetchRunningJobs(sessionId);
      setJobs(runningJobs);
      console.log("runningJobs", runningJobs);

      if (
        runningJobs.length === 0 ||
        !resolveRef.current ||
        runningJobs[0].status === "waiting_user"
      ) {
        // un peu cracra mais ça marche
        stopPolling();
        if (resolveRef.current) resolveRef.current(runningJobs);
        return;
      } else {
        intervalRef.current = setTimeout(() => {
          poll(sessionId);
        }, POLLING_INTERVAL);
      }
    } catch (err) {
      throw err;
    }
  };

  const startPolling = async (sessionId: string): Promise<Job[]> => {
    return new Promise((resolve, reject) => {
      if (isPolling) {
        reject(new Error("Polling already in progress"));
        return;
      }

      setIsPolling(true);
      resolveRef.current = resolve;

      poll(sessionId);
    });
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    intervalRef.current = null;
    setIsPolling(false);

    // Résoudre la promesse avec les jobs actuels si elle existe
    if (resolveRef.current) {
      resolveRef.current(jobs);
      resolveRef.current = null;
    }
  };

  return {
    jobs,
    startPolling,
    stopPolling,
  };
}
