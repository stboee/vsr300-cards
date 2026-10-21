# Changelog

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
- GitHub distribution metadata, HACS custom-repository manifest, English and
  Norwegian installation guides, entity examples and simulated screenshots.
- Existing MIT license retained; SPDX/copyright comments added to the source.

Publication packaging does not change the runtime logic from the manually
delivered 1.0.0 file. The maintainer reports that initial actual-HA testing works;
full acceptance and HACS installation checks remain open.
