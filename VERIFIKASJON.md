# Verifikasjon – 1.0.0 – 2026-10-21

## Gjennomført lokalt

Kontrollene gjelder kortkoden og er ikke V-verifikasjon på VSR300-aggregatet.

- JavaScript-syntaks kontrollert med Node.
- To custom-card-registreringer og native editorskjemaer kontrollert.
- Normalvisning, 0-verdier, manglende/ugyldige verdier og separate varmesignaler.
- Filteralarm, filtervarsel, prioritetsregler og ukjent filterstatus.
- Resttid i sekunder, endret resttid, ukjent resttid og Ferie over ett døgn.
- Alle ti godkjente betjeningsvalg gir forventet HA-tjeneste og entitetsmål i simulering.
- Avbrutt bekreftelse gir ikke tjenestekall; feil fra tjenestekall blir synlig.
- En HA button med `unknown` før første trykk er fortsatt betjenbar.
- Ingen Stopp- eller Filter byttet-knapp.
- Entitetsbytte og tømt valgfri kilde beholdes ved ny innlesing av konfigurasjonen.
- Lokal headless Chromium: desktop og 390 px mobil, uten sidefeil eller horisontal overflyt.
- Visuell gjennomgang av normalvisning, filteralarm og mobilvisning.
- Alle 28 opprinnelige SVG-path-former er bevart. Teksten «utenom veksler» beholdt.
- Eksempel-YAML er gyldig. Lokal kontroll av Forklaringer er dokumentert i den
  separate lokale leveransen; kortet distribueres ikke her.

## Avgrensning

Nettlesertesten brukte simulerte HA-tilstander og en enkel skjemaadapter. Den
bekrefter kortets logikk og editorens konfigurasjonsskjema, men er ikke en full
kjøring av HAs egen grafiske editor. API-støtten for native skjema og entitetsfelt
er kontrollert mot HAs dokumentasjon og frontend-kilde 20260930.4, som HA core
2026.10.2 oppgir som avhengighet.

Det ble ikke foretatt tjenestekall til faktisk HA, Modbus-lesing, Modbus-skriving,
parallell polling eller installasjon i brukerens miljø. En headless testnettleser
ble brukt bare i utviklingsmiljøet og inngår ikke i leveransen.

## Rapportert fra faktisk HA

Prosjekteieren opplyste 2026-10-21 at distribusjonskortene var så vidt testet og
at de innledningsvis fungerer. Det er en første praktisk tilbakemelding, uten
spesifisert dekning av alle kontroller, editorvalg eller signalkombinasjoner.

## Publiseringskontroll og gjenstående arbeid

GitHub-pakken beholder funksjonskoden fra den manuelt leverte 1.0.0-versjonen.
Bare lisenskommentarer er lagt til i JavaScript-filen. HACS-manifest, eksempler,
dokumentasjonslenker og pakkens sjekksummer kontrolleres før publisering.
MIT-lisensen fra repositoryet beholdes uendret.

Full gjennomgang av HAs grafiske editor, entitetsbytte, modusbetjening og
installasjon/oppdatering gjennom HACS gjenstår. Repositorystruktur og manifest
kan kontrolleres lokalt, men det erstatter ikke faktisk installasjon i HACS.
Ingen praktisk test eller endring i brukerens HA startes av publiseringen.

Native temperatur-, status- og utgangsregistre beholder tidligere dokumentert
V/D/T/?-status. Kilde i integrasjonen er ikke alene bevis på fysisk verifikasjon.
