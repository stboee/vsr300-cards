# Changelog

## Documentation — 2026-10-22

- Shorten the English and Norwegian guides to manual installation and updates.
- Remove unused installation metadata and references to an unverified installation route.
- Card code and version remain 1.1.0.

## 1.1.0 — 2026-10-22

- SVG animation selector: **På / Auto – følg enheten / Av**, with **På** as
  default, including saved configurations without the new option.
- On explicitly animates despite the device's reduced-motion preference; Auto
  follows it; Off stops fan and air-path animations.
- Both headings hidden by default, including legacy saved titles. Optional
  custom headings can be enabled through the graphical editor.
- Fixed SVG footer removed; estimated airflow retains the `≈` marker.
- Recovery label shortened to **Vekslerpådrag**.
- One line per active configured A/B/C summary alarm, filter alarm and filter
  warning. Configured unknown signals stay unknown; optional empty alarms are
  omitted. Existing saved entity mappings remain authoritative.
- Examples, English/Norwegian guides, screenshots and verification notes updated.
- Simulated browser checks cover all 32 alarm combinations, all six animation
  and reduced-motion combinations, actual frame movement, legacy configurations,
  mobile width and existing service-call behaviour. Actual Pixel/HA checks remain open.

## 1.0.0 — 2026-10-21

First standalone frontend package, based on the project's reviewed Systemair
SVG and Kontrollpanel YAML cards v4.8.1.

- Two independent custom cards in one JavaScript file.
- Native HA graphical editor with configurable entity bindings.
- Maintainer's entity IDs as initial presets; saved and cleared bindings persist.
- Estimated airflows marked with `≈`; unverified calculated exhaust temperature
  removed.
- Recovery labelled as control output; heater output stays in percent without a
  watt estimate.
- Integration countdown replaces browser-clock countdown calculations.
- Filter alarm, warning and unknown indications on both filter symbols.
- Original SVG paths and “utenom veksler” illustration preserved.
- Existing control choices preserved, with no Stop or filter-reset button.
- Version recorded in source and examples, without a visible version label.
- GitHub distribution files, English and Norwegian manual installation guides,
  entity examples and simulated screenshots.
- Existing MIT license retained; SPDX/copyright comments added to the source.

Publication packaging does not change the runtime logic from the manually
delivered 1.0.0 file. The maintainer reports that initial actual-HA testing works;
full acceptance and manual installation/update checks remain open.
