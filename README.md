# VSR300 Cards

Two Home Assistant cards for Systemair SAVE VSR300: **Systemair SVG** and
**Systemair Kontrollpanel**, with graphical entity selection. Current card
version: **1.1.0**. Reference setup: HA 2026.10.2 and
[Howard systemair_modbus 1.3.0](https://github.com/Howard0000/home-assistant-systemair-modbus).

[Norsk veiledning](README.nb.md)

## Manual installation

1. Download [vsr300-cards.js](vsr300-cards.js) using GitHub's **Download raw file** button.
2. Copy it to `/config/www/vsr300/vsr300-cards.js` in Home Assistant. Create the `vsr300` folder if needed.
3. Add a dashboard resource with URL **`/local/vsr300/vsr300-cards.js?v=1.1.0`** and type **JavaScript module**.
4. Fully reload the browser, edit the dashboard and add **Systemair SVG** and **Systemair Kontrollpanel** from the card picker.
5. **Adapt the entity bindings in both cards.** Open **Entitetskoblinger**, check every field and replace the example IDs with the matching entities from your own Home Assistant installation. Clear optional fields you do not use.

Complete YAML configurations are available in [01-SVG.yaml](examples/01-SVG.yaml)
and [02-Kontrollpanel.yaml](examples/02-Kontrollpanel.yaml). **When using these
examples, also check and adapt every entity ID under `entities:` before using
the cards.** The prefilled IDs are installation-specific examples.
The frontend file itself does not require a Home Assistant restart.

## Updates

Replace the JavaScript file, change the resource URL's version query to match
that file, and fully reload the browser, including mobile devices. Keep your
existing card configurations and entity selections.

When upgrading from 1.0.0, select the optional **A-alarm**, **B-alarm** and
**C-alarm** entities in the SVG editor to display these summary alarms.

## Options and displayed values

- Animations: **På** (default), **Auto – følg enheten**, or **Av**. On animates even when the device requests reduced motion; Auto follows that preference.
- Headings are hidden by default. Enable **Vis overskrift** to show a custom heading.
- `≈` marks the integration's estimated airflow. **Vekslerpådrag** is control output, not measured heat-recovery efficiency. Heater output is shown in percent, without a watt estimate.
- Each active configured alarm signal gets its own row. A/B/C are summary alarms and may overlap other indications.
- The air paths and animations are schematic. The maintainer's local Forklaringer card is outside this package.

![Cards rendered with simulated values](images/overview-simulated.png)

*Simulated values and placeholder icons; Home Assistant supplies the actual icons.*

[Entity bindings](ENTITETSKART.md) · [Changelog](CHANGELOG.md) ·
[Verification and test limits](VERIFIKASJON.md) · [Sources](SOURCES.md) · [MIT license](LICENSE)
