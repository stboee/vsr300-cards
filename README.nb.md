# VSR300 Cards – norsk veiledning

Versjon **1.1.0**, 2026-10-22. To selvstendige kort med grafisk editor:

- **Systemair SVG** – prosessillustrasjon, temperaturer, estimert luftmengde,
  turtall, pådrag, filterstatus og rapportert resttid.
- **Systemair Kontrollpanel** – modusknapper og innstilte varigheter.

[Hoveddokumentasjon med skjermbilder](README.md) · [Entitetskart](ENTITETSKART.md) ·
[Verifikasjon](VERIFIKASJON.md) · [Endringslogg](CHANGELOG.md)

## Forutsetninger og status

Referanseoppsettet er **Home Assistant 2026.10.2** og **Howard systemair_modbus
1.3.0**. HACS-manifestet setter konservativt HA 2026.10.2 som minsteversjon.
Andre versjoner og aggregatmodeller er ikke systematisk kontrollert.

Integrasjonen må være satt opp først. Den er eneste Modbus-eier. Kortene bruker
bare HA-tilstander og eksisterende HA-tjenester. De trenger ingen lokale
templates, helpers, Node-RED, button-card eller card-mod. Utendørs luftfuktighet
kan hentes fra en valgfri separat føler.

Lokale kontroller med simulerte verdier er gjennomført. Prosjekteieren har meldt
at første utprøving av 1.0.0-kortene i HA fungerer. 1.1.0 er ennå ikke kontrollert
på faktisk Pixel 8 Pro eller i brukerens HA. Full gjennomgang av
editor, betjening og installasjon gjennom HACS gjenstår. Skjermbildene i README
er fra simulering og bruker plassholderikoner.

## Installasjon gjennom HACS

Repositoryet er tilrettelagt som **egendefinert Dashboard-repository**. Det er
ikke meldt inn til HACS' standardkatalog.

1. Åpne HACS → ⋮ → **Custom repositories / Egendefinerte repositorier**.
2. Legg inn `https://github.com/stboee/vsr300-cards`.
3. Velg typen **Dashboard** og legg til.
4. Åpne **VSR300 Cards** i HACS og last ned. Inntil en GitHub-utgivelse er
   publisert, brukes standardgrenen `main`.
5. Kontroller dashboardressursen i HA:
   - URL: `/hacsfiles/vsr300-cards/vsr300-cards.js`
   - Type: **JavaScript-modul**.
   Behold eventuelt versjonstillegg som HACS setter i URL-en.
6. Last nettlesersiden på nytt og legg til kortene.

### Hvis du allerede har lagt inn kortene manuelt

Behold kortoppsettene og entitetsvalgene. Når filen er lastet ned gjennom HACS,
bytter du den gamle `/local/vsr300/vsr300-cards.js?...`-ressursen til HACS-
ressursen. Ha én aktiv ressurs for denne pakken. Foreta deretter en full
sideoppdatering i nettleserne som brukes til dashboardet.

## Manuell installasjon

1. Last ned `vsr300-cards.js` fra repositoryet med **Download raw file**.
2. Legg filen i `/config/www/vsr300/vsr300-cards.js` i Home Assistant.
3. Registrer dashboardressursen:
   - URL: `/local/vsr300/vsr300-cards.js?v=1.1.0`
   - Type: **JavaScript-modul**.
4. Last nettlesersiden på nytt.

Selve frontendressursen krever ingen HA-omstart eller backendendring.

## Legg til kortene og velg entiteter

Velg **Legg til kort** og deretter **Systemair SVG** eller **Systemair
Kontrollpanel**. Åpne **Entitetskoblinger** i den grafiske editoren og velg egne
integrasjonsentiteter. Entitetsnavnene som ligger inne fra start, kommer fra
referanseoppsettet og kan avvike hos andre.

Alternativt kan disse minimale oppsettene brukes i hvert sitt manuelle kort:

```yaml
type: custom:vsr300-svg-card
```

```yaml
type: custom:vsr300-control-card
```

Komplette startoppsett ligger i `examples/01-SVG.yaml` og
`examples/02-Kontrollpanel.yaml`. `examples/default-entities.json` er en referanse
til startkoblingene og skal ikke legges inn som egen HA-konfigurasjon.

Et lagret `entities:`-oppsett er autoritativt. Tomme eller utelatte felt i dette
oppsettet fylles ikke automatisk med startverdier. Bruk editoren til å velge
manglende koblinger. Ingen måleverdier erstattes med reserveverdier.

Utendørs RF, A/B/C-samlealarmene og de fem varighetsfeltene er valgfrie i SVG. Varighetsfeltene er
valgfrie i Kontrollpanel. Bruk enhetene editoren angir: minutter, timer og døgn.
Resttidssensoren må levere **sekunder**.

## Animasjoner og overskrifter

I SVG-kortets editor kan **Animasjoner** settes til:

| Valg | Virkning |
| --- | --- |
| **På – standard** | Vifter og luftstrøm animeres selv om enheten ber om redusert bevegelse. |
| **Auto – følg enheten** | Følger enhetens innstilling for redusert bevegelse. |
| **Av** | Begge animasjonene stoppes. |

I YAML brukes `animation: 'on'`, `animation: auto` eller `animation: 'off'`.
Behold anførselstegnene rundt `'on'` og `'off'`. Et eksisterende oppsett uten
animasjonsvalg får **På** som standard.

Begge kortene skjuler overskriften som standard, også når et eldre kortoppsett
inneholder «Systemair SVG» eller «Kontrollpanel». Egen overskrift kan aktiveres
med **Vis overskrift** i editoren. Den faste teksten under SVG-en er fjernet.

### Oppdatering fra 1.0.0

Bytt ressursfilen, oppdater versjonstillegget til `?v=1.1.0` ved manuell
installasjon og last nettlesersiden helt på nytt. Behold eksisterende
entitetskoblinger. Velg de tre nye **A-alarm**, **B-alarm** og **C-alarm** i SVG-
kortets editor for å få disse med. De legges ikke automatisk inn i et allerede
lagret `entities:`-oppsett. De komplette eksempeloppsettene inneholder
referanseoppsettets koblinger.

## Tolkning av verdiene

- Luftmengde er integrasjonens **estimat**, markert med `≈`.
- Gjenvinningsprosenten heter nå **vekslerpådrag** og er ikke målt virkningsgrad.
- Ettervarme vises som prosentpådrag og separat aktiv/inaktiv-status. Det
  beregnes ingen wattverdi.
- Avkasttemperatur vises ikke; en fysisk temperaturkilde er ikke verifisert.
- Resttid kommer fra integrasjonens countdown-sensor. Kortet trekker ikke fra
  tid etter nettleserklokken. Varighetsfeltene brukes bare for fremdriftslinjen.
- Luftveiene, animasjonene og «utenom veksler» er skjematiske illustrasjoner.
- Frikjøling følger integrasjonens signal. IR4111 er foreløpig ikke dokumentert
  i prosjektets Systemair-registerliste; lokal sammenligning med IR3102 gjenstår.
- Ukjente/utilgjengelige verdier blir ikke gyldige nullmålinger.

Filteralarm gir røde filtre med `!`; filtervarsel gir oransje filtre med `!`.
Uavklart inaktiv status gir nøytrale filtre med `?`. En kjent aktiv alarm eller
et kjent aktivt varsel beholdes synlig selv om det andre signalet mangler.
Markeringen gjelder felles filterstatus.

Under SVG-en vises **én linje per aktivt alarmsignal**, i rekkefølgen A, B, C,
filteralarm og filtervarsel. A/B/C er samlealarmer og oppgir ikke feilårsaken.
Flere linjer kan gjelde samme underliggende hendelse og er ikke et antall
uavhengige feil. Begge filterlinjene kan vises samtidig; filteralarm har fortsatt
prioritet i selve filtersymbolene. Tilkoblede signaler med ukjent status vises
nøytralt som ukjente. Tomme valgfrie alarmkoblinger gir ingen linje.

## Betjening og oppdateringer

Auto, Manuell, Lav, Normal, Høy, Ildsted, Boost, Party, Borte og Ferie bruker
integrasjonens eksisterende entiteter. Spesialmoduser krever bekreftelse.
Aktiv farge følger rapportert modus. Feil fra tjenestekall vises i kortet.
Stopp og Filter byttet finnes ikke som betjeningsknapper.

Ved HACS-oppdatering beholdes kortoppsettene og entitetskoblingene. Last ned
oppdateringen og last nettlesersiden på nytt. Ved manuell oppdatering byttes
JavaScript-filen, og versjonstillegget i ressurs-URL-en oppdateres.

Forklaringer-kortet og lokale Diagnose-/Trendkort er utenfor denne pakken.
Versjonen står i kode og dokumentasjon, uten å ta plass i korttitlene.

## Lisens

[MIT](LICENSE), med repositoryets eksisterende opphavsrettsmerknad.
Se [SOURCES.md](SOURCES.md) for kildegrunnlag og avgrensning.
