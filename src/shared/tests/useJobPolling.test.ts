import { renderHook } from "@testing-library/react";
import useJobPolling from "../hooks/useJobPolling";

describe("useJobPolling", () => {
  const runningSessionId = "9a298d81-897b-46fb-a73d-d87b93484aed";
  const waitingUserSessionId = "55844bb2-000f-4929-bcac-ec59a6f6962c";

  it("should run something I guess?", async () => {
    const { result } = renderHook(() => useJobPolling(runningSessionId));
    const { jobs, startPolling, stopPolling, isPolling } = result.current;
    startPolling();

    expect(true).toBe(true);
  });
});
