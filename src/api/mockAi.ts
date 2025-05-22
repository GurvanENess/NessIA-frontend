import { AIRequest, AIRequestFunction, AIResponse } from "../types/mockAITypes";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockAIClient {
  private static readonly RESPONSES: Record<string, AIResponse> = {
    default: {
      content: "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ?",
      availableActions: [
        {
          label: "Reformuler",
          type: "primary",
          request: {
            message: "Pouvez-vous reformuler votre réponse ?",
          },
        },
        {
          label: "Annuler",
          type: "secondary",
          request: {
            message: "Annuler la demande",
          },
        },
      ],
    },
    planification: {
      content:
        "Je peux vous aider à planifier votre journée. Que souhaitez-vous faire ?",
      availableActions: [
        {
          label: "Créer une tâche",
          type: "primary",
          request: {
            message: "Créer une nouvelle tâche",
            context: "create_task",
          },
        },
        {
          label: "Voir l'agenda",
          type: "secondary",
          request: {
            message: "Afficher l'agenda",
            context: "view_calendar",
          },
        },
        {
          label: "Rappel",
          type: "secondary",
          request: {
            message: "Définir un rappel",
            context: "set_reminder",
          },
        },
      ],
    },
    analyse: {
      content: "J'ai analysé les données. Voici les actions possibles :",
      availableActions: [
        {
          label: "Voir le détail",
          type: "primary",
          request: {
            message: "Afficher les détails",
            context: "show_details",
          },
        },
        {
          label: "Générer un rapport",
          type: "primary",
          request: {
            message: "Générer un rapport d'analyse",
            context: "generate_report",
          },
        },
        {
          label: "Exporter",
          type: "secondary",
          request: {
            message: "Exporter les données",
            context: "export",
          },
        },
      ],
    },
  };

  getResponse: AIRequestFunction = async (
    request: AIRequest
  ): Promise<AIResponse> => {
    await delay(1000);

    if (request.message.toLowerCase().includes("planifier")) {
      return MockAIClient.RESPONSES.planification;
    } else if (request.message.toLowerCase().includes("analyser")) {
      return MockAIClient.RESPONSES.analyse;
    }

    return MockAIClient.RESPONSES.default;
  };
}

export const mockAiClient = new MockAIClient();
