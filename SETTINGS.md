# Innstillinger – kortpakke 1.4.0

Et valgfritt fjerde kort i samme JavaScript-pakke. Oppdater gjennom HACS,
last dashboardet på nytt og legg til **Systemair Innstillinger** fra kortvelgeren:

```yaml
type: custom:vsr300-settings-card
```

Et komplett eksempel finnes i [04-Innstillinger.yaml](examples/04-Innstillinger.yaml).
Kontroller entitetskoblingene i grafisk editor. Startverdiene er eksempler fra
referanseoppsettet, ikke universelle navn. Tøm valgfrie felt som ikke brukes.

## Tre temaer

| Tema | Innhold |
|---|---|
| Temperatur og ECO | Temperatursettpunkt, ECO-valg, senking av ettervarmegrensen og kort avlesning av reguleringsmåte. |
| Frikjøling | Tillatelse, separat aktiv-status, start/slutt, temperaturgrenser og minste tilluft-/avtrekksnivå. |
| System | Kortversjon, integrasjonsversjoner fra valgt HA update-entitet, eventuell HA-versjon og dette kortets entitetskilder. |

Trykk på et temafelt for å åpne det, og på samme felt igjen for å lukke.
Lukk nederst beholder fokus på temafeltet. Temaene kan skjules enkeltvis i
editoren. Utvidede grenser ligger under **Flere innstillinger**.

## Endre et valg

- **Tall:** skriv en verdi eller bruk pluss/minus, og velg **Bruk**. Grenser og
  trinn hentes fra entitetens `min`, `max` og `step`. Manglende metadata eller
  utilgjengelig verdi deaktiverer redigeringen; kortet gjetter ikke grenser.
- **Brytere:** trykk på På/Av for ECO eller frikjøling. Ukjent status kan ikke
  tolkes som av og gir ingen betjeningshandling.
- **Klokkeslett:** velg start eller slutt og trykk Bruk. Native klokkevelgere
  følger nettleserens visning; verdien sendes som time og minutt fra valgt tid.
- **Viftenivå:** velg et av alternativene HA leverer, og trykk Bruk. Kortet
  oversetter ikke Lav/Normal/Høy til egne registerverdier.

Ulagrede valg beholdes ved vanlige HA-oppdateringer. Ved endring av kortets
konfigurasjon tømmes utkastene. Meldingen **Innstilling sendt** betyr at
tjenestekallet er sendt, ikke at den viste verdien er korrigert lokalt.
Avlesningene endres først når HA rapporterer nye verdier. Ved feil beholdes
utkastet, og en feilmelding vises. Nye innsendinger blokkeres mens et kall pågår.

Klokkeslett lagres via to separate number-entiteter. Begge verdier valideres
før sending, men oppdateringen er ikke atomisk. Hvis bare ett kall lykkes,
viser kortet dette tydelig og gjør ingen automatisk tilbakerulling.

## Datagrunnlag og avgrensning

Betjening bruker bare `number.set_value`, `select.select_option` og eksplisitte
`switch.turn_on` / `switch.turn_off` på de valgte entitetene. Howard-integrasjonen
eier fortsatt Modbus. Kortet poller ikke selv, lager ingen helpers og oppretter
ingen sensorer, automasjoner eller bakgrunnsstyring.

Temperatursettpunktet er integrasjonens number-entitet for tilluftsettpunkt.
Rapportert reguleringstype vises separat; verdien gjøres ikke om til et eget
romsettpunkt. Målte tillufts-/avtrekkstemperaturer finnes i Cockpit.
Sesong for behovsstyring forklares under Auto i Status og forklaringer.
ECO-senkingen forklares under ECO; eksemplet er ikke en beregnet regulatorgrense.

Modusvarigheter finnes i Kontrollpanel bak **Varigheter**, ved siden av Ferie.
Ildsted er en sensor i referanseintegrasjonen og vises derfor uten redigering.
Boost, Party, Borte og Ferie kan redigeres via native number-entiteter.
Endring av varighet starter ingen modus. Valgene bruker utkast og **Bruk**.

Filterskift registreres og filterperioden endres på aggregatets betjeningspanel.
Innstillinger har ingen filterbetjening. Cockpit beholder filtervarsler, og
Filter-forklaringen beholder rapportert intervall og tidsopplysninger.
Det legges ikke inn Stopp- eller Filter byttet-knapper.

Integrasjonsversjonen leses bare fra attributtene `installed_version` og
`latest_version` i den valgte update-entiteten. Kildekodeversjonen hos Howard
eller denne kortpakkens versjon brukes ikke som bevis for installert versjon.
Manglende opplysninger merkes som ikke oppgitt. En tilgjengelig sensorverdi
er ikke alene en test av Modbus-forbindelsen. Det foretas ingen oppdatering
av integrasjonen fra dette kortet; mer-info-knappen åpner HAs egen visning.

## Overgang fra Service/diagnose

Baseline for innholdsgjennomgangen var HA-diagnose.txt 4.8.3 fra 2026-10-21.
Dette er ikke en eksport av gjeldende Lovelace-oppsett. De gamle YAML-kortene
eller lokale HA-filene endres ikke av pakken.

1. Oppdater kortpakken og legg til Innstillinger som et nytt kort.
2. Kontroller alle entitetskoblinger, native grenser og visninger i egen HA.
3. Velg de nye kildene i eksisterende Status og forklaringer. Eldre ECO/TRIAC
   kan leses under Teknisk grunnlag. Trykkvakt og sentralstøvsuger er skjult
   som standard og aktiveres bare når relevante for installasjonen.
4. Behold det gamle Service-kortet til funksjonene er gjennomgått. Fjern det
   deretter fra dashboardet hvis det er erstattet. Entiteter slettes separat
   først etter kontroll av andre brukere.

Cockpit er uendret bortsett fra pakkeversjonen. Kontrollpanelets tidligere
modusbetjening og entitetskart beholdes, med Varigheter som nytt felt.
Kontroller varighetskoblingene i Kontrollpanelet: egne navn fra Innstillinger
flyttes ikke automatisk mellom kort. Gamle fjernede Innstillinger-koblinger
kan bli liggende i lagret YAML, men vises ikke og kan ikke skrives fra kortet.
De kan ryddes manuelt uten å slette HA-entitetene.
Tidligere lokale termiske estimater blir ikke gjeninnført bare fordi de fantes
i Service-kortet. Huslast beregnes fortsatt i forklaringskortet uten egen historikk.

## Fordeling av tidligere Service/diagnose-innhold

| Tidligere gruppe | Plass i kortpakken |
|---|---|
| Alarmer og filter | Cockpit-varsler og Filter-forklaring; registrering/intervall på aggregatets panel. |
| Drift og modus | Cockpit/Kontrollpanel; regulering i Temperatur, behovssesong i Auto-forklaring. |
| Temperatur og fukt | Cockpit og relevante forklaringer; settpunkt i Innstillinger. |
| Luftmengde og RPM | Uendret Cockpit og forklaringer med kildehistorikk. |
| Frikjøling | Aktivitet og diagnose i forklaringen; native innstillinger i Innstillinger. |
| ECO og ettervarme | Status/pådrag i forklaringene; gamle signaler under Teknisk grunnlag; ECO-valg/offset i Innstillinger. |
| Termiske estimater | Huslast beholdes som kortberegning; tidligere lokale estimater gjenopprettes ikke automatisk. |
| Elektrisk effekt/energi | Valgfrie målte kilder i Elektrisk-forklaringen. |
| Tidsstyrte moduser | Kontrollpanel; native varigheter bak Varigheter ved siden av Ferie. |
| Eksterne innganger | Hette beholdes; trykkvakt og støvsugermodus er valgfrie emner. |
| Integrasjonsoppdatering | Opplysninger og native mer-info under System. |

## English quick guide

Add `custom:vsr300-settings-card` after updating the existing HACS package.
Map each entity in the native visual editor and clear unused optional fields.
The three sections cover temperature/ECO, free cooling and system information.
Mode durations are edited through Varigheter in the control card. Verify its
duration bindings; custom mappings are not copied between separate cards.
Supply/extract readings remain in Cockpit; filter registration/intervals belong
on the unit panel. Old retired settings fields are ignored as write targets. Number bounds/steps
and select choices come from HA. Numeric/time/select drafts require Apply;
switches act directly on known binary states. Reported values are never
optimistically replaced. Partial time-write failure is explicit. This is a
frontend for existing integration services, with no separate Modbus owner.

![Innstillinger med simulerte HA-verdier](images/settings-mobile-simulated.png)

![Modusvarigheter i Kontrollpanel med simulerte HA-verdier](images/control-durations-simulated.png)
