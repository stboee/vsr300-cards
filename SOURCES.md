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

The initial entity names are configuration presets from the maintainer's HA
installation. They are not credentials, recorded operating data or universal
integration entity IDs. Screenshots use simulated states and placeholder icons.
The HA configuration export, register PDF and local Forklaringer card are not
part of this repository.

## External software and documentation

| Source | Use in this package |
| --- | --- |
| [Home Assistant custom cards](https://contributors.home-assistant.io/frontend/custom-ui/card/) | Public custom-card API: `hass`, custom elements and card registration. |
| [Home Assistant card editor](https://contributors.home-assistant.io/frontend/custom-ui/card-editor/) | Public `getConfigForm` API and entity selectors. |
| [HA core 2026.10.2 frontend manifest](https://github.com/home-assistant/core/blob/2026.10.2/homeassistant/components/frontend/manifest.json) | Reference frontend version 20260930.4 for API compatibility review. |
| [Howard Systemair Modbus v1.3.0](https://github.com/Howard0000/home-assistant-systemair-modbus/tree/v1.3.0) | Source of the reference entities and their documented/code-derived meanings. |
| [Howard v1.3.0 binary sensors](https://github.com/Howard0000/home-assistant-systemair-modbus/blob/v1.3.0/custom_components/systemair_modbus/binary_sensor.py) | A/B/C summary alarm, filter alarm and filter warning sources. |
| [HA frontend schema types 20260930.4](https://github.com/home-assistant/frontend/blob/20260930.4/src/components/ha-form/types.ts) | Native editor field defaults, boolean and select selectors. |
| [MDN reduced-motion media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Behaviour of the optional Auto animation mode. |
| [HA state objects](https://www.home-assistant.io/docs/configuration/state_object/) | Report/update timestamps used to anchor the local countdown display. |
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
