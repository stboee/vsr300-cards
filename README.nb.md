# VSR300 Cards – installasjon

Fire Home Assistant-kort for Systemair SAVE VSR300: **Systemair SVG**,
**Systemair Kontrollpanel**, **Systemair Status og forklaringer** og det valgfrie
**Systemair Innstillinger**,
med grafisk valg av entiteter. Kortversjon: **1.5.0**.
Referanseoppsettet er HA 2026.10.2 og
[Howard systemair_modbus 1.3.0](https://github.com/Howard0000/home-assistant-systemair-modbus).

## Installer med HACS – egendefinert repository

1. Åpne trepunktsmenyen i HACS og velg **Egendefinerte repositorier / Custom repositories**.
2. Legg til **`https://github.com/stboee/vsr300-cards`**, velg type **Dashboard** (Plugin/Lovelace i eldre HACS-versjoner), og legg til repositoriet.
3. Åpne VSR300 Cards i HACS og last ned nyeste release.
4. Last nettlesersiden helt på nytt og legg til **Systemair SVG**, **Systemair Kontrollpanel** og eventuelt **Systemair Status og forklaringer** og **Systemair Innstillinger** fra kortvelgeren. Tilpass entitetene i alle kortene du bruker.

HACS registrerer dashboardressursen automatisk. Du trenger ikke legge den til
manuelt ved denne installasjonsmetoden.

Ved overgang fra manuell installasjon fjerner du den gamle ressursen
`/local/vsr300/vsr300-cards.js?...`, slik at kortene bare lastes én gang gjennom
HACS. Behold eksisterende kortoppsett.

## Manuell installasjon

1. Last ned [vsr300-cards.js](vsr300-cards.js) med GitHubs **Download raw file**-knapp.
2. Kopier filen til `/config/www/vsr300/vsr300-cards.js` i Home Assistant. Opprett mappen `vsr300` ved behov.
3. Legg til en dashboardressurs med URL **`/local/vsr300/vsr300-cards.js?v=1.5.0`** og type **JavaScript-modul**.
4. Last nettlesersiden helt på nytt. Rediger dashboardet og legg til kortene du ønsker fra kortvelgeren.

## Oppsett av kortene

**Tilpass entitetskoblingene i alle kortene du bruker, uansett installasjonsmetode.** Åpne
**Entitetskoblinger**, kontroller hvert felt og bytt eksempelnavnene til
tilsvarende entiteter i din egen Home Assistant-installasjon. Tøm valgfrie felt
du ikke bruker.

Komplette YAML-oppsett ligger i [01-SVG.yaml](examples/01-SVG.yaml),
[02-Kontrollpanel.yaml](examples/02-Kontrollpanel.yaml) og
[03-Status-og-forklaringer.yaml](examples/03-Status-og-forklaringer.yaml). **Bruker du disse
oppsettene, må du også kontrollere og tilpasse alle entitets-ID-er under
`entities:` før kortene tas i bruk.** Navnene er eksempler fra én installasjon.
Selve frontendfilen krever ingen omstart av Home Assistant.

## Oppdatering

Hvis installasjon av 1.3.0 feiler med melding om manglende `hacs.json`, oppdaterer
du repositoryinformasjonen i HACS og velger **1.3.1 eller nyere**. Denne versjonen
inneholder den manglende installasjonsfilen. Behold kortene og entitetsvalgene dine.

**HACS:** Installer tilbudt oppdatering i HACS og last nettlesersiden helt på
nytt, også på mobilen. HACS håndterer filen og ressursversjonen; du trenger ikke
endre versjonstillegget manuelt. Behold kortoppsettene og entitetsvalgene.
Vises ikke releasen ennå, velger du **Oppdater informasjon / Update information**
i repositoriets meny og laster deretter ned oppdateringen.

**Manuelt:** Bytt JavaScript-filen, endre versjonstillegget i ressursadressen
til å samsvare med filen, og last nettlesersiden helt på nytt. Behold oppsettene.

Ved oppdatering fra 1.0.0 velger du de valgfrie **A-alarm**, **B-alarm** og
**C-alarm** i SVG-editoren dersom disse samlealarmene skal vises.

## Legg til forklaringskortet etter oppdatering

Oppdateringen legger ikke automatisk til et kort i dashboardet. Velg **Systemair
Status og forklaringer** i kortvelgeren, eller bruk:

```yaml
type: custom:vsr300-explanations-card
```

Kontroller entitetskoblingene. Startverdiene er eksempler, også for de valgfrie
lokale diagnose- og effektmålerentitetene. Tøm valgfrie felt du ikke bruker.
Behold det gamle YAML-kortet til oppsettet i det nye er kontrollert, og erstatt
så det gamle kortet. SVG- og Kontrollpanel-oppsettene beholdes.

## Endringer i 1.5.0

Kontrollpanel, Status og forklaringer og Innstillinger har fått et felles visuelt
uttrykk med nøytrale flater, tydelige rammer og samme knapper. Cockpit beholder
sin eksisterende grafikk og fargebruk.

| Farge | Betydning |
| --- | --- |
| Nøytral | Vanlige knapper, verdier og inaktiv funksjon |
| Blå | Valgt modus, åpnet felt og betjening |
| Grønn | Egen markering for rapportert aktivitet |
| Ravgul | Manglende nødvendig informasjon, usikre data eller avvik mellom luftmengdeestimatene |
| Rød | Rapportert konfigurasjonsfeil eller mislykket tjenestekall |

Tekst og symboler følger fargene. Prosent og watt er nøytrale måle-/pådragsverdier;
normal ettervarme er ingen rød alarm. Grønt betyr rapportert aktivitet, ikke
bekreftet virkningsgrad eller fysisk balanse. Blå «På» i Innstillinger gjelder
konfigurasjon; aktiv drift rapporteres separat.

Begge HA-temaer støttes, også når tema byttes uten nye entitetsverdier.
Tre kolonner på mobil, historikk, innstillinger, varigheter og eksisterende
entitetskoblinger videreføres. Oppdater i HACS og last nettleseren helt på nytt;
det er ikke nødvendig å legge inn kortene eller entitetene på nytt.

## Historikk – 1.4.1

Varigheter i Kontrollpanel åpner først fem kompakte modusvalg med gjeldende tid.
Velg en modus for å åpne bare dens varighetsfelt; nytt trykk lukker feltet.
Dette starter ingen modus. Lukking av hele panelet nullstiller valget og
beholder eventuelle utkast.

Innstillinger har nå bare Temperatur og ECO samt Frikjøling. System er fjernet.
Filter er fjernet fra Status og forklaringer. Cockpit beholder filtergrafikk og alarmer.

**Veksler viser ukjent?** Kortene lagrer koblingene hver for seg. Velg samme
**Vekslerpådrag (%)**-entitet i forklaringskortets editor som i Cockpit.
Et tomt felt viser nå **Velg entitet**. En entitet som ikke finnes skilles fra
ukjent/utilgjengelig måleverdi. Kortet gjetter ingen kilde eller prosent.

## Historikk – 1.4.0

**Varigheter** ved siden av Ferie i Kontrollpanel åpner fire justerbare
modusvarigheter. Å åpne/lukke feltet starter ingen modus. Ildsted forblir en
avlesning inntil integrasjonen tilbyr en justerbar entitet. Kontroller de fem
varighetskoblingene i Kontrollpanelets editor. Egne koblinger fra Innstillinger
flyttes ikke automatisk mellom kortene.

Innstillinger inneholder nå temperatur/ECO, frikjøling og systemopplysninger.
Tillufts-/avtrekkstemperatur blir i Cockpit. Filterskift og intervallendringer
håndteres på aggregatets panel; varsler beholdes i Cockpit. Den tidligere Filter-forklaringen ble fjernet i 1.4.1.
Sesong for behovsstyring forklares under Auto. Temperaturregulering og ECO-senking
av ettervarmegrensen har fått tydeligere forklaringer.

Behold kortoppsettene. Gamle ubrukte Innstillinger-felt kan ligge igjen i YAML,
men vises ikke eller brukes som skrivemål. Se [overgangsveiledningen](SETTINGS.md).

## Historikk – 1.3.0

Cockpit og Kontrollpanel beholder kode og oppsett. Status og forklaringer får
Temperaturstyring, Veksler og Filter; trykkvakt og sentralstøvsuger er valgfrie og
skjult som standard. Eldre ECO/TRIAC-signaler ligger under Teknisk grunnlag.
Eksisterende entitetskart beholdes: velg de nye kildene i editoren, eller skjul
emner du ikke bruker. Manglende nye koblinger vises som ukjent.

Legg til **Systemair Innstillinger** fra kortvelgeren, eller bruk:

```yaml
type: custom:vsr300-settings-card
```

Kortet samler temperatur/ECO og frikjøling. Behold
det gamle Service-kortet til koblinger og betjening er bekreftet. Se
[Innstillinger og overgang](SETTINGS.md) og [komplett YAML](examples/04-Innstillinger.yaml).

## Klikk på verdier i SVG-kortet

Trykk på en verdirad for å åpne den valgte entitetens vanlige HA-vindu med
tilgjengelig historikk. Hele raden er et trykkfelt. Entitetskoblingene i kortets
grafiske editor brukes også her; det kreves ingen nye helpers eller oppsett.

| Område | Separate trykkfelt |
|---|---|
| Inntak | Utetemperatur og eventuell utendørs luftfuktighet |
| Tilluft | Temperatur, estimert luftmengde og RPM |
| Avkast | Estimert luftmengde og RPM |
| Avtrekk | Temperatur og luftfuktighet |
| Veksler / aktiv frikjøling | Vekslerpådrag eller rapportert frikjølingsstatus |
| Ettervarme | Symbol/tekst åpner aktiv-status; prosentverdien åpner pådrag |
| Viftesymboler | RPM for den tilhørende viften |
| Filtre | Aktiv filteralarm har prioritet foran filtervarsel; ved normal status åpnes filteralarmen |
| Modusfelt | Rapportert modus og rapportert resttid åpnes separat |
| Alarmrader | Hver rad åpner sin tilhørende alarm- eller varselentitet |

Historikken kommer fra HA og avhenger av hva som er lagret der. Luftmengden er
fortsatt estimert, og vekslerpådrag er ikke virkningsgrad. Resttidens HA-historikk
viser integrasjonens rapporteringer, mens kortet teller jevnt ned lokalt mellom
rapportene. En utilgjengelig entitet kan åpnes dersom den finnes i HA; en tom
eller manglende entitetskobling får ingen klikkhandling. Tab, Enter og mellomrom
kan også brukes. Trykkfeltene sender ingen styringskommando til aggregatet.

Sideboksene er høyere, med mer avstand mellom verdiene. Topp-/bunnjustering,
SVG-ens totale bredde og skriftstørrelser er beholdt.

## Valg og verdier

- Bakgrunnen rundt aggregatet og modusfeltet følger det aktive HA-temaet. Aggregat og veksler har mørke flater med lys tekst i både lyst og mørkt tema. Luftportenes og alarmenes farger beholder betydningen.
- Viftenes rpm står i høyere informasjonsbokser for Tilluft og Avkast. Inntak og Avkast flukter med aggregatets overkant; Tilluft, Avtrekk og aggregatet har felles underkant. Ettervarmeprosenten er større, og Vekslerpådrag står på én linje. Filtersymboler og varselmerker beholdes uten separate FILTER-tekster.
- Animasjoner: **På** (standard), **Auto – følg enheten** eller **Av**. På animerer også når enheten ber om redusert bevegelse; Auto følger enhetens valg.
- SVG og Kontrollpanel skjuler overskriften som standard. Forklaringskortet viser sin overskrift som standard. **Vis overskrift** og tittelfeltet tilpasses per kort.
- Resttid telles ned lokalt hvert sekund mellom integrasjonens rapporteringer og synkroniseres med nye rapporter. Dette er en beregnet visning; aktiv modus kommer fortsatt fra integrasjonen.
- `≈` markerer integrasjonens estimerte luftmengde. **Vekslerpådrag** er et pådrag, ikke målt virkningsgrad. Ettervarme vises i prosent, uten wattestimat.
- Hvert aktivt tilkoblet alarmsignal får egen rad. A/B/C er samlealarmer og kan overlappe andre indikasjoner.
- Luftveiene og animasjonene er skjematiske.
- **Status og forklaringer** har ti statusfelt som standard, med to valgfrie eksterne funksjoner og forklaringer, lokalt menyvalg (nytt trykk på samme felt lukker teksten), tre kolonner også på mobil, beregnet Huslast og valgfri effektmåling. Det krever verken input_select-hjelper eller button-card. Lokal frikjølingsdiagnose og døgnmaksimum er valgfrie eksisterende HA-kilder som skilles fra integrasjonens rapportering. Trykk på verdiradene i forklaringene for å åpne tilhørende HA-entitet og tilgjengelig historikk. Se [kortet og overgangen fra YAML](EXPLANATIONS.md).

[Entitetskart](ENTITETSKART.md) · [Endringslogg](CHANGELOG.md) ·
[Verifikasjon og begrensninger](VERIFIKASJON.md) · [Kilder](SOURCES.md) · [MIT-lisens](LICENSE)
