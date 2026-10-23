# Entitetskart – custom cards 1.1.1

Startkoblingene er eksempler fra referanseoppsettet. Brukeren må kontrollere alle
koblinger i begge kort og endre dem til tilsvarende entiteter i sin egen
HA-installasjon. Dette gjøres i editorens **Entitetskoblinger**, eller under
`entities:` i kortets YAML. Tøm valgfrie felt som ikke skal brukes.

## SVG

| Rolle | Startentitet |
|---|---|
| `mode` | `sensor.systemair_save_modus` |
| `outdoor_temperature` | `sensor.systemair_save_utetemperatur` |
| `supply_temperature` | `sensor.systemair_save_tilluftstemperatur` |
| `extract_temperature` | `sensor.systemair_save_avtrekkstemperatur` |
| `extract_humidity` | `sensor.systemair_save_luftfuktighet` |
| `supply_flow` | `sensor.systemair_save_tilluft_luftmengde` |
| `extract_flow` | `sensor.systemair_save_avkast_luftmengde` |
| `supply_rpm` | `sensor.systemair_save_tilluftsvifte_hastighet_rpm` |
| `extract_rpm` | `sensor.systemair_save_avtrekksvifte_hastighet_rpm` |
| `recovery_output` | `sensor.systemair_save_varmegjenvinning` |
| `heater_output` | `sensor.systemair_save_triac_after_manual_override` |
| `heater_active` | `binary_sensor.loft_systemair_save_ettervarme_aktiv` |
| `free_cooling_active` | `binary_sensor.systemair_save_frikjoling_aktiv` |
| `countdown` | `sensor.systemair_save_countdown_mode_time` |
| `filter_warning` | `binary_sensor.systemair_save_filtervarsel` |
| `filter_alarm` | `binary_sensor.systemair_save_filteralarm` |
| `alarm_a` | `binary_sensor.systemair_save_a_alarm` |
| `alarm_b` | `binary_sensor.systemair_save_b_alarm` |
| `alarm_c` | `binary_sensor.systemair_save_c_alarm` |
| `outdoor_humidity` | `sensor.a4_c1_38_23_90_74_9074_humidity` |
| `fireplace_duration` | `sensor.systemair_save_fireplace_mode_duration` |
| `boost_duration` | `number.systemair_save_oppfriskning_varighet` |
| `party_duration` | `number.systemair_save_party_varighet` |
| `away_duration` | `number.systemair_save_borte_varighet` |
| `holiday_duration` | `number.systemair_save_ferietid_varighet` |

## Kontrollpanel

| Rolle | Startentitet |
|---|---|
| `mode` | `sensor.systemair_save_modus` |
| `auto_source` | `sensor.loft_systemair_save_auto_styrekilde` |
| `mode_select` | `select.systemair_save_modusvalg` |
| `manual_speed` | `select.systemair_save_manuell_viftehastighet` |
| `auto_button` | `button.systemair_save_auto` |
| `low_button` | `button.systemair_save_lav` |
| `normal_button` | `button.systemair_save_normal` |
| `high_button` | `button.systemair_save_hoy` |
| `boost_button` | `button.systemair_save_boost` |
| `party_button` | `button.systemair_save_party` |
| `away_button` | `button.systemair_save_borte` |
| `holiday_button` | `button.systemair_save_ferie` |
| `fireplace_duration` | `sensor.systemair_save_fireplace_mode_duration` |
| `boost_duration` | `number.systemair_save_oppfriskning_varighet` |
| `party_duration` | `number.systemair_save_party_varighet` |
| `away_duration` | `number.systemair_save_borte_varighet` |
| `holiday_duration` | `number.systemair_save_ferietid_varighet` |

SVG-kortets utendørs RF kommer fra en separat HA-føler. Alle øvrige datakilder og all betjening i disse to kortene kommer fra Howard-integrasjonen. Luftmengdene er likevel integrasjonens estimater.

Valgfrie felt: `outdoor_humidity`, `alarm_a`, `alarm_b`, `alarm_c` og de fem
`*_duration`-feltene i SVG; varighetsfeltene i Kontrollpanel. Resttidens kilde er
`countdown`, ikke varighetsfeltene.

Fra 1.1.1 brukes siste rapporterte resttid og tilgjengelig HA-tidsstempel som
grunnlag for en lokal sekundvis nedtelling. Nye rapporter synkroniserer visningen.
Visningen mellom rapportene er beregnet; den starter ikke ny modus når tiden når
null. Ukjent/utilgjengelig resttid vises som ukjent, uten å gjette fra varigheten.

A/B/C er samlealarmer fra integrasjonen. Eksisterende lagrede oppsett beholder
entitetsvalgene sine og får ikke nye alarmkoblinger automatisk. Velg dem i
editoren, eller bruk de komplette eksempeloppsettene som grunnlag.

Innstilte varigheter må velges med de enhetene editoren angir: min, timer og døgn.
