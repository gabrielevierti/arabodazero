/**
 * Keeps the progress of this device and the copy in the person's Google Drive
 * in step. Every sync reads the copy in the cloud, merges it with what is on
 * this device (lib/cloud-merge) and writes the result back, so studying on the
 * phone and on the computer never throws work away.
 *
 * Saving to Drive is optional: without it the site works exactly as before,
 * with the progress in the browser.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { makeBackup, parseBackup } from "./backup";
import { mergeRecords } from "./cloud-merge";
import { CloudError, authorize, cloudConfigured, readRemote, revoke, writeRemote } from "./google-drive";
import type { StoredRecords } from "./storage";

const KEY = "arabic-academy:cloud";
/** Device-local, never part of the backup: which device is connected and when it last synced. */
type Settings = { enabled: boolean; lastSyncAt?: string; pushedAt?: string; fileId?: string };
const readSettings = (): Settings => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return raw && typeof raw === "object" ? raw : { enabled: false };
  } catch {
    return { enabled: false };
  }
};
const writeSettings = (s: Settings) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
};

export type CloudState = {
  available: boolean;
  enabled: boolean;
  status: "off" | "working" | "ready" | "error";
  message: string;
  lastSyncAt?: string;
  needsConsent: boolean;
};

export function useCloudSync({
  dataRef,
  loaded,
  flush,
  importData,
}: {
  dataRef: { current: StoredRecords };
  loaded: boolean;
  flush: () => Promise<void>;
  importData: (incoming: StoredRecords, replace: boolean, expected: StoredRecords) => Promise<void>;
}) {
  const available = cloudConfigured();
  const [settings, setSettings] = useState<Settings>(() => (available ? readSettings() : { enabled: false }));
  const [status, setStatus] = useState<CloudState["status"]>("off");
  const [message, setMessage] = useState("");
  const [needsConsent, setNeedsConsent] = useState(false);
  const running = useRef<Promise<void> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const save = useCallback((next: Settings) => {
    setSettings(next);
    writeSettings(next);
  }, []);

  /** One round: read the cloud, merge, write back what the two have together. */
  const sync = useCallback(
    async (silent: boolean) => {
      if (running.current) return running.current;
      const work = (async () => {
        setStatus("working");
        setMessage("");
        try {
          const token = await authorize(silent);
          setNeedsConsent(false);
          await flush();
          const current = { ...dataRef.current };
          const remote = await readRemote(token);
          let data = current;
          let fileId = remote?.id;
          if (remote) {
            const parsed = parseBackup(remote.text);
            const pushedAt = Date.parse(readSettings().pushedAt || "") || 0;
            // a copy written after our last upload comes from another device
            const newer = Date.parse(remote.modifiedTime) > pushedAt + 2000 ? "remote" : "local";
            const merged = mergeRecords(current, parsed.data, newer);
            if (merged.changed.length || merged.added.length) {
              await importData(merged.data, true, current);
              data = merged.data;
            }
          }
          const text = JSON.stringify(makeBackup(data));
          if (!remote || remote.text !== text) fileId = await writeRemote(token, text, fileId);
          const now = new Date().toISOString();
          save({ enabled: true, lastSyncAt: now, pushedAt: now, fileId });
          setStatus("ready");
        } catch (e) {
          const cloud = e instanceof CloudError;
          setNeedsConsent(cloud && (e as CloudError).needsConsent);
          setStatus("error");
          setMessage(
            (cloud ? (e as Error).message : "Salvataggio su Google non riuscito.") +
              " I progressi restano salvati su questo dispositivo.",
          );
        }
      })();
      running.current = work;
      try {
        await work;
      } finally {
        running.current = null;
      }
    },
    [dataRef, flush, importData, save],
  );

  const connect = useCallback(async () => {
    await sync(false);
  }, [sync]);

  const disconnect = useCallback(async () => {
    clearTimeout(timer.current);
    await revoke();
    save({ enabled: false });
    setStatus("off");
    setMessage("");
    setNeedsConsent(false);
  }, [save]);

  // resume the session when the page is opened again, without asking anything
  useEffect(() => {
    if (!available || !settings.enabled || !loaded) return;
    void sync(true);
    // once at startup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available, loaded, settings.enabled]);

  /** Called by the app after a change: syncs once the person stops studying. */
  const schedule = useCallback(() => {
    if (!available || !settings.enabled) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void sync(true), 15000);
  }, [available, settings.enabled, sync]);

  useEffect(() => {
    if (!available || !settings.enabled) return;
    const hide = () => {
      if (document.visibilityState === "hidden") {
        clearTimeout(timer.current);
        void sync(true);
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [available, settings.enabled, sync]);

  const state: CloudState = {
    available,
    enabled: !!settings.enabled,
    status: settings.enabled ? status : "off",
    message,
    lastSyncAt: settings.lastSyncAt,
    needsConsent,
  };
  return { cloud: state, connect, disconnect, syncNow: () => sync(true), scheduleCloudSync: schedule };
}
