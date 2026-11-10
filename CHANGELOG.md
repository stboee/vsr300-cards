# Changelog

## 1.5.0 — 2026-11-10

- Unify Control, Status/explanations and Settings with neutral surfaces and
  borders, blue selection/actions and small semantic status markers. Remove
  per-function colored outlines and decorative gradients. Cockpit is unchanged
  apart from the package version.
- Use green only for reported activity, amber for missing/uncertain required
  data or an airflow-estimate difference, and red for actual configuration or
  service errors. Keep heater and recovery percentages neutral. Optional unset
  power is neutral; an explicitly configured unavailable source is distinguished.
- Retain the estimate tolerance with an explicit amber estimate-difference label;
  do not imply physical balance or efficiency. Keep all calculations and sources.
- Standardize relevant native MDI icons, readable disabled controls, keyboard
  focus, buttons and fields in both themes. HA theme-only updates preserve DOM,
  focus and drafts. Three mobile columns and existing mappings are retained.
- Refresh simulated previews and document the palette. Local behavior, layout
  and contrast checks passed; actual HA installation remains a user check.

## Documentation — 2026-11-09

- Correct HACS installation instructions in English and Norwegian: HACS
  registers the dashboard resource automatically. Remove the manual-resource
  step and clarify removal of an old manual resource when migrating to HACS.
- Documentation only; card code, version 1.4.1 and release tags are unchanged.

## 1.4.1 — 2026-11-09

- Compact duration navigation: Varigheter first shows five modes with their
  reported durations. Selecting one opens only its editor; selecting it again
  collapses. Closing resets selection while retaining drafts. No navigation
  action starts a mode or writes a duration.
- Remove System and its update-entity binding from Settings. It now contains
  only temperature/ECO and free cooling.
- Remove Filter and its four source fields from Status og forklaringer.
  Cockpit filter graphics, alarms and bindings are preserved.
- Distinguish missing recovery binding, missing entity and unavailable/nonnumeric
  value. Show mapping guidance without guessing a source or percentage. Both
  cards agree when explicitly bound to the same entity; existing HA mappings
  still require checking in the user's card editor.

## 1.4.0 — 2026-11-09

- Add Varigheter beside Holiday in the control card, with native number controls
  for Boost/Party/Away/Holiday and a read-only Ildsted duration. Existing mode
  commands and bindings are preserved; opening the panel never starts a mode.
- Reuse native constraints, explicit Apply, retained drafts, error reporting and
  pending-command protection across settings and control. No separate Modbus owner.
- Remove filter maintenance, supply/extract readings, demand season and mode
  durations from settings. Filter registration/intervals belong on the unit panel;
  filter warnings and explanation readouts remain available.
- Explain temperature-regulation alternatives, demand-control season under Auto,
  and ECO heater-threshold reduction with an explicitly illustrative example.
- Keep Cockpit unchanged apart from version. Preserve HACS manifest and existing
  mappings; custom duration bindings must be selected in the control card.

## 1.3.1 — 2026-11-09

- Fix installation/update failure caused by the missing root `hacs.json` in
  release 1.3.0. Declare the single root-level `vsr300-cards.js` bundle and
  README rendering explicitly.
- Publish a new tag and release containing the manifest. A manifest added only
  to the default branch would not repair installation of the existing tag.
- Card behavior, layouts and entity mappings are unchanged from 1.3.0; only the
  displayed package version changes. No Home Assistant configuration changes.

## 1.3.0 — 2026-11-09

- Add optional `custom:vsr300-settings-card`: graphical temperature/ECO,
  free-cooling, filter-maintenance and system sections with native entity editing.
- Numeric bounds/steps and select choices come from HA. Numeric/time/select
  drafts require Apply, retain edits through HA updates, and never replace
  reported values optimistically. Unknown switches cannot be toggled.
- Time edits validate both native fields before sending; partial failure is
  explicit. Service errors preserve drafts; pending submissions block duplicates.
- Add temperature regulation, recovery output and filter explanations, retaining
  three columns and all existing topics. Pressure guard/vacuum topics are
  optional and hidden by default; old ECO/TRIAC sources are expandable details.
- Existing saved entity mappings remain authoritative. New sources must be
  selected in the visual editor; missing values stay unknown.
- Cockpit, control, shared code and their default bindings are unchanged apart
  from the package version. No new Modbus owner, helper, sensor or automation.

## 1.2.3 — 2026-11-03

- Entity rows in Status og forklaringer open their mapped HA entity through
  native more-info actions. Labels, values and optional source IDs share a
  full-width target, with keyboard activation and focus retained on HA updates.
- Existing unavailable entities remain inspectable. Missing entities show an
  unknown value without a misleading action; cleared bindings stay omitted.
- Topic selection, repeated-tap closing, three mobile columns and the bottom
  Close button are retained. Existing mappings and calculations are reused.
- SVG and control card code are unchanged apart from the package version.

## 1.2.2 — 2026-11-03

- SVG values now open their mapped HA entity using native more-info actions:
  individual temperature/humidity/estimated-flow/RPM rows, both fans,
  recovery/free cooling, heater active status and percentage, mode/countdown,
  filters and individual alarm rows.
- Side boxes are taller with larger, separate row targets. Existing top/bottom
  alignment, font sizes, overall SVG canvas, dark equipment and airflow paths
  are retained.
- Keyboard activation, accessible labels, visible focus and focus retention
  across HA updates. Hidden components and missing bindings have no action;
  existing unavailable entities remain inspectable.
- Existing entity mappings are reused. No helpers, new entities, control
  commands, history collection or extra Modbus traffic are added.
- Control and explanations cards retain the behaviour from 1.2.1.

## 1.2.1 — 2026-11-03

- Tapping an open status tile closes its explanation. Tapping a different tile
  switches topics; the Close button below the explanation remains available.
- Status tiles keep three columns on mobile, with unchanged font sizes and
  wrapping text.
- SVG, controls, entity mappings and calculations are unchanged.

## 1.2.0 — 2026-11-03

- Add optional Systemair Status og forklaringer as a third card in the same
  JavaScript module and HACS release, based on the maintainer's full uploaded
  YAML card. Preserve all eight status topics and explanations.
- Keep explanation selection inside each card instance, with keyboard support
  and a close button. No input_select helper or button-card is needed.
- Calculate house load from integration temperatures and estimated supply
  airflow. No local house-load entity, electrical meter or new HA entity is
  involved in that calculation.
- Add a native visual editor with entity bindings, optional source IDs and a
  balance-indication threshold. Keep mapped and cleared fields authoritative.
- Preserve optional local free-cooling diagnoses and electrical measurements;
  label local interpretation separately from native integration reports.
- Unknown values remain unknown. Support °C/°F, m³/h/l/s and W/kW where used in
  calculations. The status grid adapts to card width, with two columns on mobile.
- Keep existing SVG, control and shared code unchanged apart from package version.
  Add a third YAML example, dependency/migration guide and simulated screenshots.

## 1.1.5 — 2026-11-02

- Align Inntak and Avkast with the upper edge of the unit shell, moving each
  panel and its labels together. Keep panel sizes, fonts and line spacing.
- Preserve the bottom alignment of Tilluft, Avtrekk and the unit, the existing
  airflow paths and all card behaviour. Refresh the simulated screenshots.

## 1.1.4 — 2026-11-02

- Raise the Tilluft information box to align its bottom edge with Avtrekk and
  the unit shell. Keep the taller box, line spacing and all font sizes.
- Document HACS custom-repository installation and updates in English and
  Norwegian, including the Dashboard category, HACS resource path, migration
  from the old manual resource and entity binding in both cards.
- Keep manual installation as an alternative. Record the maintainer's report
  that HACS custom-repository updates work in the reference installation.
- Keep the dark equipment, theme-aware canvas, bindings and controls unchanged.

## 1.1.3 — 2026-11-02

- Move supply fan RPM into the Tilluft information box and extract fan RPM into
  Avkast. Increase those box heights and line spacing without reducing existing
  temperature/airflow fonts or enlarging the SVG viewBox.
- Paint the information panels over the duct ends so airflow graphics do not
  cover temperatures, airflow estimates or RPM text.
- Remove the two FILTER captions at the unit edges. Keep both filter symbols,
  their warning/alarm badges and the alarm rows below the illustration.
- Restore the dark unit and exchanger colours from 1.1.1 with light equipment
  text. The surrounding canvas and mode panel continue to follow the HA theme.
- Show Vekslerpådrag on one line in a slightly wider exchanger face, preserving
  the original airflow paths. Enlarge numeric heater output from 31 to 56 SVG
  units and give the unknown-output label its own readable style.
- Fourteen simulated browser groups pass, including text bounds at 360/412/900px,
  HA themes, alarm combinations, local countdown and existing controls.
- Keep entity bindings, controls, animations and local countdown unchanged.
  Auto Low/Normal/High classification is outside this change.

## 1.1.2 — 2026-11-02

- Replace fixed dark cockpit backgrounds and neutral text colours with inherited
  Home Assistant theme variables. Canvas, unit panels, exchanger face, mode box,
  neutral labels and progress track now follow the selected light/dark theme.
- Keep semantic air-port and alarm colours with contrasting light foregrounds.
- Theme changes apply through CSS without replacing the SVG or waiting for a
  sensor update; the selected HA theme takes priority over the OS colour preference.
- Thirteen simulated browser groups cover light/dark/custom palettes, live theme
  changes, selected text/background contrast pairs and previous card behaviour.
- Refresh screenshots and manual installation version examples. Actual-HA theme
  acceptance remains open.

## 1.1.1 — 2026-10-23

- Restore a local one-second countdown and progress update between integration
  reports, using the last reported remaining time as the reference.
- Account for the HA sample timestamp when available and resynchronise whenever
  a new report arrives, including extensions or restarts of a timed mode.
- Update only the time label and progress bar on local ticks, preserving the
  running fan and air-path animations.
- Stop timers for disconnected cards, unavailable time values, untimed modes
  and zero remaining time. Reattached cards account for elapsed time.
- Keep the reported operating mode at zero; never infer a device mode change.
- Countdown behaviour checked with 15 controlled-clock cases and 12 simulated
  browser regression groups. Actual-HA acceptance remains open.

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
