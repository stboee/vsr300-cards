# VSR300 Cards

Four Home Assistant cards for Systemair SAVE VSR300: **Systemair SVG**,
**Systemair Kontrollpanel**, **Systemair Status og forklaringer**, and optional
**Systemair Innstillinger**,
with graphical entity selection. Current card
version: **1.7.1**. Maintainer-reported setup: HA 2026.11.1 and
[Howard systemair_modbus 1.3.0](https://github.com/Howard0000/home-assistant-systemair-modbus).

[Norsk veiledning](README.nb.md)

## Install with HACS — custom repository

1. In HACS, open the three-dot menu and select **Custom repositories**.
2. Add **`https://github.com/stboee/vsr300-cards`**, select type **Dashboard** (Plugin/Lovelace in older HACS versions), and add the repository.
3. Open VSR300 Cards in HACS and download the latest release.
4. Fully reload the browser and add **Systemair SVG**, **Systemair Kontrollpanel**, and optionally **Systemair Status og forklaringer** and **Systemair Innstillinger** from the dashboard card picker. Adapt the entities in every card you use.

HACS registers the dashboard resource automatically; no manual resource entry
is needed for this installation method.

When switching from manual installation, remove the old
`/local/vsr300/vsr300-cards.js?...` resource so that the cards are loaded only
once through HACS. Keep the existing card configurations.

## Manual installation

1. Download [vsr300-cards.js](vsr300-cards.js) using GitHub's **Download raw file** button.
2. Copy it to `/config/www/vsr300/vsr300-cards.js` in Home Assistant. Create the `vsr300` folder if needed.
3. Add a dashboard resource with URL **`/local/vsr300/vsr300-cards.js?v=1.7.1`** and type **JavaScript module**.
4. Fully reload the browser, edit the dashboard and add the cards you want from the card picker.

## Configure the cards

**Adapt the entity bindings in every card you use, regardless of installation method.**
Open **Entitetskoblinger**, check every field and replace the example IDs with
the matching entities from your own Home Assistant installation. Clear optional
fields you do not use.

Complete YAML configurations are available in [01-SVG.yaml](examples/01-SVG.yaml),
[02-Kontrollpanel.yaml](examples/02-Kontrollpanel.yaml), and
[03-Status-og-forklaringer.yaml](examples/03-Status-og-forklaringer.yaml). **When using these
examples, also check and adapt every entity ID under `entities:` before using
the cards.** The prefilled IDs are installation-specific examples.
The frontend file itself does not require a Home Assistant restart.

For the optional free-cooling candidate assessment, configure the
[24-hour maximum sensor and time bindings](FREE-COOLING.md). The card works
without that assessment; missing candidate inputs are shown explicitly.

## Updates

If installing 1.3.0 fails with a missing `hacs.json` message, refresh repository
information in HACS and select **1.3.1 or later**. That release includes the
missing installation manifest. Keep your existing cards and entity selections.

**HACS:** install the offered update in HACS, then fully reload the browser,
including mobile devices. HACS manages the downloaded file and resource version;
there is no need to edit a version query manually. Keep existing card
configurations and entity selections. If the release is not yet shown, use
**Update information** in the repository menu, then download the update.

**Manual:** replace the JavaScript file, change the resource URL's version query
to match that file, and fully reload the browser. Keep existing configurations.

When upgrading from 1.0.0, select the optional **A-alarm**, **B-alarm** and
**C-alarm** entities in the SVG editor to display these summary alarms.

## Add the explanations card after updating

Updating the file does not add a dashboard card automatically. Add **Systemair
Status og forklaringer** from the picker, or use:

```yaml
type: custom:vsr300-explanations-card
```

Check its entity bindings. Your initial presets are examples, including optional
24-hour maximum and electrical-meter entities. Clear optional fields you do not
use. Keep the old YAML card until the new card's configuration is checked, then
replace it. The SVG and control card configurations stay as they are.

## Changes in 1.7.1

Control now shows remaining time for the active Ildsted, Boost, Party, Borte or
Ferie mode, using exactly the same local countdown calculation as Cockpit.
The inactive tiles still show configured duration. Select **Rapportert resttid
(sekunder)** in the Control editor, using the same sensor as Cockpit; the
reference ID is `sensor.systemair_save_countdown_mode_time`. Existing mappings
are retained, so this new field must be selected in an existing card.

A successfully sent duration stays in the editor, labelled as sent while HA
still reports the old value. The reported value remains separate. Confirmation
comes from a new HA report; a service response does not start a local mode or
claim that the setting has been confirmed. See [Control durations](SETTINGS.md).

## History — 1.7.0

Free-cooling candidacy is now calculated inside Status og forklaringer. It uses
the mapped integration temperatures, thresholds and start/end hour/minute, plus
the existing HA 24-hour outdoor maximum. No history polling or new HA entity is
created. Reported activity/diagnostics retain priority. Missing necessary input
is explicitly unknown, without guessed temperatures or times.

**Existing cards:** keep all entity mappings and select the four new free-cooling
start/end time fields in the explanations editor. Use the same number entities
as Settings; bindings are not copied between cards. Then check the calculation
before manually removing the old local candidate template. Its old binding is
ignored. Keep the maximum sensor. See [sensor definition and migration](FREE-COOLING.md).

## History — 1.6.1

Settings and Status og forklaringer now use the same stronger filled highlights
as Control. Open fields are blue; reported activity, missing/uncertain data and
actual faults have stronger green, amber and red markers with contrasting text
and icons. Status text retains the meaning; colors do not change measurements.

Cockpit and Control are unchanged apart from the package version. Entity
bindings, editing, history and all commands are retained. Update through HACS
and fully reload each browser. Keep existing cards and entity selections.

## History — 1.6.0

Control uses stronger filled highlights. Tap Ildsted, Boost, Party, Borte or
Ferie directly to open its duration and start options without sending commands.
Tap it again to collapse. The separate **Varigheter** button is removed.

| Choice | Action |
| --- | --- |
| Lagre (Save) | Sends only the duration, with no start command. |
| Lagre og start (Save and start) | Awaits the duration service before sending the native mode command. |
| Lukk (Close) | Closes without saving or starting; drafts are retained. |

A failed save prevents Start. If saving succeeds but Start fails, the partial
result is explicit and no rollback is attempted. Readings and active mode remain
integration reports, without optimistic confirmation.

Howard v1.3.0 exposes Ildsted duration only as a sensor. It has a readout,
**Start** and **Lukk**; Start uses the duration already configured in the unit.
Explicit Start is also retained when an optional duration source is missing or
not editable. Auto/Manual, Cockpit and the other two cards retain their behavior
and appearance.

Update in HACS and fully reload each browser. Keep existing cards and mappings.

## History — 1.5.0

Control, Status og forklaringer and Settings share neutral surfaces, consistent
borders and buttons, and a semantic palette. Cockpit keeps its existing graphics
and colors.

| Color | Meaning |
| --- | --- |
| Neutral | Ordinary controls, values and inactive functions |
| Blue | Selected mode, open section and actions |
| Green | Separate marker for reported activity |
| Amber | Missing required data, uncertain data or an airflow-estimate difference |
| Red | Reported configuration fault or failed service call |

Text and icons accompany colors. Percentages and watts stay neutral; normal
heating is not an alarm. Green indicates reported activity, not verified
performance or physical balance. A blue On switch in Settings means enabled;
actual operation is reported separately.

Both HA themes are supported, including theme-only updates with unchanged
states. Three mobile columns, history, settings, durations and saved mappings
are retained. Update in HACS and fully reload each browser. Keep existing cards
and entity bindings.

## History — 1.4.1

Varigheter in the control card first opens five compact mode choices. Select one
mode to open its duration editor; select it again to collapse. Opening/closing
never starts a mode. Closing the whole panel resets selection and keeps drafts.

Settings now contains only temperature/ECO and free cooling. System information
has been removed. Filter has been removed from Status og forklaringer; Cockpit
filter graphics and alarms are retained.

**Recovery shows Unknown?** Each card stores its own entity bindings. In the
explanations editor, choose the same **Vekslerpådrag (%)** entity as in Cockpit.
An empty binding now says **Velg entitet**; a nonexistent entity is distinguished
from an existing unavailable value. No source or percentage is guessed.

## History — 1.4.0

**Varigheter** beside Holiday in the control card opens four editable native
mode durations. Opening/closing this panel does not start a mode. Ildsted stays
read-only until the integration exposes a writable entity. Check the five
existing duration bindings in the control card editor; custom bindings from the
settings card are not transferred between cards automatically.

Settings now contains temperature/ECO, free cooling and system information.
Supply/extract readings stay in Cockpit. Filter registration and interval changes
belong on the unit panel; filter warnings remain in Cockpit. The former filter explanation was removed in 1.4.1.
Demand-control season is explained under Auto, and temperature regulation and
ECO heater-threshold reduction have clearer explanations.

Keep existing card configurations. Retired settings fields may remain in older
YAML, but are not displayed or used as write targets. See [settings and migration](SETTINGS.md).

## History — 1.3.0

Cockpit and control code/configuration are preserved. Explanations gain
temperature control, recovery output and filter topics; pressure guard and vacuum
functions are optional and hidden by default. Older ECO/TRIAC sources belong
to expandable technical sections. Existing entity mappings stay authoritative:
select new source fields in the editor or hide unwanted new topics.

Add **Systemair Innstillinger** from the card picker, or use:

```yaml
type: custom:vsr300-settings-card
```

The optional fourth card groups temperature/ECO and free cooling. Number constraints and choices come from HA. No new helper
or Modbus client is created. Keep the old service card until mappings and
behaviour have been checked. See [settings and migration](SETTINGS.md) and
[complete YAML](examples/04-Innstillinger.yaml).

## Tap values in the SVG card

Tap a value row to open its mapped entity in Home Assistant's standard more-info
dialog, with whatever history HA has recorded. The whole row is a target, using
the existing entity mappings in the visual editor. No helpers or additional
configuration are required.

- Each temperature, humidity, estimated airflow and RPM row opens separately.
- Fan symbols open their RPM sensor. The exchanger opens recovery output;
  when free cooling is displayed, that component opens reported cooling status.
- The heater symbol/label opens the active-status binary sensor; the percentage
  opens the output sensor. These remain distinct signals.
- Filters open the active alarm ahead of warning, or the alarm entity when both
  are inactive. Each alarm row opens its own entity.
- Mode and remaining time open separately. Countdown history contains integration
  reports, while the visible card ticks locally between reports.

The side boxes are taller with more row spacing, preserving top/bottom alignment,
overall SVG width and font sizes. Tab, Enter and Space are supported. An existing
unavailable entity still opens; empty or nonexistent mappings have no action.
These actions only open entity details; they do not control the unit. Airflows
remain estimates, recovery output remains a reported control output rather than
thermal efficiency, and no new history is created by the card.

## Options and displayed values

- The outer cockpit background and mode panel follow the active Home Assistant theme. The unit and heat exchanger retain a dark appearance with light text in both light and dark themes. Air-port and alarm colours retain their meaning.
- Fan RPM is shown in the taller Tilluft and Avkast information boxes. Inntak and Avkast align with the unit top; Tilluft, Avtrekk and the unit share one bottom edge. Heater percentage is enlarged; Vekslerpådrag appears on one line. Filter symbols and warning badges remain visible without separate FILTER captions.
- Animations: **På** (default), **Auto – følg enheten**, or **Av**. On animates even when the device requests reduced motion; Auto follows that preference.
- SVG and control headings are hidden by default. The explanations card shows its heading by default. **Vis overskrift** and the title field configure this per card.
- Remaining mode time counts down locally each second between integration reports and resynchronises with new reports. This is a display estimate; the active mode continues to come from the integration.
- `≈` marks the integration's estimated airflow. **Vekslerpådrag** is control output, not measured heat-recovery efficiency. Heater output is shown in percent, without a watt estimate.
- Each active configured alarm signal gets its own row. A/B/C are summary alarms and may overlap other indications.
- The air paths and animations are schematic.
- **Status og forklaringer** has ten default status topics plus two optional external functions and explanations, local open/close selection (tap the same tile again to close), three columns on mobile, calculated house load, and optional measured power. It needs neither an input_select helper nor button-card. Free-cooling candidacy is calculated in the card from integration values and an optional existing HA 24-hour maximum sensor, clearly separate from integration reports. Tap the entity rows inside explanations to open their mapped HA entity and available history. See [explanations card and migration](EXPLANATIONS.md).

![Cards rendered with simulated values](images/overview-simulated.png)

![Light theme rendered with simulated values](images/overview-light-simulated.png)

![Optional explanations card with simulated values](images/explanations-simulated.png)

![Optional settings card with simulated values](images/settings-mobile-simulated.png)

*Simulated HA values. Preview icons use the local Material Design Icons font; Home Assistant renders its own icons.*

[Entity bindings](ENTITETSKART.md) · [Changelog](CHANGELOG.md) ·
[Verification and test limits](VERIFIKASJON.md) · [Sources](SOURCES.md) · [MIT license](LICENSE)
