# Free-cooling candidate / Frikjølingskandidat — 1.7.0

## English

Status og forklaringer calculates free-cooling candidacy in the browser from
the selected integration entities and one existing Home Assistant Statistics
sensor: the maximum outdoor temperature over a rolling 24 hours. It does not
query history, create helpers, poll Modbus or control ventilation.

Reported activity, disabled operation and known native diagnostics retain
priority. The calculated assessment is labelled **Beregnet i kortet**. It is
not the unit's internal decision. A rolling HA maximum is not documented as
identical to the firmware's daytime-temperature memory.

### Configure the maximum once

If `sensor.systemair_ute_max_siste_24t` already exists, keep it. Do not create
a duplicate. Otherwise, use Home Assistant's Statistics helper or the YAML
definition below. Choose the integration's outdoor-temperature entity as source,
`value_max` as characteristic, 24 hours as maximum age and precision 1.

The YAML is a **list entry**, for example in `/config/sensor/systemair_24h.yaml`
when that directory is already loaded through `!include_dir_merge_list sensor/`.
It must not be placed under `template:`. For a direct `sensor:` configuration,
append the entry to its existing list. Preserve existing configuration and do
not add a second identical `sensor:` key. Check the configuration before a
restart if adding the file for the first time.

```yaml
- platform: statistics
  name: "Systemair ute max siste 24t"
  unique_id: systemair_ute_max_siste_24t
  entity_id: sensor.systemair_save_utetemperatur
  state_characteristic: value_max
  max_age:
    hours: 24
  sampling_size: 1000
  precision: 1
```

Replace the source `entity_id` with your own integration entity. Check the
resulting Statistics sensor's actual entity ID and select it as **Utetemperatur
– maks siste 24t** in the explanations editor. `unique_id` does not force an
entity ID. A helper created through the UI may have a different ID.

Both `max_age` and `sampling_size` limit the stored samples. The example retains
the maintainer's existing 1000-sample configuration; it is not a universal
capacity guarantee. Check `age_coverage_ratio` near 1 and that
`buffer_usage_ratio` is not limiting the window. If necessary, increase the
sample limit or omit `sampling_size` so only `max_age` limits retention.
`source_value_valid` describes the latest source value, not every past sample.
Statistics uses an internal buffer, updates on source events and sample expiry,
and can restore history through Recorder at startup. The source must be recorded
for that history restoration. No per-second history request is introduced.

### Bind the candidate inputs

Keep your existing temperature and threshold selections. In the explanations
card, also select these four fields using your integration entities:

| Field | Reference-installation example |
|---|---|
| Start hour / Start time | `number.systemair_save_frikjoling_start_time` |
| Start minute / Start minutt | `number.systemair_save_frikjoling_start_min` |
| End hour / Slutt time | `number.systemair_save_frikjoling_slutt_time` |
| End minute / Slutt minutt | `number.systemair_save_frikjoling_slutt_min` |

These are the same sources used by Settings. Existing card mappings stay
authoritative; the four new bindings are not guessed or copied across cards.
They are prefilled only in a new card's presets and the complete YAML example.

The assessment requires outdoor maximum, daytime threshold, outdoor and extract
temperatures, both night limits, room cancellation threshold and all four time
values. Missing, unavailable, invalid or unsupported temperature-unit inputs
produce **Ukjent · Mangler datagrunnlag**, with an explanation. Native reported
activity remains visible even when candidate inputs are incomplete.

Checks retain the earlier order: day maximum below threshold, outdoor above
upper night limit, outdoor below lower night limit, extract at/below cancellation
threshold, outside the time window, then candidate. Values equal to the day or
night thresholds pass; equality to the room cancellation threshold blocks.
Cross-midnight windows are supported. Start is inclusive and end exclusive;
equal start/end gives an empty window. The clock uses `hass.config.time_zone`,
which must agree with the unit's clock. It refreshes locally at minute boundaries
and on relevant HA updates, and stops its timer when detached.

### Remove the old candidate template manually

1. Update through HACS and fully reload each browser.
2. Check the maximum, temperatures, limits and four time bindings. Open
   Frikjøling and check its reported and calculated sources.
3. Search your other cards, scripts and automations for
   `sensor.systemair_frikjoling_kandidat` before removing its definition.
4. Remove only the **Systemair frikjøling kandidat** template block from your
   own template file. Preserve other templates and the maximum sensor.
5. Reload template entities, or check configuration and restart HA. If a stale
   registry entity remains, remove it only after confirming its definition is
   gone and no other configuration uses it.

The package does not edit HA configuration or delete entities. The retired
`free_cooling_diagnosis` key in older card YAML is ignored and may be removed.
The maximum sensor remains required for the calculated assessment. Reported
statuses can still be viewed separately without a complete assessment.

## Norsk

Frikjølingskandidaten beregnes nå i **Status og forklaringer**, med
integrasjonens verdier og én lokal HA-statistikksensor for rullerende døgnmaks.
Kortet henter ingen historikk, oppretter ingen entiteter og sender ingen nye
Modbus-avlesninger eller styringskommandoer.

**Døgnmaks beholdes.** Hvis sensoren allerede finnes, trenger du ikke opprette
den på nytt eller endre filen. YAML-definisjonen ovenfor er den eksisterende
referansekonfigurasjonen. Tilpass kildens `entity_id` ved andre installasjoner.
Ved inkludert `sensor/`-mappe legges listen i for eksempel
`sensor/systemair_24h.yaml`; den hører ikke under `template:`. Behold eksisterende
include-oppsett. Alternativt kan samme beregning opprettes som Statistikks-hjelper
i HA: maksimum (`value_max`), 24 timer og én desimal. Kontroller faktisk entitets-ID
og velg denne i kortet. Ikke opprett både YAML-sensor og hjelper for samme formål.

1000 målinger er en buffergrense som virker sammen med 24-timersgrensen.
Kontroller `age_coverage_ratio` nær 1 og `buffer_usage_ratio`. Øk grensen eller
utelat `sampling_size` ved behov. Den sistnevnte løsningen lar bare `max_age`
begrense antallet lagrede målinger. `source_value_valid` bekrefter siste verdi,
ikke ubrutt datadekning. Recorder-historikk brukes ved oppstart når kilden er
lagret der; i vanlig drift brukes statistikkbufferen.

I **eksisterende forklaringskort** velger du de fire nye feltene for starttime,
startminutt, sluttime og sluttminutt. Bruk samme number-entiteter som i
Innstillinger; tabellen ovenfor viser referanseinstallasjonens navn. Eksisterende
koblinger overstyres ikke, og nye koblinger kopieres ikke mellom kort.

Rapportert aktivitet og kjent diagnostikk har prioritet. Kandidat, Venter tid,
Dag ikke OK, For varmt, For kaldt og Rom kaldt merkes **Beregnet i kortet**.
Vurderingen bruker samme temperaturrekkefølge og grenseulikheter som før.
Manglende nødvendig grunnlag gir **Ukjent · Mangler datagrunnlag** med årsak,
uten antatte temperaturer eller tider. Temperaturer i °F konverteres til °C.

Tidspunktet tolkes i HA-installasjonens tidssone, som må samsvare med aggregatets
klokke. Tidsvinduet kan krysse midnatt. Startminuttet inngår, sluttminuttet inngår
ikke. Lik start og slutt gir et tomt tidsvindu. Kortet oppdaterer tidsvurderingen
lokalt ved minuttskifte og ved relevante HA-oppdateringer. Ingen databaseforespørsel
kjøres ved disse oppdateringene.

**Etter kontroll kan kandidat-sensoren fjernes manuelt:**

1. Oppdater kortpakken og last nettleseren helt på nytt på PC og mobil.
2. Kontroller døgnmaks, temperaturer, grenser og alle fire tidskoblinger.
3. Søk etter `sensor.systemair_frikjoling_kandidat` i øvrige kort og automasjoner.
4. Fjern bare template-blokken **Systemair frikjøling kandidat**, dersom ingen
   andre funksjoner bruker den. Behold døgnmaks og øvrige templates.
5. Last template-entiteter på nytt, eller kontroller konfigurasjonen og start HA
   på nytt. En eventuell gjenværende registerentitet fjernes først når definisjonen
   er borte og ingen andre bruker den.

Den gamle `free_cooling_diagnosis`-koblingen i lagret kort-YAML ignoreres og kan
fjernes. Kortpakken endrer ikke HA-filene dine eller sletter entiteter.

Dette er en lokal forklaringsmodell. Rullerende HA-døgnmaks er ikke dokumentert
som identisk med aggregatets interne dagvurdering, og Kandidat garanterer ikke
at aggregatet starter. Ingen ny regulator eller fysisk verifikasjon innføres.

## References

- [Home Assistant Statistics](https://www.home-assistant.io/integrations/statistics/)
- [Home Assistant History](https://www.home-assistant.io/integrations/history/)
- [Complete explanations-card example](examples/03-Status-og-forklaringer.yaml)
