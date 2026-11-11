# Sources and license scope

## Project source

The card package was developed in the VSR300 project from the maintainer's
reviewed Systemair SVG and Kontrollpanel YAML cards v4.8.1, then converted into
standalone custom elements. The functional 1.0.0 JavaScript was delivered on
2026-10-21. Its initial GitHub packaging added license comments and documentation
without changing the runtime logic. Version 1.1.0, 2026-10-22, adds explicit
animation options, optional class-alarm lines and the agreed appearance changes.
Version 1.1.1, 2026-10-23, restores a local display countdown between integration
reports. The displayed remaining time is extrapolated from the last reported
value and available HA timestamps; it is not a new register measurement.
Version 1.1.2, 2026-11-02, uses inherited Home Assistant theme variables for cockpit
backgrounds and neutral text. Semantic air-port and alarm colours are retained.
Version 1.1.3, 2026-11-02, restores the reviewed 1.1.1 equipment colours inside
the theme-aware canvas, moves fan RPM to taller air-port boxes, and improves
equipment labels and heater percentage size. The exchanger face is wider to
fit its single-line title; the airflow paths and data bindings are unchanged.
Version 1.1.4, 2026-11-02, aligns the lower information panels with the unit
shell and documents HACS as a custom-repository installation route following
the maintainer's report that HACS installation and updates work.
Version 1.1.5, 2026-11-02, aligns Inntak and Avkast with the unit's top edge
without changing their dimensions, font sizes or data bindings.
Version 1.2.0, 2026-11-03, adds the optional Status og forklaringer card from the
maintainer's complete YAML attachment supplied that day. All eight topics are
retained, with native entity selectors, internal explanation selection and a
card-local house-load calculation. Optional local diagnoses remain labelled
as local, rather than being presented as firmware observations.
Version 1.2.1, 2026-11-03, makes repeated taps close the selected explanation
and keeps three status columns on mobile.
Version 1.2.2, 2026-11-03, adds native HA more-info actions to individual SVG
values, symbols and alarm lines using their existing entity mappings. The side
boxes gain vertical space without changing the SVG canvas or text sizes.
The UI action opens entity details; it does not write a Modbus register.
Version 1.2.3, 2026-11-03, reuses the same native more-info action for the entity
rows inside explanations. Topic selection and card-local calculations remain
independent of those entity-history actions.

The initial entity names are configuration presets from the maintainer's HA
installation. They are not credentials, recorded operating data or universal
integration entity IDs. Screenshots use simulated states and placeholder icons.
The HA configuration export, register PDF and original local YAML card are not
part of this repository. The converted explanations card is included from 1.2.0.

Version 1.3.0, 2026-11-09, adds the optional graphical settings card and three
new explanation topics. Baseline content was HA-diagnose.txt 4.8.3 (2026-10-21),
reviewed against Howard v1.3.0 number/select/sensor/binary-sensor code. It is not
an export of the currently installed HA configuration. Number limits and choices
come from live HA metadata; no second Modbus client or regulator is introduced.
Pressure guard and vacuum functions are separately optional; old raw signals
stay in technical explanation details.

Version 1.4.0, 2026-11-09, relocates native mode-duration editing to the control
card and removes filter controls and repeated temperature readings from settings.
The explanations distinguish temperature regulation, demand-control season and
ECO heater-threshold reduction. These are documented functions, not new real-unit
verification. The numeric ECO example is illustrative, not a calculated live limit.

Version 1.4.1 refines duration navigation, removes System/Filter sections and
adds recovery-binding diagnostics. The actual user's card mappings have not
been read or changed. Cross-card agreement is locally tested with simulated
HA states; it is not a new real-unit measurement.

Version 1.5.0, 2026-11-10, changes only presentation of Control, explanations
and Settings: semantic colors and relevant native MDI icons. Numerical sources,
calculations and service contracts stay in place. The airflow comparison retains
its configured tolerance and now labels the estimate difference explicitly.
Cockpit and its shared base are byte-identical apart from the package version.
Local visual checks use simulated states and a bundled MDI font; they are not
measurements or verification on the physical unit.

Version 1.6.0, 2026-11-10, refines only Control interaction and highlights.
Howard v1.3.0 `number.py` was read again: the four mode duration numbers await
register writing and coordinator refresh. `button.py` awaits the mode-command
write and refresh. The card awaits the native duration service before the native
mode service, without a direct Modbus client. This is a two-step operation, not
an atomic transaction. Partial failure is explicit. Ildsted remains a read-only
sensor; no writable source is invented. Other card classes/styles and Cockpit
were compared with 1.5.0, alongside local simulated service/UI checks.

Version 1.6.1, 2026-11-10, changes only scoped CSS for Settings and explanations.
After removing the CSS block, its two render references and version strings,
the entire bundle is byte-identical to 1.6.0. Strong selections and activity
markers were compared with Control in a local browser. There are no new source
entities, calculations, register assumptions or physical-unit test claims.

Version 1.7.0, 2026-11-10, moves the local free-cooling candidate assessment
from the maintainer's supplied active template into the explanations card.
The supplied `systemair_24h.yaml` definition was confirmed by the maintainer's
container readout, together with current Statistics attributes and a CSV history
export. That supports retaining the existing Statistics source; raw HA telemetry
is not redistributed. HA 2026.11.1 is maintainer-reported, not a live installation
tested from this environment. Howard v1.3.0 remains the reviewed integration.

The handover register PDF's free-cooling table, printed pages 46–47, was read
and visually checked. It documents IR3102, IR4114, IR4119 and IR4120, not an
exposed 24-hour outdoor maximum or complete candidate decision. The card does
not treat these observation registers as the decision-making firmware itself.
The existing reported-active binding is retained; this release does not add
physical verification of IR4111 or change its provisional project status.
The local rolling maximum and candidate result are not represented as firmware
measurements. Time-window evaluation assumes HA's configured time zone agrees
with the unit clock. Installation and migration are in [FREE-COOLING.md](FREE-COOLING.md).

Version 1.7.1, 2026-11-11, addresses the maintainer's report that Control kept
showing a two-minute configured Boost duration after a one-minute Save and
start, while Cockpit correctly counted down one minute. The code review found
that Control displayed the configured-duration source rather than the separate
remaining-time source. It does not establish why the installed integration
reported the setting late; no live HA history was obtained for that sequence.

The existing Cockpit countdown body is extracted without changing its logic
and shared with Control. A card-local request record retains the last sent
duration explicitly as pending, separate from reported HA state. This is not
optimistic confirmation, additional Modbus access or a replacement regulator.
Native service order, confirmations and partial-failure behavior are preserved.

## External software and documentation

| Source | Use in this package |
| --- | --- |
| [Systemair SAVE VSR 300/500 service manual](https://shop.systemair.com/upload/assets/SAVE_VSR_300_500_SERVICE_AND_ACCESSORIES_EN_V01_1_12_0.PDF) | Temperature-control choices, ECO heater offset and filter-period reset behavior; documented behavior, not a new local test. |
| [Systemair SAVE Modbus reference](https://shopng.systemair.com/upload/assets/SAVE_MODBUS_VARIABLE_LIST_20210301_REV36.PDF?58f78dfe=) | Demand-control season and separate RH summer/winter setpoints. This online reference is older than the project handover register PDF; it is not presented as a reread of that attachment. |
| [Home Assistant custom cards](https://contributors.home-assistant.io/frontend/custom-ui/card/) | Public custom-card API: `hass`, custom elements and card registration. |
| [Home Assistant card editor](https://contributors.home-assistant.io/frontend/custom-ui/card-editor/) | Public `getConfigForm` API and entity selectors. |
| [HA action event for custom cards](https://contributors.home-assistant.io/blog/2023/07/07/action-event-custom-cards/) | Native `hass-action` with `tap_action: more-info`, using the configured entity. |
| [HA core 2026.10.2 frontend manifest](https://github.com/home-assistant/core/blob/2026.10.2/homeassistant/components/frontend/manifest.json) | Reference frontend version 20260930.4 for API compatibility review. |
| [Howard Systemair Modbus v1.3.0](https://github.com/Howard0000/home-assistant-systemair-modbus/tree/v1.3.0) | Source of the reference entities and their documented/code-derived meanings. |
| [Howard v1.3.0 numbers](https://github.com/Howard0000/home-assistant-systemair-modbus/blob/v1.3.0/custom_components/systemair_modbus/number.py) | Existing number services, bounds, steps and units; numeric values are not written by another Modbus client. |
| [Howard v1.3.0 selects](https://github.com/Howard0000/home-assistant-systemair-modbus/blob/v1.3.0/custom_components/systemair_modbus/select.py) | Free-cooling minimum fan-level options and select service. |
| [Howard v1.3.0 binary sensors](https://github.com/Howard0000/home-assistant-systemair-modbus/blob/v1.3.0/custom_components/systemair_modbus/binary_sensor.py) | A/B/C summary alarm, filter alarm and filter warning sources. |
| [HA frontend schema types 20260930.4](https://github.com/home-assistant/frontend/blob/20260930.4/src/components/ha-form/types.ts) | Native editor field defaults, boolean and select selectors. |
| [MDN reduced-motion media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Behaviour of the optional Auto animation mode. |
| [HA state objects](https://www.home-assistant.io/docs/configuration/state_object/) | Report/update timestamps used to anchor the local countdown display. |
| [HA Statistics](https://www.home-assistant.io/integrations/statistics/) | Existing rolling-maximum helper, sample/time limits, buffer attributes and startup restoration. |
| [HA History](https://www.home-assistant.io/integrations/history/) | User-supplied CSV export and the distinction between recorded changes and polling frequency. |
| [MDN setInterval](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval) | Local one-second visual updates and timer cleanup. |
| [HACS custom repositories](https://www.hacs.dev/docs/faq/custom_repositories/) | Add this GitHub repository manually in HACS. |
| [HACS dashboard elements](https://hacs.dev/docs/use/repositories/type/dashboard/) | Dashboard type, downloaded frontend files and the `/hacsfiles/` resource endpoint. |
| [HACS repository dashboard](https://github.com/hacs/documentation/blob/main/source/docs/use/repositories/dashboard.md) | Download releases, update repository information and keep metadata refresh distinct from downloading an update. |
| [HA theming and design tokens](https://contributors.home-assistant.io/frontend/architecture/theming/) | Inherited card/background/text/divider CSS variables for light, dark and custom themes. |

The distributed JavaScript has no imports, bundled third-party JavaScript
libraries, fonts or icon assets. `ha-icon` is provided by Home Assistant at
runtime; the cards reference icon names. The Howard integration, HA frontend
and development browser/test dependencies are not redistributed here.

## License

The repository uses the existing [MIT license](LICENSE), with
`Copyright (c) 2026 stboee`. The distribution review checked the standalone file,
its imports/assets and the project source comments. It found no separate
third-party notice in those source cards or a bundled third-party dependency
requiring an additional notice in this package. This records the reviewed
material; it is not a guarantee about the originality of every generated line.

External software and documentation retain their own licenses. Contributions
that incorporate third-party material must identify its source and preserve
the applicable notices and license requirements.
