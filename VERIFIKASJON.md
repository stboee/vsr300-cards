# Verifikasjon – 1.1.3 – 2026-11-02

## Gjennomført lokalt for 1.1.3

- 14 simulerte nettlesergrupper er bestått. Lys mobilvisning og mørk
  desktopvisning er gjennomgått visuelt etter siste endring.
- Layoutkontroll i simulerte nettlesere ved 360, 412 og 900 px bredde omfatter
  firesifret rpm, luftmengde opp til modellkapasiteten og ettervarmeverdiene
  0 %, 2 %, 100 % og ukjent. Tekstgrenser og linjeavstand måles i rendret SVG.
- Informasjonsboksene tegnes over kanalendene, slik at kanalene ikke dekker
  tallene i boksene.
- Rpm står i egne linjer i Tilluft- og Avkast-boksene. Temperatur- og
  luftmengdeteksten har beholdt størrelsen; boksene er blitt høyere.
- SVG-ens viewBox er uendret. Hele illustrasjonen skaleres dermed ikke ekstra
  ned for å få plass til endringene. De 28 opprinnelige path-formene beholdes.
- Ettervarmeprosentens skriftstørrelse er økt fra 31 til 56 SVG-enheter.
  Ukjent pådrag vises fortsatt som ukjent, med egen lesbar tekststørrelse.
- Vekslerpådrag står på én linje i en noe bredere vekslerflate. De separate
  FILTER-tekstene er fjernet; filtersymbolene og alarmvisningen beholdes.
- Aggregatets og vekslerens mørke farger er hentet fra 1.1.1. Lys tekst på
  aggregatet beholdes gjennom bytte av HA-tema, mens bakgrunn og modusfelt
  fortsatt følger lyse, mørke og egendefinerte HA-paletter.
- Tidligere kontroller for lokal nedtelling, animasjoner, 32 alarmkombinasjoner,
  entitetsvalg og simulerte betjeningskall er bestått på nytt.

Dette er lokale kontroller med simulerte verdier, ikke en ny verifikasjon på
VSR300-aggregatet. Faktisk lesbarhet i brukerens HA og på Pixel 8 Pro må bekreftes
etter manuell oppdatering. Auto-nivåklassifisering er ikke lagt til.

## Historisk kontrollgrunnlag – 1.1.2, 2026-11-02

- 13 simulerte nettlesergrupper er bestått. Temakontrollen omfatter lyst, mørkt
  og en egendefinert palett, hver med både lyst og mørkt OS-fargevalg.
- SVG-bakgrunn, aggregatpanel, modusfelt og nøytral tekst følger arvede HA-
  variabler. Temabytte er kontrollert uten nye HA-tilstander, SVG-utskifting
  eller sideoppdatering.
- Utvalgte nøytrale tekst/bakgrunn-par og hvit tekst på de fire fargede
  luftportene har minst 4,5:1 beregnet kontrast i testpalettene. Dette er en
  kontroll av konkrete fargepar, ikke en full tilgjengelighetssertifisering.
- Lys desktop- og mobilvisning samt mørk visning er gjennomgått visuelt.
- Tidligere nettleserkontroller for lokal nedtelling, animasjoner, alarmer,
  entitetsvalg og betjening er bestått på nytt.

Kontrollene bruker simulerte HA-verdier og temavariabler. Faktisk temabytte i
brukerens Home Assistant og på Pixel 8 Pro gjenstår å bekrefte.

## Historisk kontrollgrunnlag – 1.1.1, 2026-10-23

- 15 kontroller med styrt klokke dekker sekundvis lokal nedtelling, alder på
  mottatt HA-verdi, tilgjengelige rapporterings-/oppdateringstidsstempler,
  manglende/ugyldige tidsstempler og synkronisering av nye rapporter begge veier.
- Oppdateringer av andre entiteter nullstiller ikke nedtellingen. Forlengelser
  og nye rapporter med samme verdi, men nytt tidsstempel, behandles som nye data.
- Forsinkede klokkeoppdateringer tar igjen faktisk forløpt tid og stopper på
  null. Alle fem tidsstyrte moduser og deres enheter/formater er kontrollert.
- Ukjent/utilgjengelig resttid blir ukjent, uten reserveberegning fra innstilt
  varighet. Manglende valgfri varighet skjuler bare fremdriftsfyllingen.
- Nettleseren bekrefter at tekst og fremdriftslinje endres uten nye HA-verdier.
  SVG-elementet, viftenoden og dens løpende CSS-animasjon beholdes ved klokketikk.
- Intervaller stoppes ved fjerning av kortet, utilgjengelig verdi og ikke-tidsstyrt
  modus. Kortet tar igjen tiden og starter intervallet ved gjeninnsetting.
- Tolv simulerte nettlesergrupper kontrollerer også tidligere funksjoner, blant
  annet animasjonsvalg, 32 alarmkombinasjoner, entitetsvalg, tjenestekall og mobilbredde.

Resttiden mellom rapporteringene er en lokal visningsberegning. Verken timeren
eller nullpunktet endrer aggregatets rapporterte modus eller skriver til Modbus.
Faktisk kontroll i brukerens HA og på Pixel 8 Pro gjenstår.

## Historisk kontrollgrunnlag – 1.1.0, 2026-10-22

Elleve kontrollgrupper er bestått i lokal headless Chromium med simulerte
HA-tilstander. De omfatter følgende endringer og regresjonskontroller:

- Begge overskrifter skjules som standard, også med gamle lagrede titler.
  Egen overskrift vises bare etter uttrykkelig aktivering.
- Den faste teksten under SVG-en er fjernet. Estimatmerket `≈` beholdes.
- «Vekslerpådrag» vises i den opprinnelige vekslerillustrasjonen.
- Animasjoner har standarden **På**, også når et gammelt oppsett mangler feltet.
- Alle seks kombinasjoner av På/Auto/Av og redusert/vanlig bevegelse er kontrollert
  gjennom beregnet CSS. Faktisk endring mellom to animasjonsbilder bekrefter både
  vifte- og luftstrømsbevegelse med På mens redusert bevegelse er forespurt.
- Alle 32 kombinasjoner av A/B/C, filteralarm og filtervarsel gir én linje per
  aktivt signal i avtalt rekkefølge. Samlealarmer tolkes ikke som feilårsaker.
- Ukjent status på en valgt alarm vises nøytralt, mens tom valgfri alarmkobling
  utelates. Gamle lagrede entitetsvalg får ikke nye koblinger automatisk.
- Filterfarger, ukjente verdier, countdown, Ferie over ett døgn og den opprinnelige
  frikjølingsbanen er kontrollert på nytt.
- Alle ti betjeningsvalg gir riktige simulerte HA-tjenestekall. Avbrutt bekreftelse,
  tjenestefeil og utilgjengelige betjeningsentiteter er kontrollert.
- Grafiske editorskjemaer, standardverdier og bevaring av valgte/tomme koblinger
  er kontrollert. Selve HAs fullstendige editor er ikke kjørt.
- Desktop og mobilbredde 412 px, inkludert flere samtidige alarmer, er kontrollert
  for sidefeil og horisontal overflyt. Skjermbilder er gjennomgått visuelt.

Dette er ikke en fysisk Pixel 8 Pro-test eller V-verifikasjon på aggregatet.

## Historisk kontrollgrunnlag – 1.0.0, 2026-10-21

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

Prosjekteieren opplyste 2026-10-21 at 1.0.0-distribusjonskortene var så vidt testet og
at de innledningsvis fungerer. Det er en første praktisk tilbakemelding, uten
spesifisert dekning av alle kontroller, editorvalg eller signalkombinasjoner.

## Publiseringskontroll og gjenstående arbeid

1.1.3 viderefører tidligere kortfunksjoner, forbedrer tekstplasseringen og
beholder temaavhengig bakgrunn rundt et mørkt aggregat og en mørk veksler. Komplette eksempler, dokumentasjonslenker og
pakkens sjekksummer kontrolleres før publisering. MIT-lisensen beholdes uendret.

Full gjennomgang av HAs grafiske editor, entitetsbytte, modusbetjening og
manuell installasjon/oppdatering gjenstår. Repositorystruktur og eksempler
kan kontrolleres lokalt, men det erstatter ikke faktisk installasjon i HA.
Ingen praktisk test eller endring i brukerens HA startes av publiseringen.

Native temperatur-, status- og utgangsregistre beholder tidligere dokumentert
V/D/T/?-status. Kilde i integrasjonen er ikke alene bevis på fysisk verifikasjon.
