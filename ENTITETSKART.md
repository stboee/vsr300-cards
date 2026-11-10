# Entitetskart – kortpakke 1.7.0

Startkoblingene er eksempler fra én installasjon. Velg dine entiteter i hvert
korts grafiske editor. Lagrede koblinger er autoritative; tømte felt blir ikke
fylt automatisk. Ingen HA-entiteter slettes av kortpakken.

## Cockpit / SVG

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

## Status og forklaringer

| Rolle | Startentitet |
|---|---|
| `supply_flow` | `sensor.systemair_save_tilluft_luftmengde` |
| `extract_flow` | `sensor.systemair_save_avkast_luftmengde` |
| `supply_temperature` | `sensor.systemair_save_tilluftstemperatur` |
| `extract_temperature` | `sensor.systemair_save_avtrekkstemperatur` |
| `free_cooling_active` | `binary_sensor.systemair_save_frikjoling_aktiv` |
| `heater_active` | `binary_sensor.loft_systemair_save_ettervarme_aktiv` |
| `heater_output` | `sensor.systemair_save_triac_after_manual_override` |
| `mode` | `sensor.systemair_save_modus` |
| `auto_source` | `sensor.loft_systemair_save_auto_styrekilde` |
| `free_cooling_enabled` | `switch.systemair_save_frikjoling` |
| `eco_enabled` | `switch.systemair_save_eco_modus` |
| `eco_active` | `binary_sensor.loft_systemair_save_eco_aktiv` |
| `cooker_hood_active` | `binary_sensor.systemair_save_kjokkenhette_aktiv` |
| `supply_rpm` | `sensor.systemair_save_tilluftsvifte_hastighet_rpm` |
| `extract_rpm` | `sensor.systemair_save_avtrekksvifte_hastighet_rpm` |
| `outdoor_temperature` | `sensor.systemair_save_utetemperatur` |
| `free_cooling_state` | — |
| `free_cooling_reliable` | `binary_sensor.loft_systemair_save_frikjoling_temperaturer_palitelige` |
| `outdoor_max_24h` | `sensor.systemair_ute_max_siste_24t` |
| `cooling_start_hour` | `number.systemair_save_frikjoling_start_time` |
| `cooling_start_minute` | `number.systemair_save_frikjoling_start_min` |
| `cooling_end_hour` | `number.systemair_save_frikjoling_slutt_time` |
| `cooling_end_minute` | `number.systemair_save_frikjoling_slutt_min` |
| `free_cooling_day_min` | `number.systemair_save_frikjoling_dag_min_temperatur` |
| `free_cooling_night_high` | `number.systemair_save_frikjoling_natt_hoy_grense` |
| `free_cooling_night_low` | `number.systemair_save_frikjoling_natt_lav_grense` |
| `free_cooling_room_cancel` | `number.systemair_save_frikjoling_rom_avbryt_temperatur` |
| `electric_power` | `sensor.vsr300_power` |
| `electric_energy` | `sensor.vsr300_energy` |
| `supply_setpoint` | `number.systemair_save_tilluft_setpunkt_degc` |
| `eco_offset` | `number.systemair_save_oko_varmeoffset` |
| `overheat_temperature` | `sensor.systemair_save_overheat_temperature` |
| `air_quality` | `sensor.systemair_save_luftkvalitet` |
| `regulation_mode` | `sensor.systemair_save_regulering` |
| `active_season` | `sensor.systemair_save_aktiv_sesong` |
| `recovery_output` | `sensor.systemair_save_varmegjenvinning` |
| `legacy_triac` | `sensor.systemair_save_triac_control_signal` |
| `legacy_eco` | `binary_sensor.systemair_save_oko_funksjon_aktiv` |
| `pressure_guard_active` | `binary_sensor.systemair_save_trykkvakt_aktiv` |

## Innstillinger

| Rolle | Startentitet |
|---|---|
| `supply_setpoint` | `number.systemair_save_tilluft_setpunkt_degc` |
| `eco_enabled` | `switch.systemair_save_eco_modus` |
| `eco_offset` | `number.systemair_save_oko_varmeoffset` |
| `regulation_mode` | `sensor.systemair_save_regulering` |
| `free_cooling_enabled` | `switch.systemair_save_frikjoling` |
| `free_cooling_active` | `binary_sensor.systemair_save_frikjoling_aktiv` |
| `free_cooling_day_min` | `number.systemair_save_frikjoling_dag_min_temperatur` |
| `free_cooling_night_high` | `number.systemair_save_frikjoling_natt_hoy_grense` |
| `free_cooling_night_low` | `number.systemair_save_frikjoling_natt_lav_grense` |
| `free_cooling_room_cancel` | `number.systemair_save_frikjoling_rom_avbryt_temperatur` |
| `cooling_start_hour` | `number.systemair_save_frikjoling_start_time` |
| `cooling_start_minute` | `number.systemair_save_frikjoling_start_min` |
| `cooling_end_hour` | `number.systemair_save_frikjoling_slutt_time` |
| `cooling_end_minute` | `number.systemair_save_frikjoling_slutt_min` |
| `cooling_min_supply` | `select.systemair_save_frikjoling_min_tilluft` |
| `cooling_min_extract` | `select.systemair_save_frikjoling_min_avtrekk` |

## Visningsvalg og overgang

Forklaringskortet har ti standardemner. `show_temperature` og `show_recovery`
kan skjule Temperatur/Veksler. `show_pressure_guard` og `show_vacuum` er av som
standard; et eksisterende signal beviser ikke fysisk tilkoblet utstyr.
Innstillinger har `show_temperature` og `show_cooling`.

System og update-koblingen er fjernet fra Innstillinger. Filter med fire
kilder og `show_filter` er fjernet fra forklaringskortet. Gamle ubrukte felt
kan ligge igjen i eldre YAML, men vises ikke eller brukes som skrivemål.
Cockpits filterkoblinger, varsler og grafikk beholdes.

Modusvarigheter bruker Kontrollpanelets eksisterende fem koblinger. Egne
navn flyttes ikke automatisk fra et annet kort. Trykk direkte på en tidsstyrt
modus for editor/avlesning med Lagre, Lagre og start og Lukk. Ildsted er kun
avlesning med Start og Lukk. Ingen ny entitet er nødvendig.

Veksler krever `recovery_output` i forklaringskortet. Velg samme entitet som i
Cockpit når begge brukes. Tom kobling, manglende entitet og utilgjengelig
verdi skilles. 100 % er pådrag, ikke virkningsgrad. Pådrag og aktiv-status
er ulike signaler. Klikk på verdirader åpner valgt HA-entitet.

Frikjølingskandidaten beregnes i forklaringskortet fra disse kildene.
Den tidligere `free_cooling_diagnosis`-koblingen ignoreres. Døgnmaks er fortsatt
en lokal HA-statistikksensor; se [oppsett og overgang](FREE-COOLING.md).
