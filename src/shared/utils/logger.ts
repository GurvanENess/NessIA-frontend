/**
 * Utilitaire de logging pour l'application
 * En production, ces logs peuvent être envoyés vers un service de monitoring
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  source?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string
  ): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      source,
    };
  }

  private log(entry: LogEntry) {
    // En développement, afficher dans la console
    if (this.isDevelopment) {
      const logMethod =
        entry.level === "error"
          ? console.error
          : entry.level === "warn"
          ? console.warn
          : console.log;

      logMethod(
        `[${entry.level.toUpperCase()}] ${entry.message}`,
        entry.data || ""
      );
    } else {
      // En production, on peut envoyer vers un service de monitoring
      // comme Sentry, LogRocket, ou un service personnalisé
      // Pour l'instant, on ne fait rien pour éviter le spam de logs
    }
  }

  info(message: string, data?: any, source?: string) {
    this.log(this.createLogEntry("info", message, data, source));
  }

  warn(message: string, data?: any, source?: string) {
    this.log(this.createLogEntry("warn", message, data, source));
  }

  error(message: string, data?: any, source?: string) {
    this.log(this.createLogEntry("error", message, data, source));
  }

  debug(message: string, data?: any, source?: string) {
    this.log(this.createLogEntry("debug", message, data, source));
  }
}

export const logger = new Logger();
