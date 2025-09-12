import { useApp } from "../../../shared/contexts/AppContext";
import useJobPolling from "../../../shared/hooks/useJobPolling";

export const useCommonLogic = () => {
  const { state } = useApp();
  const {
    chat: { messageInput, isLoading, showQuickActions },
  } = state;
  const { jobs } = useJobPolling();

  return {
    messageInput,
    isLoading,
    showQuickActions,
    jobs,
  };
};
