/**
 * Merging the progress of two devices.
 *
 * The same person can study on the phone and on the computer, so the copy in
 * the cloud and the copy on this device both hold real work. Replacing one
 * with the other would throw a study session away, so every record is merged
 * on its own, keeping whatever shows more work done: the pages read, the
 * attempts made, the minutes studied. Settings and notes have no such measure:
 * there the more recent of the two copies wins.
 */
import type { StoredRecords } from "./storage";

export type MergeSide = "local" | "remote";
export type MergeReport = {
  data: StoredRecords;
  /** Keys taken from the copy in the cloud, and keys only this device had. */
  fromRemote: string[];
  added: string[];
  changed: string[];
};

const isObject = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === "object" && !Array.isArray(v);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const time = (v: unknown) => {
  const t = typeof v === "string" ? Date.parse(v) : NaN;
  return Number.isNaN(t) ? -Infinity : t;
};
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : -Infinity);
/** The record that carries more study: more attempts, more pages, more minutes. */
function progressScore(key: string, v: any): number {
  if (!isObject(v)) return -Infinity;
  if (key.startsWith("answer:")) return num(v.attempts) || (v.rating ? 1 : 0);
  if (key.startsWith("progress:"))
    return (v.done ? 10000 : 0) + (Array.isArray(v.read) ? v.read.length : 0);
  if (key.startsWith("study:") || key.startsWith("session:")) return num(v.seconds);
  if (key.startsWith("writing:") || key.startsWith("alphabet:")) return num(v.attempts);
  return -Infinity;
}

/** Merge of one record: `newer` says which side was written last. */
export function mergeValue(key: string, local: any, remote: any, newer: MergeSide): any {
  if (same(local, remote)) return local;
  if (local === undefined) return remote;
  if (remote === undefined) return local;
  const latest = () => (newer === "remote" ? remote : local);

  // a day of study, a day of activity: keep the larger figure
  if (key.startsWith("study:"))
    return isObject(local) && isObject(remote)
      ? { ...local, ...remote, seconds: Math.max(num(local.seconds), num(remote.seconds)) }
      : latest();
  if (key.startsWith("activity:")) return local || remote;

  // a lesson: the pages read on either device, and done if either says so
  if (key.startsWith("progress:") && isObject(local) && isObject(remote)) {
    const read = [...new Set([...(local.read || []), ...(remote.read || [])])].sort(
      (a: number, b: number) => a - b,
    );
    const base = newer === "remote" ? { ...local, ...remote } : { ...remote, ...local };
    return {
      ...base,
      ...(read.length ? { read } : {}),
      ...(local.done || remote.done ? { done: true } : {}),
      ...(local.step !== undefined || remote.step !== undefined
        ? { step: Math.max(num(local.step), num(remote.step)) }
        : {}),
    };
  }

  // an answer: the copy with more attempts, and the longer history of the two
  if (key.startsWith("answer:") && isObject(local) && isObject(remote)) {
    const ahead =
      progressScore(key, local) === progressScore(key, remote)
        ? time(local.checkedAt) >= time(remote.checkedAt)
          ? local
          : remote
        : progressScore(key, local) > progressScore(key, remote)
          ? local
          : remote;
    const history =
      (local.history?.length || 0) >= (remote.history?.length || 0) ? local.history : remote.history;
    return history ? { ...ahead, history } : ahead;
  }

  // a scheduled review or a flashcard: the one reviewed last is the current state
  if (key.startsWith("review:") || key.startsWith("card:")) {
    const l = isObject(local) ? local : {},
      r = isObject(remote) ? remote : {};
    const lt = Math.max(time(l.reviewedAt), time(l.schedule?.reviewedAt), time(l.createdAt));
    const rt = Math.max(time(r.reviewedAt), time(r.schedule?.reviewedAt), time(r.createdAt));
    if (lt !== rt) return lt > rt ? local : remote;
    return latest();
  }

  // the alphabet and the handwriting: more attempts, and known once known
  if ((key.startsWith("alphabet:") || key.startsWith("writing:")) && isObject(local) && isObject(remote)) {
    const base = newer === "remote" ? { ...local, ...remote } : { ...remote, ...local };
    const more = progressScore(key, local) >= progressScore(key, remote) ? local : remote;
    return {
      ...base,
      ...(more.attempts !== undefined
        ? { attempts: Math.max(num(local.attempts), num(remote.attempts)) }
        : {}),
      ...(local.known || remote.known ? { known: true } : {}),
      ...(local.completed || remote.completed ? { completed: true } : {}),
    };
  }

  // anything with a date inside: the more recent one
  const lt = Math.max(time(local?.at), time(local?.updatedAt), time(local?.completedAt), time(local?.checkedAt));
  const rt = Math.max(time(remote?.at), time(remote?.updatedAt), time(remote?.completedAt), time(remote?.checkedAt));
  if (lt !== rt && (lt !== -Infinity || rt !== -Infinity)) return lt > rt ? local : remote;

  // a count that only grows
  const l = progressScore(key, local),
    r = progressScore(key, remote);
  if (l !== r && (l !== -Infinity || r !== -Infinity)) return l > r ? local : remote;

  // notes, settings, the lesson you were on: the last written wins
  return latest();
}

/**
 * Merges the records of this device with the copy in the cloud.
 * `newer` says which of the two was written last, and decides the records
 * where neither copy shows more work than the other (settings, notes).
 */
export function mergeRecords(
  local: StoredRecords,
  remote: StoredRecords,
  newer: MergeSide = "remote",
): MergeReport {
  const data: StoredRecords = { ...local };
  const fromRemote: string[] = [],
    added: string[] = [],
    changed: string[] = [];
  for (const key of Object.keys(remote)) {
    const merged = mergeValue(key, local[key], remote[key], newer);
    if (!Object.hasOwn(local, key)) {
      data[key] = merged;
      added.push(key);
      fromRemote.push(key);
      continue;
    }
    if (same(merged, local[key])) continue;
    data[key] = merged;
    changed.push(key);
    if (same(merged, remote[key])) fromRemote.push(key);
  }
  return { data, fromRemote, added, changed };
}
