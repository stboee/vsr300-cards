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
