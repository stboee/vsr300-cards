# Status og forklaringer – 1.7.0

Det tredje kortet i samme pakke som SVG og Kontrollpanel:

```yaml
type: custom:vsr300-explanations-card
```

Oppdater pakken gjennom HACS, last nettlesersiden helt på nytt og legg til
**Systemair Status og forklaringer** fra kortvelgeren. De to andre kortene
beholder eksisterende oppsett. Et komplett eksempel ligger i
[03-Status-og-forklaringer.yaml](examples/03-Status-og-forklaringer.yaml).

## Frikjølingskandidat i 1.7.0

Kandidatvurderingen beregnes nå i kortet. Behold døgnmaks-sensoren, og velg
alle fire tidsentiteter i tillegg til temperaturer og grenser. Rapporterte
statuser har prioritet. Manglende gyldig grunnlag vises som ukjent.
Den tidligere `free_cooling_diagnosis`-koblingen ignoreres og kan fjernes.
Se [komplett sensordefinisjon og overgang](FREE-COOLING.md).

## Oppsett

Åpne kortets grafiske editor og kontroller **Entitetskoblinger**. Startverdiene
er eksempler fra referanseinstallasjonen, også for valgfrie lokale sensorer.
Bytt til dine entiteter og tøm valgfrie felt du ikke bruker.

- **Vis overskrift:** på som standard for dette kortet. Tittel kan endres.
- **Vis entitets-ID-er i forklaringene:** valgfri kildevisning under verdiene.
- **Grense for markering av estimert ubalanse:** 15 m³/h som standard. Grønn
  markering betyr at differansen mellom luftmengdeestimatene er mindre enn
  grensen; det er ikke en måling av fysisk balanse eller trykk.
- Statusfeltene vises i tre kolonner, også på mobil. Teksten kan brytes over
  flere linjer og beholder samme skriftstørrelse.

## Endringer i 1.4.1

Filter-emnet og dets fire kildefelt er tatt ut. Filteralarmer og grafikk beholdes
uendret i Cockpit. Gamle `show_filter`-valg og Filter-koblinger i dette kortet
brukes ikke. Ikke fjern Cockpits filterkoblinger.

Veksler viser **Velg entitet** når koblingen er tom, **Entitet ikke funnet**
ved en manglende entitet, og **Pådrag ukjent** ved en eksisterende kilde uten
numerisk verdi. Velg samme **Vekslerpådrag (%)**-entitet som i Cockpit, hvis begge
kort brukes. Kortene lagrer koblingene hver for seg. Eksisterende oppsett fylles
ikke med en gjettet kilde. Null vises som 0 %, og kilden kan åpnes i HA.

## Presiseringer i 1.4.0

- Temperaturstyring forklarer regulering etter tilluft, egen romføler og avtrekk.
- Behovsstyringens Sommer/Vinter-status forklares under Auto, med egne
  sesongsettpunkt for relativ luftfuktighet. Den betyr ikke at ettervarmen er på.
- ECO forklarer senking av ettervarmegrensen. Eksemplet 20 °C minus 5 °C er en
  prinsippforklaring, ikke en beregnet faktisk regulatorgrense.

## Historikk – emner og teknisk grunnlag i 1.3.0

De tre nye emnene kan skjules enkeltvis i grafisk editor. Valgfrie eksterne
funksjoner aktiveres bare når de er relevante. Eldre ECO-status og TRIAC-råsignal
vises under Teknisk grunnlag i de respektive forklaringene. Disse bruker egne
valgbare kilder og erstatter ikke de vanlige statusene eller pådragsprosenten.

Eksisterende lagrede entitetskart overstyres ikke. Nye kildefelt som mangler i et
gammelt oppsett forblir tomme og må velges i editoren. Ingen endring av lokale
HA-filer er nødvendig for å vise de nye integrasjonskildene.

## Hva kortet gjør selv

De ti standardfeltene er Balanse, Frikjøling, ECO, Hette, Ettervarme,
Elektrisk, Huslast, Auto-styring, Temperatur og Veksler. Temperatur åpner
forklaringen Temperaturstyring. Trykkvakt og Sentralstøvsuger er valgfrie og
skjult som standard. Entitetens tilstedeværelse beviser ikke tilkoblet utstyr. Trykk på et felt for å lese forklaringen og se relevante
verdier. Trykk på det samme feltet igjen for å lukke teksten, eller på et annet
felt for å bytte forklaring. **Lukk** nederst skjuler også forklaringen.
Menyvalget gjelder hvert kort for seg,
beholdes ved vanlige HA-oppdateringer og starter skjult ved ny sideinnlasting.
Valget sender ingen kommando til HA eller aggregatet.

### Klikk på entiteter i forklaringen

Trykk på en rad i tabellen **Relevante verdier** for å åpne den valgte
entitetens vanlige HA-vindu med tilgjengelig historikk. Navn, verdi og eventuell
synlig entitets-ID tilhører samme trykkfelt. Enter og mellomrom fungerer også.
Forklaringen beholdes åpen, og entitetskoblingene i editoren brukes videre.

Dette gjelder integrasjonsentiteter og eventuelle valgte lokale eller målte
kilder. En eksisterende entitet med ukjent/utilgjengelig verdi kan fortsatt
åpnes; en entitet som ikke finnes vises som ukjent uten klikkhandling.
Tømte valgfrie koblinger utelates som før. Historikken avhenger av hva HA har
lagret. Kortet henter ikke egen historikk eller oppretter nye entiteter.

Huslast beregnes i kortet og har ingen egen historikk. Radene i forklaringen
åpner temperaturene, luftmengden og frikjølingsstatusen som ligger til grunn.
Menyfeltene øverst fortsetter å åpne/lukke forklaringer, og **Lukk** nederst
beholdes. Et trykk på en entitetsrad sender bare en mer-info-handling.

Kortet beregner følgende fra de valgte integrasjonsentitetene:

| Visning | Datagrunnlag | Betydning |
|---|---|---|
| Balanse | Estimert tilluftmengde minus estimert avtrekksmengde | Differanse mellom estimater, ikke målt balanse |
| Huslast | `0,335 × tilluft m³/h × (avtrekk °C − tilluft °C)` | Termisk effektestimat i W |

Positiv Huslast merkes **tap** når frikjøling rapporteres inaktiv, og **kjøl**
når den rapporteres aktiv. Negativ verdi merkes **varme**. Ved ukjent
frikjølingsstatus vises positivt effektestimat uten å anta hensikten.
Manglende beregningsgrunnlag vises som ukjent. Elektrisk effekt brukes ikke i
disse beregningene. °F konverteres til °C og l/s til m³/h når slike enheter er
oppgitt. Verdiene i HA er siste tilgjengelige avlesninger, ikke nødvendigvis
ett samtidig Modbus-uttak.

Det opprettes ingen HA-sensorer, historikk eller automasjoner for beregningene.
De finnes som visning i kortet. Ettervarme vises som rapportert prosent og
uavhengig varmestatus, uten wattberegning. Auto-styring viser rapportert
styrekilde, uten å oversette den til Lav/Normal/Høy.

## Valgfrie kilder

| Kilde | Bruk og begrensning |
|---|---|
| Målt elektrisk effekt | Egen HA-effektsensor, for eksempel fra Shelly. W og kW støttes. Uten måler vises Elektrisk som ikke tilgjengelig; en prosentverdi erstatter ikke målingen. |
| Målt energi | Vises blant de relevante verdiene når en energisensor er valgt. Kortet beregner ikke energi fra et øyeblikksbilde av effekt. |
| Frikjøling – rapportert tilstand | Valgfri native diagnostikk fra integrasjonen, blant annet Dagfase og Temperaturer usikre. |
| Frikjøling – temperaturer pålitelige | Separat rapportert diagnostikk. Ukjent verdi behandles ikke som av. |
| Frikjølingskandidat | Beregnes i kortet fra temperaturer, grenser, tid og døgnmaks. Merkes **Beregnet i kortet**. Ingen kandidat-sensor kreves. |
| Utetemperatur – maks siste 24t | Eksisterende HA-statistikksensor til kandidatvurderingen. Kortet henter ingen historikk. Se [definisjon](FREE-COOLING.md). |
| Frikjøling – start-/sluttime og minutt | Fire number-entiteter fra integrasjonen. Velg samme kilder som i Innstillinger. Tidsvinduet bruker HA-installasjonens tidssone. |

Rapportert frikjølingsaktivitet har prioritet i statusfeltet. Deretter brukes
kjente native diagnoser, og deretter kortets kandidatvurdering. Denne er en
lokal tolkning, ikke en avlest begrunnelse fra firmware. Mangler nødvendige
kilder, vises kandidatvurderingen som ukjent. Rapportert aktivitet, tillatelse
og eventuell diagnostikk kan fortsatt leses separat i forklaringen.

## Overgang fra det gamle YAML-kortet

1. Legg til det nye kortet og kontroller entitetskoblingene og visningen.
2. Erstatt det gamle Status og forklaringer-kortet når oppsettet er bekreftet.
3. Det nye kortet bruker ikke `input_select.systemair_valgt_forklaring`,
   `sensor.systemair_ventilasjonslast_hus` eller `custom:button-card`.
   Disse kan fortsatt ha andre brukere i HA; kontroller øvrige referanser før
   eventuell opprydding. Pakken sletter eller endrer ingen HA-konfigurasjon.

Fra 1.7.0 kreves ikke den gamle kandidat-sensoren. Følg
[overgangsveiledningen](FREE-COOLING.md) før du fjerner template-blokken selv.
Behold døgnmaks-sensoren og alle øvrige funksjoner som fortsatt brukes.

## English quick guide

Add **Systemair Status og forklaringer** after updating the existing HACS
package. Configure every entity you use in the native visual editor; clear
unused optional fields. The original topics, explanations and source readouts
are retained from the maintainer's supplied card. Selection is local to each
card: tap the selected tile again to close it, or use Close below the text.
The tiles keep three columns on mobile without smaller font sizes. Version 1.3.0
adds temperature regulation, recovery output and filter topics. Optional external
functions default to hidden; older ECO/TRIAC signals have expandable technical rows.
Existing saved mappings are not backfilled with installation-specific defaults.
Tap any entity row in an explanation to open its mapped HA entity and available
history. The label, value and optional source ID share one native button,
including keyboard support. The explanation stays open. Missing entities have
no action; existing unavailable entities remain inspectable. Card-local house
load has no separate history; its underlying source rows can be opened.
House load is calculated from native integration values. No helper,
button-card dependency or local house-load entity is required. The optional
24-hour maximum and measured electrical power remain external HA inputs.
From 1.7.0 the card calculates free-cooling candidacy itself. The old candidate
sensor is no longer used; select the four new time bindings and retain the
24-hour maximum. See [setup and migration](FREE-COOLING.md). Check other
consumers before removing any old helpers or templates.

Filter-emnet som ble innført i 1.3.0 er fjernet fra forklaringskortet i 1.4.1.
