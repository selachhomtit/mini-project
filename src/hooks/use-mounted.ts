import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after hydration on the client — use for UI that depends on cookies or localStorage. */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
