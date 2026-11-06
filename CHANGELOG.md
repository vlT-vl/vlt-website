# Changelog

Le funzionalità principali del sito, in ordine cronologico inverso.

## 2026-11-06 — 0.1.5 / R061126

- About vlT: le card delle tecnologie scorrono ora in carosello continuo, come le pillole delle card competenze della home (due righe in direzioni opposte per l'infrastruttura, una per lo sviluppo); si fermano al passaggio del mouse. Le card mantengono la forma di prima. Con il movimento ridotto restano ferme in griglia.
- Mobile: la card competenze aperta non lascia più uno spazio vuoto sotto di sé, la pill del sito non si sovrappone più alle card progetto e la barra di navigazione è più compatta.
- Lo sfondo con la rete animata della home compare ora in tutte le pagine (Progetti, Blog, About Me, About vlT), appena percettibile e sfocato.

## 2026-11-05 — 0.1.5 / R051126

- Home: il titolo sopra le card entra in motion design, riga dopo riga. Le tre card delle competenze si aprono anche passando il mouse sopra. Le mini card in basso restano nascoste finché non entrano in vista, poi compaiono in animazione.
- Ultimo progetto e ultimo articolo: all'hover gli elementi della card escono uno alla volta e compare un'anteprima dentro la card stessa. Per il progetto il logo scorre di lato e compaiono linguaggi, file principali e ultimi commit, con la pill del sito sotto il logo; per l'articolo la copertina si espande a tutta card e data e tempo di lettura passano in alto a destra. Il clic apre il modale completo.
- Progetti e Blog: tutte le card hanno ora lo stesso aspetto e le stesse animazioni di ultimo progetto e ultimo articolo, e le card del blog sono orizzontali come quelle dei progetti. Entrano in animazione quando arrivano in vista, senza segnaposto vuoti. Se l'immagine di un progetto non si carica compare l'icona generica del progetto.
- Ricerca in Progetti e Blog: pulsante X per cancellare il testo; i filtri per linguaggio e per tag si adattano ai risultati della ricerca; durante la ricerca la card principale in alto non resta e compaiono solo i risultati; i colori dei tag sono gli stessi nei filtri e nelle card.
- Le filigrane dei loghi nelle card progetto hanno dimensioni e intensità uniformi e non si sovrappongono più alla linea di separazione.
- About Me: i contatti LinkedIn ed Email sono pillole sotto il nome, che entrano in animazione e all'hover prendono il colore del servizio con l'icona che scorre dal lato opposto; l'Email apre un modale di contatto con oggetto e testo già compilati e modificabili. Il nome animato è più fluido e più grande, un selettore laterale segue il paragrafo che si sta leggendo, il testo è ampliato (framework nex, studio di Harvester, OKD e KubeVirt) e ha la stessa larghezza della card «Dove lavoro» e delle certificazioni, che è stata ridisegnata più compatta.
- About vlT: nuove card per Nutanix, Harvester, OKD, nex Web e Python.
- Un repository diventato privato non compare più nel sito.

## 2026-10-30 — 0.1.4 / R301026

- Nuova apertura in motion design a tutto schermo: il logo vlT parte al centro della pagina e si costruisce con le linee disegnate dei due elementi dell'esagono rosso, il riempimento che sale a onda e una scia di luce sul contorno; compare la scritta «vlT». Segue il nome: salgono le iniziali «l» e «v» e il resto di «lorenzo» e «veronesi» si apre ed espande, come nell'acronimo animato della pagina S2E. Poi entra lo slogan «From hypervisor to interface» con un'animazione diversa: «hypervisor» e «interface» si rivelano da lati opposti e una linea con «to» in rosso le collega. La schermata intera si restringe poi fino alla barra di presentazione (con la riga dei ruoli), e il resto della pagina la segue risalendo come in uno scroll, con le card e le altre informazioni della home che compaiono in animazione. L'apertura completa si vede a ogni caricamento del sito, mentre tornando alla home da un'altra sezione tutto appare già composto. Con il movimento ridotto nelle impostazioni di sistema le animazioni sono disattivate.
- Le tre card delle competenze hanno l'icona al centro in alto, dentro un esagono (richiamo del logo) che si disegna, con un'icona coerente per ogni ambito (infrastruttura, sviluppo, design); entrano in motion design una dopo l'altra: la card si apre, l'esagono si traccia, l'icona compare, poi sigla, titolo, descrizione e tag a cascata. I colori restano quelli attuali.
- Sfondo della home con gradiente e una rete animata di linee, nodi, impulsi luminosi, anelli e puntini in movimento, come nella pagina S2E; qua e là compare l’icona del logo vlT, disegnata a linee, in tinta chiara o scura secondo il tema. Un parallax molto leggero segue lo scroll e il mouse. I colori restano quelli attuali.
- Il logo vlT, ovunque compaia (barra in alto, footer, modale), si costruisce con la stessa animazione a linee disegnate.
- Nel modale «About vlT Website» il logo animato sta a sinistra, seguito dalla scritta «website» che entra lettera per lettera con alcune lettere in rosso vlT.
- Sito disponibile in italiano e in inglese: nella barra in alto, accanto al tema, c’è il pulsante per cambiare lingua (la scelta viene ricordata; al primo accesso si usa la lingua del browser) e un pulsante info che apre il modale «About vlT Website».
- About Me e About vlT hanno un ingresso in motion design: foto che si apre a cerchio, titoli e paragrafi che entrano a cascata, certificazioni e competenze che compaiono una dopo l’altra.
- In About Me le certificazioni attuali sono mini card con il badge originale Credly, ente, anno e nome, che rimandano al singolo badge su Credly; si aggiornano automaticamente come progetti e blog (ogni ora e a ogni pubblicazione) e mostrano tutti i badge pubblici del profilo. In About vlT anche le card delle competenze e il blocco blog entrano in animazione mentre si scorre la pagina.
- Dipendenze aggiornate alle ultime versioni disponibili.

## 2026-07-07 — 0.1.3 / R070726

- Tema chiaro e scuro: pulsante nella barra in alto, scelta ricordata, per impostazione predefinita segue il tema del sistema. Tutto il sito usa la stessa palette, con una palette dedicata in stile GitHub per card dei progetti, README e licenza. Il tema chiaro è volutamente un po' meno luminoso e il rosso vlT è più morbido.
- Il testo «vlT» del logo è leggibile anche nel tema chiaro.
- Nuovo modale «About vlT Website», che si apre dal logo e dalle scritte in fondo alla pagina: logo esteso, versione, build, data di aggiornamento, tecnologie, elenco completo delle dipendenze e link alla licenza.
- La scheda «Dettagli» di ogni progetto ora mostra linguaggi, file principali, ultimi commit e ultima release.
- I dati di progetti e articoli sono sempre disponibili: l'ultimo stato valido resta nel sito anche se un aggiornamento automatico non riesce, e gli articoli più vecchi non spariscono dal blog quando escono dagli ultimi pubblicati.

## 2026-06-29 — 0.1.2 / R290626

- Progetti e articoli del blog vengono preparati in anticipo a ogni pubblicazione e ogni ora, così il sito non dipende da servizi esterni mentre lo si visita ed è più veloce e affidabile.

## 2026-06-26 — 0.1.1 / R260626

- Rifiniture generali di stile e struttura su tutte le sezioni.

## 2026-06-25 — 0.1.0 / R250626

- Prima versione del sito: Home con presentazione, tre schede sulle competenze con approfondimento, ultimo progetto e ultimo articolo; About Me; About vlT; Progetti con ricerca, filtro per linguaggio, README, statistiche e licenza di ogni repository; Blog con ricerca, filtri per tag e lettura degli articoli nel sito.
- Pubblicazione automatica su GitHub Pages.
