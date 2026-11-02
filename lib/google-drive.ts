/**
 * Optional backup to the person's own Google Drive.
 *
 * The site has no server: the progress stays in the browser, and this file
 * lets the person keep a copy in their own Drive so that it is not lost with
 * the browser data and can be picked up on another device.
 *
 * The copy goes into the "application data" folder, a hidden folder of their
 * Drive that only this site can read: it is not among their files and no other
 * app or site can open it. The site never sees their documents, and the access
 * token stays in memory for the session only.
 */
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const FILE = "arabo-da-zero.json";
const GIS = "https://accounts.google.com/gsi/client";
const DRIVE = "https://www.googleapis.com/drive/v3/files";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";

export const cloudConfigured = () => !!CLIENT_ID;

export class CloudError extends Error {
  constructor(message: string, readonly needsConsent = false) {
    super(message);
    this.name = "CloudError";
  }
}

let script: Promise<void> | null = null;
function loadGoogle(): Promise<void> {
  if ((window as any).google?.accounts?.oauth2) return Promise.resolve();
  if (!script)
    script = new Promise<void>((resolve, reject) => {
      const el = document.createElement("script");
      el.src = GIS;
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => {
        script = null;
        reject(new CloudError("Non è stato possibile contattare Google. Controlla la connessione."));
      };
      document.head.appendChild(el);
    });
  return script;
}

let token = "",
  expires = 0,
  client: any = null;

/**
 * Asks Google for permission to use the hidden folder.
 * `silent` reuses a permission already given, without showing anything: it is
 * how the session is resumed when the page is opened again.
 */
export async function authorize(silent: boolean): Promise<string> {
  if (!CLIENT_ID) throw new CloudError("Il collegamento a Google non è configurato in questa copia del sito.");
  if (token && Date.now() < expires - 60_000) return token;
  await loadGoogle();
  const oauth2 = (window as any).google.accounts.oauth2;
  return new Promise<string>((resolve, reject) => {
    client =
      client ||
      oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback: () => {},
      });
    client.callback = (response: any) => {
      if (response?.error || !response?.access_token) {
        const code = response?.error;
        reject(
          new CloudError(
            code === "popup_closed_by_user" || code === "access_denied"
              ? "Collegamento annullato."
              : "Google non ha concesso l'accesso alla cartella.",
            true,
          ),
        );
        return;
      }
      token = response.access_token;
      expires = Date.now() + Number(response.expires_in || 3600) * 1000;
      resolve(token);
    };
    client.error_callback = (e: any) =>
      reject(new CloudError(e?.type === "popup_failed_to_open"
        ? "Il browser ha bloccato la finestra di Google. Consenti le finestre pop-up per questo sito."
        : "Collegamento annullato.", true));
    try {
      client.requestAccessToken({ prompt: silent ? "" : "consent" });
    } catch {
      reject(new CloudError("Non è stato possibile aprire la finestra di Google.", true));
    }
  });
}

export function forgetToken() {
  token = "";
  expires = 0;
}

/** Withdraws the permission: Google forgets that this site may use the folder. */
export async function revoke() {
  const current = token;
  forgetToken();
  if (!current) return;
  try {
    await loadGoogle();
    (window as any).google.accounts.oauth2.revoke(current, () => {});
  } catch {}
}

async function call(url: string, init: RequestInit, accessToken: string) {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { ...(init.headers || {}), Authorization: "Bearer " + accessToken },
    });
  } catch {
    throw new CloudError("Nessuna connessione a Google Drive. I progressi restano salvati sul dispositivo.");
  }
  if (response.status === 401 || response.status === 403) {
    forgetToken();
    throw new CloudError("Google ha chiesto di autorizzare di nuovo il salvataggio.", true);
  }
  if (!response.ok)
    throw new CloudError("Google Drive ha risposto con un errore (" + response.status + ").");
  return response;
}

export type RemoteFile = { id: string; text: string; modifiedTime: string } | null;

/** The copy in the hidden folder, if there is one. */
export async function readRemote(accessToken: string): Promise<RemoteFile> {
  const query = new URLSearchParams({
    spaces: "appDataFolder",
    q: `name = '${FILE}' and trashed = false`,
    fields: "files(id,modifiedTime)",
    pageSize: "1",
  });
  const list = await (await call(DRIVE + "?" + query, {}, accessToken)).json();
  const file = list.files?.[0];
  if (!file) return null;
  const text = await (
    await call(DRIVE + "/" + encodeURIComponent(file.id) + "?alt=media", {}, accessToken)
  ).text();
  return { id: file.id, text, modifiedTime: file.modifiedTime };
}

/** Writes the copy, creating the file the first time. */
export async function writeRemote(accessToken: string, text: string, id?: string): Promise<string> {
  if (id) {
    const r = await call(
      UPLOAD + "/" + encodeURIComponent(id) + "?uploadType=media&fields=id",
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: text },
      accessToken,
    );
    return (await r.json()).id;
  }
  const boundary = "az" + Math.random().toString(36).slice(2);
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify({ name: FILE, parents: ["appDataFolder"] }) +
    `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
    text +
    `\r\n--${boundary}--`;
  const r = await call(
    UPLOAD + "?uploadType=multipart&fields=id",
    { method: "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body },
    accessToken,
  );
  return (await r.json()).id;
}
