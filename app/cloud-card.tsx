import { useState } from "react";
import { Icon } from "./icons";
import type { CloudState } from "../lib/use-cloud-sync";

const when = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  return today
    ? "oggi alle " + d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("it-IT", { day: "numeric", month: "long" }) +
        " alle " +
        d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
};

/** Settings card: keep a copy of the progress in the person's own Google Drive. */
export default function CloudCard({
  cloud,
  connect,
  disconnect,
  syncNow,
}: {
  cloud: CloudState;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  syncNow: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  if (!cloud.available) return null;
  const run = (fn: () => Promise<void>) => async () => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="az-card az-settings-card az-cloud" aria-labelledby="cloud-title">
      <h2 id="cloud-title" className="az-card-title">
        <Icon name="cloud" /> Salvataggio con Google
      </h2>
      {!cloud.enabled ? (
        <>
          <p className="az-small">
            I progressi restano in questo browser. Se lo cancelli o cambi dispositivo, li perdi.
            Collegando il tuo account Google ne tieni una copia nel tuo Drive e la ritrovi sugli
            altri dispositivi.
          </p>
          <p className="az-small">
            La copia finisce in una cartella nascosta del tuo Drive, che solo questo sito può
            leggere: non compare tra i tuoi file e nessun altro sito può aprirla. Il sito non
            vede né i tuoi documenti né la tua posta.{" "}
            <a href="./privacy.html">Come vengono trattati i dati</a>.
          </p>
          <button type="button" className="az-btn az-btn-primary" disabled={busy} onClick={run(connect)}>
            {busy ? "Collegamento in corso…" : "Collega il tuo account Google"}
          </button>
        </>
      ) : (
        <>
          <p className="az-cloud-state" role="status">
            {cloud.status === "working" ? (
              <>Sincronizzazione in corso…</>
            ) : cloud.status === "error" ? (
              <>{cloud.message}</>
            ) : cloud.lastSyncAt ? (
              <>
                <Icon name="check" size={16} /> Copia salvata nel tuo Drive · {when(cloud.lastSyncAt)}
              </>
            ) : (
              <>Collegato.</>
            )}
          </p>
          <p className="az-small">
            Ogni sincronizzazione unisce quello che hai fatto qui con quello che hai fatto sugli
            altri dispositivi: niente viene sovrascritto. Avviene da sola quando smetti di
            studiare o chiudi la pagina.
          </p>
          <div className="az-cloud-actions">
            <button type="button" className="az-btn az-btn-outline" disabled={busy} onClick={run(syncNow)}>
              <Icon name="review" size={16} /> {cloud.needsConsent ? "Autorizza di nuovo" : "Sincronizza ora"}
            </button>
            {confirm ? (
              <>
                <span className="az-small">Scollegare? La copia nel Drive resta dov'è.</span>
                <button type="button" className="az-btn az-btn-outline" disabled={busy} onClick={run(async () => {
                  await disconnect();
                  setConfirm(false);
                })}>
                  Sì, scollega
                </button>
                <button type="button" className="az-link" onClick={() => setConfirm(false)}>
                  Annulla
                </button>
              </>
            ) : (
              <button type="button" className="az-link" onClick={() => setConfirm(true)}>
                Scollega questo dispositivo
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
