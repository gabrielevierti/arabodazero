/**
 * Progress lives in IndexedDB. Browsers may clear it under storage pressure,
 * and Safari on iOS clears it after seven days without a visit unless the site
 * is added to the Home Screen. Asking for persistent storage (granted
 * automatically to installed apps and often to frequently used sites) removes
 * the first risk; the Home Screen hint addresses the second.
 */
export type PersistenceState = "persisted" | "best-effort" | "unsupported";

export async function persistenceState(): Promise<PersistenceState> {
  if (!navigator.storage?.persisted) return "unsupported";
  try {
    return (await navigator.storage.persisted()) ? "persisted" : "best-effort";
  } catch {
    return "unsupported";
  }
}

/** Asks once; browsers decide silently (Chrome) or ignore the request. */
export async function requestPersistence(): Promise<PersistenceState> {
  if (!navigator.storage?.persist) return "unsupported";
  try {
    return (await navigator.storage.persist()) ? "persisted" : "best-effort";
  } catch {
    return "best-effort";
  }
}

/** iPhone/iPad Safari, not already opened from the Home Screen. */
export function needsHomeScreenHint() {
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone =
    matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return ios && !standalone;
}
