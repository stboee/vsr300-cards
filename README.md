# VSR300 Cards

Two Home Assistant cards for Systemair SAVE VSR300: **Systemair SVG** and
**Systemair Kontrollpanel**, with graphical entity selection. Current card
version: **1.1.4**. Reference setup: HA 2026.10.2 and
[Howard systemair_modbus 1.3.0](https://github.com/Howard0000/home-assistant-systemair-modbus).

[Norsk veiledning](README.nb.md)

## Install with HACS — custom repository

1. In HACS, open the three-dot menu and select **Custom repositories**.
2. Add **`https://github.com/stboee/vsr300-cards`**, select type **Dashboard** (Plugin/Lovelace in older HACS versions), and add the repository.
3. Open VSR300 Cards in HACS and download the latest release.
4. Under **Settings → Dashboards → Resources**, check that the HACS resource is present as a **JavaScript module**: `/hacsfiles/vsr300-cards/vsr300-cards.js`. Keep any query string managed by HACS. If the resource is missing, add it once.
5. Fully reload the browser and add **Systemair SVG** and **Systemair Kontrollpanel** from the dashboard card picker. Adapt both cards' entities as described below.

When switching from manual installation, replace the old
`/local/vsr300/vsr300-cards.js?...` resource with the HACS resource so that the
same cards are loaded only once. Keep the existing card configurations.

## Manual installation

1. Download [vsr300-cards.js](vsr300-cards.js) using GitHub's **Download raw file** button.
2. Copy it to `/config/www/vsr300/vsr300-cards.js` in Home Assistant. Create the `vsr300` folder if needed.
3. Add a dashboard resource with URL **`/local/vsr300/vsr300-cards.js?v=1.1.4`** and type **JavaScript module**.
4. Fully reload the browser, edit the dashboard and add **Systemair SVG** and **Systemair Kontrollpanel** from the card picker.

## Configure both cards

**Adapt the entity bindings in both cards, regardless of installation method.**
Open **Entitetskoblinger**, check every field and replace the example IDs with
the matching entities from your own Home Assistant installation. Clear optional
fields you do not use.

Complete YAML configurations are available in [01-SVG.yaml](examples/01-SVG.yaml)
and [02-Kontrollpanel.yaml](examples/02-Kontrollpanel.yaml). **When using these
examples, also check and adapt every entity ID under `entities:` before using
the cards.** The prefilled IDs are installation-specific examples.
The frontend file itself does not require a Home Assistant restart.

## Updates

**HACS:** install the offered update in HACS, then fully reload the browser,
including mobile devices. HACS manages the downloaded file and resource version;
there is no need to edit a version query manually. Keep existing card
configurations and entity selections. If the release is not yet shown, use
**Update information** in the repository menu, then download the update.

**Manual:** replace the JavaScript file, change the resource URL's version query
to match that file, and fully reload the browser. Keep existing configurations.

When upgrading from 1.0.0, select the optional **A-alarm**, **B-alarm** and
**C-alarm** entities in the SVG editor to display these summary alarms.

## Options and displayed values

- The outer cockpit background and mode panel follow the active Home Assistant theme. The unit and heat exchanger retain a dark appearance with light text in both light and dark themes. Air-port and alarm colours retain their meaning.
- Fan RPM is shown in the taller Tilluft and Avkast information boxes. Tilluft, Avtrekk and the unit share one bottom edge. Heater percentage is enlarged; Vekslerpådrag appears on one line. Filter symbols and warning badges remain visible without separate FILTER captions.
- Animations: **På** (default), **Auto – følg enheten**, or **Av**. On animates even when the device requests reduced motion; Auto follows that preference.
- Headings are hidden by default. Enable **Vis overskrift** to show a custom heading.
- Remaining mode time counts down locally each second between integration reports and resynchronises with new reports. This is a display estimate; the active mode continues to come from the integration.
- `≈` marks the integration's estimated airflow. **Vekslerpådrag** is control output, not measured heat-recovery efficiency. Heater output is shown in percent, without a watt estimate.
- Each active configured alarm signal gets its own row. A/B/C are summary alarms and may overlap other indications.
- The air paths and animations are schematic. The maintainer's local Forklaringer card is outside this package.

![Cards rendered with simulated values](images/overview-simulated.png)

![Light theme rendered with simulated values](images/overview-light-simulated.png)

*Simulated values and placeholder icons; Home Assistant supplies the actual icons.*

[Entity bindings](ENTITETSKART.md) · [Changelog](CHANGELOG.md) ·
[Verification and test limits](VERIFIKASJON.md) · [Sources](SOURCES.md) · [MIT license](LICENSE)
