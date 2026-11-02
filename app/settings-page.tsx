import { useEffect, useState } from "react";
import Preferences from "./preferences";
import BackupManager from "./backup-manager";
import { OfflineSettings } from "./offline-status";
import { arabicVoiceStatus, playArabic } from "../lib/audio";
import {
  needsHomeScreenHint,
  persistenceState,
  requestPersistence,
  type PersistenceState,
} from "../lib/persistence";
import { Icon } from "./icons";

function VoiceStatus({ rate }: { rate: number }) {
  const [voice, setVoice] = useState<{ available: boolean; name?: string } | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    void arabicVoiceStatus().then(setVoice);
  }, []);
  return (
    <section className="az-card az-settings-card" aria-labelledby="voice-title">
      <h2 id="voice-title" className="az-card-title">
        <Icon name="sound" /> Voce araba
      </h2>
      {voice === null ? (
        <p className="az-small">Controllo le voci del dispositivo…</p>
      ) : voice.available ? (
        <p>
          Il sito usa la voce <strong>{voice.name}</strong> del tuo dispositivo. È una voce sintetica:
          utile per lettere e parole, meno precisa di un madrelingua su ع, ح, ق e sulle enfatiche.
        </p>
      ) : (
        <p>
          Sul dispositivo non c'è una voce araba, quindi i pulsanti di ascolto restano muti. Aggiungila
          dalle impostazioni di sistema: <em>Windows</em> Impostazioni › Ora e lingua › Voce;{" "}
          <em>macOS e iPhone</em> Accessibilità › Contenuti letti › Voci › Arabo;{" "}
          <em>Android</em> Impostazioni › Sintesi vocale › Google › Installa dati vocali.
        </p>
      )}
      <div className="az-row">
        <button
          type="button"
          className="az-btn az-btn-outline"
          onClick={() =>
            playArabic("مَرْحَبًا، أَهْلًا وَسَهْلًا", rate).then(
              () => setMessage(""),
              () => setMessage("Nessuna voce araba disponibile."),
            )
          }
        >
          <Icon name="play" size={16} /> Prova la voce
        </button>
        {message && <span role="status" className="az-small">{message}</span>}
      </div>
    </section>
  );
}

function StorageSafety() {
  const [state, setState] = useState<PersistenceState | null>(null);
  useEffect(() => {
    void persistenceState().then(setState);
  }, []);
  const ios = needsHomeScreenHint();
  return (
    <section className="az-card az-settings-card" aria-labelledby="storage-title">
      <h2 id="storage-title" className="az-card-title">
        <Icon name="shield" /> I tuoi dati
      </h2>
      <p>
        Lezioni completate, risposte, appunti e flashcard restano solo in questo browser: niente account,
        niente server. Per non perderli, esporta un backup di tanto in tanto.
      </p>
      <ul className="az-checklist">
        <li className={state === "persisted" ? "ok" : ""}>
          {state === "persisted"
            ? "Il browser ha reso permanente lo spazio del sito: non lo svuoterà per fare posto."
            : state === "unsupported"
              ? "Questo browser non permette di rendere permanente lo spazio del sito."
              : "Lo spazio del sito non è ancora permanente: il browser potrebbe svuotarlo se il disco è pieno."}
          {state === "best-effort" && (
            <button
              type="button"
              className="az-link"
              onClick={() => void requestPersistence().then(setState)}
            >
              Chiedi di renderlo permanente
            </button>
          )}
        </li>
        {ios && (
          <li>
            Su iPhone e iPad Safari cancella i dati dei siti non visitati per sette giorni. Aggiungi
            Arabo da Zero alla schermata Home (Condividi › Aggiungi alla schermata Home) e aprilo da lì.
          </li>
        )}
      </ul>
    </section>
  );
}

export default function SettingsPage({
  data,
  put,
  loaded,
  importData,
}: {
  data: Record<string, any>;
  put: (k: string, v: any) => void;
  loaded: boolean;
  importData: any;
}) {
  return (
    <div className="az-settings">
      <header className="az-page-head">
        <div className="az-eyebrow">Impostazioni</div>
        <h1>Il corso, come piace a te.</h1>
      </header>
      <div className="az-settings-grid">
        <section className="az-card az-settings-card" aria-labelledby="goal-setting">
          <h2 id="goal-setting" className="az-card-title">
            <Icon name="flame" /> Obiettivo quotidiano
          </h2>
          <label>
            Minuti di studio attivo al giorno
            <select
              aria-label="Minuti di studio attivo al giorno"
              value={data.goal || 15}
              disabled={!loaded}
              onChange={(e) => put("goal", Number(e.target.value))}
            >
              {[10, 15, 20, 30, 45, 60].map((n) => (
                <option key={n} value={n}>
                  {n} minuti
                </option>
              ))}
            </select>
          </label>
          <p className="az-small">
            Il tempo si conta solo mentre studi con la pagina in primo piano; si ferma dopo un minuto
            senza interazioni.
          </p>
        </section>
        <VoiceStatus rate={data.preferences?.audioRate || 0.8} />
        <StorageSafety />
        <div className="az-settings-wide">
          <Preferences data={data} put={put} />
        </div>
        <div className="az-settings-wide">
          <BackupManager data={data} disabled={!loaded} importData={importData} />
        </div>
        <div className="az-settings-wide">
          <OfflineSettings />
        </div>
      </div>
    </div>
  );
}
