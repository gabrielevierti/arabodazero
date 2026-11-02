# Confronto del sito con i PDF originali (A0–C1)

Il testo dei sei volumi è stato estratto con l'importatore del progetto (`scripts/volume-import`) e confrontato parola per parola con le lezioni del sito.

## Corretto automaticamente

- **10830 celle di tabella** in 295 file: celle fuse, parole arabe finite nella colonna sbagliata e frasi in arabo (dialoghi, elenchi) con l'ordine delle parole rimescolato dalla vecchia importazione. Il testo è stato preso dal PDF; le celle in arabo seguono ora l'ordine logico del volume, così si leggono bene anche quando vanno a capo.
- **98 testi** (dialoghi, avvisi, lettere, modelli di risposta) con frasi arabe rimescolate, ricostruiti dal PDF.
- Le correzioni sono in `scripts/content-fixes/pdf-tables.json` e `pdf-fields.json` e si applicano con `node scripts/apply-pdf-fixes.mjs`.
- Il volume C1 coincide già parola per parola con il PDF.

## Probabili refusi nei PDF originali

Sul sito queste parole sono già scritte correttamente; vale la pena correggerle nel sorgente dei volumi.

| Volume | Pagina | Parola nel PDF | Problema |
|---|---|---|---|
| A1 | 215 | مُمَرِّضََةٌ | segno ripetuto |
| A1 | 220 | بَغْدَادِيّّ | segno ripetuto |
| A1 | 220 | إِسْبَانِيّّ | segno ripetuto |
| A1 | 220 | تُرّْكِيّ | shadda + sukūn |
| A1 | 221 | كَبِيرَةٍِّ | due vocali sulla stessa lettera |
| B1 | 491 | مُعَطَّلَةٌِ | due vocali sulla stessa lettera |

## Da controllare a mano

Restano **637 testi nelle lezioni** (più le copie nei materiali della biblioteca) in cui la sequenza delle parole arabe non compare identica nel PDF. Sono quasi tutti paragrafi in italiano con più frasi arabe separate da punteggiatura: qui la correzione automatica non è affidabile, perché anche l'estrazione dal PDF può invertire l'ordine dei segmenti. Il numero di pagina indica dove guardare nel PDF.

| Lezione | Dove | Pagina PDF | Inizio del testo sul sito |
|---|---|---|---|
| A0-L0-01 | passaggio 5 | 21, 32, 33 | ن nūn (نُون) n /n/ ن نـ ـنـنـ |
| A0-L0-01 | esercizio 1, domanda 5 (prompt) | — | Quale vocale breve indica la fatḥa َ ? |
| A0-L0-01 | esercizio 1, domanda 5 (explanation) | — | La fatḥa َ indica a breve; la kasra ِ indica i; la ḍamma ُ indica u. |
| A0-L0-01 | esercizio 1, domanda 7 (prompt) | — | Che cosa indica il sukūn ْ ? |
| A0-L0-01 | esercizio 1, domanda 7 (explanation) | — | Il sukūn indica assenza di vocale breve dopo la consonante. La šadda ّ indica invece il ra |
| A0-L0-04 | passaggio 6 | 45, 47, 89 | لَيْل اللَّيْل al-layl solare: ل dell'articolo + ل della parola |
| A0-L0-04 | passaggio 7 | 45, 46, 47 | La šadda ّ indica una consonante doppia (geminata): رَدّ radd, مُدَرِّب mudarrib. Gli ital |
| A0-L0-04 | esercizio 2, domanda 1 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 2 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 3 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 4 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 5 (model) | — | الذَّنْبذَنْب /  / aḏ-ḏanb / solare |
| A0-L0-04 | esercizio 2, domanda 5 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 5 (feedback) | — | الذَّنْبذَنْب /  / aḏ-ḏanb / solare |
| A0-L0-04 | esercizio 2, domanda 6 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 7 (model) | — | الزَّيْتُونزَيْتُون /  / az-zaytūn / solare |
| A0-L0-04 | esercizio 2, domanda 7 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 7 (feedback) | — | الزَّيْتُونزَيْتُون /  / az-zaytūn / solare |
| A0-L0-04 | esercizio 2, domanda 8 (model) | — | التِّبْنتِبْن /  / at-tibn / solare |
| A0-L0-04 | esercizio 2, domanda 8 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 8 (feedback) | — | التِّبْنتِبْن /  / at-tibn / solare |
| A0-L0-04 | esercizio 2, domanda 9 (model) | — | الثِّيَابثِيَاب /  / aṯ-ṯiyāb / solare |
| A0-L0-04 | esercizio 2, domanda 9 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 9 (feedback) | — | الثِّيَابثِيَاب /  / aṯ-ṯiyāb / solare |
| A0-L0-04 | esercizio 2, domanda 10 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 11 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 12 (model) | — | المُدَرِّبمُدَرِّب /  / al-mudarrib / lunare |
| A0-L0-04 | esercizio 2, domanda 12 (explanation) | 100 | Parola / Con articolo / Pronuncia / Tipo a) بَلَد / البَلَد / al-balad / lunare b) نَار /  |
| A0-L0-04 | esercizio 2, domanda 12 (feedback) | — | المُدَرِّبمُدَرِّب /  / al-mudarrib / lunare |
| A0-L0-05 | passaggio 2 | 50 | خ ḫāʾ (خَاء) ḫ /x/ ~ [χ] خ خـ ـخـخـ |
| A0-L0-06 | esercizio 3, domanda 1 (explanation) | 103 | a) سلام: س ل ا م, 2 tratti (سلا، م) · b) صباح: ص ب ا ح, 2 tratti (صبا، ح) · c) مريض: م ر ي |
| A0-L0-06 | esercizio 3, domanda 2 (explanation) | 103 | a) سلام: س ل ا م, 2 tratti (سلا، م) · b) صباح: ص ب ا ح, 2 tratti (صبا، ح) · c) مريض: م ر ي |
| A0-L0-06 | esercizio 3, domanda 3 (model) | 103 | مريض: م ر ي ض, 2 tratti (مر، يض) |
| A0-L0-06 | esercizio 3, domanda 3 (explanation) | 103 | a) سلام: س ل ا م, 2 tratti (سلا، م) · b) صباح: ص ب ا ح, 2 tratti (صبا، ح) · c) مريض: م ر ي |
| A0-L0-06 | esercizio 3, domanda 3 (feedback) | 103 | مريض: م ر ي ض, 2 tratti (مر، يض) |
| A0-L0-06 | esercizio 3, domanda 4 (explanation) | 103 | a) سلام: س ل ا م, 2 tratti (سلا، م) · b) صباح: ص ب ا ح, 2 tratti (صبا، ح) · c) مريض: م ر ي |
| A0-L0-06 | esercizio 3, domanda 5 (explanation) | 103 | a) سلام: س ل ا م, 2 tratti (سلا، م) · b) صباح: ص ب ا ح, 2 tratti (صبا، ح) · c) مريض: م ر ي |
| A0-L0-06 | esercizio 3, domanda 6 (explanation) | 103 | a) سلام: س ل ا م, 2 tratti (سلا، م) · b) صباح: ص ب ا ح, 2 tratti (صبا، ح) · c) مريض: م ر ي |
| A0-L0-06 | soluzioni | 103 | Esercizio 1. a) سـ sīn iniziale · b) ـشـ šīn mediana · c) ص ṣād isolata · d) ـض ḍād finale |
| A0-L0-08 | esercizio 4, domanda 1 (explanation) | 105 | a) دولة: د و ل ة, 3 tratti (د، و، لة) · b) حكومة: ح ك و م ة, 2 tratti (حكو، مة) · c) قانون |
| A0-L0-08 | esercizio 4, domanda 2 (explanation) | 105 | a) دولة: د و ل ة, 3 tratti (د، و، لة) · b) حكومة: ح ك و م ة, 2 tratti (حكو، مة) · c) قانون |
| A0-L0-08 | esercizio 4, domanda 3 (model) | 105 | قانون: ق ا ن و ن, 3 tratti (قا، نو، ن) |
| A0-L0-08 | esercizio 4, domanda 3 (explanation) | 105 | a) دولة: د و ل ة, 3 tratti (د، و، لة) · b) حكومة: ح ك و م ة, 2 tratti (حكو، مة) · c) قانون |
| A0-L0-08 | esercizio 4, domanda 3 (feedback) | 105 | قانون: ق ا ن و ن, 3 tratti (قا، نو، ن) |
| A0-L0-08 | esercizio 4, domanda 4 (explanation) | 105 | a) دولة: د و ل ة, 3 tratti (د، و، لة) · b) حكومة: ح ك و م ة, 2 tratti (حكو، مة) · c) قانون |
| A0-L0-08 | esercizio 4, domanda 5 (explanation) | 105 | a) دولة: د و ل ة, 3 tratti (د، و، لة) · b) حكومة: ح ك و م ة, 2 tratti (حكو، مة) · c) قانون |
| A0-L0-08 | esercizio 4, domanda 6 (model) | 105, 108 | العراق: ا ل ع ر ا ق, 4 tratti (ا، لعر، ا، ق) |
| A0-L0-08 | esercizio 4, domanda 6 (explanation) | 105 | a) دولة: د و ل ة, 3 tratti (د، و، لة) · b) حكومة: ح ك و م ة, 2 tratti (حكو، مة) · c) قانون |
| A0-L0-08 | esercizio 4, domanda 6 (feedback) | 105, 108 | العراق: ا ل ع ر ا ق, 4 tratti (ا، لعر، ا، ق) |
| A0-L0-08 | soluzioni | 105 | Esercizio 1. a) هـ hāʾ iniziale · b) ـهـ hāʾ mediana · c) ـه hāʾ finale · d) ه hāʾ isolata |
| A0-L0-09 | passaggio 6 | 10, 18, 19 | Alcune parole cominciano con una alif senza hamza, la alif waṣla («alif di collegamento»): |
| A0-L0-09 | passaggio 7 | 78 | ى finale / يّ عَلَى – عَلِيّ ʿalā – ʿAlī su – Ali (nome) |
| A0-L0-10 | passaggio 3 | 85, 93 | الجَيْشُ عَلَى الحُدُودِ سُؤَالٌ إِلَى الوَزِيرِ |
| A0-L0-10 | passaggio 11 | — | شرطت حتيق |
| A1-A1-01 | passaggio 4 | 12, 16 | تُصْبِحُ عَلَى خَيْرٍ / تُصْبِحِينَ وَأَنْتَ مِنْ أَهْلِهِ / وَأَنْتِ مِنْ Buonanotte (a u |
| A1-A1-01 | passaggio 8 | 13, 273 | صَبَاحُ النُّورِ ṣabāḥu n-nūr risposta a صباح الخير ن و ر formula — |
| A1-A1-01 | esercizio 9, domanda 1 (model) | 12, 13, 14 | Modello. Al gruppo: اِسْمِي لُوكَا! مَسَاءُ الخَيْرِ. ! إِلَى اللِّقَاءِ A Salmā: ! مَسَاء |
| A1-A1-01 | esercizio 9, domanda 1 (explanation) | 12, 13, 14 | Modello. Al gruppo: اِسْمِي لُوكَا! مَسَاءُ الخَيْرِ. ! إِلَى اللِّقَاءِ A Salmā: ! مَسَاء |
| A1-A1-01 | soluzioni | 214 | Esercizio 1. 1 b · 2 d · 3 g · 4 e · 5 a · 6 c · 7 f. La 4 vuole أَهْلًا بِكَ perché la fr |
| A1-A1-02 | esercizio 9, domanda 1 (model) | 84, 215 | Modello. هِيَ صَدِيقَتِي، وَهِيَ. هِيَ جُولْيَا. هُوَ زَمِيلِي، وَهُوَ شُرْطِيٌّ فِي مِيلَ |
| A1-A1-02 | esercizio 9, domanda 1 (explanation) | 84, 215 | Modello. هِيَ صَدِيقَتِي، وَهِيَ. هِيَ جُولْيَا. هُوَ زَمِيلِي، وَهُوَ شُرْطِيٌّ فِي مِيلَ |
| A1-A1-02 | soluzioni | 84, 215 | Esercizio 9 · Modello. هِيَ صَدِيقَتِي، وَهِيَ. هِيَ جُولْيَا. هُوَ زَمِيلِي، وَهُوَ شُرْط |
| A1-A1-03 | passaggio 3 | 29, 34, 41 | سَيَّارَة مَكْتَب ufficio · automobile |
| A1-A1-03 | passaggio 4 | 30 | Uomini con حَمْزَةة Ḥamza · أُسَامَة Usāma · خَلِيفَة ḫalīfa Il significato è maschile: l' |
| A1-A1-03 | passaggio 12 | 34, 35 | أُسْتَاذِي مُهَنْدِسٌ مَشْهُورٌ، وَهُوَ رَجُلٌ طَوِيلٌ. صَغِيرٌ وَقَدِيمٌ، وَهُوَ قَرِيبٌ  |
| A1-A1-04 | esercizio 9, domanda 1 (model) | 217 | Modello. . فِي الشَّارِعِ مَدْرَسَةٌ كَبِيرَةٌ وَصَيْدَلِيَّةٌ وَمَكْتَبَةٌ صَغِيرَةٌ. شَا |
| A1-A1-04 | esercizio 9, domanda 1 (explanation) | 217 | Modello. . فِي الشَّارِعِ مَدْرَسَةٌ كَبِيرَةٌ وَصَيْدَلِيَّةٌ وَمَكْتَبَةٌ صَغِيرَةٌ. شَا |
| A1-A1-06 | passaggio 3 | 40, 41, 44 | . فِي الشَّارِعِ صَيْدَلِيَّةٌ هَلْ فِي الشَّارِعِ صَيْدَلِيَّةٌ؟. نَعَمْ |
| A1-A1-06 | passaggio 7 | 58, 64, 66 | الإِيطَالِيَّةُ ٢، مَسَاءً الدَّرْسُ |
| A1-A1-07 | passaggio 10 | 66, 70, 220 | إِيطَالِيٌّ لُوكَا الإِيطَالِيَّةُ، الإِنْجْلِيزِيَّةُ شُرْطِيٌّ مِيلَانُو |
| A1-A1-07 | esercizio 1, domanda 1 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 2 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 3 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 4 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 5 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 6 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 7 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 7 (feedback) | 220 | تُرْكِيّ / تُرْكِيَّة |
| A1-A1-07 | esercizio 1, domanda 8 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 8 (feedback) | 220 | إِسْبَانِيّ / إِسْبَانِيَّة |
| A1-A1-07 | esercizio 1, domanda 9 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 1, domanda 10 (explanation) | 220 | a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِيَّة · d) فِلَ |
| A1-A1-07 | esercizio 8, domanda 1 (model) | 220 | Modello. حَسَن مُهَنْدِسٌ سُودَانِيٌّ مُقِيمٌ فِي مِصْرَ، وَلُغَتُهُ الثَّانِيَةُ. مُنَى ط |
| A1-A1-07 | esercizio 8, domanda 1 (explanation) | 220 | Modello. حَسَن مُهَنْدِسٌ سُودَانِيٌّ مُقِيمٌ فِي مِصْرَ، وَلُغَتُهُ الثَّانِيَةُ. مُنَى ط |
| A1-A1-07 | soluzioni | 220 | Esercizio 1. a) مِصْرِيّ / مِصْرِيَّة · b) لِيبِيّ / لِيبِيَّة · c) أُرْدُنِيّ / أُرْدُنِي |
| A1-A1-08 | passaggio 2 | 74 | Che cosa notare. Dopo ogni preposizione il nome finisce in -i: عَلَى المَكْتَبِ, بِجَانِبِ |
| A1-A1-08 | passaggio 4 | 64, 71, 75 | فِي بَغْدَادَ، مِنْ مِصْرَبَغْدَادُ، مِصْرُ fī Baġdād, min Miṣr |
| A1-A1-08 | esercizio 10, domanda 1 (model) | 221 | Modello (settimana 2). لِي أُخْتٌ فِي رُومَا، وَلِي صَدِيقٌ. عِنْدِي سَيَّارَةٌ صَغِيرَةٌ  |
| A1-A1-08 | esercizio 10, domanda 1 (explanation) | 221 | Modello (settimana 2). لِي أُخْتٌ فِي رُومَا، وَلِي صَدِيقٌ. عِنْدِي سَيَّارَةٌ صَغِيرَةٌ  |
| A1-A1-09 | passaggio 5 | 85 | Accusativo أَبَاكَأَبِي abāka أَبَاهُ abāhu أَبَاهَا abāhā |
| A1-A1-09 | esercizio 8, domanda 1 (model) | 222 | Modello. . أُمِّي اسْمُهَا آنَّا، وَهِيَ مُمَرِّضَةٌ فِي مُسْتَشْفًى كَبِيرٍ. أَبِي اسْمُه |
| A1-A1-09 | esercizio 8, domanda 1 (explanation) | 222 | Modello. . أُمِّي اسْمُهَا آنَّا، وَهِيَ مُمَرِّضَةٌ فِي مُسْتَشْفًى كَبِيرٍ. أَبِي اسْمُه |
| A1-A1-10 | passaggio 3 | 29, 78, 84 | سَيَّارَةُ أَخِي أَخِي سَيَّارَة sayyāratu aḫī l'auto di mio fratello |
| A1-A1-10 | passaggio 16 | 48, 92, 99 | المَدِينَةُ مِيلَانُو مَدِينَةُ مِيلَانُو |
| A1-A1-10 | esercizio 8, domanda 1 (explanation) | 223 | a) La sicurezza delle città. b) Il ministro dell'Interno italiano, il direttore della poli |
| A1-A1-10 | esercizio 8, domanda 2 (explanation) | 223 | a) La sicurezza delle città. b) Il ministro dell'Interno italiano, il direttore della poli |
| A1-A1-10 | esercizio 8, domanda 3 (explanation) | 223 | a) La sicurezza delle città. b) Il ministro dell'Interno italiano, il direttore della poli |
| A1-A1-10 | esercizio 8, domanda 4 (explanation) | 223 | a) La sicurezza delle città. b) Il ministro dell'Interno italiano, il direttore della poli |
| A1-A1-10 | esercizio 8, domanda 5 (explanation) | 223 | a) La sicurezza delle città. b) Il ministro dell'Interno italiano, il direttore della poli |
| A1-A1-10 | esercizio 8, domanda 6 (model) | 223 | أَمْنِ المُدُنِ · وَزِيرُ الدَّاخِلِيَّةِ · مُدِيرُ الشُّرْطَةِ · سَفِيرُ تُونِسَ · مَكَان |
| A1-A1-10 | esercizio 8, domanda 6 (explanation) | 223 | a) La sicurezza delle città. b) Il ministro dell'Interno italiano, il direttore della poli |
| A1-A1-10 | esercizio 8, domanda 6 (feedback) | 223 | أَمْنِ المُدُنِ · وَزِيرُ الدَّاخِلِيَّةِ · مُدِيرُ الشُّرْطَةِ · سَفِيرُ تُونِسَ · مَكَان |
| A1-A1-10 | esercizio 8, domanda 7 (explanation) | 223 | a) La sicurezza delle città. b) Il ministro dell'Interno italiano, il direttore della poli |
| A1-A1-10 | esercizio 8, domanda 8 (explanation) | 223 | a) La sicurezza delle città. b) Il ministro dell'Interno italiano, il direttore della poli |
| A1-A1-11 | passaggio 14 | 107, 109 | سِتَّة سِتَة, con la šadda |
| A1-A1-11 | esercizio 8, domanda 1 (model) | 57, 58, 208 | Modello. الاِسْمُ: لُوكَا · العُمْرُ: . عُمْرِي ثَلَاثُونَ سَنَةً · ١٥: تَارِيخُ المِيلَاد |
| A1-A1-11 | esercizio 8, domanda 1 (explanation) | 57, 58, 208 | Modello. الاِسْمُ: لُوكَا · العُمْرُ: . عُمْرِي ثَلَاثُونَ سَنَةً · ١٥: تَارِيخُ المِيلَاد |
| A1-A1-11 | soluzioni | 225 | Esercizio 1. a) ٧ · ٠ · ٣ · ١٠ · ٢ · ٩ · ٥ · ١١٢ · b) 4 · 8 · 6 · 1 · 5 · 0 · 25 · 1998 Es |
| A1-A1-12 | passaggio 6 | 112 | 3ª femminile كِتَابُهَا -hā كِتَابُهُمَا -humā كِتَابُهُنَّ -hunna Le regole di A1-09 rest |
| A1-A1-12 | esercizio 3, domanda 1 (explanation) | 226 | a) سَيَّارَتَانِ · فِي سَيَّارَتَيْنِ · b) طَالِبَانِ · مَعَ طَالِبَيْنِ · c) غُرْفَتَانِ  |
| A1-A1-12 | esercizio 3, domanda 2 (explanation) | 226 | a) سَيَّارَتَانِ · فِي سَيَّارَتَيْنِ · b) طَالِبَانِ · مَعَ طَالِبَيْنِ · c) غُرْفَتَانِ  |
| A1-A1-12 | esercizio 3, domanda 3 (explanation) | 226 | a) سَيَّارَتَانِ · فِي سَيَّارَتَيْنِ · b) طَالِبَانِ · مَعَ طَالِبَيْنِ · c) غُرْفَتَانِ  |
| A1-A1-12 | esercizio 3, domanda 4 (model) | 140, 226, 235 | مُتَرْجِمَانِ · مِنْ مُتَرْجِمَيْنِ |
| A1-A1-12 | esercizio 3, domanda 4 (explanation) | 226 | a) سَيَّارَتَانِ · فِي سَيَّارَتَيْنِ · b) طَالِبَانِ · مَعَ طَالِبَيْنِ · c) غُرْفَتَانِ  |
| A1-A1-12 | esercizio 3, domanda 4 (feedback) | 140, 226, 235 | مُتَرْجِمَانِ · مِنْ مُتَرْجِمَيْنِ |
| A1-A1-12 | esercizio 3, domanda 5 (explanation) | 226 | a) سَيَّارَتَانِ · فِي سَيَّارَتَيْنِ · b) طَالِبَانِ · مَعَ طَالِبَيْنِ · c) غُرْفَتَانِ  |
| A1-A1-12 | esercizio 10, domanda 1 (model) | 226 | Modello. . نَحْنُ خَمْسَةُ طُلَّابٍ، وَصَفُّنَا فِي الطَّابِقِ الأَوَّلِ. نَحْنُ مَجْمُوعَ |
| A1-A1-12 | esercizio 10, domanda 1 (explanation) | 226 | Modello. . نَحْنُ خَمْسَةُ طُلَّابٍ، وَصَفُّنَا فِي الطَّابِقِ الأَوَّلِ. نَحْنُ مَجْمُوعَ |
| A1-A1-12 | soluzioni | 226 | Esercizio 1. a) أَنْتُمَا · b) هُمَا · c) أَنْتُنَّ · d) نَحْنُ · e) هُمْ (gruppo misto) · |
| A1-A1-12 | soluzioni | 226 | عِنْدَنَا كُتُبٌ جَدِيدَةٌ. مُدَرِّسَتُنَا سَلْمَى، وَهِيَ مِنَ القَاهِرَةِ. مَارْيَا وَهُ |
| A1-A1-13 | passaggio 3 | 119, 120, 121 | lei … تَدْرُسُ تَ tadrusu |
| A1-A1-13 | passaggio 4 | 120 | يَجْلِسُ i sedersi, stare seduto أَجْلِسُجَلَسَ تَجْلِسِينَ · |
| A1-A1-13 | passaggio 5 | 121 | «Mi piace il caffè» = أُحِبُّ القَهْوَةَ: in arabo «io amo il caffè», con il caffè complem |
| A1-A1-13 | esercizio 10, domanda 1 (model) | 125, 227 | Modello. هُوَ يَكْتُبُ تَقَارِيرَ، وَهِيَ تَكْتُبُ. هُوَ يَشْرَبُ القَهْوَةَ صَبَاحًا، وَه |
| A1-A1-13 | esercizio 10, domanda 1 (explanation) | 125, 227 | Modello. هُوَ يَكْتُبُ تَقَارِيرَ، وَهِيَ تَكْتُبُ. هُوَ يَشْرَبُ القَهْوَةَ صَبَاحًا، وَه |
| A1-A1-13 | esercizio 11, domanda 1 (model) | 227 | Modello. أَعْمَلُ فِي مَكْتَبٍ. أَوَّلًا أَشْرَبُ قَهْوَةً، ثُمَّ أَذْهَبُ إِلَى العَمَلِ. |
| A1-A1-13 | esercizio 11, domanda 1 (explanation) | 227 | Modello. أَعْمَلُ فِي مَكْتَبٍ. أَوَّلًا أَشْرَبُ قَهْوَةً، ثُمَّ أَذْهَبُ إِلَى العَمَلِ. |
| A1-A1-13 | soluzioni | 126, 227 | . بَعْدَ ذٰلِكَ أَدْرُسُ العَرَبِيَّةَ وَأَسْمَعُ الأَخْبَارَ. وَأَطْبُخُ العَشَاءَ (57 pa |
| A1-A1-14 | passaggio 3 | 131 | loro (f.) يَعْرِفْنَيَعْمَلْنَيَدْرُسْنَْنَ… يَ Come ricordarla. I prefissi sono solo quat |
| A1-A1-14 | passaggio 5 | 131, 132 | يَبْحَثُ عَنْ cercare يَبْحَثُونَتَبْحَثِينَأَبْحَثُ Come si usano. يَتَكَلَّمُ + lingua a |
| A1-A1-14 | esercizio 11, domanda 1 (model) | 228 | Modello. لَا. نَعْمَلُ مَعًا كُلَّ يَوْمٍ، وَنَأْكُلُ ظُهْرًا فِي مَطْعَمٍ قَرِيبٍ. نَحْنُ |
| A1-A1-14 | esercizio 11, domanda 1 (explanation) | 228 | Modello. لَا. نَعْمَلُ مَعًا كُلَّ يَوْمٍ، وَنَأْكُلُ ظُهْرًا فِي مَطْعَمٍ قَرِيبٍ. نَحْنُ |
| A1-A1-15 | passaggio 5 | 41, 141, 261 | مَدْرَسَة مَدَارِس mafāʿil scuola |
| A1-A1-15 | passaggio 5 | 141 | Come impararli. Il plurale fratto si impara insieme al singolare: nel lessico di questo vo |
| A1-A1-15 | esercizio 2, domanda 2 (prompt) | 23, 140, 144 | ◌ إِيطَالِيِّ ◌ أَعْمَلُ مَعَ مُهَنْدِس. |
| A1-A1-15 | esercizio 2, domanda 5 (prompt) | 114, 145, 181 | كَثِيرُونَ ◌ فِي الوِزَارَةِ مُحَلِّل. |
| A1-A1-15 | esercizio 9, domanda 1 (model) | 229 | Modello. زُمَلَائِي شُرْطِيُّونَ وَضُبَّاطٌ، وَفِي المَرْكَزِ أَيْضًا. أَعْمَلُ شُرْطِيًّا |
| A1-A1-15 | esercizio 9, domanda 1 (explanation) | 229 | Modello. زُمَلَائِي شُرْطِيُّونَ وَضُبَّاطٌ، وَفِي المَرْكَزِ أَيْضًا. أَعْمَلُ شُرْطِيًّا |
| A1-A1-16 | passaggio 12 | 154 | لَيْسَ فِي الحَيِّ مَتَاحِفُ أَوْ. مَحَطَّةُ المِتْرُو قَرِيبَةٌ، وَالحَافِلَاتُ كَثِيرَةٌ |
| A1-A1-16 | esercizio 10, domanda 1 (model) | 230 | Modello (settimana 2). الحَيُّ هَادِئٌ وَنَظِيفٌ، لٰكِنْ. أَسْكُنُ فِي حَيٍّ حَدِيثٍ فِي ش |
| A1-A1-16 | esercizio 10, domanda 1 (explanation) | 230 | Modello (settimana 2). الحَيُّ هَادِئٌ وَنَظِيفٌ، لٰكِنْ. أَسْكُنُ فِي حَيٍّ حَدِيثٍ فِي ش |
| A1-A1-16 | soluzioni | 230 | لَيْسَ فِي الحَيِّ مَسْرَحٌ،. الشَّوَارِعُ وَاسِعَةٌ، وَفِي المَيْدَانِ حَدِيقَةٌ كَبِيرَة |
| A1-A1-17 | esercizio 9, domanda 1 (model) | 231 | /  / النَّشَاطُ الوَقْتُ اليَوْمُ الاِثْنَيْنُ وَالأَرْبِعَاءُ / : ١٣ – ٠٠: ٩ / دُرُوسٌ فِ |
| A1-A1-17 | esercizio 9, domanda 1 (explanation) | 231 | /  / النَّشَاطُ الوَقْتُ اليَوْمُ الاِثْنَيْنُ وَالأَرْبِعَاءُ / : ١٣ – ٠٠: ٩ / دُرُوسٌ فِ |
| A1-A1-17 | esercizio 11, domanda 1 (model) | 231 | Modello. يَوْمَ الثُّلَاثَاءِ عِنْدِي دَرْسُ. يَوْمَ الاِثْنَيْنِ أَعْمَلُ مِنَ السَّاعَةِ |
| A1-A1-17 | esercizio 11, domanda 1 (explanation) | 231 | Modello. يَوْمَ الثُّلَاثَاءِ عِنْدِي دَرْسُ. يَوْمَ الاِثْنَيْنِ أَعْمَلُ مِنَ السَّاعَةِ |
| A1-A1-17 | soluzioni | 231 | يَوْمَ الخَمِيسِ أَذْهَبُ إِلَى النَّادِي. يَوْمَ الأَرْبِعَاءِ أَعْمَلُ فِي الشَّارِعِ مَ |
| A1-A1-18 | passaggio 4 | 120, 123, 169 | عَرَفَ a عَرَفْتُيَعْرِفُ sapere, conoscere |
| A1-A1-18 | passaggio 6 | 170, 264 | أَحْبَبْتُ أَحَبَّتْأَحَبَّ يُحِبُّ أَحَبُّوا amare |
| A1-A1-18 | esercizio 12, domanda 1 (model) | 233 | Modello (settimana 2). ثُمَّ شَرِبْتُ قَهْوَةً وَقَرَأْتُ. يَوْمَ السَّبْتِ نِمْتُ حَتَّى  |
| A1-A1-18 | esercizio 12, domanda 1 (explanation) | 233 | Modello (settimana 2). ثُمَّ شَرِبْتُ قَهْوَةً وَقَرَأْتُ. يَوْمَ السَّبْتِ نِمْتُ حَتَّى  |
| A1-A1-18 | soluzioni | 233 | يَوْمَ. مَسَاءً شَاهَدْنَا فِيلْمًا عَرَبِيًّا، لٰكِنْ مَا فَهِمْتُ كُلَّ شَيْءٍ. بَعْدَ ا |
| A1-A1-19 | passaggio 4 | 180, 182, 293 | soggetto del verbo (فَاعِل) nominativo التَّقْرِيرَ المُدِيرُ قَرَأَ A1-13 |
| A1-A1-19 | passaggio 4 | 132, 135, 137 | complemento di tempo e di luogo accusativo البَيْتِ أَمَامَ ، صَبَاحًا الأَحَدِ، يَوْمَ A1 |
| A1-A1-19 | passaggio 4 | 67, 131, 132 | complemento di modo, avverbio accusativo جَيِّدًا ، أَتَكَلَّمُ مُتَأَخِّرًا رَجَعَ A1-13 |
| A1-A1-19 | passaggio 4 | 180 | البَيْتِ الكَبِيرِ, زَارَ أُخْتَهُ وَأَخَاهُ. |
| A1-A1-19 | passaggio 5 | 27, 69, 180 | . صَبَاحًا رَجَعَ الطَّالِبُ صَبَاحًا complemento di tempo (acc.) |
| A1-A1-19 | passaggio 7 | 180, 266 | Singolare comune الكِتَابُ · كِتَابٌ كِتَابٍ الكِتَابَ · كِتَابًا الكِتَابِ · |
| A1-A1-19 | passaggio 8 | 181 | كَانَ «era, fu» (A1-18) e لَيْسَ (A1-16) lasciano il soggetto al nominativo e mettono il p |
| A1-A1-19 | passaggio 18 | 186 | مَشْغُولٌ · 4. كَانَ الطَّقْسُ جَمِيلًا · 5. إِنَّ المُشْكِلَةَ كَبِيرَةٌ · 6. رَجَعْتُ لَ |
| A1-A1-19 | esercizio 1, domanda 3 (prompt) | 183 | أَكَلْتُ الخُبْزَ. |
| A1-A1-19 | esercizio 1, domanda 6 (prompt) | 183, 214 | لَيْسَ الدَّرْسُ سَهْلًا. |
| A1-A1-19 | esercizio 1, domanda 7 (prompt) | 168, 169, 177 | رَجَعْتُ مَسَاءً. |
| A1-A1-19 | esercizio 8, domanda 1 (explanation) | 184, 235 | a) Lunga e difficile, perché quest'anno gli studenti sono tanti. b) Un poliziotto italiano |
| A1-A1-19 | esercizio 8, domanda 2 (explanation) | 184, 235 | a) Lunga e difficile, perché quest'anno gli studenti sono tanti. b) Un poliziotto italiano |
| A1-A1-19 | esercizio 8, domanda 3 (explanation) | 184, 235 | a) Lunga e difficile, perché quest'anno gli studenti sono tanti. b) Un poliziotto italiano |
| A1-A1-19 | esercizio 8, domanda 4 (explanation) | 184, 235 | a) Lunga e difficile, perché quest'anno gli studenti sono tanti. b) Un poliziotto italiano |
| A1-A1-19 | esercizio 8, domanda 5 (explanation) | 184, 235 | a) Lunga e difficile, perché quest'anno gli studenti sono tanti. b) Un poliziotto italiano |
| A1-A1-19 | esercizio 8, domanda 6 (model) | 184, 235 | Soggetti di frase nominale: نَحْنُ، الطُّلَّابُ (in وَالطُّلَّابُ يَدْرُسُونَ) ، نُور، سَل |
| A1-A1-19 | esercizio 8, domanda 6 (explanation) | 184, 235 | a) Lunga e difficile, perché quest'anno gli studenti sono tanti. b) Un poliziotto italiano |
| A1-A1-19 | esercizio 8, domanda 6 (feedback) | 184, 235 | Soggetti di frase nominale: نَحْنُ، الطُّلَّابُ (in وَالطُّلَّابُ يَدْرُسُونَ) ، نُور، سَل |
| A1-A1-19 | esercizio 8, domanda 7 (explanation) | 184, 235 | a) Lunga e difficile, perché quest'anno gli studenti sono tanti. b) Un poliziotto italiano |
| A1-A1-19 | soluzioni | 235 | Esercizio 1. a) nominativo, soggetto della frase nominale · b) nominativo, predicato · c)  |
| A1-A1-20 | passaggio 5 | 190 | السَّاعَةَ الخَامِسَةَ وَالنِّصْفَ، وَيَرْجِعُ إِلَى بَيْتِهِ بِالمِتْرُو. عِنْدَهُ سَيَّا |
| A1-A1-20 | passaggio 6 | 191 | . أَنَا بَاحِثٌ فِي جَامِعَةِ مَالْطَا: الرَّجُلُ الجَلْسَةُ الأُولَى تَبْدَأُ السَّاعَةَ  |
| A1-A1-20 | passaggio 10 | 132, 168, 169 | مَا ذَهَبْتُلَا ذَهَبْتُ A1-18 |
| A2-A2-01 | passaggio 13 | 21 | . فِي حَرْفِ المِيمِ، لٰكِنَّ الكَلِمَةَ لَيْسَتْ هُنَاكَ «مَعْلُومَات» البَيْتِ فَتَحَ ال |
| A2-A2-01 | esercizio 5, domanda 1 (model) | 363 | Una soluzione possibile (le parole tra parentesi esistono ma non sono ancora state studiat |
| A2-A2-01 | esercizio 5, domanda 1 (explanation) | 363 | Una soluzione possibile (le parole tra parentesi esistono ma non sono ancora state studiat |
| A2-A2-01 | soluzioni | 363 | سَاكِنسَكَنَس ك ن — مَسْكَن (سَكَن «alloggio») |
| A2-A2-02 | passaggio 3 | 27 | loro (f.) دَرَسْنَهُنَّ darasna ـْنَ -na |
| A2-A2-02 | passaggio 4 | — | faʿula – yafʿulu يَكْبُرُكَبُرَ (stati e qualità: «diventare grande, crescere») |
| A2-A2-02 | passaggio 15 | 36, 134, 301 | لُوكَامَعَ السَّلَامَةِ، |
| A2-A2-03 | passaggio 3 | — | loro (f.) يَدْرُسْنَهُنَّ yadrusna |
| A2-A2-03 | passaggio 5 | 33, 42, 44 | وَقَعَ «cadere; trovarsi» يَقَعُ yaqaʿu يَقَعُونَأَقَعُ |
| A2-A2-03 | passaggio 6 | 29, 39, 42 | ā نِمْتُيَخَافُ, يَنَامُ خِفْتُ, |
| A2-A2-03 | esercizio 12, domanda 1 (explanation) | 367 | a) Una società italiana di Milano. b) Arabo e italiano. c) Tradurre lettere e rapporti, ri |
| A2-A2-03 | esercizio 12, domanda 2 (explanation) | 367 | a) Una società italiana di Milano. b) Arabo e italiano. c) Tradurre lettere e rapporti, ri |
| A2-A2-03 | esercizio 12, domanda 3 (explanation) | 367 | a) Una società italiana di Milano. b) Arabo e italiano. c) Tradurre lettere e rapporti, ri |
| A2-A2-03 | esercizio 12, domanda 4 (explanation) | 367 | a) Una società italiana di Milano. b) Arabo e italiano. c) Tradurre lettere e rapporti, ri |
| A2-A2-03 | esercizio 12, domanda 5 (explanation) | 367 | a) Una società italiana di Milano. b) Arabo e italiano. c) Tradurre lettere e rapporti, ri |
| A2-A2-03 | esercizio 12, domanda 6 (explanation) | 367 | a) Una società italiana di Milano. b) Arabo e italiano. c) Tradurre lettere e rapporti, ri |
| A2-A2-03 | esercizio 12, domanda 7 (explanation) | 367 | a) Una società italiana di Milano. b) Arabo e italiano. c) Tradurre lettere e rapporti, ri |
| A2-A2-03 | esercizio 12, domanda 8 (model) | 367 | تُتَرْجِمُ المُتَرْجِمَةُ الرَّسَائِلَ وَالتَّقَارِيرَ، وَتُرَاجِعُ تَرْجَمَاتِ الزُّمَلَا |
| A2-A2-03 | esercizio 12, domanda 8 (explanation) | 367 | a) Una società italiana di Milano. b) Arabo e italiano. c) Tradurre lettere e rapporti, ri |
| A2-A2-03 | esercizio 12, domanda 8 (feedback) | 367 | تُتَرْجِمُ المُتَرْجِمَةُ الرَّسَائِلَ وَالتَّقَارِيرَ، وَتُرَاجِعُ تَرْجَمَاتِ الزُّمَلَا |
| A2-A2-04 | passaggio 3 | 2, 53, 54 | سَوْفَ يَدْعُونَسَيَدْعُونَيَدْعُونَ inviteranno |
| A2-A2-04 | passaggio 7 | 57, 370 | يَرْفُضُ أَنْ رَفَضُوا أَنْ يَدْفَعُوا. Si sono rifiutati di pagare. |
| A2-A2-04 | esercizio 7, domanda 1 (explanation) | 369 | a) ذَهَبْتُ إِلَى البَنْكِ لِأَدْفَعَ الإِيجَارَ. · b) سَتَتَّصِلُ بِالسَّفَارَةِ لِتَسْأَ |
| A2-A2-04 | esercizio 7, domanda 2 (explanation) | 369 | a) ذَهَبْتُ إِلَى البَنْكِ لِأَدْفَعَ الإِيجَارَ. · b) سَتَتَّصِلُ بِالسَّفَارَةِ لِتَسْأَ |
| A2-A2-04 | esercizio 7, domanda 3 (explanation) | 369 | a) ذَهَبْتُ إِلَى البَنْكِ لِأَدْفَعَ الإِيجَارَ. · b) سَتَتَّصِلُ بِالسَّفَارَةِ لِتَسْأَ |
| A2-A2-04 | esercizio 7, domanda 4 (explanation) | 369 | a) ذَهَبْتُ إِلَى البَنْكِ لِأَدْفَعَ الإِيجَارَ. · b) سَتَتَّصِلُ بِالسَّفَارَةِ لِتَسْأَ |
| A2-A2-04 | esercizio 7, domanda 5 (model) | 369 | خَرَجَتْ مُبَكِّرًا لِتَشْتَرِيَ الخُبْزَ. Con لِكَيْ le frasi sono identiche: لِكَيْ أَدْ |
| A2-A2-04 | esercizio 7, domanda 5 (explanation) | 369 | a) ذَهَبْتُ إِلَى البَنْكِ لِأَدْفَعَ الإِيجَارَ. · b) سَتَتَّصِلُ بِالسَّفَارَةِ لِتَسْأَ |
| A2-A2-04 | esercizio 7, domanda 5 (feedback) | 369 | خَرَجَتْ مُبَكِّرًا لِتَشْتَرِيَ الخُبْزَ. Con لِكَيْ le frasi sono identiche: لِكَيْ أَدْ |
| A2-A2-04 | esercizio 8, domanda 1 (model) | 87, 289, 344 | بِكُلِّ سُرُورٍ! فِي أَيِّ سَاعَةٍ؟ / شُكْرًا عَلَى الدَّعْوَةِ، لٰكِنْ لِلْأَسَفِ لَنْ أَ |
| A2-A2-04 | esercizio 8, domanda 1 (explanation) | 369 | Risposte possibili. a) بِكُلِّ سُرُورٍ! فِي أَيِّ سَاعَةٍ؟ / شُكْرًا عَلَى الدَّعْوَةِ، لٰ |
| A2-A2-04 | esercizio 8, domanda 1 (feedback) | 87, 289, 344 | بِكُلِّ سُرُورٍ! فِي أَيِّ سَاعَةٍ؟ / شُكْرًا عَلَى الدَّعْوَةِ، لٰكِنْ لِلْأَسَفِ لَنْ أَ |
| A2-A2-04 | esercizio 8, domanda 2 (explanation) | 369 | Risposte possibili. a) بِكُلِّ سُرُورٍ! فِي أَيِّ سَاعَةٍ؟ / شُكْرًا عَلَى الدَّعْوَةِ، لٰ |
| A2-A2-04 | esercizio 8, domanda 3 (explanation) | 369 | Risposte possibili. a) بِكُلِّ سُرُورٍ! فِي أَيِّ سَاعَةٍ؟ / شُكْرًا عَلَى الدَّعْوَةِ، لٰ |
| A2-A2-04 | soluzioni | 369 | Esercizio 8. Risposte possibili. a) بِكُلِّ سُرُورٍ! فِي أَيِّ سَاعَةٍ؟ / شُكْرًا عَلَى ال |
| A2-A2-05 | passaggio 4 | 21, 28, 279 | Nelle tue conversazioni con il tutor puoi usare entrambe; nei testi scritti di questo live |
| A2-A2-05 | passaggio 6 | 70, 227 | لَمْ يَبْقَ يَبْقَى lam yabqa لَمْ يَبْقَوْا |
| A2-A2-05 | passaggio 15 | 54, 60, 61 | «non ancora» = لَمْ… لَمْأَيْضًا بَعْدُ… |
| A2-A2-05 | esercizio 2, domanda 1 (model) | 371 | لَمْ أَعْمَلْ · لَمْ تَعْمَلْ · لَمْ تَعْمَلِي · لَمْ يَعْمَلْ · لَمْ تَعْمَلْ · لَمْ تَعْ |
| A2-A2-05 | esercizio 2, domanda 1 (explanation) | 371 | لَمْ أَعْمَلْ · لَمْ تَعْمَلْ · لَمْ تَعْمَلِي · لَمْ يَعْمَلْ · لَمْ تَعْمَلْ · لَمْ تَعْ |
| A2-A2-05 | esercizio 3, domanda 1 (model) | 371 | Indicativo / Congiuntivo (أَنْ) / Giussivo (لَمْ) يَكْتُبُونَ / أَنْ يَكْتُبُوا / لَمْ يَك |
| A2-A2-05 | esercizio 3, domanda 1 (explanation) | 371 | Indicativo / Congiuntivo (أَنْ) / Giussivo (لَمْ) يَكْتُبُونَ / أَنْ يَكْتُبُوا / لَمْ يَك |
| A2-A2-05 | esercizio 13, domanda 1 (model) | 372 | Modello (settimana 2). الأَرْبِعَاءُ ٢ مَايُو، السَّاعَةُ ١٥:١١ · تَقْرِيرٌ عَنْ حَقِيبَةٍ |
| A2-A2-05 | esercizio 13, domanda 1 (explanation) | 372 | Modello (settimana 2). الأَرْبِعَاءُ ٢ مَايُو، السَّاعَةُ ١٥:١١ · تَقْرِيرٌ عَنْ حَقِيبَةٍ |
| A2-A2-05 | soluzioni | 74, 371 | لَمْ يَسْأَلْنَأَنْ يَسْأَلْنَ يَسْأَلْنَ |
| A2-A2-06 | passaggio 4 | 81, 231 | doppio رُدَّتَرُدَّ rudda «rispondi» رُدِّي رُدُّوا |
| A2-A2-06 | passaggio 5 | 5, 20, 22 | لَا تَتَأَخَّرْتَأَخَّرْ non fare tardi |
| A2-A2-06 | esercizio 11, domanda 1 (model) | 373 | Modello. فِي المَطْبَخِ قَهْوَةٌ وَشَايٌ: .«شُكْرًا» أَهْلًا يَا صَدِيقِي! المِفْتَاحُ عِن |
| A2-A2-06 | esercizio 11, domanda 1 (explanation) | 373 | Modello. فِي المَطْبَخِ قَهْوَةٌ وَشَايٌ: .«شُكْرًا» أَهْلًا يَا صَدِيقِي! المِفْتَاحُ عِن |
| A2-A2-07 | passaggio 3 | 91, 264 | Con tutte queste forme il predicato nominale è all'accusativo : كَانَ الطَّرِيقُ مُزْدَحِم |
| A2-A2-07 | passaggio 5 | 93, 375 | loro (m.) لَا يَزَالُونَمَا زَالُوا |
| A2-A2-08 | passaggio 6 | 105 | Con l'articolo o come primo termine di un'iḍāfa si declinano normalmente: فِي المَكَاتِبِ, |
| A2-A2-08 | passaggio 7 | 106 | Il collettivo è grammaticalmente maschile singolare : البُرْتُقَالُ لَذِيذٌ «le arance son |
| A2-A2-08 | passaggio 8 | 106 | سُجَنَاء fuʿalāʾ سَجِينس ج ن «detenuto» |
| A2-A2-08 | passaggio 13 | 112 | لَا، السَّمَكُ عِنْدَ جَارِي، فِي آخِرِ السُّوقِ. عِنْدِي دَجَاجٌ وَبَيْضٌ فَقَطْ.: البَائ |
| A2-A2-09 | passaggio 4 | 117 | رَئِيسَة رَئِيسَةُ القِسْمِ الجَدِيدَةُ (f., nom.) la nuova capo della sezione |
| A2-A2-09 | passaggio 5 | 103, 117, 121 | plurale sano m., nominativo مُوَظَّفُوهُمُوَظَّفُو الوِزَارَةِ مُوَظَّفُونَ |
| A2-A2-09 | passaggio 15 | 124 | D · Titoli (4 punti). Vocalizza e traduci: 17. موظفو السفارة الإيطالية · 18. معظم سكان الق |
| A2-A2-09 | esercizio 9, domanda 1 (explanation) | 379 | a) La dottoressa Rīmā Ḫūrī; il vice è il professor Samīr Naṣṣār (الأُسْتَاذ si usa anche c |
| A2-A2-09 | esercizio 9, domanda 2 (explanation) | 379 | a) La dottoressa Rīmā Ḫūrī; il vice è il professor Samīr Naṣṣār (الأُسْتَاذ si usa anche c |
| A2-A2-09 | esercizio 9, domanda 3 (explanation) | 379 | a) La dottoressa Rīmā Ḫūrī; il vice è il professor Samīr Naṣṣār (الأُسْتَاذ si usa anche c |
| A2-A2-09 | esercizio 9, domanda 4 (explanation) | 379 | a) La dottoressa Rīmā Ḫūrī; il vice è il professor Samīr Naṣṣār (الأُسْتَاذ si usa anche c |
| A2-A2-09 | esercizio 9, domanda 5 (model) | 379 | Esempi: الدُّكْتُورَة رِيمَا خُورِي المُدِيرَةُ العَامَّةُ لِلْمُؤَسَّسَةِ. · الأُسْتَاذ ف |
| A2-A2-09 | esercizio 9, domanda 5 (explanation) | 379 | a) La dottoressa Rīmā Ḫūrī; il vice è il professor Samīr Naṣṣār (الأُسْتَاذ si usa anche c |
| A2-A2-09 | esercizio 9, domanda 5 (feedback) | 379 | Esempi: الدُّكْتُورَة رِيمَا خُورِي المُدِيرَةُ العَامَّةُ لِلْمُؤَسَّسَةِ. · الأُسْتَاذ ف |
| A2-A2-09 | esercizio 9, domanda 6 (explanation) | 379 | a) La dottoressa Rīmā Ḫūrī; il vice è il professor Samīr Naṣṣār (الأُسْتَاذ si usa anche c |
| A2-A2-10 | passaggio 3 | 127 | vi / li (duale) ـهُمَا · ـكُمَا سَاعَدَهُمَا · سَاعَدَكُمَا يُسَاعِدُهُمَا · يُسَاعِدُكُمَ |
| A2-A2-10 | esercizio 9, domanda 6 (prompt) | 127 | أَعْطَٮنِي |
| A2-A2-11 | passaggio 3 | 138 | كَثِير molto ضَيِّقأَكْثَر stretto أَضْيَق |
| A2-A2-11 | passaggio 6 | 33, 140, 383 | أُخْرَى آخَر uḫrā مَرَّةً أُخْرَى «un'altra volta» |
| A2-A2-11 | passaggio 7 | 137, 141, 147 | ؟… أَيُّهُمَا أَيُّهُمَا أَرْخَصُ؟ Quale dei due è più economico? |
| A2-A2-12 | passaggio 5 | 152 | 19 تِسْعَ عَشْرَةَ صَفْحَةً تِسْعَةَ عَشَرَ كِتَابًا |
| A2-A2-12 | passaggio 6 | 153, 385 | 99 تِسْعٌ وَتِسْعُونَ دَقِيقَةً تِسْعَةٌ وَتِسْعُونَ يُورُو |
| A2-A2-12 | passaggio 7 | 153 | Egitto, Sudan جُنَيْهَات جُنَيْه خَمْسَةُ جُنَيْهَاتٍ · عِشْرُونَ جُنَيْهًا |
| A2-A2-12 | passaggio 7 | 108, 113, 137 | — يُورُو يُورُو ثَلَاثَةُ يُورُو |
| A2-A2-12 | passaggio 9 | 155, 385 | 2000 أَلْفَا دُولَارٍ أَلْفَيْنِ / أَلْفَانِ (iḍāfa: senza ن) |
| A2-A2-12 | esercizio 11, domanda 1 (explanation) | 385 | a) بِكَمِ الكِتَابُ؟ — بِاثْنَيْ عَشَرَ يُورُو. · b) بِكَمِ الغُرْفَةُ فِي تُونِسَ؟ — بِخَ |
| A2-A2-12 | esercizio 11, domanda 2 (explanation) | 385 | a) بِكَمِ الكِتَابُ؟ — بِاثْنَيْ عَشَرَ يُورُو. · b) بِكَمِ الغُرْفَةُ فِي تُونِسَ؟ — بِخَ |
| A2-A2-12 | esercizio 11, domanda 3 (explanation) | 385 | a) بِكَمِ الكِتَابُ؟ — بِاثْنَيْ عَشَرَ يُورُو. · b) بِكَمِ الغُرْفَةُ فِي تُونِسَ؟ — بِخَ |
| A2-A2-12 | esercizio 11, domanda 4 (explanation) | 385 | a) بِكَمِ الكِتَابُ؟ — بِاثْنَيْ عَشَرَ يُورُو. · b) بِكَمِ الغُرْفَةُ فِي تُونِسَ؟ — بِخَ |
| A2-A2-12 | esercizio 11, domanda 5 (model) | 385 | بِكَمِ التَّذْكِرَةُ؟ — بِثَلَاثَةِ يُورُو وَنِصْفٍ. Dopo بِـ il numero è al genitivo (بِا |
| A2-A2-12 | esercizio 11, domanda 5 (explanation) | 385 | a) بِكَمِ الكِتَابُ؟ — بِاثْنَيْ عَشَرَ يُورُو. · b) بِكَمِ الغُرْفَةُ فِي تُونِسَ؟ — بِخَ |
| A2-A2-12 | esercizio 11, domanda 5 (feedback) | 385 | بِكَمِ التَّذْكِرَةُ؟ — بِثَلَاثَةِ يُورُو وَنِصْفٍ. Dopo بِـ il numero è al genitivo (بِا |
| A2-A2-12 | soluzioni | 385 | Esercizio 1. a) يَوْمٌ (o يَوْمٌ وَاحِدٌ) · b) يَوْمَانِ · c) غُرْفَةٌ وَاحِدَةٌ · d) اِمْ |
| A2-A2-13 | passaggio 12 | 196 | تتكلم العربية والإيطالية بطلاقة، عندها خبرة في الترجمة القانونية، للعمل في مكتب مترجمة: ٣. |
| A2-A2-13 | esercizio 12, domanda 1 (model) | 392 | Modello. ١. زَمِيلِي الَّذِي يَجْلِسُ أَمَامِي يَتَكَلَّمُ ثَلَاثَ لُغَاتٍ. ٢. المَكْتَبُ  |
| A2-A2-13 | esercizio 12, domanda 1 (explanation) | 392 | Modello. ١. زَمِيلِي الَّذِي يَجْلِسُ أَمَامِي يَتَكَلَّمُ ثَلَاثَ لُغَاتٍ. ٢. المَكْتَبُ  |
| A2-A2-13 | soluzioni | 392 | مَعَهُ. · 11. اليَوْمُ الَّذِي وَصَلْتُ فِيهِ · 12. الشَّخْصُ الَّذِي أَبْحَثُ عَنْهُ · 13 |
| A2-A2-14 | esercizio 6, domanda 1 (explanation) | 393 | a) أَغْلِقِ النَّافِذَةَ قَبْلَ أَنْ تَخْرُجَ. · b) بَعْدَ أَنْ أَكَلُوا، ذَهَبُوا إِلَى ا |
| A2-A2-14 | esercizio 6, domanda 2 (explanation) | 393 | a) أَغْلِقِ النَّافِذَةَ قَبْلَ أَنْ تَخْرُجَ. · b) بَعْدَ أَنْ أَكَلُوا، ذَهَبُوا إِلَى ا |
| A2-A2-14 | esercizio 6, domanda 3 (explanation) | 393 | a) أَغْلِقِ النَّافِذَةَ قَبْلَ أَنْ تَخْرُجَ. · b) بَعْدَ أَنْ أَكَلُوا، ذَهَبُوا إِلَى ا |
| A2-A2-14 | esercizio 6, domanda 4 (explanation) | 393 | a) أَغْلِقِ النَّافِذَةَ قَبْلَ أَنْ تَخْرُجَ. · b) بَعْدَ أَنْ أَكَلُوا، ذَهَبُوا إِلَى ا |
| A2-A2-14 | esercizio 6, domanda 5 (model) | 393 | بَعْدَ أَنْ أُنْهِيَ العَمَلَ سَأَتَّصِلُ بِكَ. (anche: بَعْدَ أَنْ أَنْتَ هِيَ مِنَ العَم |
| A2-A2-14 | esercizio 6, domanda 5 (explanation) | 393 | a) أَغْلِقِ النَّافِذَةَ قَبْلَ أَنْ تَخْرُجَ. · b) بَعْدَ أَنْ أَكَلُوا، ذَهَبُوا إِلَى ا |
| A2-A2-14 | esercizio 6, domanda 5 (feedback) | 393 | بَعْدَ أَنْ أُنْهِيَ العَمَلَ سَأَتَّصِلُ بِكَ. (anche: بَعْدَ أَنْ أَنْتَ هِيَ مِنَ العَم |
| A2-A2-14 | esercizio 6, domanda 6 (explanation) | 393 | a) أَغْلِقِ النَّافِذَةَ قَبْلَ أَنْ تَخْرُجَ. · b) بَعْدَ أَنْ أَكَلُوا، ذَهَبُوا إِلَى ا |
| A2-A2-14 | soluzioni | 393 | Esercizio 6. a) أَغْلِقِ النَّافِذَةَ قَبْلَ أَنْ تَخْرُجَ. · b) بَعْدَ أَنْ أَكَلُوا، ذَه |
| A2-A2-15 | passaggio 3 | 216, 398 | difettivo 3ª radicale و / ي (ن س ي) نَسِيَ ,(م ش ي) مَشَى ,(د ع و) دَعَا نَاقِص |
| A2-A2-15 | passaggio 7 | 56, 70, 217 | هُمْ يَبِيعُونَبَاعُوا أَنْ يَبِيعُوا بِيعُوالَمْ يَبِيعُوا (voi) |
| A2-A2-15 | passaggio 8 | 70, 218 | هُمْ يَخَافُونَخَافُوا أَنْ يَخَافُوا لَا تَخَافُوالَمْ يَخَافُوا (voi) |
| A2-A2-15 | passaggio 11 | 219, 222, 464 | Così: بَكَى يَبْكِي «piangere», حَكَى يَحْكِي «raccontare», رَمَى يَرْمِي «gettare», جَرَى |
| A2-A2-15 | esercizio 8, domanda 1 (model) | 395 | أَنَا: وَصَلْتُ إِلَى المَحَطَّةِ، وَقُلْتُ لِلسَّائِقِ العُنْوَانَ، وَنَسِيتُ الحَقِيبَةَ |
| A2-A2-15 | esercizio 8, domanda 1 (explanation) | 395 | أَنَا: وَصَلْتُ إِلَى المَحَطَّةِ، وَقُلْتُ لِلسَّائِقِ العُنْوَانَ، وَنَسِيتُ الحَقِيبَةَ |
| A2-A2-15 | esercizio 13, domanda 1 (model) | 395 | Modello (forme). وَجَدَ — perfetto: وَجَدَ, وَجَدَتْ, وَجَدْتُ, وَجَدْتَ, وَجَدْتِ, وَجَدْ |
| A2-A2-15 | esercizio 13, domanda 1 (explanation) | 395 | Modello (forme). وَجَدَ — perfetto: وَجَدَ, وَجَدَتْ, وَجَدْتُ, وَجَدْتَ, وَجَدْتِ, وَجَدْ |
| A2-A2-15 | esercizio 14, domanda 1 (model) | 396 | Modello. يَوْمَ الجُمُعَةِ المَاضِي وَصَلْتُ إِلَى المَحَطَّةِ مُتَأَخِّرًا، لِأَنَّنِي نَ |
| A2-A2-15 | esercizio 14, domanda 1 (explanation) | 396 | Modello. يَوْمَ الجُمُعَةِ المَاضِي وَصَلْتُ إِلَى المَحَطَّةِ مُتَأَخِّرًا، لِأَنَّنِي نَ |
| A2-A2-15 | soluzioni | 395 | وَبَقِيتُ سَاعَةً أَنْتَظِرُ، وَوَجَدْتُهَا. · هُمْ: وَصَلُوا إِلَى المَحَطَّةِ، وَقَالُوا |
| A2-A2-15 | soluzioni | 395 | Esercizio 9. a) لَمْ أَقُلْ شَيْئًا. · b) لَا تَنْسَيْ جَوَازَ السَّفَرِ! · c) يَبْدُو أَن |
| A2-A2-16 | passaggio 6 | 2, 5, 6 | لَمْ تَقْرَأْتَقْرَأُقَرَأَتْهِيَ |
| A2-A2-16 | passaggio 10 | 234 | Note d'uso. يَمُرُّ بِـ «passare per, davanti a»: مَرَرْتُ بِالمَكْتَبِ «sono passato dall |
| A2-A2-16 | passaggio 12 | 236 | افتتاح مكتبة عربية في ميلانو ، بحضور رئيس البلدية وعدد كبير من «باولو سارْبي» تَمَّ يوم ال |
| A2-A2-16 | passaggio 17 | 235, 238 | 11. sedile: سُ◌َال · 12. sedile: رَ◌ِيس · 13. sedile: سَ◌َلَ · 14. sedile: شَيْ◌ · 15. sed |
| A2-A2-16 | esercizio 3, domanda 1 (prompt) | — | سُ◌َال |
| A2-A2-16 | esercizio 3, domanda 2 (prompt) | 55, 63, 66 | سَ◌َلَ |
| A2-A2-16 | esercizio 3, domanda 3 (prompt) | — | رَ◌ِيس |
| A2-A2-16 | esercizio 3, domanda 4 (prompt) | — | مَسْ◌ُول |
| A2-A2-16 | esercizio 3, domanda 5 (prompt) | — | يَقْرَ◌ُونَ |
| A2-A2-16 | esercizio 3, domanda 6 (prompt) | — | سُ◌ِلَ |
| A2-A2-16 | esercizio 3, domanda 7 (prompt) | 30, 69, 105 | قَرَ◌َ |
| A2-A2-16 | esercizio 3, domanda 11 (prompt) | — | رَ◌ْس |
| A2-A2-16 | esercizio 3, domanda 12 (prompt) | 47, 87, 92 | بِي◌َة |
| A2-A2-17 | passaggio 12 | 248 | .«الشرطة، وأن تتعرّف الشرطة على الحيّ وقابل الزوّار رجال الشرطة، وسألوهم عن عملهم، وشاهدوا |
| A2-A2-17 | soluzioni | 246, 399 | حَفْلَةً. · 17. وَافَقَ المُدِيرُ عَلَى الاِقْتِرَاحِ. · 18. شَارَكْتُ فِي الاِجْتِمَاعِ.  |
| A2-A2-18 | passaggio 3 | 254, 440 | X يَسْتَفْعِلُ اِسْتَفْعَلَ اِسْتِفْعَال مُسْتَفْعِل مُسْتَفْعَل chiedere, considerare |
| A2-A2-18 | passaggio 4 | 254, 400 | أَجَابَ rispondere إِجَابَة يُجِيبُ «risposta» — |
| A2-A2-18 | passaggio 6 | 256 | ش ر ياِشْتَرَى comprare مُشْتَرٍ شِرَاء |
| A2-A2-18 | passaggio 6 | 256 | , ط, ض, ص اِصْطَدَمَط → ت (ص د م) «scontrarsi», اِضْطَرَّ (ض ر ر) «costringere», اِطَّلَعَ |
| A2-A2-19 | passaggio 11 | 269 | مدينة بلغات كثيرة يقول بعض الناس إنّ تعلّم اللغات أصبح غير ضروري، لأنّ الهاتف يترجم كلّ شي |
| A2-A2-19 | passaggio 14 | 55, 56, 65 | أُرِيدُ أَنْ أَذْهَبَأُرِيدُ أَنَّ أَذْهَبَ |
| A2-A2-19 | soluzioni | 403 | إِنَّ عِنْدِي سُؤَالًا. · 8. لَا شَكَّ · 9. قَالَ إِنَّهُ مَشْغُولٌ. · 10. قَالَتْ إِنَّ ا |
| A2-A2-20 | passaggio 3 | 260, 275, 367 | fortuna لِسُوءِ الحَظِّ, لِحُسْنِ الحَظِّ لِسُوءِ الحَظِّ كَانَ المَتْحَفُ مُغْلَقًا. |
| A2-A2-20 | passaggio 7 | 277, 404, 405 | un divieto … طَلَبَ مِنْهُ أَلَّا طَلَبَتْ مِنَّا أَلَّا نَتَأَخَّرَ. Ci ha chiesto di non |
| A2-A2-20 | passaggio 14 | 275, 278, 280 | كَانَ القِطَارُ قَدْ غَادَرَعِنْدَمَا وَصَلْتُ، القِطَارُ قَدْ غَادَرَ |
| A2-A2-20 | esercizio 8, domanda 1 (model) | 404 | Esempio. … فِي البِدَايَةِ ظَنَنْتُ أَنَّهُ ضَائِعٌ. ثُمَّ رَأَيْتُ عَلَى رَقَبَتِهِ اسْمً |
| A2-A2-20 | esercizio 8, domanda 1 (explanation) | 404 | Esempio. … فِي البِدَايَةِ ظَنَنْتُ أَنَّهُ ضَائِعٌ. ثُمَّ رَأَيْتُ عَلَى رَقَبَتِهِ اسْمً |
| A2-A2-20 | soluzioni | 404 | Esercizio 7. a) فَجْأَةً سَمِعْتُ صَرْخَةً. · b) فِي اليَوْمِ التَّالِي غَادَرْنَا إِلَى ا |
| A2-A2-21 | passaggio 16 | 297, 406 | مُنْذُ لَيْلَةِ أَمْسِمُنْذُ أَمْسِ اللَّيْلُ مُنْذُ أَمْسِ فِي اللَّيْلِ / |
| A2-A2-21 | esercizio 7, domanda 1 (model) | 406 | Esempio. حَقِيبَتِي كَبِيرَةٌ، لَوْنُهَا أَسْوَدُ، وَلَهَا أَرْبَعُ عَجَلَاتٍ. هِيَ مِنَ ا |
| A2-A2-21 | esercizio 7, domanda 1 (explanation) | 406 | Esempio. حَقِيبَتِي كَبِيرَةٌ، لَوْنُهَا أَسْوَدُ، وَلَهَا أَرْبَعُ عَجَلَاتٍ. هِيَ مِنَ ا |
| A2-A2-21 | esercizio 10, domanda 1 (explanation) | 406 | a) Tre ore prima. b) Possono essere distrutti. c) Liquidi oltre 100 ml. d) Il volo 721 da  |
| A2-A2-21 | esercizio 10, domanda 2 (explanation) | 406 | a) Tre ore prima. b) Possono essere distrutti. c) Liquidi oltre 100 ml. d) Il volo 721 da  |
| A2-A2-21 | esercizio 10, domanda 3 (explanation) | 406 | a) Tre ore prima. b) Possono essere distrutti. c) Liquidi oltre 100 ml. d) Il volo 721 da  |
| A2-A2-21 | esercizio 10, domanda 4 (explanation) | 406 | a) Tre ore prima. b) Possono essere distrutti. c) Liquidi oltre 100 ml. d) Il volo 721 da  |
| A2-A2-21 | esercizio 10, domanda 5 (explanation) | 406 | a) Tre ore prima. b) Possono essere distrutti. c) Liquidi oltre 100 ml. d) Il volo 721 da  |
| A2-A2-21 | esercizio 10, domanda 6 (explanation) | 406 | a) Tre ore prima. b) Possono essere distrutti. c) Liquidi oltre 100 ml. d) Il volo 721 da  |
| A2-A2-21 | esercizio 10, domanda 7 (explanation) | 406 | a) Tre ore prima. b) Possono essere distrutti. c) Liquidi oltre 100 ml. d) Il volo 721 da  |
| A2-A2-21 | esercizio 10, domanda 8 (model) | 406 | 5. الرِّحْلَةُ رَقْمُ سَبْعِمِئَةٍ وَوَاحِدٍ وَعِشْرِينَ… الوُصُولُ المُتَوَقَّعُ: السَّاع |
| A2-A2-21 | esercizio 10, domanda 8 (explanation) | 406 | a) Tre ore prima. b) Possono essere distrutti. c) Liquidi oltre 100 ml. d) Il volo 721 da  |
| A2-A2-21 | esercizio 10, domanda 8 (feedback) | 406 | 5. الرِّحْلَةُ رَقْمُ سَبْعِمِئَةٍ وَوَاحِدٍ وَعِشْرِينَ… الوُصُولُ المُتَوَقَّعُ: السَّاع |
| A2-A2-21 | esercizio 12, domanda 1 (model) | 407 | Modello. السَّيِّدُ مُدِيرُ الفُنْدُقِ المُحْتَرَمُ، تَحِيَّةً طَيِّبَةً، وَبَعْدُ، أَوَدُ |
| A2-A2-21 | esercizio 12, domanda 1 (explanation) | 407 | Modello. السَّيِّدُ مُدِيرُ الفُنْدُقِ المُحْتَرَمُ، تَحِيَّةً طَيِّبَةً، وَبَعْدُ، أَوَدُ |
| A2-A2-21 | soluzioni | 407 | تَحِيَّةً طَيِّبَةً، وَبَعْدُ، أَوَدُّ أَنْ أَحْجِزَ غُرْفَةً لِشَخْصٍ وَاحِدٍ لِلَيْلَتَي |
| A2-A2-21 | soluzioni | 295, 301, 407 | لُوكَامَعَ الشُّكْرِ وَالتَّقْدِيرِ، |
| A2-A2-22 | passaggio 13 | 305, 409 | لوكامع تحياتي،أراك يوم الاثنين في المكتب. |
| A2-A2-22 | esercizio 2, domanda 1 (model) | 408 | Esempio (persona inventata). ١٩٩٠، تونس / ٣ / تاريخ ومكان الميلاد: ١٢تونسية: الجنسية الاسم |
| A2-A2-22 | esercizio 2, domanda 1 (explanation) | 408 | Esempio (persona inventata). ١٩٩٠، تونس / ٣ / تاريخ ومكان الميلاد: ١٢تونسية: الجنسية الاسم |
| A2-A2-22 | esercizio 5, domanda 1 (model) | 408 | Modello. اِسْتِفْسَارٌ عَنْ مَوْعِدِ بَدْءِ الدَّوْرَةِ: المَوْضُوعُ تَحِيَّةً طَيِّبَةً و |
| A2-A2-22 | esercizio 5, domanda 1 (explanation) | 408 | Modello. اِسْتِفْسَارٌ عَنْ مَوْعِدِ بَدْءِ الدَّوْرَةِ: المَوْضُوعُ تَحِيَّةً طَيِّبَةً و |
| A2-A2-22 | esercizio 8, domanda 1 (explanation) | 304, 408 | a) Da domenica 19 luglio fino a nuovo avviso; i libri si prendono in prestito alla recepti |
| A2-A2-22 | esercizio 8, domanda 2 (explanation) | 304, 408 | a) Da domenica 19 luglio fino a nuovo avviso; i libri si prendono in prestito alla recepti |
| A2-A2-22 | esercizio 8, domanda 3 (explanation) | 304, 408 | a) Da domenica 19 luglio fino a nuovo avviso; i libri si prendono in prestito alla recepti |
| A2-A2-22 | esercizio 8, domanda 4 (explanation) | 304, 408 | a) Da domenica 19 luglio fino a nuovo avviso; i libri si prendono in prestito alla recepti |
| A2-A2-22 | esercizio 8, domanda 5 (explanation) | 304, 408 | a) Da domenica 19 luglio fino a nuovo avviso; i libri si prendono in prestito alla recepti |
| A2-A2-22 | esercizio 8, domanda 6 (explanation) | 304, 408 | a) Da domenica 19 luglio fino a nuovo avviso; i libri si prendono in prestito alla recepti |
| A2-A2-22 | esercizio 8, domanda 7 (model) | 304, 408 | يمكن للطلاب · يرجى تقديم الطلبات · الرجاء عدم الاتصال · لا تعطى إلا (passivo) · مختومة ومو |
| A2-A2-22 | esercizio 8, domanda 7 (explanation) | 304, 408 | a) Da domenica 19 luglio fino a nuovo avviso; i libri si prendono in prestito alla recepti |
| A2-A2-22 | esercizio 8, domanda 7 (feedback) | 304, 408 | يمكن للطلاب · يرجى تقديم الطلبات · الرجاء عدم الاتصال · لا تعطى إلا (passivo) · مختومة ومو |
| A2-A2-22 | esercizio 10, domanda 1 (model) | 409 | Modello (circa 120 parole; istituto inventato). اِسْتِفْسَارٌ عَنْ دَوْرَةِ اللُّغَةِ العَ |
| A2-A2-22 | esercizio 10, domanda 1 (explanation) | 409 | Modello (circa 120 parole; istituto inventato). اِسْتِفْسَارٌ عَنْ دَوْرَةِ اللُّغَةِ العَ |
| A2-A2-22 | soluzioni | 408 | ١٩٩٠، تونس / ٣ / تاريخ ومكان الميلاد: ١٢تونسية: الجنسية الاسم الرباعي: آمنة حسن عبد الله ا |
| A2-A2-22 | soluzioni | 408 | تاريخرقم جواز السفر: ٠٠٠٠٠٠٠ (اسم البنك) جهة العمل: بنكموظفة: المهنة الحالة الاجتماعية: مت |
| A2-A2-22 | soluzioni | 408 | تاريخ تقديم العنوان الحالي: ١٤ شارع الحرية، تونس٢٠٢٩ / ١ / تاريخ الانتهاء: ٤ · ٢٠٢٤ / ١ /  |
| A2-A2-22 | soluzioni | 304, 408 | Esercizio 8. a) Da domenica 19 luglio fino a nuovo avviso; i libri si prendono in prestito |
| A2-A2-22 | soluzioni | 299, 409 | طَالِبٌ فِي المُسْتَوَى المُتَوَسِّطِلُوكَا |
| A2-A2-23 | passaggio 13 | 321 | خلاص، تعالي معانا!: منى إِذَنْ تَعَالَيْ مَعَنَا!: مُنَى |
| A2-A2-23 | passaggio 14 | 324 | شكرًا يا باشا. نورت مصر!: السواق شُكْرًا يَا سَيِّدِي. أَهْلًا بِكَ فِي: السَّائِقُ |
| A2-A2-23 | esercizio 13, domanda 1 (model) | 412 | 1. Confronta con la colonna «Fuṣḥā» dello Script D. 2. Modello (indirizzo inventato): أَهْ |
| A2-A2-23 | esercizio 13, domanda 1 (explanation) | 412 | 1. Confronta con la colonna «Fuṣḥā» dello Script D. 2. Modello (indirizzo inventato): أَهْ |
| A2-A2-23 | soluzioni | 87, 301, 303 | لُوكَامَعَ تَحِيَّاتِي، |
| A2-A2-24 | passaggio 6 | 332 | .«السيّارة نسيتُ حقيبتي الصغيرة على المقعد الخلفيّ. وكان فيها جواز السفر والنقود والهاتف ذ |
| A2-A2-24 | esercizio 2, domanda 1 (explanation) | 413 | a) Con la collega Maria, per un corso intensivo in un centro linguistico; all'arrivo la va |
| A2-A2-24 | esercizio 2, domanda 2 (explanation) | 413 | a) Con la collega Maria, per un corso intensivo in un centro linguistico; all'arrivo la va |
| A2-A2-24 | esercizio 2, domanda 3 (explanation) | 413 | a) Con la collega Maria, per un corso intensivo in un centro linguistico; all'arrivo la va |
| A2-A2-24 | esercizio 2, domanda 4 (explanation) | 413 | a) Con la collega Maria, per un corso intensivo in un centro linguistico; all'arrivo la va |
| A2-A2-24 | esercizio 2, domanda 5 (explanation) | 413 | a) Con la collega Maria, per un corso intensivo in un centro linguistico; all'arrivo la va |
| A2-A2-24 | esercizio 2, domanda 6 (explanation) | 413 | a) Con la collega Maria, per un corso intensivo in un centro linguistico; all'arrivo la va |
| A2-A2-24 | esercizio 2, domanda 7 (model) | 413 | كَانَ + imperfetto: كنّا ندرس · كانت تقول · كنّا نزور · كان عمّ أحمد يسلّم · لم أكن أفهم · |
| A2-A2-24 | esercizio 2, domanda 7 (explanation) | 413 | a) Con la collega Maria, per un corso intensivo in un centro linguistico; all'arrivo la va |
| A2-A2-24 | esercizio 2, domanda 7 (feedback) | 413 | كَانَ + imperfetto: كنّا ندرس · كانت تقول · كنّا نزور · كان عمّ أحمد يسلّم · لم أكن أفهم · |
| A2-A2-24 | esercizio 9, domanda 1 (model) | 415 | Il tutor valuta con la rubrica 6.3. Indicatori: presentazione senza esitazioni sui dati pe |
| A2-A2-24 | esercizio 9, domanda 1 (explanation) | 415 | Il tutor valuta con la rubrica 6.3. Indicatori: presentazione senza esitazioni sui dati pe |
| A2-A2-24 | soluzioni | 413 | Esercizio 1. Lavoro personale: controlla con la tabella della sezione 2 e con l'Appendice  |
| A2-A2-24 | soluzioni | 87, 301, 303 | لُوكَامَعَ تَحِيَّاتِي، |
| A2-ONO-01 | passaggio 17 | 173 | Venti punti; superi con almeno 16. A · Le parti del nome (8 punti). Indica il tipo della p |
| A2-ONO-01 | esercizio 1, domanda 4 (prompt) | 172 | أَحْمَد البَغْدَادِيّ |
| A2-ONO-01 | esercizio 1, domanda 5 (prompt) | 172 | هَارُون الرَّشِيد |
| A2-ONO-01 | esercizio 1, domanda 8 (prompt) | 169, 172, 174 | مُحَمَّد الفَاسِيّ |
| A2-ONO-01 | esercizio 5, domanda 1 (prompt) | 294 | عبد الرحمن صالح |
| A2-ONO-01 | esercizio 5, domanda 2 (prompt) | 173, 305, 331 | نور الدين أحمد |
| A2-ONO-01 | esercizio 5, domanda 3 (prompt) | 173, 347, 350 | عبد الله محمد |
| A2-ONO-01 | esercizio 5, domanda 4 (prompt) | 173 | فاطمة الزهراءعلي |
| A2-ONO-02 | passaggio 12 | 183 | Note d'uso. النَّقْلُ الحَرْفِيُّ «traslitterazione» non va confuso con التَّرْجَمَةُ الحَ |
| A2-ONO-02 | soluzioni | 390 | جَمَال · 12. شَرِيف · 13. حَسَن · حَسَّان · 14. صَالِح · صَلَاح · 15. كَيْفَ تَكْتُبُ اسْم |
| B1-B1-01 | passaggio 4 | 15 | concava و o ي come 2ª قَالَب ي ع · ق و ل بَيْع · يَقُولُ · diventa ā, ū, ī o cade |
| B1-B1-01 | passaggio 20 | 26 | B · Il dizionario (4 punti). 11. In quale ordine sono elencate le radici in un dizionario  |
| B1-B1-02 | passaggio 5 | 30 | voi due · loro due تَسْتَعْمِلَانِاِسْتَعْمَلَا · اِسْتَعْمَلْتُمَا يَسْتَعْمِلَانِ · أَنْ |
| B1-B1-02 | passaggio 8 | 31 | عَرَفَع ر ف · تَعَارَفَ · تَعَرَّفَ · عَرَّفَ · conoscere · far conoscere · conoscere qual |
| B1-B1-02 | passaggio 11 | 33 | Note d'uso. اِعْتَبَرَ ha due costruzioni: اِعْتَبَرَ أَنَّ… «ritenere che…» e اِعْتَبَرَه |
| B1-B1-02 | passaggio 16 | 31, 38, 480 | … اِتَّخَذَ القَرَارَ أَنْ قَرَّرَ أَنْ… oppure اِتَّخَذَ قَرَارًا بِـ + maṣdar |
| B1-B1-03 | passaggio 3 | 41, 574 | III مُشَارِكشَارَكَ «partecipante» مُشَارَك «condiviso» |
| B1-B1-03 | passaggio 3 | — | X مُسْتَقِلّاِسْتَقَلَّ «indipendente» — |
| B1-B1-03 | passaggio 8 | 44 | اِشْتَبَهَ فِي «sospettare di» المُشْتَبَهُ بِهِفِيهِ / مُشْتَبَهٌ بِهِ «il sospettato» (A |
| B1-B1-03 | passaggio 17 | 50 | مُسْتَخْدِمُو الإِنْتَرْنِت مُسْتَخْدِمُونَ الإِنْتَرْنِت: in iḍāfa cade la nūn |
| B1-B1-04 | passaggio 17 | 63 | عَدَمُ الحُضُورِلَا حُضُور |
| B1-B1-04 | esercizio 6, domanda 1 (explanation) | 484 | a) بَعْدَ وُصُولِ الطَّائِرَةِ · b) قَبْلَ التَّوْقِيعِ · c) لِلْحُصُولِ عَلَى التَّصْرِيح |
| B1-B1-04 | esercizio 6, domanda 2 (explanation) | 484 | a) بَعْدَ وُصُولِ الطَّائِرَةِ · b) قَبْلَ التَّوْقِيعِ · c) لِلْحُصُولِ عَلَى التَّصْرِيح |
| B1-B1-04 | esercizio 6, domanda 3 (model) | 484 | لِلْحُصُولِ عَلَى التَّصْرِيحِ (anche: مِنْ أَجْلِ / بِهَدَفِ الحُصُولِ عَلَى الإِذْنِ) |
| B1-B1-04 | esercizio 6, domanda 3 (explanation) | 484 | a) بَعْدَ وُصُولِ الطَّائِرَةِ · b) قَبْلَ التَّوْقِيعِ · c) لِلْحُصُولِ عَلَى التَّصْرِيح |
| B1-B1-04 | esercizio 6, domanda 3 (feedback) | 484 | لِلْحُصُولِ عَلَى التَّصْرِيحِ (anche: مِنْ أَجْلِ / بِهَدَفِ الحُصُولِ عَلَى الإِذْنِ) |
| B1-B1-04 | esercizio 6, domanda 4 (explanation) | 484 | a) بَعْدَ وُصُولِ الطَّائِرَةِ · b) قَبْلَ التَّوْقِيعِ · c) لِلْحُصُولِ عَلَى التَّصْرِيح |
| B1-B1-04 | esercizio 6, domanda 5 (explanation) | 484 | a) بَعْدَ وُصُولِ الطَّائِرَةِ · b) قَبْلَ التَّوْقِيعِ · c) لِلْحُصُولِ عَلَى التَّصْرِيح |
| B1-B1-04 | esercizio 6, domanda 6 (explanation) | 484 | a) بَعْدَ وُصُولِ الطَّائِرَةِ · b) قَبْلَ التَّوْقِيعِ · c) لِلْحُصُولِ عَلَى التَّصْرِيح |
| B1-B1-04 | esercizio 6, domanda 7 (explanation) | 484 | a) بَعْدَ وُصُولِ الطَّائِرَةِ · b) قَبْلَ التَّوْقِيعِ · c) لِلْحُصُولِ عَلَى التَّصْرِيح |
| B1-B1-04 | esercizio 6, domanda 8 (explanation) | 484 | a) بَعْدَ وُصُولِ الطَّائِرَةِ · b) قَبْلَ التَّوْقِيعِ · c) لِلْحُصُولِ عَلَى التَّصْرِيح |
| B1-B1-04 | soluzioni | 484 | Esercizio 2. a) تَنْظِيم «organizzazione» · b) تَقْدِيم «presentazione, consegna» · c) مُت |
| B1-B1-05 | passaggio 8 | — | raddoppiata I يُعَدُّعُدَّعَدَّ |
| B1-B1-05 | passaggio 18 | 65, 66, 69 | Passivo di قَالَ · قِيلَوَجَدَ يُوجَدُ / وُجِدَ · يُقَالُ / |
| B1-B1-05 | esercizio 11, domanda 1 (model) | 487 | Testo modello. «لُورِيتُو» افْتِتَاحُ مَكْتَبَةٍ عَامَّةٍ جَدِيدَةٍ فِي حَيِّ فِي مِيلَانُ |
| B1-B1-05 | esercizio 11, domanda 1 (explanation) | 487 | Testo modello. «لُورِيتُو» افْتِتَاحُ مَكْتَبَةٍ عَامَّةٍ جَدِيدَةٍ فِي حَيِّ فِي مِيلَانُ |
| B1-B1-06 | passaggio 3 | 32, 35, 38 | con hamza quasi tutte IV con hamza iniziale, VIII di آمَنَأَخَذَ اِتَّخَذَ · |
| B1-B1-06 | passaggio 5 | 81 | X لَمْ يَسْتَدْعِيَسْتَدْعِياِسْتَدْعَى مُسْتَدْعٍ اِسْتِدْعَاء مُسْتَدْعًى |
| B1-B1-07 | passaggio 9 | 96 | مِلْعَقَة مِفْعَلَة «cucchiaio» · مِكْنَسَة «scopa» · مِطْرَقَة «martello» · مِرْوَحَة «ve |
| B1-B1-08 | esercizio 9, domanda 1 (explanation) | 492 | a) Si sono fermati autobus e metro della capitale per uno sciopero di 24 ore dei lavorator |
| B1-B1-08 | esercizio 9, domanda 2 (explanation) | 492 | a) Si sono fermati autobus e metro della capitale per uno sciopero di 24 ore dei lavorator |
| B1-B1-08 | esercizio 9, domanda 3 (explanation) | 492 | a) Si sono fermati autobus e metro della capitale per uno sciopero di 24 ore dei lavorator |
| B1-B1-08 | esercizio 9, domanda 4 (explanation) | 492 | a) Si sono fermati autobus e metro della capitale per uno sciopero di 24 ore dei lavorator |
| B1-B1-08 | esercizio 9, domanda 5 (model) | 492 | Titolo: عُمَّالُ النَّقْلِ يُضْرِبُونَ e المَدِينَةُ تَتَوَقَّفُ. Frasi verbali: أَضْرَبَ  |
| B1-B1-08 | esercizio 9, domanda 5 (explanation) | 492 | a) Si sono fermati autobus e metro della capitale per uno sciopero di 24 ore dei lavorator |
| B1-B1-08 | esercizio 9, domanda 5 (feedback) | 492 | Titolo: عُمَّالُ النَّقْلِ يُضْرِبُونَ e المَدِينَةُ تَتَوَقَّفُ. Frasi verbali: أَضْرَبَ  |
| B1-B1-08 | esercizio 11, domanda 1 (model) | 492 | Testo modello. طُلَّابُ الجَامِعَةِ يَحْتَجُّونَ عَلَى رَفْعِ الرُّسُومِ اِحْتَجَّ مِئَاتُ |
| B1-B1-08 | esercizio 11, domanda 1 (explanation) | 492 | Testo modello. طُلَّابُ الجَامِعَةِ يَحْتَجُّونَ عَلَى رَفْعِ الرُّسُومِ اِحْتَجَّ مِئَاتُ |
| B1-B1-08 | soluzioni | 492 | Esercizio 7. a) حَضَرَتْ سَلْمَى وَالطُّلَّابُ. (il verbo si accorda con il primo soggetto |
| B1-B1-08 | soluzioni | 492 | طُلَّابُ الجَامِعَةِ يَحْتَجُّونَ عَلَى رَفْعِ الرُّسُومِ اِحْتَجَّ مِئَاتُ الطُّلَّابِ أَ |
| B1-B1-09 | passaggio 14 | 122 | .«الانتظار جزء من الحبّ بقي الشابّ جالسًا لا يتكلّم، والعجوز يقلّب صفحات جريدته بهدوء. وفج |
| B1-B1-09 | passaggio 19 | 125 | Venti punti; superi con almeno 16. A · Forme (8 punti). Metti il ḥāl nella forma giusta: 1 |
| B1-B1-09 | esercizio 11, domanda 1 (model) | 495 | Testo modello. كُنْتُ أَمْسِ فِي مَحَطَّةِ القِطَارِ أَنْتَظِرُ صَدِيقِي القَادِمَ مِنْ رُ |
| B1-B1-09 | esercizio 11, domanda 1 (explanation) | 495 | Testo modello. كُنْتُ أَمْسِ فِي مَحَطَّةِ القِطَارِ أَنْتَظِرُ صَدِيقِي القَادِمَ مِنْ رُ |
| B1-B1-10 | passaggio 5 | 128 | أَقَلُّ شُهْرَةً مَشْهُور meno famoso |
| B1-B1-10 | passaggio 6 | 129 | Misure. Nella lingua classica: عِنْدِي كِيلُو لَحْمًا, شَرِبْتُ كُوبًا مَاءً. Nella lingua |
| B1-B1-11 | passaggio 5 | 140 | رُبَّمَا, إِنَّ, قَدْ إِذَا تَأَخَّرْتَ فَرُبَّمَا يُغْلِقُونَ البَابَ. |
| B1-B1-11 | esercizio 11, domanda 1 (model) | 498 | Testo modello. إِذَا جِئْتَ إِلَى مِيلَانُو لِأَوَّلِ مَرَّةٍ، فَاشْتَرِ بِطَاقَةَ المُوَا |
| B1-B1-11 | esercizio 11, domanda 1 (explanation) | 498 | Testo modello. إِذَا جِئْتَ إِلَى مِيلَانُو لِأَوَّلِ مَرَّةٍ، فَاشْتَرِ بِطَاقَةَ المُوَا |
| B1-B1-12 | passaggio 12 | 156 | المتحف صرّاف آليّ، لذا ننصح الزوّار بإحضار مبلغ نقديّ صغير. يُسمح بالتصوير في كلّ القاعات، |
| B1-B1-12 | passaggio 17 | 159 | (القَهْوَة). · 4. لَمْ يَبْقَ إِلَّا ◌ (يَوْم وَاحِد). · 5. لَا أَعْرِفُ غَيْرَ ◌ (هٰذِهِ  |
| B1-B1-12 | esercizio 3, domanda 1 (explanation) | 304, 500 | a) لَا أَعْرِفُ غَيْرَ القَلِيلِ. · لَا أَعْرِفُ سِوَى القَلِيلِ. · b) مَا حَضَرَ غَيْرُ ا |
| B1-B1-12 | esercizio 3, domanda 2 (explanation) | 304, 500 | a) لَا أَعْرِفُ غَيْرَ القَلِيلِ. · لَا أَعْرِفُ سِوَى القَلِيلِ. · b) مَا حَضَرَ غَيْرُ ا |
| B1-B1-12 | esercizio 3, domanda 3 (explanation) | 304, 500 | a) لَا أَعْرِفُ غَيْرَ القَلِيلِ. · لَا أَعْرِفُ سِوَى القَلِيلِ. · b) مَا حَضَرَ غَيْرُ ا |
| B1-B1-12 | esercizio 3, domanda 3 (feedback) | 152, 154, 155 | لَمْ يَبْقَ غَيْرُ دَقَائِقَ. · لَمْ يَبْقَ سِوَى دَقَائِقَ. |
| B1-B1-12 | esercizio 3, domanda 4 (explanation) | 304, 500 | a) لَا أَعْرِفُ غَيْرَ القَلِيلِ. · لَا أَعْرِفُ سِوَى القَلِيلِ. · b) مَا حَضَرَ غَيْرُ ا |
| B1-B1-12 | soluzioni | 500 | Esercizio 1. a) حَضَرَ المُوَظَّفُونَ إِلَّا مُوَظَّفًا وَاحِدًا. · b) زُرْتُ المُدُنَ إِل |
| B1-B1-13 | passaggio 5 | 163, 247, 516 | 12 (acc. · gen.) اثْنَتَيْ عَشْرَةَ طَالِبَةً اثْنَيْ عَشَرَ طَالِبًا |
| B1-B1-13 | esercizio 11, domanda 1 (model) | 502 | Testo modello. مِيلَانُو فِي أَرْقَامٍ تَأَسَّسَتْ مِيلَانُو قَبْلَ أَكْثَرَ مِنْ أَلْفَيْ |
| B1-B1-13 | esercizio 11, domanda 1 (explanation) | 502 | Testo modello. مِيلَانُو فِي أَرْقَامٍ تَأَسَّسَتْ مِيلَانُو قَبْلَ أَكْثَرَ مِنْ أَلْفَيْ |
| B1-B1-13 | soluzioni | 502 | السُّكَّانِ حَوَالَيْ عِشْرِينَ بِالمِئَةِ مِنْ أَصْلٍ أَجْنَبِيٍّ. بَدَأَ بِنَاءُ الكَاتِ |
| B1-B1-14 | passaggio 3 | — | genitivo مَدَارِسَكِتَابٍ |
| B1-B1-14 | passaggio 6 | 176, 181 | وُزَرَاءُفُعَلَاءُ شُعَرَاءُ · زُمَلَاءُ · عُلَمَاءُ · ministri · scienziati · colleghi ·  |
| B1-B1-14 | passaggio 15 | 182 | dare la a anche all'aggettivo: مَدَارِسَ كَثِيرَةٍ مَدَارِسَ كَثِيرَةَ |
| B1-B1-14 | esercizio 4, domanda 1 (explanation) | 504 | a) فِي المَدَارِسِ · فِي مَدَارِسِ المَدِينَةِ · b) مَعَ الأَصْدِقَاءِ · مَعَ أَصْدِقَاءِ  |
| B1-B1-14 | esercizio 4, domanda 2 (explanation) | 504 | a) فِي المَدَارِسِ · فِي مَدَارِسِ المَدِينَةِ · b) مَعَ الأَصْدِقَاءِ · مَعَ أَصْدِقَاءِ  |
| B1-B1-14 | esercizio 4, domanda 3 (model) | 504, 555 | فِي الشَّوَارِعِ · فِي شَوَارِعِ المَدِينَةِ |
| B1-B1-14 | esercizio 4, domanda 3 (answers) | 504, 555 | فِي الشَّوَارِعِ · فِي شَوَارِعِ المَدِينَةِ |
| B1-B1-14 | esercizio 4, domanda 3 (explanation) | 504 | a) فِي المَدَارِسِ · فِي مَدَارِسِ المَدِينَةِ · b) مَعَ الأَصْدِقَاءِ · مَعَ أَصْدِقَاءِ  |
| B1-B1-14 | esercizio 4, domanda 3 (feedback) | 504, 555 | فِي الشَّوَارِعِ · فِي شَوَارِعِ المَدِينَةِ |
| B1-B1-14 | esercizio 4, domanda 4 (explanation) | 504 | a) فِي المَدَارِسِ · فِي مَدَارِسِ المَدِينَةِ · b) مَعَ الأَصْدِقَاءِ · مَعَ أَصْدِقَاءِ  |
| B1-B1-14 | soluzioni | 504 | Esercizio 4. a) فِي المَدَارِسِ · فِي مَدَارِسِ المَدِينَةِ · b) مَعَ الأَصْدِقَاءِ · مَعَ |
| B1-B1-15 | passaggio 5 | 199 | اِسْتِمْرَارُ ارْتِفَاعِ دَرَجَاتِ الحَرَارَةِ تَسْتَمِرُّ دَرَجَاتُ الحَرَارَةِ فِي الاِر |
| B1-B1-15 | esercizio 2, domanda 1 (explanation) | 508 | a) تَسْتَمِرُّ المَدَارِسُ مُغْلَقَةً بِسَبَبِ الثُّلُوجِ. · Neve, scuole ancora chiuse ·  |
| B1-B1-15 | esercizio 2, domanda 2 (model) | 508 | يُطَالِبُ (النَّاسُ) بِتَخْفِيضِ أَسْعَارِ النَّقْلِ العَامِّ. · Si chiede di abbassare i  |
| B1-B1-15 | esercizio 2, domanda 2 (explanation) | 508 | a) تَسْتَمِرُّ المَدَارِسُ مُغْلَقَةً بِسَبَبِ الثُّلُوجِ. · Neve, scuole ancora chiuse ·  |
| B1-B1-15 | esercizio 2, domanda 2 (feedback) | 508 | يُطَالِبُ (النَّاسُ) بِتَخْفِيضِ أَسْعَارِ النَّقْلِ العَامِّ. · Si chiede di abbassare i  |
| B1-B1-15 | esercizio 2, domanda 3 (explanation) | 508 | a) تَسْتَمِرُّ المَدَارِسُ مُغْلَقَةً بِسَبَبِ الثُّلُوجِ. · Neve, scuole ancora chiuse ·  |
| B1-B1-15 | esercizio 2, domanda 4 (explanation) | 508 | a) تَسْتَمِرُّ المَدَارِسُ مُغْلَقَةً بِسَبَبِ الثُّلُوجِ. · Neve, scuole ancora chiuse ·  |
| B1-B1-15 | esercizio 11, domanda 1 (model) | 509 | Testo modello. أَخْبَارُ المَدِينَةِ لَا» ٣. مُدِيرُ المِتْرُو:٢. اِرْتِفَاعُ أَسْعَارِ ال |
| B1-B1-15 | esercizio 11, domanda 1 (explanation) | 509 | Testo modello. أَخْبَارُ المَدِينَةِ لَا» ٣. مُدِيرُ المِتْرُو:٢. اِرْتِفَاعُ أَسْعَارِ ال |
| B1-B1-15 | soluzioni | 508 | Esercizio 1. a) tipo 1 · Il governo aumenta i prezzi dei carburanti · b) tipo 2 (maṣdar co |
| B1-B1-16 | passaggio 14 | 219 | أعلنت اللجنة الانتخابية أمس أن نسبة المشاركة في الانتخابات البلدية بلغت ٤٢ بالمئة، مقابل س |
| B1-B1-16 | passaggio 14 | 219 | انخفض معدل التضخم في الشهر الماضي إلى ٢٫٣ بالمئة، وهو أدنى مستوى منذ عامين، حسب اقتصاد. ٢. |
| B1-B1-16 | passaggio 14 | 219 | نظم مئات المتقاعدين صباح أمس اعتصاما أمام وزارة المالية، للمطالبة برفع المعاشات لمواجهة مج |
| B1-B1-16 | passaggio 14 | 219 | اندلع حريق مساء الأحد في مصنع للأثاث في المنطقة الصناعية شمال المدينة، وتمكن رجال حوادث. ٤ |
| B1-B1-16 | passaggio 14 | 219 | حكمت المحكمة الإدارية أمس على شركة نقل خاصة بغرامة قدرها مليون دينار، بسبب التأخر محاكم. ٥ |
| B1-B1-16 | esercizio 11, domanda 1 (model) | 511 | Testo modello. أَخْبَارُ مِيلَانُو صَوَّتَ المَجْلِسُ البَلَدِيُّ أَمْسِ عَلَى خُطَّةٍ جَد |
| B1-B1-16 | esercizio 11, domanda 1 (explanation) | 511 | Testo modello. أَخْبَارُ مِيلَانُو صَوَّتَ المَجْلِسُ البَلَدِيُّ أَمْسِ عَلَى خُطَّةٍ جَد |
| B1-B1-17 | passaggio 4 | 226, 231 | نُقِلَ المُصَابُونَ إِلَى المُسْتَشْفَى نقل المصابون إلى المستشفى i feriti sono trasportat |
| B1-B1-17 | passaggio 14 | 234 | يوم بلا سيارات في العاصمة شهدت العاصمة يوم الجمعة الماضي تجربة جديدة: يوم كامل بلا سيارات  |
| B1-B1-17 | passaggio 19 | 236 | 9. وصل القطار متأخرا. · 10. فلم يحضر أحد. · 11. وجد الحل. · 12. بلغ عدد الزوار ألفا. · 13. |
| B1-B1-17 | esercizio 6 (blocks) | 232 | فتحت المكتبة قاعة جديدة وخصصتها للأطفال خصصتها |
| B1-B1-17 | esercizio 7, domanda 1 (model) | 513 | Vocalizzazione modello. عَلِمَ سكان الحي يوم الأحد أن المدرسة القديمة سَتُغْلَقُ، فَنَظَّم |
| B1-B1-17 | esercizio 7, domanda 1 (explanation) | 513 | Vocalizzazione modello. عَلِمَ سكان الحي يوم الأحد أن المدرسة القديمة سَتُغْلَقُ، فَنَظَّم |
| B1-B1-18 | passaggio 15 | 246 | أَهْلًا بِكُمْ، مُسْتَمِعِينَا الأَعِزَّاءَ، فِي نَشْرَةِ أَخْبَارِ السَّاعَةِ الثَّامِنَة |
| B1-B1-18 | esercizio 11, domanda 1 (model) | 517 | Testo modello. — إِلَيْكُمْ أَهَمَّ العَنَاوِينِ: البَلَدِيَّةُ تَفْتَحُ ثَلَاثَ حَدَائِقَ |
| B1-B1-18 | esercizio 11, domanda 1 (explanation) | 517 | Testo modello. — إِلَيْكُمْ أَهَمَّ العَنَاوِينِ: البَلَدِيَّةُ تَفْتَحُ ثَلَاثَ حَدَائِقَ |
| B1-B1-19 | passaggio 17 | 257, 259, 262 | leggere مِثْل al posto di كَمَا يَقُولُ المَثَلُمَثَل |
| B1-B1-20 | passaggio 10 | 269 | بَعْدَ أَنِ انْتَهَتِ الاِمْتِحَانَاتُبَعْدَ الاِمْتِحَانَاتِ dopo gli esami · dopo che so |
| B1-B1-20 | passaggio 19 | 277 | يتصل بي، (بل / لكن) أرسل رسالة. · 4. أدرس كثيرا (لكي / لذلك) أنجح في الامتحان. · 5. كان مر |
| B1-B1-20 | soluzioni | 522 | اسْتَمَرَّ فِي العَمَلِ. · 10. الطُّلَّابُ سُعَدَاءُ، أَمَّا الأَسَاتِذَةُ فَقَلِقُونَ. ·  |
| B1-B1-21 | passaggio 19 | 291 | المكتبات العامة في زمن الإنترنت يظن كثيرون أن المكتبات العامة فقدت دورها في زمن الإنترنت،  |
| B1-B1-21 | passaggio 19 | 291 | عَلَى بُعْدِ نَقْرَةٍ «a un clic di distanza». A · Analisi (8 punti, 2 per risposta). 1. S |
| B1-B1-21 | esercizio 6, domanda 1 (model) | 523 | Esempi. § 1 يَقْضِي المُرَاهِقُونَ أَكْثَرَ مِنْ خَمْسِ سَاعَاتٍ يَوْمِيًّا أَمَامَ الشَّا |
| B1-B1-21 | esercizio 6, domanda 1 (explanation) | 523 | Esempi. § 1 يَقْضِي المُرَاهِقُونَ أَكْثَرَ مِنْ خَمْسِ سَاعَاتٍ يَوْمِيًّا أَمَامَ الشَّا |
| B1-B1-21 | soluzioni | 523 | ذٰلِكَ عَلَى النَّوْمِ وَالدِّرَاسَةِ وَالهِوَايَاتِ. · § 3 لٰكِنَّ الشَّاشَاتِ تُتِيحُ أَ |
| B1-B1-21 | soluzioni | 524 | أَنْشِطَةٌ لِكُلِّ الأَعْمَارِ (خَدَمَاتٌ مُتَنَوِّعَةٌ) · 6. المَطْبُوعَات (مَوَادُّ القِ |
| B1-B1-22 | passaggio 9 | 297 | chiusura سَلَامٌ مَعَ أَطْيَبِ التَّحِيَّاتِ وَتَفَضَّلُوا بِقَبُولِ فَائِقِ الاِحْتِرَامِ |
| B1-B1-22 | passaggio 15 | 301, 302, 526 | الزمالك – معهد اللغاتقسم شؤون الطلاب |
| B1-B1-22 | esercizio 6, domanda 1 (model) | 525 | Esempio. طَلَبُ تَغْيِيرِ مَوْعِدِ الاِمْتِحَانِ: المَوْضُوعُ عَزِيزَتِي الأُسْتَاذَةُ سَل |
| B1-B1-22 | esercizio 6, domanda 1 (explanation) | 525 | Esempio. طَلَبُ تَغْيِيرِ مَوْعِدِ الاِمْتِحَانِ: المَوْضُوعُ عَزِيزَتِي الأُسْتَاذَةُ سَل |
| B1-B1-22 | esercizio 11, domanda 1 (model) | 526 | Reclamo. مِيلَانُو، فِي ١٠ أَغُسْطُس لِلطَّيَرَانِ المُحْتَرَمُونَ «النَّسْرِ» السَّادَةُ  |
| B1-B1-22 | esercizio 11, domanda 1 (explanation) | 526 | Testi modello. a) Reclamo. مِيلَانُو، فِي ١٠ أَغُسْطُس لِلطَّيَرَانِ المُحْتَرَمُونَ «النَ |
| B1-B1-22 | esercizio 11, domanda 1 (feedback) | 526 | Reclamo. مِيلَانُو، فِي ١٠ أَغُسْطُس لِلطَّيَرَانِ المُحْتَرَمُونَ «النَّسْرِ» السَّادَةُ  |
| B1-B1-22 | esercizio 11, domanda 2 (model) | 527 | Candidatura. مِيلَانُو، فِي ٢٠ سِبْتَمْبِر حَضْرَةَ السَّيِّدِ مُدِيرِ المَرْكَزِ الثَّقَا |
| B1-B1-22 | esercizio 11, domanda 2 (explanation) | 526 | Testi modello. a) Reclamo. مِيلَانُو، فِي ١٠ أَغُسْطُس لِلطَّيَرَانِ المُحْتَرَمُونَ «النَ |
| B1-B1-22 | esercizio 11, domanda 2 (feedback) | 527 | Candidatura. مِيلَانُو، فِي ٢٠ سِبْتَمْبِر حَضْرَةَ السَّيِّدِ مُدِيرِ المَرْكَزِ الثَّقَا |
| B1-B1-22 | esercizio 12, domanda 1 (explanation) | 527 | a) È scritta come a un amico (أَهْلًا !, أُرِيدُ). Con il destinatario (حَضْرَةَ السَّيِّد |
| B1-B1-22 | esercizio 12, domanda 2 (explanation) | 527 | a) È scritta come a un amico (أَهْلًا !, أُرِيدُ). Con il destinatario (حَضْرَةَ السَّيِّد |
| B1-B1-22 | esercizio 12, domanda 3 (model) | 527 | Il test di livello è il 6 luglio alle nove invece che alle dieci. Il passaporto e due foto |
| B1-B1-22 | esercizio 12, domanda 3 (explanation) | 527 | a) È scritta come a un amico (أَهْلًا !, أُرِيدُ). Con il destinatario (حَضْرَةَ السَّيِّد |
| B1-B1-22 | esercizio 12, domanda 3 (feedback) | 527 | Il test di livello è il 6 luglio alle nove invece che alle dieci. Il passaporto e due foto |
| B1-B1-22 | soluzioni | 86, 166, 526 | مِيلَانُو، فِي ٢٠ سِبْتَمْبِر حَضْرَةَ السَّيِّدِ مُدِيرِ المَرْكَزِ الثَّقَافِيِّ العَرَب |
| B1-B1-23 | passaggio 16 | 316 | قَصْرُ الحَمْرَاءِ؟: نُور نَعَمْ، الحَمْرَاءُ! عِنْدَمَا كُنْتُ صَغِيرًا كُنْتُ أَقْرَأُ ا |
| B1-B1-23 | esercizio 11, domanda 1 (model) | 530 | Dialogo modello (parti in egiziano segnalate). مَسَاءُ الخَيْرِ! هَلْ هٰذَا المَكَانُ فَار |
| B1-B1-23 | esercizio 11, domanda 1 (explanation) | 530 | Dialogo modello (parti in egiziano segnalate). مَسَاءُ الخَيْرِ! هَلْ هٰذَا المَكَانُ فَار |
| B1-B1-23 | soluzioni | 531 | (كَيْفَ تَقُولُونَ… ؟) · 5. عُذْرًا عَلَى المُقَاطَعَةِ. · 6. مَعَكَ حَقٌّ. · 7. أَفْهَمُ  |
| B1-B1-24 | esercizio 2, domanda 1 (model) | 538 | Frase / Elemento / Struttura / Traduzione أ / مُبْتَسِمًا / ḥāl (riga 9) / Il ministro è e |
| B1-B1-24 | esercizio 2, domanda 1 (explanation) | 538 | Frase / Elemento / Struttura / Traduzione أ / مُبْتَسِمًا / ḥāl (riga 9) / Il ministro è e |
| B1-B1-24 | soluzioni | 536 | وَلِمَاذَا اخْتَرْتِ التَّطَوُّعَ؟: المُذِيعَةُ سُؤَالٌ جَيِّدٌ! فِي الحَقِيقَةِ، عِنْدَمَ |
| B1-INT-01 | soluzioni | 533 | مُسْتَخْدِمُو مَوَاقِعِ التَّوَاصُلِ فِيدْيُو لَمْ يَتَسَنَّ التَّحَقُّقُ مِنْ تَارِيخِهِ. |
| B1-INT-02 | passaggio 3 | 334 | giudiziario المَحَاكِمُ السُّلْطَةُ القَضَائِيَّةُ المَحْكَمَةُ الدُّسْتُورِيَّةُ · |
| B1-ONO-03 | passaggio 4 | 186 | · البَحْرَيْن · الكُوَيْت · المَغْرِب · اليَمَن · السُّودَان · الأُرْدُنّ · العِرَاق · عُم |
| B1-ONO-03 | passaggio 10 | 190 | ج.م.ع. – القَاهِرَة الزَّمَالِك – ١٥ شَارِعُ مُحَمَّد مَظْهَرالطَّابِقُ الثَّالِثُ – مَعْه |
| B1-ONO-03 | esercizio 7, domanda 1 (model) | 506 | Modello. بِجِوَارِ مَحَطَّةِ المِتْرُوج.م.ع. – الجِيزَة الدُّقِّي – ٧ شَارِعُ التَّحْرِيرِ |
| B1-ONO-03 | esercizio 7, domanda 1 (explanation) | 506 | Modello. بِجِوَارِ مَحَطَّةِ المِتْرُوج.م.ع. – الجِيزَة الدُّقِّي – ٧ شَارِعُ التَّحْرِيرِ |
| B1-ONO-03 | esercizio 10, domanda 1 (model) | 507 | Modello (con dati verificabili su fonti pubbliche). الإِسْكَنْدَرِيَّة ، وَبِالإِيطَالِيَّ |
| B1-ONO-03 | esercizio 10, domanda 1 (explanation) | 507 | Modello (con dati verificabili su fonti pubbliche). الإِسْكَنْدَرِيَّة ، وَبِالإِيطَالِيَّ |
| B1-ONO-03 | soluzioni | 506 | بِجِوَارِ مَحَطَّةِ المِتْرُوج.م.ع. – الجِيزَة الدُّقِّي – ٧ شَارِعُ التَّحْرِيرِ الطَّابِ |
| B2-ARZ-01 | soluzioni | 699 | Esercizio 4. a) Levante: kifak, shu, 3am ta3mel, halla2. · b) Golfo (o Iraq): shlonak, way |
| B2-ARZ-02 | passaggio 3 | 482, 520 | futuro هـ / حـ حروح · هروح ha- / ḥa- |
| B2-ARZ-02 | passaggio 4 | 521 | ما فيما في (Iraq) ماكو · مافيش non c'è |
| B2-ARZ-02 | passaggio 12 | 528 | C · Thread (6 punti). Commenti: «١ · الطريق مقفول من ساعة 😤 ٢ · بيقولوا في حادثة كبيرة!!!  |
| B2-B2-01 | passaggio 4 | 15 | sezione سِيَاسَة القِسْم · ثَقَافَة · اِقْتِصَاد · l'ambito (politica, economia, cultura,  |
| B2-B2-01 | passaggio 8 | 18 | ز ي دمُتَزَايِد «aumento» + participio VI «crescente» طَلَبٌ مُتَزَايِدٌ «una domanda cres |
| B2-B2-02 | passaggio 13 | 42 | مجتمع ترميم المدينة العتيقة: هل تفقد الأزقة سكانها؟ |
| B2-B2-02 | esercizio 2 (blocks) | 39 | 1. سيارة مدير المدرسة الجديدة 2. نتائج امتحانات الطلاب الأخيرة 3. رئيس وزراء البلد السابق  |
| B2-B2-02 | esercizio 7, domanda 1 (model) | 598 | Frasi semplici: أَكَّدَ رَئِيسُ مَجْلِسِ إِدَارَةِ الشَّرِكَةِ الوَطَنِيَّةِ لِلْكَهْرَبَا |
| B2-B2-02 | esercizio 7, domanda 1 (explanation) | 598 | Frasi semplici: أَكَّدَ رَئِيسُ مَجْلِسِ إِدَارَةِ الشَّرِكَةِ الوَطَنِيَّةِ لِلْكَهْرَبَا |
| B2-B2-02 | esercizio 12, domanda 1 (explanation) | 599 | a) Perché società e amministrazione sono femminili e l'aggettivo è maschile. Con il senso: |
| B2-B2-02 | esercizio 12, domanda 2 (explanation) | 599 | a) Perché società e amministrazione sono femminili e l'aggettivo è maschile. Con il senso: |
| B2-B2-02 | esercizio 12, domanda 3 (model) | 599 | .1 (مِنَ المُقَرَّرِ أَنْ) . 2 بَرْنَامَجٍ تَدْعَمُهُ مُنَظَّمَاتٌ. · … تَهْدِفُ إِلَى تَط |
| B2-B2-02 | esercizio 12, domanda 3 (explanation) | 599 | a) Perché società e amministrazione sono femminili e l'aggettivo è maschile. Con il senso: |
| B2-B2-02 | esercizio 12, domanda 3 (feedback) | 599 | .1 (مِنَ المُقَرَّرِ أَنْ) . 2 بَرْنَامَجٍ تَدْعَمُهُ مُنَظَّمَاتٌ. · … تَهْدِفُ إِلَى تَط |
| B2-B2-03 | esercizio 1, domanda 1 (model) | 601 | Esempio. تَصَدَّرَ حِزْبُ النَّهْضَةِ الوَطَنِيَّةِ الاِنْتِخَابَاتِ بِحُصُولِهِ عَلَى ٣٤٪ |
| B2-B2-03 | esercizio 1, domanda 1 (explanation) | 601 | Esempio. تَصَدَّرَ حِزْبُ النَّهْضَةِ الوَطَنِيَّةِ الاِنْتِخَابَاتِ بِحُصُولِهِ عَلَى ٣٤٪ |
| B2-B2-03 | soluzioni | 601 | ثَمَانِيَةِ مَقَاعِدَ. · وَحَلَّ التَّحَالُفُ الدِّيمُقْرَاطِيُّ فِي المَرْتَبَةِ الثَّانِ |
| B2-B2-06 | passaggio 9 | 52, 100, 122 | النِّظَامُ الحُكُومَةُ B2-03 |
| B2-B2-06 | passaggio 13 | 107 | تحليل الأمن البحري في المتوسط: تعاون ضروري وثقة ناقصة |
| B2-B2-06 | esercizio 5, domanda 1 (explanation) | 610 | a) مسلحون (neutro) «uomini armati» / مرتزقة «mercenari» b) قتل (neutro) «è stato ucciso» / |
| B2-B2-06 | esercizio 5, domanda 2 (explanation) | 610 | a) مسلحون (neutro) «uomini armati» / مرتزقة «mercenari» b) قتل (neutro) «è stato ucciso» / |
| B2-B2-06 | esercizio 5, domanda 3 (explanation) | 610 | a) مسلحون (neutro) «uomini armati» / مرتزقة «mercenari» b) قتل (neutro) «è stato ucciso» / |
| B2-B2-06 | esercizio 5, domanda 4 (explanation) | 610 | a) مسلحون (neutro) «uomini armati» / مرتزقة «mercenari» b) قتل (neutro) «è stato ucciso» / |
| B2-B2-06 | esercizio 5, domanda 5 (model) | 610 | عملية أمنية (più neutro, ma è il termine delle autorità) «operazione di sicurezza» / حملة  |
| B2-B2-06 | esercizio 5, domanda 5 (explanation) | 610 | a) مسلحون (neutro) «uomini armati» / مرتزقة «mercenari» b) قتل (neutro) «è stato ucciso» / |
| B2-B2-06 | esercizio 5, domanda 5 (feedback) | 610 | عملية أمنية (più neutro, ma è il termine delle autorità) «operazione di sicurezza» / حملة  |
| B2-B2-06 | esercizio 8 (blocks) | 105 | ثمانية قتلى و٢٥ جريحا جراء القصف، فيما قال الجيش إنه استهدف " مواقع لمسلحين ". ولم يتسن ال |
| B2-B2-06 | esercizio 9, domanda 1 (model) | 106, 611 | Tra il governo e il «Fronte delle Montagne»; dalla mezzanotte di domenica; dopo tre mesi d |
| B2-B2-06 | esercizio 9, domanda 1 (explanation) | 106, 611 | a) Tra il governo e il «Fronte delle Montagne»; dalla mezzanotte di domenica; dopo tre mes |
| B2-B2-06 | esercizio 9, domanda 1 (feedback) | 106, 611 | Tra il governo e il «Fronte delle Montagne»; dalla mezzanotte di domenica; dopo tre mesi d |
| B2-B2-06 | esercizio 9, domanda 2 (explanation) | 106, 611 | a) Tra il governo e il «Fronte delle Montagne»; dalla mezzanotte di domenica; dopo tre mes |
| B2-B2-06 | soluzioni | 610 | e) عملية أمنية (più neutro, ma è il termine delle autorità) «operazione di sicurezza» / حم |
| B2-B2-06 | soluzioni | 610 | Esercizio 6. a) Il parlamento ha adottato una nuova legge sulla protezione dei dati. · b)  |
| B2-B2-07 | passaggio 14 | 137 | ، دون أن يوضح طبيعتها. «ظروف خارجة عن إرادة الوزارة» مرجعا ذلك إلى كل مشروع كبير يواجه تحد |
| B2-B2-07 | esercizio 10 (blocks) | 138 | 1. وقالت الوزيرة في حوار مع إذاعة محلية إن الحكومة «تدرس كل الخيارات» ، دون أن تستبعد رفع  |
| B2-B2-08 | esercizio 10 (blocks) | 154 | 1. وأقر رئيس الوزراء بأن الحكومة «لم تنجح» في السيطرة على الأسعار، لكنه شدد على أن الأشهر  |
| B2-B2-09 | passaggio 5 | 161 | عَلَى مَا يَبْدُو · يَبْدُو أَنَّ يَبْدُو أَنَّ المُفَاوَضَاتِ مُتَعَثِّرَةٌ. impressione |
| B2-B2-10 | passaggio 5 | 175 | … وَإِنْ الخُطَّةُ جَيِّدَةٌ، وَإِنْ كَانَتْ مُتَأَخِّرَةً. il piano è buono, anche se arr |
| B2-B2-10 | passaggio 8 | 176 | autorità impropria سُلْطَةٌ فِي غَيْرِ قَالَ لَاعِبُ كُرَةٍ مَشْهُورٌ إِنَّ هٰذَا الدَّوَا |
| B2-B2-10 | passaggio 8 | 176 | مَحَلِّهَا فَعَّالٌ. |
| B2-B2-10 | esercizio 8, domanda 1 (model) | 625 | Esempio. يَشْكُو كَثِيرٌ مِنَ الطُّلَّابِ مِنْ كُلْفَةِ التَّنَقُّلِ. · وَأَرَى أَنَّ المُ |
| B2-B2-10 | esercizio 8, domanda 1 (explanation) | 625 | Esempio. يَشْكُو كَثِيرٌ مِنَ الطُّلَّابِ مِنْ كُلْفَةِ التَّنَقُّلِ. · وَأَرَى أَنَّ المُ |
| B2-B2-10 | soluzioni | 624 | تَجْلِبُ «porta» · تُدَمِّرُ «distrugge». Esercizio 4. a) dati: abbastanza solido se la fo |
| B2-B2-11 | passaggio 12 | 196 | نوال الحسيني: بقلم ، الذي تحول، منذ ثلاث «شارع الحرية» لكل مدينة معالمها. لباريس برجها، ول |
| B2-B2-11 | passaggio 13 | 198 | .«لا تحتمل أكثر» الشرائية للعمال، في حين لم تعرض الحكومة سوى خمسة في المئة، مؤكدة أن الموا |
| B2-B2-13 | esercizio 11, domanda 1 (model) | 640 | Esempio. اِفْتَتَحَتْ بَلَدِيَّةُ مِيلَانُو أَمْسِ مَكْتَبَةً جَدِيدَةً فِي حَيِّ لُورِنْت |
| B2-B2-13 | esercizio 11, domanda 1 (explanation) | 640 | Esempio. اِفْتَتَحَتْ بَلَدِيَّةُ مِيلَانُو أَمْسِ مَكْتَبَةً جَدِيدَةً فِي حَيِّ لُورِنْت |
| B2-B2-14 | esercizio 11, domanda 1 (model) | 642 | Esempio. البَلَدِيَّةُ تُعْلِنُ عَنْ عَشَرَةِ خُطُوطٍ جَدِيدَةٍ لِلْحَافِلَاتِ الكَهْرَبَا |
| B2-B2-14 | esercizio 11, domanda 1 (explanation) | 642 | Esempio. البَلَدِيَّةُ تُعْلِنُ عَنْ عَشَرَةِ خُطُوطٍ جَدِيدَةٍ لِلْحَافِلَاتِ الكَهْرَبَا |
| B2-B2-15 | passaggio 4 | 274 | «c'è», «ci sono» … فِي · يُوجَدُ · هُنَاكَ فِي الحَيِّ مَدْرَسَتَانِ |
| B2-B2-15 | passaggio 5 | 275 | I numeri (ripasso B1-13). 3–10: il numero ha il genere opposto al nome e il nome va al gen |
| B2-B2-15 | passaggio 12 | 282, 644 | إعلان تحيط مكتبة المدينة العامة روادها الكرام علما بأنه، اعتبارا من يوم الأحد ١٥ سبتمبر، س |
| B2-B2-15 | passaggio 15 | 277, 284, 574 | calchi: أَخَذَ مَكَانًا, فَعَلَ سُؤَالًا طَرَحَ سُؤَالًا · عُقِدَ / جَرَى |
| B2-B2-15 | esercizio 10, domanda 1 (model) | 645 | Esempio. اِفْتِتَاحُ مَرْكَزٍ رِيَاضِيٍّ جَدِيدٍ فِي كْوَارْتُو أُوجَّارُو اِفْتَتَحَتْ بَ |
| B2-B2-15 | esercizio 10, domanda 1 (explanation) | 645 | Esempio. اِفْتِتَاحُ مَرْكَزٍ رِيَاضِيٍّ جَدِيدٍ فِي كْوَارْتُو أُوجَّارُو اِفْتَتَحَتْ بَ |
| B2-B2-16 | passaggio 13 | 298, 406 | رأي هل نحتاج إلى التشكيل؟ |
| B2-B2-16 | esercizio 5, domanda 8 (prompt) | 296 | التغيير. أمل يعيش الناس على وَسَّعَ «ampliare». |
| B2-B2-17 | passaggio 11 | 311 | الفصحى أم العامية على الشاشة؟ دراسة جديدة تعيد فتح النقاش كشفت دراسة أعدها فريق من الباحثي |
| B2-B2-17 | esercizio 4, domanda 1 (model) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 1 (explanation) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 2 (model) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 2 (explanation) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 3 (model) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 3 (explanation) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 4 (model) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 4 (explanation) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 5 (model) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 5 (explanation) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 6 (model) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 6 (explanation) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 7 (model) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 7 (explanation) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 8 (model) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 4, domanda 8 (explanation) | 651 | Fuṣḥā / Egiziano / Levantino  / هلّقدلوقتيالآن /   / بدّيعايزأريد /  ماذا / إيه / شو هكذا  |
| B2-B2-17 | esercizio 11, domanda 1 (explanation) | 652 | Esempi. a) وَبِصَرَاحَةٍ، فَإِنَّ المَرْأَةَ الَّتِي تَذْهَبُ إِلَى السُّوقِ كُلَّ يَوْمٍ  |
| B2-B2-17 | esercizio 11, domanda 2 (explanation) | 652 | Esempi. a) وَبِصَرَاحَةٍ، فَإِنَّ المَرْأَةَ الَّتِي تَذْهَبُ إِلَى السُّوقِ كُلَّ يَوْمٍ  |
| B2-B2-19 | passaggio 18 | 343 | C · Traduzione (8 punti). Traduci in italiano: «حذف مؤثر معروف تغريدة انتشرت على نطاق واسع |
| B2-B2-19 | esercizio 11, domanda 1 (model) | 659 | Esempio. تُطْلِقُ بَلَدِيَّةُ مِيلَانُو اليَوْمَ حَمْلَةً إِعْلَامِيَّةً بِخَمْسِ لُغَاتٍ، |
| B2-B2-19 | esercizio 11, domanda 1 (explanation) | 659 | Esempio. تُطْلِقُ بَلَدِيَّةُ مِيلَانُو اليَوْمَ حَمْلَةً إِعْلَامِيَّةً بِخَمْسِ لُغَاتٍ، |
| B2-B2-20 | passaggio 6 | 347 | Le iḍāfa lunghe. I titoli su questi temi accumulano iḍāfa e aggettivi: تَحْوِيلَاتُ المُغْ |
| B2-B2-20 | passaggio 12 | 353 | .«أن أغادر، لكنني لا أرى مستقبلا هنا ريم واحدة من آلاف الأطباء الشبان الذين يستعدون للهجرة |
| B2-B2-20 | esercizio 11, domanda 1 (model) | 662 | Esempio. سَيَعْمَلُ ثَلَاثُونَ وَسِيطًا ثَقَافِيًّا فِي مُسْتَشْفَيَاتِ مِيلَانُو وَمَكَات |
| B2-B2-20 | esercizio 11, domanda 1 (explanation) | 662 | Esempio. سَيَعْمَلُ ثَلَاثُونَ وَسِيطًا ثَقَافِيًّا فِي مُسْتَشْفَيَاتِ مِيلَانُو وَمَكَات |
| B2-B2-24 | passaggio 8 | 418 | .«يحزمون حقائبهم للعمل في الخارج» مئات الأطباء الشبان ، لكنها اعتبرت أن «مطالب الأطباء مشر |
| B2-B2-24 | passaggio 8 | 419 | ١. البرلمان يمنح الثقة للحكومة الجديدة بأغلبية ضئيلة والسكان يخشون على البيئة… لمشروع المي |
| B2-B2-24 | esercizio 2, domanda 1 (model) | 678 | القِمَّةُ المُزْمَعُ عَقْدُهَا فِي الرَّبِيعِ تَأَجَّلَتْ إِلَى أَجَلٍ غَيْرِ مُسَمًّى. (أ |
| B2-B2-24 | esercizio 2, domanda 1 (explanation) | 678 | القِمَّةُ المُزْمَعُ عَقْدُهَا فِي الرَّبِيعِ تَأَجَّلَتْ إِلَى أَجَلٍ غَيْرِ مُسَمًّى. (أ |
| B2-B2-24 | esercizio 3, domanda 1 (model) | 679 | Frase / Varietà / Segnali / Traduzione أ / levantino / šu (شو) · ʿam (عم) + verbo · halla  |
| B2-B2-24 | esercizio 3, domanda 1 (explanation) | 679 | Frase / Varietà / Segnali / Traduzione أ / levantino / šu (شو) · ʿam (عم) + verbo · halla  |
| B2-B2-24 | soluzioni | 675 | وإيه نصيحتك للي سامعينا؟: المذيع ما تسيبش شغلك من غير خطة. أنا حوشت فلوس سنتين قبل ما أسيب |
| B2-B2-24 | soluzioni | 680 | 3. Due tra: ضَيْفٌ ثَقِيلٌ يَدْخُلُ الصَّفَّ دُونَ اسْتِئْذَانٍ (il telefono come intruso  |
| B2-EGY-16 | passaggio 4 | 482 | «come» ازايإزاي ازاى · |
| B2-EGY-16 | esercizio 3, domanda 1 (explanation) | 691 | Esempi. a) يا شريف، معلش بكرة مش هقدر آجي. ينفع نخليها يوم الخميس؟ b) إزيك يا طنط؟ إن شاء  |
| B2-EGY-16 | esercizio 3, domanda 2 (explanation) | 691 | Esempi. a) يا شريف، معلش بكرة مش هقدر آجي. ينفع نخليها يوم الخميس؟ b) إزيك يا طنط؟ إن شاء  |
| B2-EGY-16 | esercizio 3, domanda 3 (explanation) | 691 | Esempi. a) يا شريف، معلش بكرة مش هقدر آجي. ينفع نخليها يوم الخميس؟ b) إزيك يا طنط؟ إن شاء  |
| B2-EGY-16 | esercizio 7, domanda 1 (model) | 692 | Esempio. Vocale: «أهلا يا ياسمين، معاكي لوكا. بفكرك إن يوم الجمعة فيه حفلة الكورس الساعة س |
| B2-EGY-16 | esercizio 7, domanda 1 (explanation) | 692 | Esempio. Vocale: «أهلا يا ياسمين، معاكي لوكا. بفكرك إن يوم الجمعة فيه حفلة الكورس الساعة س |
| B2-EGY-17 | esercizio 3, domanda 1 (model) | 497, 694 | Versione pulita: وإنت ابتديت البودكاست إمتى؟: م ابتديت من أربع سنين. ما هو أنا كنت شغال في |
| B2-EGY-17 | esercizio 3, domanda 1 (explanation) | 497, 694 | Versione pulita: وإنت ابتديت البودكاست إمتى؟: م ابتديت من أربع سنين. ما هو أنا كنت شغال في |
| B2-EGY-18 | esercizio 8, domanda 1 (explanation) | 698 | a) Si esercita per una presentazione: domani ha una riunione online con l'ufficio del Cair |
| B2-EGY-18 | esercizio 8, domanda 2 (explanation) | 698 | a) Si esercita per una presentazione: domani ha una riunione online con l'ufficio del Cair |
| B2-EGY-18 | esercizio 8, domanda 3 (model) | 698 | Il lavoro da casa nella sua azienda. Vantaggi, problemi, proposte. Il tempo dei trasporti, |
| B2-EGY-18 | esercizio 8, domanda 3 (explanation) | 698 | a) Si esercita per una presentazione: domani ha una riunione online con l'ufficio del Cair |
| B2-EGY-18 | esercizio 8, domanda 3 (feedback) | 698 | Il lavoro da casa nella sua azienda. Vantaggi, problemi, proposte. Il tempo dei trasporti, |
| B2-INT-03 | passaggio 13 | 121 | البيان الختامي للقمة الخامسة لمنظمة دول الحوض إن قادة الدول الأعضاء في منظمة دول الحوض، ال |
| B2-INT-04 | esercizio 10 (blocks) | 228 | 1. ويقدر مكتب الأمم المتحدة لتنسيق الشؤون الإنسانية أن نحو ثلاثة ملايين شخص يحتاجون إلى مس |
| B2-INT-06 | passaggio 4 | 385 | il «noi» inclusivo نَحْنُ، شَعْبًا وَحُكُومَةً ضَمِيرُ الجَمَاعَةِ… unità, appartenenza |
| B2-INT-06 | passaggio 11 | 392 | حين تتكلم الخطب أكثر مما تقول يلاحظ كل من يستمع إلى الخطب الرسمية في منطقتنا أنها تتشابه إ |
| B2-INT-06 | esercizio 12, domanda 1 (explanation) | 669 | a) Perché il ministro è un oratore eloquente e costruisce ogni frase su tre elementi. Con  |
| B2-INT-06 | esercizio 12, domanda 2 (explanation) | 669 | a) Perché il ministro è un oratore eloquente e costruisce ogni frase su tre elementi. Con  |
| B2-INT-06 | esercizio 12, domanda 3 (model) | 669 | Protocollo: معالي الوزراء، سعادة السفراء، السيدات والسادة. Figure: antitesi (لا ليكون بواب |
| B2-INT-06 | esercizio 12, domanda 3 (explanation) | 669 | a) Perché il ministro è un oratore eloquente e costruisce ogni frase su tre elementi. Con  |
| B2-INT-06 | esercizio 12, domanda 3 (feedback) | 669 | Protocollo: معالي الوزراء، سعادة السفراء، السيدات والسادة. Figure: antitesi (لا ليكون بواب |
| B2-INT-06 | soluzioni | 669 | Esercizio 10 · Esempio. «Nel nome di Dio, il Clemente, il Misericordioso. Cittadini, citta |
| B2-INT-06 | soluzioni | 670 | 12. Condizione: «Se l'economia migliorerà, abbasseremo le tasse.» · C. «Non promettiamo l' |
| B2-MAG-02 | soluzioni | 705 | واخا، عطيني جوج كيلو. ها عشرة دراهم.: الزبون مول الخضرة: الله يخلف عليك. |
