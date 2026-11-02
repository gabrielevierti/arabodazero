# Arabo da Zero

Un percorso di apprendimento gratuito e aperto per l'arabo, con lezioni, esercizi e monitoraggio dei progressi organizzati in un unico posto.

Arabo da Zero è nata da un'esigenza personale: voglio imparare l'arabo senza pagare un corso né perdermi tra decine di risorse separate.

Il progetto è pensato per chiunque cerchi un percorso di apprendimento strutturato e voglia usare l'arabo nella vita reale, anche in contesti professionali.

## Perché l'ho creato

Di risorse gratuite per imparare l'arabo online ce ne sono molte. La difficoltà che ho incontrato è stata metterle insieme: un sito per l'alfabeto, un video per la pronuncia, un PDF per la grammatica ed esercizi da qualche altra parte. Capire cosa studiare prima, cosa viene dopo e cosa ripassare diventa un lavoro a sé stante.

Non riuscivo a trovare una risorsa gratuita che mettesse tutto insieme come mi serviva: un percorso organizzato, spiegazioni accessibili, esercizi con cui fare pratica e un modo semplice per tenere traccia dei progressi.

Volevo anche un approccio più vicino all'uso pratico e professionale della lingua. Le frasi semplici aiutano a imparare le basi, ma il mio obiettivo non è fermarmi a "il cavallo beve il latte in cucina": voglio capire le informazioni, leggere testi e comunicare in situazioni reali.

Così ho iniziato a costruire lo strumento che avrei voluto trovare. Arabo da Zero è il risultato di quel lavoro, ed è ancora in evoluzione.

## Cosa offre

- Un percorso di apprendimento organizzato per livelli, dall'alfabeto (A0) al livello C1 «Competenza professionale», così sai da dove iniziare e come procedere.
- Lezioni disponibili direttamente sul sito, con spiegazioni, esempi e tabelle.
- Esercizi interattivi, con correzione automatica per le risposte vincolate e modelli di riferimento per le risposte aperte.
- Alfabeto interattivo, con le 28 lettere di base, le forme di congiunzione, parole di esempio, sintesi vocale del dispositivo e un quiz di cinque domande.
- Scrittura a mano: ricalca, copia e scrivi a memoria ogni lettera nelle quattro posizioni, con il dito, il mouse o la penna; il tratto si ingrossa e si assottiglia come nella scrittura vera e si può scegliere tra punta tonda e calamo.
- Correzione automatica anche delle traduzioni e delle risposte brevi: una risposta giusta scritta senza vocali, con una hamza diversa o con ة/ه scambiate viene riconosciuta; per le risposte aperte il confronto è parola per parola con il modello e indica cosa manca. Se la correzione automatica sbaglia, puoi segnare tu la risposta come corretta.
- Ripasso automatico degli errori e flashcard, anche dalle parole di ogni lezione, con ripetizione dilazionata.
- Sessioni di studio guidate, che combinano ripasso, un passo di lettura e pratica intorno a un obiettivo giornaliero che scegli tu.
- Monitoraggio chiaro dei progressi, inclusi tempo di studio attivo, passi di lettura, domande a cui si è risposto, traguardi e stime trasparenti per il livello successivo.
- Note e lezioni personali, per adattare lo studio alle tue esigenze.
- Progressi salvati nel browser, con esportazione e importazione di backup e, se vuoi, una copia nel tuo Google Drive per ritrovarli sugli altri dispositivi.
- Il corso inizia con il sistema di scrittura e l'arabo standard moderno (MSA) e, con il livello C1, arriva ai testi professionali: rapporti, comunicati diplomatici, testi giuridici ed economici, retorica, sintesi di più fonti, scrittura formale e briefing orale, con le tracce di egiziano e di darija marocchina. L'uso pratico e professionale è la direzione del progetto: questo non significa che il corso da solo ti prepari a una professione.

## A chi è rivolto

A chiunque voglia iniziare a imparare l'arabo, a chi ha già raccolto materiali ma fatica a organizzarli e a chi cerca un posto gratuito dove studiare con costanza.

Non devi condividere gli obiettivi professionali o personali che mi hanno portato a costruirlo. Se ti aiuta a imparare qualcosa, il progetto sta già facendo ciò per cui è stato creato.

## Per chi sviluppa

```sh
npm ci
npm run dev        # sito in locale
npm test           # test unitari e dei contenuti
npm run build      # versione pubblicabile in dist/
```

I volumi in PDF si importano con gli script in `scripts/volume-import/` (vedi il README della cartella): il testo arabo viene ricostruito dai glifi del PDF e rimesso in ordine logico, gli esercizi vengono collegati alle soluzioni.

### Correzioni ai contenuti importati

L'importazione dai PDF lascia alcuni difetti tipici (parole arabe incollate, celle di tabella fuse, a capo nel mezzo delle frasi, feedback generici). `scripts/repair-pdf-artifacts.mjs` li corregge in modo ripetibile su `public/course/`:

```sh
node scripts/repair-pdf-artifacts.mjs --report   # cosa cambierebbe, senza scrivere
node scripts/repair-pdf-artifacts.mjs            # applica le correzioni
node scripts/repair-pdf-artifacts.mjs --check    # esce con errore se resta qualcosa da correggere
npm run content:qa                               # controllo generale dei contenuti
```

Il confronto con i PDF originali ha prodotto altre correzioni (tabelle e testi con l'arabo rimescolato), salvate in `scripts/content-fixes/pdf-tables.json` e `pdf-fields.json`. Ripartendo dai contenuti importati, l'ordine completo è:

```sh
node scripts/repair-pdf-artifacts.mjs && node scripts/apply-pdf-fixes.mjs && node scripts/repair-pdf-artifacts.mjs
node scripts/apply-pdf-fixes.mjs --check         # verifica che tutte le correzioni siano applicate
```

Il resoconto del confronto, con i refusi trovati nei PDF e i testi da guardare a mano, è in `reports/confronto-pdf.md`; le tabelle a cui mancano ancora delle righe sono elencate in `reports/confronto-pdf-tabelle.md`.

Le tabelle che non si possono ricostruire in automatico (coniugazioni, pronomi, «Errori tipici») sono corrette a mano in `scripts/content-fixes/tables.json`, indicizzate con l'impronta del contenuto originale: se reimporti una lezione dai PDF, le correzioni a mano vengono applicate solo alle tabelle rimaste identiche. Il controllo `glued-arabic` di `content:qa` segnala le parole che sembrano ancora incollate e vanno guardate a occhio.

### Salvataggio nel Google Drive di chi studia (facoltativo)

I progressi restano nel browser. Se vuoi offrire anche una copia nel Drive di
chi studia (così non si perde cancellando i dati del browser e si ritrova sugli
altri dispositivi), serve un ID client OAuth di Google. Senza, la funzione non
compare e il sito resta identico.

1. Su [Google Cloud Console](https://console.cloud.google.com/) crea un progetto
   e attiva **Google Drive API**.
2. In *Credenziali* crea un **ID client OAuth** di tipo *Applicazione web* e
   aggiungi tra le «origini JavaScript autorizzate» l'indirizzo del sito
   (`https://<utente>.github.io`) e `http://localhost:4173` per le prove.
3. Nella schermata di consenso OAuth chiedi solo l'ambito
   `https://www.googleapis.com/auth/drive.appdata`, che dà accesso a una
   cartella nascosta creata dall'app: non ai file di chi studia.
4. Passa l'ID client alla build:

```sh
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com npm run build
```

Su GitHub Pages: *Settings → Secrets and variables → Actions → Variables*, crea
`GOOGLE_CLIENT_ID` (è un valore pubblico, non un segreto); il workflow lo passa
già alla build.

L'ambito `drive.appdata` è «sensibile» per Google: finché l'app non è
verificata, chi si collega vede una schermata di avviso e il limite è di cento
utenti. La verifica si chiede dalla stessa schermata di consenso.

Il contenuto salvato è lo stesso backup JSON del pulsante «Esporta backup», e a
ogni sincronizzazione le due copie vengono unite (`lib/cloud-merge.ts`): niente
viene sovrascritto, nemmeno studiando su due dispositivi nello stesso giorno.

### Interfaccia

Lo stile è in `app/design.css` (caricato dopo `app/globals.css`): colori, spazi e raggi sono variabili CSS con le versioni chiara e scura. I caratteri (Inter e Noto Naskh Arabic, licenza OFL) sono in `public/fonts/` e vengono salvati per l'uso offline.

```sh
npx playwright test   # test end-to-end, accessibilità (axe) e tema scuro su mobile
```

## Feedback, correzioni e contributi

Le critiche costruttive e le correzioni sono benvenute. Non devi essere d'accordo con le scelte del progetto: ciò che conta è aiutare a individuare cosa non funziona e come migliorarlo.

Per segnalare un errore, apri una Issue e includi:

- Il livello, la lezione e l'esercizio pertinenti.
- La formulazione o il comportamento che ritieni scorretto.
- La correzione che proponi e il ragionamento che la sostiene.
- Una fonte verificabile o una spiegazione linguistica documentata quando segnali un problema con i materiali didattici.
- Se esistono più forme accettabili, differenze di registro o distinzioni tra arabo standard moderno e dialetti, specificalo. L'obiettivo è migliorare il materiale senza sostituire un'inesattezza con un'altra.

Sono utili anche segnalazioni di bug, miglioramenti all'accessibilità, traduzioni, spiegazioni più chiare e suggerimenti per attività pratiche. Puoi contribuire tramite una Issue o una pull request. 

Ti preghiamo di non includere backup, note personali o altri dati privati nelle tue segnalazioni.

## Perché renderlo disponibile a tutti?

Voglio che i miei progetti siano disponibili per chiunque ne abbia bisogno.
Se costruisco qualcosa per risolvere un mio problema e questo può aiutare anche altre persone, condividerlo ha senso per me.

Arabo da Zero segue questa idea: ridurre le barriere all'apprendimento e permettere ad altri di usare, migliorare e sviluppare lo strumento. Non devi pagare per accedere al corso e non devi contribuire con codice per usarlo.

## Licenza

Il codice dell'applicazione è distribuito con licenza MIT: vedi LICENSE.

La licenza del codice non concede automaticamente gli stessi diritti sui materiali didattici. Per informazioni sull'origine e i termini di distribuzione dei contenuti, vedi CONTENT-LICENSE.md.
