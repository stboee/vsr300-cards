# Entitetskart – kortpakke 1.3.1

Startkoblingene er eksempler fra én installasjon. Kontroller og tilpass alle
entiteter i grafisk editor. Tøm valgfrie kilder som ikke brukes. Eksisterende
lagrede entitetskart overstyres ikke; nye roller må velges eksplisitt.

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
| `free_cooling_state` | Tom som standard |
| `free_cooling_reliable` | `binary_sensor.loft_systemair_save_frikjoling_temperaturer_palitelige` |
| `free_cooling_diagnosis` | `sensor.systemair_frikjoling_kandidat` |
| `outdoor_max_24h` | `sensor.systemair_ute_max_siste_24t` |
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
| `filter_alarm` | `binary_sensor.systemair_save_filteralarm` |
| `filter_warning` | `binary_sensor.systemair_save_filtervarsel` |
| `next_filter_change` | `sensor.systemair_save_neste_filterskift` |
| `filter_interval` | `number.systemair_save_filterintervall_mnd` |
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
| `active_season` | `sensor.systemair_save_aktiv_sesong` |
| `supply_temperature` | `sensor.systemair_save_tilluftstemperatur` |
| `extract_temperature` | `sensor.systemair_save_avtrekkstemperatur` |
| `free_cooling_enabled` | `switch.systemair_save_frikjoling` |
| `free_cooling_active` | `binary_sensor.systemair_save_frikjoling_aktiv` |
| `free_cooling_day_min` | `number.systemair_save_frikjoling_dag_min_temperatur` |
| `free_cooling_night_high` | `number.systemair_save_frikjoling_natt_hoy_grense` |
| `free_cooling_night_low` | `number.systemair_save_frikjoling_natt_lav_grense` |
| `free_cooling_room_cancel` | `number.systemair_save_frikjoling_rom_avbryt_temperatur` |
| `filter_alarm` | `binary_sensor.systemair_save_filteralarm` |
| `filter_warning` | `binary_sensor.systemair_save_filtervarsel` |
| `next_filter_change` | `sensor.systemair_save_neste_filterskift` |
| `filter_interval` | `number.systemair_save_filterintervall_mnd` |
| `cooling_start_hour` | `number.systemair_save_frikjoling_start_time` |
| `cooling_start_minute` | `number.systemair_save_frikjoling_start_min` |
| `cooling_end_hour` | `number.systemair_save_frikjoling_slutt_time` |
| `cooling_end_minute` | `number.systemair_save_frikjoling_slutt_min` |
| `cooling_min_supply` | `select.systemair_save_frikjoling_min_tilluft` |
| `cooling_min_extract` | `select.systemair_save_frikjoling_min_avtrekk` |
| `integration_update` | `update.systemair_modbus_update` |
| `fireplace_duration` | `sensor.systemair_save_fireplace_mode_duration` |
| `boost_duration` | `number.systemair_save_oppfriskning_varighet` |
| `party_duration` | `number.systemair_save_party_varighet` |
| `away_duration` | `number.systemair_save_borte_varighet` |
| `holiday_duration` | `number.systemair_save_ferietid_varighet` |

## Emnevalg

Status og forklaringer viser Temperatur, Veksler og Filter som standard.
`show_temperature`, `show_recovery` og `show_filter` kan skjule dem.
`show_pressure_guard` og `show_vacuum` er av som standard, uavhengig av om
tilhørende entiteter finnes. Eldre ECO/TRIAC ligger under Teknisk grunnlag.

Innstillinger har fire uavhengige visningsvalg: `show_temperature`,
`show_cooling`, `show_filter` og `show_system`. Disse gjelder bare det kortet.

Klikk på verdirader åpner valgt HA-entitet. Pådrag og aktiv-status er ulike
roller. Integrasjonsversjon kommer fra valgt update-entitets attributter; den
utledes ikke fra kortversjon eller kode på GitHub. Se [Innstillinger](SETTINGS.md).
