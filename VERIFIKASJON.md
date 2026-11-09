# Verifikasjon – 1.3.1 – 2026-11-09

## Installasjonsretting – 1.3.1

- Prosjekteieren rapporterte at installasjon av v1.3.0 ble avvist fordi
  `hacs.json` manglet. Filen manglet i både publisert tag og standardgrenen.
- `hacs.json` ligger nå i roten og angir navn, `content_in_root: true`,
  `filename: vsr300-cards.js` og README-visning. Feltene er kontrollert mot
  [HACS' publiseringsdokumentasjon](https://www.hacs.dev/docs/publish/start/).
- JSON, felttyper, plassering, filnavn, JavaScript-syntaks, pakkeversjon og
  sjekksummer er kontrollert lokalt. Hele JavaScript-filen er byte-identisk
  med 1.3.0 etter normalisering av de to versjonsangivelsene.
- Publiseringskontrollen skal lese manifestet og JavaScript-filen fra den
  faktiske releasetaggen, og sammenligne releasefilens SHA-256 med den lokale
  filen. En fil som bare finnes i `main`, reparerer ikke en gammel tag.
- Faktisk installasjon/oppdatering med HACS må bekreftes i brukerens HA.
  Ingen HA-konfigurasjon eller kommunikasjon med aggregatet endres her.

## Historisk kontrollgrunnlag – 1.3.0, 2026-11-09

- Sju kontrollgrupper består, med konkrete kontroller av fire registrerte
  kort, nye emner, native innstillinger, feiltilfeller, lagrede koblinger og
  mobil-/desktopvisning. Ingen tester utføres mot brukerens HA eller aggregat.
- Cockpit, Kontrollpanel og felleskode er sammenlignet med publisert 1.2.3 og
  er byte-identiske bortsett fra pakkeversjonen. Standardkoblingene er identiske.
- Temperaturstyring, Veksler og Filter fungerer som egne forklaringer. De
  opprinnelige emnene videreføres. Trykkvakt og støvsugermodus er skjult som
  standard; gamle ECO/TRIAC-signaler ligger i utvidbart teknisk grunnlag.
- Eksisterende entitetskart beholdes. Nye kildefelt i gamle lagrede oppsett
  blir ikke automatisk fylt med referanseinstallasjonens navn. Tømte felt
  forblir tomme, ukjente verdier blir ikke null eller av, og nullpådrag vises.
- Nye number-felt bruker HA-grenser og trinn. Plus/minus endrer bare utkast,
  Bruk sender korrekt number.set_value, og rapportert verdi endres først
  med HA-data. Ugyldige verdier/trinn og manglende metadata sender ingen kall.
- Switch-valg bruker eksplisitt turn_on/turn_off. Ukjent status gir ingen
  av/på-handling eller falsk aria-checked=false. Select bruker native alternativer.
- Start/slutt validerer begge felt før sending og sender bare endrede tall.
  Delvis feil er synlig; ingen automatisk tilbakerulling. Ved andre tjenestefeil
  beholdes utkast, og nye innsendinger blokkeres mens et kall pågår.
- Ulagrede valg, fokus og utvidede detaljer beholdes ved HA-oppdateringer.
  Remapping sender til riktig entitet. Native mer-info sender ingen innstilling.
- Integrasjonsversjon leses fra valgt update-entitets attributter. Åpning av
  mer-info foretar ingen programvareinstallasjon. Modusvarigheter er tilgjengelige
  som integrasjonen leverer dem, med Ildsted-varighet som avlesning.
- Alle fire temaer er kontrollert ved 320/360/412/900 px i lyst og mørkt tema,
  med kontrollhøyder på minst 44 CSS-piksler og uten horisontal overflyt i
  kontrolloppsettet. Forklaringskortet har fortsatt tre kolonner. Nye bilder
  er gjennomgått visuelt; de bruker simulerte HA-tilstander og erstatningsikoner.
- Ingen HTTP/WebSocket/Modbus-klient, bakgrunnspolling, nye HA-entiteter eller
  helpers opprettes. Bare eksisterende HA-tjenester forespørres ved betjening.

Kildegrunnlaget er Howard v1.3.0-kode og HA-diagnose 4.8.3 fra 2026-10-21.
Det beviser ikke dagens installerte HA-/integrasjonsversjon eller originale
Lovelace-oppsett. Faktisk editor, betjening og oppdateringsforløp i HA må bekreftes
etter installasjon. Klokkeslett består av to separate HA-entiteter og er ikke en
atomisk endring. Ingen V-verifikasjon på aggregatet er gjennomført i denne runden.

## Historisk kontrollgrunnlag – 1.2.3, 2026-11-03

- 14 kontrollgrupper for Status og forklaringer består, med tidligere
  beregninger, ukjente verdier, lokale kilder, remapping og menyoppførsel.
- Verdiradene i alle åtte emner åpner forventet entitet med én native
  `hass-action` / `more-info` ved trykk på navn eller verdi. Valgfri synlig
  entitets-ID følger samme handling og respekterer endrede koblinger.
- Native HTML-knapper støtter Enter/mellomrom uten doble hendelser. Fokus
  beholdes ved HA-oppdatering. Valgt forklaring forblir åpen etter entitetsklikk.
- Ukjente/utilgjengelige eksisterende entiteter kan åpnes. Manglende entiteter
  vises som ukjent uten knapp; tomme koblinger utelates.
- Alle emner og verdirader er kontrollert ved 320/360/412/900 px i lyst og
  mørkt tema. Radene er minst 44 CSS-piksler høye og har ingen horisontal
  overflyt i kontrolloppsettet. Berøringshendelser åpner riktig kilde.
- Tre menyfelt i bredden, gjentatt trykk for lukking og Lukk nederst består.
  Mobil-/desktopbilder er gjennomgått visuelt.
- SVG, Kontrollpanel, felleskode, entitetskart og opprinnelige forklaringstekster
  er sammenlignet med 1.2.2 og er identiske bortsett fra pakkeversjonen.
- Forklaringskortet sender ingen HA-tjenestekall eller eksterne forespørsler.
  Det lager ingen nye entiteter eller egen historikk for beregnet Huslast.

Prosjekteieren har rapportert at Cockpit-klikkene fra 1.2.2 fungerer i faktisk
HA. De nye forklaringsradene er kontrollert med simulerte HA-tilstander og
registrerte mer-info-hendelser; faktisk visning og dialogåpning bekreftes etter
oppdatering. Dette er ingen ny Modbus- eller aggregatverifikasjon.

## Historisk kontrollgrunnlag – 1.2.2, 2026-11-03

- 30 lokale nettleserkontrollgrupper består: 14 tidligere kontroller, ni for
  Status og forklaringer og sju for nye SVG-handlinger.
- Alle ni verdirader i sideboksene, veksler/frikjøling, ettervarmens status og
  prosent, begge vifter og filtre, modus/resttid og fem alarmrader åpner rett
  konfigurert entitet med én `hass-action` / `more-info` per aktivering.
- Reelle pekertreff i den simulerte nettleseren og berøringshendelser på
  naborader er kontrollert. Ingen feilaktig treff på skjult frikjøling/veksler.
  De ni radfeltene overlapper ikke og er minst 24 CSS-piksler høye i
  kontrolloppsettet ved 320/360/412/900 px vindusbredde. En ekstra smal
  dashboardkolonne kan gi mindre felt fordi SVG-en skaleres med kortbredden.
- Enter/mellomrom, tilgjengelige etiketter, synlig tastaturfokus og bevart fokus
  ved HA-oppdatering er kontrollert. Berøring gir ingen ekstra nettleserramme.
- Byttede entitetsnavn følger oppsettet. Eksisterende utilgjengelige entiteter
  kan åpnes; manglende og tomme koblinger får ingen klikkhandling.
- Sideboksene er høyere, med topp-/bunnjustering, samme viewBox, bredde og
  tekststørrelser. Tekstplass ved store tall og ukjent ettervarme er kontrollert.
  Lyse og mørke mobil-/desktopbilder er gjennomgått visuelt.
- Alle tidligere tegnede luftveier er identiske med 1.2.1. Kontrollpanel og
  Status og forklaringer har identisk kode; felleskode er bare versjonsendret.
- SVG-klikk sender ingen HA-tjenestekall, henter ikke egen historikk og gjør
  ingen eksterne forespørsler. Modbus-eierskap og HA-konfigurasjon er uendret.

Kontrollene bruker simulerte HA-tilstander og registrerer den utsendte
HA-handlingen. De er ikke en test av HAs faktiske dialog, recorder-data eller
Pixel-nettleseren. Dialogåpning og treffopplevelse i faktisk HA må bekreftes
etter oppdatering. Ettervarmeprosent, aktivitet, estimerte luftmengder og lokal
nedtelling har samme datagrunnlag og begrensninger som før.

## Historisk kontrollgrunnlag – 1.2.1, 2026-11-03

- Ni nettleserkontrollgrupper for Status og forklaringer er bestått.
- Et nytt trykk på det åpne statusfeltet lukker teksten. Enter og mellomrom
  virker på samme måte. Bytte til et annet felt og Lukk-knappen nederst virker
  fortsatt, med fokus bevart på statusfeltet etter lukking.
- Alle åtte feltene bruker tre kolonner ved 320/360/412/900 px vindusbredde.
  Teksten beholder skriftstørrelsen og er kontrollert for horisontal overflyt
  i lyse og mørke farger. Nye skjermbilder er kontrollert visuelt.
- SVG-, Kontrollpanel- og felleskode er uendret bortsett fra pakkeversjonen.
  Dette er kontrollert ved sammenligning med det tidligere kontrollgrunnlaget.
- Statusberegninger, entitetskoblinger, ukjente verdier og uavhengige kortvalg
  består de eksisterende kontrollene. Ingen eksterne forespørsler eller
  HA-tjenestekall foretas av forklaringskortet.

Kontrollene er lokale simuleringer; faktisk mobilvisning i brukerens HA må
bekreftes etter oppdatering. SVG-elementer har ikke fått nye klikkhandlinger.

## Historisk kontrollgrunnlag – 1.2.0, 2026-11-03

- 23 lokale kontrollgrupper er bestått: 14 tidligere nettlesergrupper og
  9 grupper for det nye kortet. Lyst/mørkt tema og bredder 360/412/900 px
  er kontrollert. Nye mobil- og desktopbilder er gjennomgått visuelt.
- Baseline for det nye kortet er hele Status og forklaringer-YAML-en som
  prosjekteieren la ved 2026-11-03. Alle åtte emner videreføres.
  Kilde-SHA256: `17b838abdbdc70721dce6bbc5c396f4edc605d1363fbc600369559a15c5cc6e7`.
- Eksisterende SVG-, Kontrollpanel- og felleskode er sammenlignet med 1.1.5 og
  er uendret bortsett fra pakkeversjonen. De 14 tidligere nettlesergruppene består.
- Nye nettleserkontroller dekker statusberegninger, samtlige forklaringer,
  lokalt og uavhengig menyvalg i to kort, lukking, tastatur/fokus, oppdaterte
  HA-verdier og at ny sideinnlasting starter med skjulte forklaringer.
- Manglende/tomme/ukjente verdier blir ikke null eller inaktiv. Reelle nullverdier
  beholdes. Huslast, fortegn, frikjølingstolkning og enhetskonvertering er kontrollert.
- De seks tidligere lokale frikjølingsdiagnosene kan brukes som valgfri kilde.
  Native diagnostikkverdier og rapportert aktivitet holdes atskilt fra disse.
- Entitetsbytte, tomme valgfrie felt, editorskjema, escaping av HA-tekst og
  simulerte mobile bredder er kontrollert. Menyvalg sender ingen HA-tjenestekall.

Kontrollene er lokale simuleringer, ikke installasjon i brukerens HA eller
V-verifikasjon på aggregatet. HAs faktiske editor og visning må bekreftes etter
oppdatering og valg av riktige entiteter.

## Historisk kontrollgrunnlag – 1.1.5, 2026-11-02

- 14 simulerte nettlesergrupper er bestått. Lys mobilvisning og mørk
  desktopvisning er gjennomgått visuelt.
- Toppjustering av Inntak, Avkast og aggregatets ytterramme er kontrollert i
  rendret SVG ved 360, 412 og 900 px. Bunnjusteringen fra 1.1.4 videreføres.
- Boksene og deres tekst flyttes samlet. Høyder, bredder, tekststørrelser,
  linjeavstand, luftveier, entitetskoblinger og betjening beholdes.
- Endringen gjelder bare presentasjon. Ingen installasjon, tjenestekall eller
  Modbus-trafikk foretas mot brukerens miljø.

## Historisk kontrollgrunnlag – 1.1.4, 2026-11-02

- 14 simulerte nettlesergrupper er bestått. Lys mobilvisning og mørk
  desktopvisning er gjennomgått visuelt.
- Bunnjustering er kontrollert i rendret SVG ved 360, 412 og 900 px. Tilluft,
  Avtrekk og aggregatets ytterramme har samme underkant.
- Tilluft-boksen er flyttet opp uten endringer i høyde, tekststørrelser eller
  linjeavstand. Vifteverdier, estimatmerker, mørke komponenter og modusfelt
  videreføres fra 1.1.3.
- Dokumentasjonen beskriver HACS som egendefinert repository med type Dashboard,
  ressurs via `/hacsfiles/`, oppdatering og overgang fra manuell ressurs. Oppsett
  av entiteter i begge kort gjelder fortsatt for begge installasjonsmetoder.
- HACS-fremgangsmåten er kontrollert mot HACS' offisielle dokumentasjon; faktisk
  bruk er rapportert av prosjekteieren, se nedenfor. Agenten installerer eller
  oppdaterer ikke i brukerens HA.

## Historisk kontrollgrunnlag – 1.1.3, 2026-11-02

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

Prosjekteieren opplyste 2026-11-02 at repositoriet er lagt til i HACS som et
custom repository, og at oppdatering fungerer godt uten manuell endring av
ressurslenken. Dette er brukerens praktiske tilbakemelding fra egen installasjon.


Prosjekteieren opplyste 2026-10-21 at 1.0.0-distribusjonskortene var så vidt testet og
at de innledningsvis fungerer. Det er en første praktisk tilbakemelding, uten
spesifisert dekning av alle kontroller, editorvalg eller signalkombinasjoner.

## Publiseringskontroll og gjenstående arbeid

1.2.0 legger til et tredje, valgfritt status- og forklaringskort. Tidligere
kort, HACS-veiledning og eksisterende entitetskoblinger videreføres. Komplette eksempler, dokumentasjonslenker og
pakkens sjekksummer kontrolleres før publisering. MIT-lisensen beholdes uendret.

Full gjennomgang av HAs grafiske editor, entitetsbytte og modusbetjening
gjenstår. HACS er praktisk rapportert i referanseinstallasjonen; full
installasjons- og oppdateringskontroll i andre oppsett gjenstår. Repositorystruktur og eksempler
kan kontrolleres lokalt, men det erstatter ikke faktisk installasjon i HA.
Ingen praktisk test eller endring i brukerens HA startes av publiseringen.

Native temperatur-, status- og utgangsregistre beholder tidligere dokumentert
V/D/T/?-status. Kilde i integrasjonen er ikke alene bevis på fysisk verifikasjon.
