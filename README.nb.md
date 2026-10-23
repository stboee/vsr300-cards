# VSR300 Cards – installasjon

To Home Assistant-kort for Systemair SAVE VSR300: **Systemair SVG** og
**Systemair Kontrollpanel**, med grafisk valg av entiteter. Kortversjon: **1.1.1**.
Referanseoppsettet er HA 2026.10.2 og
[Howard systemair_modbus 1.3.0](https://github.com/Howard0000/home-assistant-systemair-modbus).

## Manuell installasjon

1. Last ned [vsr300-cards.js](vsr300-cards.js) med GitHubs **Download raw file**-knapp.
2. Kopier filen til `/config/www/vsr300/vsr300-cards.js` i Home Assistant. Opprett mappen `vsr300` ved behov.
3. Legg til en dashboardressurs med URL **`/local/vsr300/vsr300-cards.js?v=1.1.1`** og type **JavaScript-modul**.
4. Last nettlesersiden helt på nytt. Rediger dashboardet og legg til **Systemair SVG** og **Systemair Kontrollpanel** fra kortvelgeren.
5. **Tilpass entitetskoblingene i begge kort.** Åpne **Entitetskoblinger**, kontroller hvert felt og bytt eksempelnavnene til tilsvarende entiteter i din egen Home Assistant-installasjon. Tøm valgfrie felt du ikke bruker.

Komplette YAML-oppsett ligger i [01-SVG.yaml](examples/01-SVG.yaml) og
[02-Kontrollpanel.yaml](examples/02-Kontrollpanel.yaml). **Bruker du disse
oppsettene, må du også kontrollere og tilpasse alle entitets-ID-er under
`entities:` før kortene tas i bruk.** Navnene er eksempler fra én installasjon.
Selve frontendfilen krever ingen omstart av Home Assistant.

## Oppdatering

Bytt JavaScript-filen, endre versjonstillegget i ressursadressen til å samsvare
med filen, og last nettlesersiden helt på nytt, også på mobilen. Behold
kortoppsettene og entitetsvalgene.

Ved oppdatering fra 1.0.0 velger du de valgfrie **A-alarm**, **B-alarm** og
**C-alarm** i SVG-editoren dersom disse samlealarmene skal vises.

## Valg og verdier

- Animasjoner: **På** (standard), **Auto – følg enheten** eller **Av**. På animerer også når enheten ber om redusert bevegelse; Auto følger enhetens valg.
- Overskrifter er skjult som standard. **Vis overskrift** aktiverer egen overskrift.
- Resttid telles ned lokalt hvert sekund mellom integrasjonens rapporteringer og synkroniseres med nye rapporter. Dette er en beregnet visning; aktiv modus kommer fortsatt fra integrasjonen.
- `≈` markerer integrasjonens estimerte luftmengde. **Vekslerpådrag** er et pådrag, ikke målt virkningsgrad. Ettervarme vises i prosent, uten wattestimat.
- Hvert aktivt tilkoblet alarmsignal får egen rad. A/B/C er samlealarmer og kan overlappe andre indikasjoner.
- Luftveiene og animasjonene er skjematiske. Forklaringer-kortet holdes lokalt og er utenfor pakken.

[Entitetskart](ENTITETSKART.md) · [Endringslogg](CHANGELOG.md) ·
[Verifikasjon og begrensninger](VERIFIKASJON.md) · [Kilder](SOURCES.md) · [MIT-lisens](LICENSE)
