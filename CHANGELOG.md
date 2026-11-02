# Registro delle modifiche

## 2.0.0-rc.6 — novembre 2026

### Tabelle: righe perse dalla vecchia importazione
- 2464 righe rimesse nelle tabelle di 311 file. L'importazione dai PDF perdeva le ultime righe di una tabella, di solito dove continuava nella pagina successiva: 2065 erano finite come paragrafi sciolti sotto la tabella (per esempio il giorno 7 del piano della settimana in ogni lezione A0), le altre mancavano del tutto.
- Le tabelle rimaste con la sola intestazione sono scese da 284 a 84; nessuna tabella è vuota o con righe di lunghezza diversa.
- 34 titoli di parte («Parte III — Esame di Livello 0»), letti come tabelle con una cella vuota, ora sono titoli.
- Le tabelle con cinque o più colonne scorrono in orizzontale invece di schiacciare le colonne, così le parole restano leggibili.
- Correzioni ripetibili in `scripts/content-fixes/pdf-rows.json`; `node scripts/apply-pdf-fixes.mjs --check` verifica che siano tutte applicate.
- Restano 200 tabelle con righe non ricostruite (il testo è comunque nella pagina, subito sotto): elencate in `reports/confronto-pdf-tabelle.md`.

## 2.0.0-rc.5 — novembre 2026

### Lezioni
- Tolti i due pannelli in fondo a ogni passaggio: «Lessico contestuale» e «Pratica orale». Per il significato di una parola basta toccarla nel testo, che apre la scheda con pronuncia, traslitterazione e traduzione.

### Scrittura a mano
- Tratto rifatto: l'inchiostro è una forma piena, quindi la linea si ingrossa e si assottiglia come nella scrittura vera, invece di avere spessore fisso.
- Due punte: «Penna» (tonda, segue velocità e pressione della penna) e «Calamo» (punta tagliata, spessa in orizzontale e sottile in verticale come il qalam). La scelta resta salvata.
- Tratto più fedele e più pulito: si usano tutte le posizioni che il dispositivo registra tra un fotogramma e l'altro, le posizioni vengono lisciate e le estremità si assottigliano come quando si stacca la penna.

## 2.0.0-rc.4 — novembre 2026

### Contenuti: confronto con i PDF originali
- Il testo dei sei volumi è stato estratto con l'importatore del progetto e confrontato parola per parola con il sito.
- 10.830 celle di tabella corrette (A0–B2): celle fuse, parole arabe nella colonna sbagliata, dialoghi ed elenchi in arabo con l'ordine delle parole rimescolato dalla vecchia importazione.
- 98 testi ricostruiti dal PDF (dialoghi, avvisi, lettere, modelli di risposta).
- Tolti circa 35.000 spazi spuri prima della punteggiatura e dentro «» e () attorno alle parole arabe.
- Correzioni ripetibili: `scripts/content-fixes/pdf-tables.json`, `pdf-fields.json`, `node scripts/apply-pdf-fixes.mjs`.
- `reports/confronto-pdf.md`: refusi trovati nei PDF e testi da controllare a mano.

### Esercizi
- Correzione automatica anche per le risposte aperte: traduzioni e risposte brevi vengono confrontate parola per parola con il modello (vocali facoltative, articolo e piccoli refusi tollerati, note tra parentesi e alternative facoltative, negazione obbligatoria), con l'elenco di cosa manca o è diverso.
- I testi liberi lunghi restano in autovalutazione, con il conteggio delle parole chiave del modello usate.
- «La mia risposta è corretta» anche per le risposte aperte.

### Interfaccia
- Le schede dei livelli nel corso non escono più dal box: griglia a 6, 3 o 2 colonne, nomi che vanno a capo.
- Ascolto lento davvero più lento (metà velocità) e condiviso tra alfabeto, lezioni e impostazioni.
- Pulsanti dell'alfabeto distanziati e raggruppati (ascolto, velocità, scrittura a mano).

## 2.0.0-rc.3 — novembre 2026

### Contenuti
- Corrette 848 parole arabe rimaste incollate dall'importazione dei PDF (es. «فيالبيت» → «في البيت»), con controlli che evitano di spezzare parole legittime.
- Ricostruite a mano 18 tabelle di coniugazione e 17 tabelle di grammatica (pronomi e suffissi, إنّ e sorelle, ما زال…) che avevano colonne fuse o spostate.
- Riscritte 233 righe delle tabelle «Errori tipici», ora nel formato «sbagliato → corretto — perché».
- Rimossi circa 13.000 a capo spuri del PDF che spezzavano le frasi a metà.
- Feedback specifico per ogni domanda (circa 14.000) al posto del messaggio generico; rimosse 408 consegne segnaposto.
- Script ripetibile `scripts/repair-pdf-artifacts.mjs` e nuovo controllo `glued-arabic` in `content:qa`.

### Esercizi e correzione
- La correzione riconosce le risposte giuste scritte senza vocali (quando la consegna non le chiede), con differenze di hamza, ة/ه o ى/ي, e spiega cosa controllare invece di segnarle come sbagliate.
- Le risposte «quasi giuste» tornano nel ripasso.
- Pulsante «La mia risposta è corretta» quando la correzione automatica sbaglia.
- Spiegazione «Perché» sotto ogni correzione.

### Interfaccia
- Nuovo design per desktop e mobile, con tema chiaro e scuro: home «Oggi», corso per livelli con ricerca, lezione con indice dei passaggi, ripasso unico (errori + flashcard), progressi, impostazioni.
- Su telefono: barra di navigazione in basso con il menu «Altro», indice della lezione apribile, nessuno scorrimento orizzontale fino a 320 px.
- Primo accesso: scelta del punto di partenza (da zero, so già leggere, voglio esplorare).
- Nuovo laboratorio di scrittura a mano (ricalca, copia, a memoria) collegato all'alfabeto.
- Mazzi di flashcard dalle parole di ogni lezione.
- Caratteri Inter e Noto Naskh Arabic inclusi nel sito (funzionano offline), arabo più grande e leggibile.
- Stato della voce araba del dispositivo e richiesta di archiviazione persistente nelle impostazioni.
- Contrasto AA verificato con axe su tutte le pagine principali, in chiaro e in scuro.

### Manutenzione
- Rimossi dal repository i file generati (`.vite/`, report dei test, screenshot); restano esclusi tramite `.gitignore`.
- Descrizione dell'app e del manifest in italiano; colore della barra del browser coerente con il tema.
- Test end-to-end aggiornati alla nuova interfaccia (47 test).
