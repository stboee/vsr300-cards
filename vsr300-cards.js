/* VSR300 custom cards · version 1.2.1 · 2026-11-03
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 stboee
 * Based on Systemair SVG / Kontrollpanel 4.8.1.
 * Uses Home Assistant states and services; Howard owns all Modbus communication.
 * User-specific defaults are initial entity bindings, never measurement fallbacks.
 * Source and local verification: see README.md and VERIFIKASJON.md.
 */
(() => {
  'use strict';
  const VERSION = '1.2.1';
  const FIELD = (key, label, domain, defaultId, extra = {}) => ({ key, label, domain, defaultId, ...extra });
  const SVG_FIELDS = [
    FIELD('mode', 'Rapportert driftsmodus', 'sensor', 'sensor.systemair_save_modus'),
    FIELD('outdoor_temperature', 'Utetemperatur', 'sensor', 'sensor.systemair_save_utetemperatur'),
    FIELD('supply_temperature', 'Tilluftstemperatur', 'sensor', 'sensor.systemair_save_tilluftstemperatur'),
    FIELD('extract_temperature', 'Avtrekkstemperatur', 'sensor', 'sensor.systemair_save_avtrekkstemperatur'),
    FIELD('extract_humidity', 'Avtrekk – luftfuktighet', 'sensor', 'sensor.systemair_save_luftfuktighet'),
    FIELD('supply_flow', 'Estimert tilluftmengde', 'sensor', 'sensor.systemair_save_tilluft_luftmengde'),
    FIELD('extract_flow', 'Estimert avtrekksmengde', 'sensor', 'sensor.systemair_save_avkast_luftmengde'),
    FIELD('supply_rpm', 'Tilluftvifte – turtall', 'sensor', 'sensor.systemair_save_tilluftsvifte_hastighet_rpm'),
    FIELD('extract_rpm', 'Avtrekksvifte – turtall', 'sensor', 'sensor.systemair_save_avtrekksvifte_hastighet_rpm'),
    FIELD('recovery_output', 'Vekslerpådrag (%)', 'sensor', 'sensor.systemair_save_varmegjenvinning'),
    FIELD('heater_output', 'Ettervarmepådrag (%)', 'sensor', 'sensor.systemair_save_triac_after_manual_override'),
    FIELD('heater_active', 'Varmefunksjon aktiv', 'binary_sensor', 'binary_sensor.loft_systemair_save_ettervarme_aktiv'),
    FIELD('free_cooling_active', 'Frikjøling aktiv', 'binary_sensor', 'binary_sensor.systemair_save_frikjoling_aktiv'),
    FIELD('countdown', 'Gjenstående modustid (sekunder)', 'sensor', 'sensor.systemair_save_countdown_mode_time'),
    FIELD('filter_warning', 'Filtervarsel', 'binary_sensor', 'binary_sensor.systemair_save_filtervarsel'),
    FIELD('filter_alarm', 'Filteralarm', 'binary_sensor', 'binary_sensor.systemair_save_filteralarm'),
    FIELD('alarm_a', 'A-alarm – samlealarm', 'binary_sensor', 'binary_sensor.systemair_save_a_alarm', { optional: true, group: 'Alarmer' }),
    FIELD('alarm_b', 'B-alarm – samlealarm', 'binary_sensor', 'binary_sensor.systemair_save_b_alarm', { optional: true, group: 'Alarmer' }),
    FIELD('alarm_c', 'C-alarm – samlealarm', 'binary_sensor', 'binary_sensor.systemair_save_c_alarm', { optional: true, group: 'Alarmer' }),
    FIELD('outdoor_humidity', 'Utendørs luftfuktighet – valgfri', 'sensor', 'sensor.a4_c1_38_23_90_74_9074_humidity', { optional: true, group: 'Valgfrie kilder' }),
    FIELD('fireplace_duration', 'Innstilt Ildsted-varighet (min)', 'sensor', 'sensor.systemair_save_fireplace_mode_duration', { optional: true, group: 'Varigheter for fremdriftslinjen' }),
    FIELD('boost_duration', 'Innstilt Boost-varighet (min)', 'number', 'number.systemair_save_oppfriskning_varighet', { optional: true, group: 'Varigheter for fremdriftslinjen' }),
    FIELD('party_duration', 'Innstilt Party-varighet (timer)', 'number', 'number.systemair_save_party_varighet', { optional: true, group: 'Varigheter for fremdriftslinjen' }),
    FIELD('away_duration', 'Innstilt Borte-varighet (timer)', 'number', 'number.systemair_save_borte_varighet', { optional: true, group: 'Varigheter for fremdriftslinjen' }),
    FIELD('holiday_duration', 'Innstilt Ferie-varighet (døgn)', 'number', 'number.systemair_save_ferietid_varighet', { optional: true, group: 'Varigheter for fremdriftslinjen' }),
  ];
  const CONTROL_FIELDS = [
    FIELD('mode', 'Rapportert driftsmodus', 'sensor', 'sensor.systemair_save_modus'),
    FIELD('auto_source', 'Auto – rapportert styrekilde', 'sensor', 'sensor.loft_systemair_save_auto_styrekilde'),
    FIELD('mode_select', 'Modusvalg', 'select', 'select.systemair_save_modusvalg'),
    FIELD('manual_speed', 'Valgt manuell viftehastighet', 'select', 'select.systemair_save_manuell_viftehastighet'),
    FIELD('auto_button', 'Auto-knapp', 'button', 'button.systemair_save_auto'),
    FIELD('low_button', 'Lav-knapp', 'button', 'button.systemair_save_lav'),
    FIELD('normal_button', 'Normal-knapp', 'button', 'button.systemair_save_normal'),
    FIELD('high_button', 'Høy-knapp', 'button', 'button.systemair_save_hoy'),
    FIELD('boost_button', 'Boost-knapp', 'button', 'button.systemair_save_boost'),
    FIELD('party_button', 'Party-knapp', 'button', 'button.systemair_save_party'),
    FIELD('away_button', 'Borte-knapp', 'button', 'button.systemair_save_borte'),
    FIELD('holiday_button', 'Ferie-knapp', 'button', 'button.systemair_save_ferie'),
    FIELD('fireplace_duration', 'Innstilt Ildsted-varighet (min)', 'sensor', 'sensor.systemair_save_fireplace_mode_duration', { optional: true, group: 'Innstilte varigheter' }),
    FIELD('boost_duration', 'Innstilt Boost-varighet (min)', 'number', 'number.systemair_save_oppfriskning_varighet', { optional: true, group: 'Innstilte varigheter' }),
    FIELD('party_duration', 'Innstilt Party-varighet (timer)', 'number', 'number.systemair_save_party_varighet', { optional: true, group: 'Innstilte varigheter' }),
    FIELD('away_duration', 'Innstilt Borte-varighet (timer)', 'number', 'number.systemair_save_borte_varighet', { optional: true, group: 'Innstilte varigheter' }),
    FIELD('holiday_duration', 'Innstilt Ferie-varighet (døgn)', 'number', 'number.systemair_save_ferietid_varighet', { optional: true, group: 'Innstilte varigheter' }),
  ];
  const defaults = fields => Object.fromEntries(fields.map(f => [f.key, f.defaultId]));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const state = (states, id) => id && states[id] ? states[id].state : undefined;
  const number = (states, id) => {
    const raw = state(states, id);
    if (raw === undefined || raw === null || String(raw).trim() === '' || ['unknown', 'unavailable'].includes(raw)) return null;
    const result = Number(raw);
    return Number.isFinite(result) ? result : null;
  };
  const binary = (states, id) => state(states, id) === 'on' ? true : state(states, id) === 'off' ? false : null;
  const MODE_NAMES = { auto: 'Auto', manual_stop: 'Manuell – Stopp', manual_low: 'Manuell – Lav', manual_normal: 'Manuell – Normal', manual_high: 'Manuell – Høy', manual_unknown: 'Manuell – Ukjent', party: 'Party', boost: 'Boost', fireplace: 'Ildsted', away: 'Borte', holiday: 'Ferie', cooker_hood: 'Kjøkkenhette', vacuum_cleaner: 'Støvsuger', cdi1: 'CDI1', cdi2: 'CDI2', cdi3: 'CDI3', pressure_guard: 'Trykkvakt' };
  const AUTO_NAMES = { week_schedule: 'Styres av ukeprogram', demand_control: 'Behovsstyring', external_control: 'Ekstern styring', configuration_fault: 'Konfigurasjonsfeil' };
  const TIMED = { fireplace: ['fireplace_duration', 60], boost: ['boost_duration', 60], party: ['party_duration', 3600], away: ['away_duration', 3600], holiday: ['holiday_duration', 86400] };
  function normalize(config, fields, title, supportsAnimation) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('Kortoppsettet må være et objekt.');
    if (config.entities != null && (typeof config.entities !== 'object' || Array.isArray(config.entities))) throw new Error('entities må inneholde entitetskoblingene.');
    // A saved mapping is authoritative; clearing an input must stay cleared.
    const entities = config.entities == null ? defaults(fields) : { ...config.entities };
    for (const f of fields) {
      if (entities[f.key] == null) entities[f.key] = '';
      if (typeof entities[f.key] !== 'string') throw new Error(`Ugyldig entitetskobling: ${f.label}`);
      entities[f.key] = entities[f.key].trim();
      if (entities[f.key] && (!/^[a-z_]+\.[a-z0-9_]+$/.test(entities[f.key]) || !entities[f.key].startsWith(f.domain + '.'))) throw new Error(`Feil entitetstype for ${f.label}: forventer ${f.domain}.`);
    }
    if (config.show_title != null && typeof config.show_title !== 'boolean') throw new Error('Vis overskrift må være på eller av.');
    const result = { ...config, title: config.title === undefined ? title : String(config.title ?? ''), show_title: config.show_title ?? false, entities };
    if (supportsAnimation) {
      result.animation = config.animation ?? 'on';
      if (!['on', 'auto', 'off'].includes(result.animation)) throw new Error('Animasjoner må være on, auto eller off.');
    }
    return result;
  }
  const SHARED_STYLE = `
    :host{display:block;color:var(--primary-text-color,#e2e8f0);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif)}
    h2{font-size:20px;font-weight:600;line-height:1.4;margin:8px 0 14px;padding:0 8px}
    .notice{font-size:13px;line-height:1.45;padding:10px 14px;border-radius:10px;background:rgba(250,204,21,.10);color:var(--primary-text-color,#e2e8f0);margin:8px 0}
    .svg-wrap{width:100%;border-radius:30px;overflow:hidden}.systemair-svg{width:100%;height:auto;display:block}
    .filter-status{font-size:14px;font-weight:700;line-height:1.4;text-align:center;padding:8px 12px;border-radius:12px;margin-top:6px}
    .filter-alarm{background:#7f1d1d;color:#fecaca}.filter-warning{background:#78350f;color:#fde68a}.filter-unknown{background:#334155;color:#e2e8f0}
    .grid{display:grid;gap:8px;margin-bottom:16px}.two{grid-template-columns:repeat(2,minmax(0,1fr))}.three{grid-template-columns:repeat(3,minmax(0,1fr))}
    h3{font-size:16px;font-weight:600;margin:20px 8px 12px}
    button{font:inherit;min-width:0;min-height:92px;border:1px solid var(--divider-color,rgba(255,255,255,.16));border-radius:20px;background:rgba(127,127,127,.06);color:inherit;padding:12px 6px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;box-sizing:border-box}
    .large{min-height:104px;border-radius:22px}.large strong{font-size:20px}button strong{font-size:14px;font-weight:900}button small{font-size:12px;opacity:.8;line-height:1.3;white-space:normal}
    ha-icon{--mdc-icon-size:36px;color:var(--accent)}.large ha-icon{--mdc-icon-size:42px}
    button.active{border:2px solid var(--accent);background:linear-gradient(135deg,var(--tint),transparent)}
    button:focus-visible{outline:3px solid var(--primary-color,#03a9f4);outline-offset:2px}button:disabled{opacity:.45;cursor:not-allowed}
    .error{background:rgba(239,68,68,.13);color:var(--error-color,#ef4444);font-size:14px;padding:12px;border-radius:12px;margin:8px 0}.error:empty{display:none}
    .svg-wrap[data-animation="off"] .duct-flow,.svg-wrap[data-animation="off"] .fan-blade{animation:none!important}
    @media(prefers-reduced-motion:reduce){.svg-wrap[data-animation="auto"] .duct-flow,.svg-wrap[data-animation="auto"] .fan-blade{animation:none!important}}
  `;
  class BaseCard extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); this._previousStates = []; }
    setConfig(config) {
      this._config = normalize(config, this.constructor.fields, this.constructor.defaultTitle, this.constructor.supportsAnimation);
      this._previousStates = [];
      this._renderIfReady();
    }
    get config() { return this._config; }
    set hass(value) {
      this._hass = value;
      const ids = Object.values(this._config?.entities || {});
      const next = ids.map(id => value?.states?.[id]);
      const changed = next.length !== this._previousStates.length || next.some((v, i) => v !== this._previousStates[i]);
      if (changed || !this._rendered) { this._previousStates = next; this._renderIfReady(); }
    }
    get hass() { return this._hass; }
    _renderIfReady() {
      if (!this._config || !this._hass) return;
      this._render(); this._rendered = true;
    }
    _heading() { return this._config.show_title && this._config.title ? `<h2>${escape(this._config.title)}</h2>` : ''; }
    _missing() {
      const states = this._hass.states || {};
      return this.constructor.fields.filter(f => !f.optional && (!this._config.entities[f.key] || !states[this._config.entities[f.key]]));
    }
    _missingNotice() {
      const missing = this._missing();
      return missing.length ? `<div class="notice" role="status">Mangler entitetskobling: ${escape(missing.map(f => f.label).join(', '))}. Åpne kortets oppsett.</div>` : '';
    }
    getCardSize() { return 8; }
    getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }
    static getStubConfig() { return { title: this.defaultTitle, show_title: false, ...(this.supportsAnimation ? { animation: 'on' } : {}), entities: defaults(this.fields) }; }
    static getConfigForm() {
      const fields = this.fields;
      return {
        schema: [
          { name: 'show_title', default: false, selector: { boolean: {} } },
          { name: 'title', selector: { text: {} } },
          ...(this.supportsAnimation ? [{ name: 'animation', required: true, default: 'on', selector: { select: { mode: 'dropdown', options: [
            { value: 'on', label: 'På' }, { value: 'auto', label: 'Auto – følg enheten' }, { value: 'off', label: 'Av' },
          ] } } }] : []),
          { name: 'entities', type: 'expandable', title: 'Entitetskoblinger', schema: fields.map(f => ({ name: f.key, required: !f.optional, selector: { entity: { filter: { domain: f.domain } } } })) },
        ],
        computeLabel: schema => ({ title: 'Overskrift', show_title: 'Vis overskrift', animation: 'Animasjoner' })[schema.name] || fields.find(f => f.key === schema.name)?.label || schema.name,
        computeHelper: schema => schema.name === 'animation' ? 'På er standard. Auto følger enhetens valg for redusert bevegelse.' : schema.name === 'title' ? 'Vises bare når Vis overskrift er slått på.' : fields.find(f => f.key === schema.name)?.optional ? 'Valgfri kobling. Kan stå tom.' : undefined,
      };
    }
  }

  class Vsr300SvgCard extends BaseCard {
    static fields = SVG_FIELDS;
    static defaultTitle = '';
    static supportsAnimation = true;
    getCardSize() { return 11; }
    connectedCallback() { this._updateCountdown(); }
    disconnectedCallback() { this._stopCountdownTimer(); }
    _stopCountdownTimer() {
      if (this._countdownInterval !== undefined) clearInterval(this._countdownInterval);
      this._countdownInterval = undefined;
    }
    _modeTiming() {
      const states = this._hass?.states || {}, e = this._config?.entities || {};
      const mode = state(states, e.mode), timed = Object.hasOwn(TIMED, mode) ? TIMED[mode] : undefined;
      if (!timed) {
        this._countdownSample = undefined;
        const known = Object.hasOwn(MODE_NAMES, mode);
        return { text: known ? 'Ikke tidsstyrt' : 'Modus ukjent', pct: known ? 100 : 0, running: false };
      }
      const raw = number(states, e.countdown), entity = states[e.countdown];
      if (raw === null || raw < 0) {
        this._countdownSample = undefined;
        return { text: 'Resttid ukjent', pct: 0, running: false };
      }
      // A report anchors the local display clock; other entity updates do not.
      // HA's last_reported may be absent from frontend states, so use last_updated.
      const reported = [entity?.last_reported, entity?.last_updated, entity?.last_changed]
        .map(value => ({ value, ms: typeof value === 'string' ? Date.parse(value) : NaN }))
        .find(stamp => Number.isFinite(stamp.ms));
      const signature = JSON.stringify([e.mode, e.countdown, mode, raw, reported?.value ?? null]);
      const now = Date.now();
      if (signature !== this._countdownSample?.signature) {
        const observedAt = reported ? Math.min(now, reported.ms) : now;
        this._countdownSample = { signature, deadline: observedAt + raw * 1000 };
      }
      // Use elapsed time, not a decrement per tick: background throttling must not drift.
      const seconds = Math.max(0, Math.min(raw, (this._countdownSample.deadline - now) / 1000));
      const remaining = Math.ceil(seconds);
      const [durationRole, scale] = timed, duration = number(states, e[durationRole]);
      const total = duration !== null && duration > 0 ? duration * scale : null;
      const pct = total === null ? 0 : Math.max(0, Math.min(100, seconds / total * 100));
      let text;
      if (remaining >= 86400) text = `${Math.floor(remaining / 86400)}d ${Math.floor(remaining % 86400 / 3600)}t igjen`;
      else if (remaining >= 3600) text = `${Math.floor(remaining / 3600)}t ${Math.floor(remaining % 3600 / 60)}m igjen`;
      else text = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')} igjen`;
      return { text, pct, running: seconds > 0 };
    }
    _updateCountdown() {
      if (!this._hass || !this._config) { this._stopCountdownTimer(); return; }
      const timing = this._modeTiming();
      const label = this.shadowRoot.querySelector('.mode-time');
      const progress = this.shadowRoot.querySelector('.mode-progress');
      if (label && label.textContent !== timing.text) label.textContent = timing.text;
      if (progress) progress.setAttribute('width', String(Math.round(1110 * timing.pct / 100)));
      if (this.isConnected && label && timing.running) {
        if (this._countdownInterval === undefined) this._countdownInterval = setInterval(() => this._updateCountdown(), 1000);
      } else this._stopCountdownTimer();
    }
    _diagram() {
      const states = this._hass.states || {}, e = this._config.entities;
const clean = v => v === undefined || v === null || String(v).trim() === '' || v === 'unknown' || v === 'unavailable' ? '-' : v;
const num = (id, unit = '', decimals = 0) => {
  const v = number(states, id);
  return v === null ? '–' : `${v.toFixed(decimals)}${unit}`;
};
const uteT = num(e.outdoor_temperature, '°C', 1);
  const uteRh = num(e.outdoor_humidity, '% RH', 0);

  const tilluftT = num(e.supply_temperature, '°C', 1);
  const tilluftFlowValue = number(states, e.supply_flow);
const tilluftFlow = tilluftFlowValue === null ? '–' : `≈ ${tilluftFlowValue.toFixed(0)} m³/h`;
  const tilluftRpm = num(e.supply_rpm, ' rpm', 0);

  const avtrekkT = num(e.extract_temperature, '°C', 1);
  const inneRh = num(e.extract_humidity, '% RH', 0);

  const avkastFlowValue = number(states, e.extract_flow);
const avkastFlow = avkastFlowValue === null ? '–' : `≈ ${avkastFlowValue.toFixed(0)} m³/h`;
  const avtrekkRpm = num(e.extract_rpm, ' rpm', 0);

  const gjenv = num(e.recovery_output, '%', 0);
  const modeRaw = states[e.mode]?.state ?? '';
  const modeNames = {
    auto: 'Auto',
    manual_stop: 'Manuell – Stopp',
    manual_low: 'Manuell – Lav',
    manual_normal: 'Manuell – Normal',
    manual_high: 'Manuell – Høy',
    manual_unknown: 'Manuell – Ukjent',
    party: 'Party',
    boost: 'Boost',
    fireplace: 'Ildsted',
    away: 'Borte',
    holiday: 'Ferie',
    cooker_hood: 'Kjøkkenhette',
    vacuum_cleaner: 'Støvsuger',
    cdi1: 'CDI1',
    cdi2: 'CDI2',
    cdi3: 'CDI3',
    pressure_guard: 'Trykkvakt',
  };
  const modeKnown = Object.hasOwn(modeNames, modeRaw);
  const driftText = modeKnown ? modeNames[modeRaw] : 'Ukjent';

  const freeCoolingActive = states[e.free_cooling_active]?.state === 'on';

  const heatingState = states[e.heater_active]?.state;
  const ettervarmeKnown = heatingState === 'on' || heatingState === 'off';
  const ettervarmeActive = heatingState === 'on';
  const heaterTitle = ettervarmeKnown ? 'ETTERVARME' : 'VARME UKJENT';

  const triacRaw = clean(states[e.heater_output]?.state);
  const triacNum = triacRaw === '-' || String(triacRaw).trim() === '' ? NaN : Number(triacRaw);
  const ettervarmeSub = Number.isFinite(triacNum) ? `${triacNum.toFixed(0)} %` : 'Ukjent pådrag';

  let modeColor1 = '#64748b';
let modeColor2 = '#94a3b8';
const colors = { fireplace: ['#fb923c', '#facc15'], boost: ['#0ea5e9', '#22d3ee'], party: ['#a855f7', '#ec4899'], auto: ['#22c55e', '#84cc16'] };
if (colors[modeRaw]) [modeColor1, modeColor2] = colors[modeRaw];
else if (modeKnown && modeRaw.startsWith('manual_')) [modeColor1, modeColor2] = ['#38bdf8', '#0ea5e9'];
const { text: timeText, pct } = this._modeTiming();
const filterAlarm = binary(states, e.filter_alarm);
const filterWarning = binary(states, e.filter_warning);
const filterState = filterAlarm === true ? 'alarm' : filterWarning === true ? 'warning' : filterAlarm === false && filterWarning === false ? 'normal' : 'unknown';
const filterColors = { alarm: ['#7f1d1d', '#ef4444', '#fecaca'], warning: ['#78350f', '#f59e0b', '#fde68a'], unknown: ['#334155', '#94a3b8', '#e2e8f0'] };
const fc = filterColors[filterState];
const filterBadge = (x, y) => filterState === 'normal' ? '' : `<g class="filter-badge" data-status="${filterState}"><circle cx="${x}" cy="${y}" r="20" fill="${fc[1]}" stroke="#0f172a" stroke-width="3"/><text x="${x}" y="${y + 10}" text-anchor="middle" style="font:900 30px Arial;fill:#0f172a">${filterState === 'unknown' ? '?' : '!'}</text></g>`;
const heaterFill = !ettervarmeKnown ? '#854d0e' : ettervarmeActive ? '#991b1b' : '#1e293b';
  const heaterStroke = !ettervarmeKnown ? '#facc15' : ettervarmeActive ? '#f87171' : '#64748b';
  const heaterWave = !ettervarmeKnown ? '#fef08a' : ettervarmeActive ? '#fecaca' : '#cbd5e1';
  const heaterGlow = ettervarmeActive ? 'url(#heaterGlow)' : 'none';

  const normalOpacity = freeCoolingActive ? 0 : 1;
  const freeOpacity = freeCoolingActive ? 1 : 0;
  const exchangerOpacity = freeCoolingActive ? 0.18 : 1;

  return `
    <div class="svg-wrap" data-animation="${this._config.animation}">
      <svg role="img" aria-label="Systemair prosessillustrasjon" class="systemair-svg" viewBox="0 -250 1300 1255" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="panelBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--card-background-color, #ffffff)" />
            <stop offset="100%" stop-color="var(--card-background-color, #ffffff)" />
          </linearGradient>

          <linearGradient id="unitBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="100%" stop-color="#111827" />
          </linearGradient>

          <linearGradient id="coldAir" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#1d4ed8" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>

          <linearGradient id="warmAir" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#f97316" />
            <stop offset="100%" stop-color="#facc15" />
          </linearGradient>

          <linearGradient id="supplyAir" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#16a34a" />
            <stop offset="100%" stop-color="#86efac" />
          </linearGradient>

          <linearGradient id="exhaustAir" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#64748b" />
            <stop offset="100%" stop-color="#e2e8f0" />
          </linearGradient>

          <linearGradient id="modeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${modeColor1}" />
            <stop offset="100%" stop-color="${modeColor2}" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="heaterGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <style>
            .label {
              font-family: Arial, sans-serif;
              font-size: 44px;
              font-weight: 950;
              fill: var(--primary-text-color, #212121);
              letter-spacing: 1px;
            }
            .small {
              font-family: Arial, sans-serif;
              font-size: 42px;
              font-weight: 900;
              fill: var(--primary-text-color, #212121);
            }
            .value {
              font-family: Arial, sans-serif;
              font-size: 60px;
              font-weight: 950;
              fill: var(--primary-text-color, #212121);
            }
            .tiny {
              font-family: Arial, sans-serif;
              font-size: 33px;
              font-weight: 900;
              fill: var(--primary-text-color, #212121);
            }
            .micro {
              font-family: Arial, sans-serif;
              font-size: 32px;
              font-weight: 900;
              fill: var(--primary-text-color, #212121);
            }
            .heater-text {
              font-family: Arial, sans-serif;
              font-size: 31px;
              font-weight: 900;
              fill: var(--primary-text-color, #212121);
            }
            .heater-value { font-size: 56px; font-weight: 950; }
            .heater-value-unknown { font-size: 36px; }
            .recovery-title { font-size: 32px; letter-spacing: 0; }
            .mode-title {
              font-family: Arial, sans-serif;
              font-size: 32px;
              font-weight: 900;
              fill: var(--secondary-text-color, #727272);
            }
            .mode-value {
              font-family: Arial, sans-serif;
              font-size: 58px;
              font-weight: 950;
              fill: var(--primary-text-color, #212121);
            }
            .mode-time {
              font-family: Arial, sans-serif;
              font-size: 38px;
              font-weight: 900;
              fill: var(--primary-text-color, #212121);
            }
            /* Semantic air-port colours retain a contrasting light foreground. */
            .port-text { fill: #ffffff; }
            /* Equipment stays dark inside the theme-aware cockpit canvas. */
            .unit-text { fill: #f8fafc; }
            .duct-base {
              fill: none;
              stroke: var(--divider-color, #bdbdbd);
              stroke-width: 64;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .duct-inner {
              fill: none;
              stroke: rgba(15,23,42,0.80);
              stroke-width: 46;
              stroke-linecap: round;
              stroke-linejoin: round;
            }
            .duct-flow {
              fill: none;
              stroke-width: 30;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-dasharray: 44 34;
              animation: flow 1.15s linear infinite;
              filter: url(#glow);
            }
            @keyframes flow {
              to { stroke-dashoffset: -78; }
            }
            .fan-blade {
              animation: fanSpin 3s linear infinite;
            }
            @keyframes fanSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          </style>
        </defs>

        <rect class="canvas" x="0" y="-250" width="1300" height="1255" rx="34" fill="url(#panelBg)" />

        <rect class="unit-shell" x="365" y="-200" width="570" height="875" rx="46" fill="url(#unitBg)" stroke="#64748b" stroke-width="4" />
        <rect class="unit-inner" x="392" y="-170" width="516" height="815" rx="34" fill="rgba(15,23,42,0.64)" stroke="rgba(148,163,184,0.38)" stroke-width="2" />

        <g opacity="${normalOpacity}">
          <path class="duct-base" d="M 295 -110 L 425 -110 L 530 160" />
          <path class="duct-inner" d="M 295 -110 L 425 -110 L 530 160" />
          <path class="duct-flow" d="M 295 -110 L 425 -110 L 530 160" stroke="url(#coldAir)" />

          <path class="duct-base" d="M 530 365 L 500 430 L 440 565 L 295 565" />
          <path class="duct-inner" d="M 530 365 L 500 430 L 440 565 L 295 565" />
          <path class="duct-flow" d="M 530 365 L 500 430 L 440 565 L 295 565" stroke="url(#supplyAir)" />

          <path class="duct-base" d="M 1005 565 L 875 565 L 770 365" />
          <path class="duct-inner" d="M 1005 565 L 875 565 L 770 365" />
          <path class="duct-flow" d="M 1005 565 L 875 565 L 770 365" stroke="url(#warmAir)" />

          <path class="duct-base" d="M 770 160 L 875 -110 L 1005 -110" />
          <path class="duct-inner" d="M 770 160 L 875 -110 L 1005 -110" />
          <path class="duct-flow" d="M 770 160 L 875 -110 L 1005 -110" stroke="url(#exhaustAir)" />
        </g>

        <g opacity="${freeOpacity}">
          <path class="duct-base" d="M 295 -110 L 425 -110 L 425 565 L 295 565" />
          <path class="duct-inner" d="M 295 -110 L 425 -110 L 425 565 L 295 565" />
          <path class="duct-flow" d="M 295 -110 L 425 -110 L 425 565 L 295 565" stroke="url(#coldAir)" />

          <path class="duct-base" d="M 1005 565 L 875 565 L 875 -110 L 1005 -110" />
          <path class="duct-inner" d="M 1005 565 L 875 565 L 875 -110 L 1005 -110" />
          <path class="duct-flow" d="M 1005 565 L 875 565 L 875 -110 L 1005 -110" stroke="url(#warmAir)" />
        </g>

        <!-- Paint port panels over duct ends so values stay unobscured. -->
        <g class="air-info">
          <rect class="intake-info" x="28" y="-200" width="280" height="220" rx="28" fill="#1e40af" stroke="#93c5fd" stroke-width="4" />
          <text x="168" y="-140" text-anchor="middle" class="label port-text">INNTAK</text>
          <text x="168" y="-65" text-anchor="middle" class="value port-text">${uteT}</text>
          <text x="168" y="-9" text-anchor="middle" class="small port-text">${uteRh}</text>

          <rect class="supply-info" x="28" y="375" width="280" height="300" rx="28" fill="#166534" stroke="#86efac" stroke-width="4" />
          <text x="168" y="435" text-anchor="middle" class="label port-text">TILLUFT</text>
          <text x="168" y="512" text-anchor="middle" class="value port-text">${tilluftT}</text>
          <text x="168" y="580" text-anchor="middle" class="small port-text">${tilluftFlow}</text>
          <text x="168" y="645" text-anchor="middle" class="small port-text supply-rpm">${tilluftRpm}</text>

          <rect class="exhaust-info" x="992" y="-200" width="280" height="300" rx="28" fill="#334155" stroke="#cbd5e1" stroke-width="4" />
          <text x="1132" y="-145" text-anchor="middle" class="label port-text">AVKAST</text>
          <text x="1132" y="-65" text-anchor="middle" class="small port-text">${avkastFlow}</text>
          <text x="1132" y="-9" text-anchor="middle" class="micro port-text">estimert</text>
          <text x="1132" y="66" text-anchor="middle" class="small port-text extract-rpm">${avtrekkRpm}</text>

          <rect class="extract-info" x="992" y="455" width="280" height="220" rx="28" fill="#9a3412" stroke="#fdba74" stroke-width="4" />
          <text x="1132" y="515" text-anchor="middle" class="label port-text">AVTREKK</text>
          <text x="1132" y="590" text-anchor="middle" class="value port-text">${avtrekkT}</text>
          <text x="1132" y="646" text-anchor="middle" class="small port-text">${inneRh}</text>
        </g>

        <g opacity="${exchangerOpacity}">
          <polygon class="exchanger-shell" points="490,135 650,85 810,135 810,370 650,420 490,370"
                   fill="rgba(88,28,135,0.56)" stroke="#d946ef" stroke-width="4" />
          <polygon class="exchanger-inner" points="505,165 650,125 795,165 795,345 650,385 505,345"
                   fill="rgba(15,23,42,0.70)" stroke="rgba(255,255,255,0.30)" stroke-width="3" />

          <line x1="575" y1="187" x2="725" y2="320" stroke="rgba(216,180,254,0.66)" stroke-width="10" stroke-linecap="round" />
          <line x1="595" y1="170" x2="745" y2="303" stroke="rgba(216,180,254,0.42)" stroke-width="7" stroke-linecap="round" />
          <line x1="555" y1="215" x2="705" y2="348" stroke="rgba(216,180,254,0.42)" stroke-width="7" stroke-linecap="round" />

          <line x1="725" y1="187" x2="575" y2="320" stroke="rgba(125,211,252,0.66)" stroke-width="10" stroke-linecap="round" />
          <line x1="705" y1="170" x2="555" y2="303" stroke="rgba(125,211,252,0.42)" stroke-width="7" stroke-linecap="round" />
          <line x1="745" y1="215" x2="595" y2="348" stroke="rgba(125,211,252,0.42)" stroke-width="7" stroke-linecap="round" />

          <text x="650" y="235" text-anchor="middle" class="label unit-text recovery-title">Vekslerpådrag</text>
          <text x="650" y="315" text-anchor="middle" class="value unit-text">${gjenv}</text>
        </g>

        <g opacity="${freeOpacity}">
          <rect x="510" y="150" width="280" height="205" rx="30" fill="rgba(12,74,110,0.88)" stroke="#38bdf8" stroke-width="5" />
          <text x="650" y="223" text-anchor="middle" class="label port-text">FRIKJØLING</text>
          <text x="650" y="285" text-anchor="middle" class="small port-text">utenom</text>
          <text x="650" y="333" text-anchor="middle" class="small port-text">veksler</text>
        </g>

        <rect x="392" y="-170" width="66" height="135" rx="14" class="supply-filter" data-status="${filterState}" fill="${fc ? fc[0] : '#1e3a8a'}" stroke="${fc ? fc[1] : '#93c5fd'}" stroke-width="${fc ? 7 : 4}" />
        <line x1="407" y1="-145" x2="443" y2="-60" stroke="#bfdbfe" stroke-width="6" />
        <line x1="443" y1="-145" x2="407" y2="-60" stroke="#bfdbfe" stroke-width="6" />
        <line x1="425" y1="-150" x2="425" y2="-55" stroke="rgba(255,255,255,0.42)" stroke-width="4" />
        ${filterBadge(458, -165)}

        <rect x="842" y="500" width="66" height="135" rx="14" class="extract-filter" data-status="${filterState}" fill="${fc ? fc[0] : '#7c2d12'}" stroke="${fc ? fc[1] : '#fdba74'}" stroke-width="${fc ? 7 : 4}" />
        <line x1="857" y1="525" x2="893" y2="610" stroke="#fed7aa" stroke-width="6" />
        <line x1="893" y1="525" x2="857" y2="610" stroke="#fed7aa" stroke-width="6" />
        <line x1="875" y1="520" x2="875" y2="615" stroke="rgba(255,255,255,0.42)" stroke-width="4" />
        ${filterBadge(908, 505)}

        <g filter="${heaterGlow}">
          <rect x="603" y="395" width="94" height="86" rx="18" fill="${heaterFill}" stroke="${heaterStroke}" stroke-width="4" />
          <path d="M621 429 C636 409, 656 449, 674 427" fill="none" stroke="${heaterWave}" stroke-width="7" stroke-linecap="round" />
          <path d="M621 457 C636 437, 656 477, 674 455" fill="none" stroke="${heaterWave}" stroke-width="7" stroke-linecap="round" />
          <text x="650" y="525" text-anchor="middle" class="heater-text unit-text">${heaterTitle}</text>
          <text x="650" y="600" text-anchor="middle" class="heater-text heater-value unit-text${Number.isFinite(triacNum) ? '' : ' heater-value-unknown'}">${ettervarmeSub}</text>
        </g>

        <circle cx="405" cy="565" r="60" fill="#064e3b" stroke="#86efac" stroke-width="5" />
        <circle cx="405" cy="565" r="14" fill="#dcfce7" opacity="0.9" />
        <g class="fan-blade" style="transform-origin: 405px 565px;">
          <path d="M405 565 L405 518 Q431 534 418 565 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L452 565 Q436 591 405 578 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L405 612 Q379 596 392 565 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L358 565 Q374 539 405 552 Z" fill="#86efac" opacity="0.93" />
        </g>

        <circle cx="875" cy="-110" r="60" fill="#334155" stroke="#e2e8f0" stroke-width="5" />
        <circle cx="875" cy="-110" r="14" fill="#f8fafc" opacity="0.9" />
        <g class="fan-blade" style="transform-origin: 875px -110px;">
          <path d="M875 -110 L875 -157 Q901 -141 888 -110 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L922 -110 Q906 -84 875 -97 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L875 -63 Q849 -79 862 -110 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L828 -110 Q844 -136 875 -123 Z" fill="#e2e8f0" opacity="0.93" />
        </g>

        <rect class="mode-box" x="48" y="780" width="1204" height="165" rx="36" fill="var(--card-background-color, #ffffff)" stroke="url(#modeGrad)" stroke-width="4" />
        <text x="92" y="837" class="mode-title">AKTIV MODUS</text>
        <text x="92" y="900" class="mode-value">${driftText}</text>
        <text x="760" y="900" class="mode-time">${timeText}</text>
        <rect x="92" y="917" width="1110" height="16" rx="8" fill="var(--divider-color, #bdbdbd)" />
        <rect class="mode-progress" x="92" y="917" width="${Math.round(1110 * pct / 100)}" height="16" rx="8" fill="url(#modeGrad)" />
      </svg>
    </div>
  `;
    }
    _alarmLines(states, entities) {
      const rows = [];
      const add = (key, label, level) => rows.push(`<div class="filter-status filter-${level}" data-alarm="${key}" role="status">${escape(label)}</div>`);
      for (const [key, label] of [['alarm_a', 'A-alarm'], ['alarm_b', 'B-alarm'], ['alarm_c', 'C-alarm']]) {
        if (!entities[key]) continue;
        const active = binary(states, entities[key]);
        if (active === true) add(key, `⚠ ${label} aktiv – kontroller aggregatets alarmliste`, 'alarm');
        else if (active === null) add(key, `? ${label} – status ukjent`, 'unknown');
      }
      const alarm = binary(states, entities.filter_alarm), warning = binary(states, entities.filter_warning);
      if (alarm === true) add('filter_alarm', '⚠ Filteralarm – bytt filtre', 'alarm');
      if (warning === true) add('filter_warning', '⚠ Filtervarsel – planlegg filterskift', 'warning');
      if (alarm !== true && warning !== true && (alarm === null || warning === null)) add('filter_unknown', '? Filterstatus ukjent', 'unknown');
      return rows.join('');
    }
    _render() {
      const states = this._hass.states || {}, e = this._config.entities;
      const freeUnknown = binary(states, e.free_cooling_active) === null;
      this.shadowRoot.innerHTML = `<style>${SHARED_STYLE}</style>${this._heading()}${this._diagram()}
        ${this._alarmLines(states, e)}${this._missingNotice()}
        ${freeUnknown ? '<div class="notice" role="status">Frikjølingsstatus ukjent.</div>' : ''}`;
      this._updateCountdown();
    }
  }

  class Vsr300ControlCard extends BaseCard {
    static fields = CONTROL_FIELDS;
    static defaultTitle = '';
    constructor() {
      super();
      this.shadowRoot.addEventListener('click', event => {
        const button = event.composedPath().find(el => el instanceof HTMLElement && el.matches('button[data-action]'));
        if (button && !button.disabled) this._activate(button.dataset.action);
      });
    }
    _available(role) {
      const entity = this._hass.states[this._config.entities[role]];
      // An HA button may legitimately have state 'unknown' before its first press.
      return !!entity && entity.state !== 'unavailable';
    }
    _button(action, name, label, icon, active, color, large = false) {
      const command = ['manual', 'fireplace'].includes(action) ? 'mode_select' : action + '_button';
      const enabled = this._available(command) && !this._busy;
      return `<button type="button" data-action="${action}" class="${large ? 'large ' : ''}${active ? 'active' : ''}" style="--accent:${color};--tint:${color}55" aria-pressed="${active}" ${enabled ? '' : 'disabled'} title="${escape(enabled ? name : name + ' – betjening utilgjengelig')}"><ha-icon icon="${icon}" aria-hidden="true"></ha-icon><strong>${name}</strong><small>${escape(label)}</small></button>`;
    }
    _duration(role, unit) {
      const v = number(this._hass.states, this._config.entities[role]);
      return v === null || v < 0 ? 'Varighet ukjent' : `${v} ${unit}`;
    }
    _render() {
      const states = this._hass.states, e = this._config.entities;
      const mode = state(states, e.mode), source = state(states, e.auto_source), speed = state(states, e.manual_speed);
      const modeKnown = Object.hasOwn(MODE_NAMES, mode);
      const manual = typeof mode === 'string' && mode.startsWith('manual_');
      const autoLabel = !modeKnown ? 'Modus ukjent' : mode !== 'auto' ? 'Ikke aktiv' : AUTO_NAMES[source] || 'Styrekilde ukjent';
      const speedName = { Low: 'Lav', Normal: 'Normal', High: 'Høy', Stop: 'Stopp' }[speed] || 'Ukjent';
      const showManual = manual || state(states, e.mode_select) === 'Manual';
      this.shadowRoot.innerHTML = `<style>${SHARED_STYLE}</style>${this._heading()}${this._missingNotice()}
        <div class="grid two">
          ${this._button('auto', 'Auto', autoLabel, 'mdi:fan-auto', mode === 'auto', '#84cc16', true)}
          ${this._button('manual', 'Manuell', 'Manuell · ' + speedName, 'mdi:hand-back-right-outline', manual, '#38bdf8', true)}
        </div>
        ${showManual ? `<h3>Manuell viftehastighet</h3><div class="grid three">
          ${this._button('low', 'Lav', 'Manuell', 'mdi:fan-speed-1', speed === 'Low', '#69f0ae')}
          ${this._button('normal', 'Normal', 'Manuell', 'mdi:fan-speed-2', speed === 'Normal', '#40c4ff')}
          ${this._button('high', 'Høy', 'Manuell', 'mdi:fan-speed-3', speed === 'High', '#ffab40')}
        </div>` : ''}
        <h3>Tidsstyrte og spesialmoduser</h3><div class="grid three">
          ${this._button('fireplace', 'Ildsted', this._duration('fireplace_duration', 'min'), 'mdi:fireplace', mode === 'fireplace', '#ff7043')}
          ${this._button('boost', 'Boost', this._duration('boost_duration', 'min'), 'mdi:fan-plus', mode === 'boost', '#40c4ff')}
          ${this._button('party', 'Party', this._duration('party_duration', 't'), 'mdi:account-group', mode === 'party', '#ec4899')}
          ${this._button('away', 'Borte', this._duration('away_duration', 't'), 'mdi:home-export-outline', mode === 'away', '#94a3b8')}
          ${this._button('holiday', 'Ferie', this._duration('holiday_duration', 'd'), 'mdi:beach', mode === 'holiday', '#94a3b8')}
        </div><div class="error" role="alert"></div>`;
      if (this._serviceError) this.shadowRoot.querySelector('.error').textContent = this._serviceError;
    }
    async _activate(action) {
      if (this._busy) return;
      const names = { fireplace: 'Ildsted', boost: 'Boost / oppfriskning', party: 'Party', away: 'Borte', holiday: 'Ferie' };
      if (names[action] && !window.confirm(`Starte ${names[action]}-modus?`)) return;
      const select = { manual: 'Manual', fireplace: 'Fireplace' }[action];
      const role = select ? 'mode_select' : action + '_button';
      const allowed = ['auto', 'manual', 'low', 'normal', 'high', 'fireplace', 'boost', 'party', 'away', 'holiday'];
      if (!allowed.includes(action) || !this._available(role)) return;
      this._busy = true; this._serviceError = ''; this._render();
      try {
        await this._hass.callService(select ? 'select' : 'button', select ? 'select_option' : 'press', {
          entity_id: this._config.entities[role], ...(select ? { option: select } : {}),
        });
      } catch (error) {
        this._serviceError = 'Kunne ikke endre modus. Kontroller integrasjonens status i Home Assistant.';
        console.warn('VSR300: service call failed', error);
      } finally { this._busy = false; this._render(); }
    }
  }

  const explanationField = (key, extra = {}) => ({ ...[...SVG_FIELDS, ...CONTROL_FIELDS].find(f => f.key === key), ...extra });
  const EXPLANATION_FIELDS = [
    ...['supply_flow', 'extract_flow', 'supply_temperature', 'extract_temperature', 'free_cooling_active', 'heater_active', 'heater_output', 'mode', 'auto_source'].map(key => explanationField(key)),
    FIELD('free_cooling_enabled', 'Frikjøling – tillatt', 'switch', 'switch.systemair_save_frikjoling'),
    FIELD('eco_enabled', 'ECO – aktivert', 'switch', 'switch.systemair_save_eco_modus'),
    FIELD('eco_active', 'ECO – rapportert aktiv', 'binary_sensor', 'binary_sensor.loft_systemair_save_eco_aktiv'),
    FIELD('cooker_hood_active', 'Kjøkkenhette – rapportert aktiv', 'binary_sensor', 'binary_sensor.systemair_save_kjokkenhette_aktiv'),
    ...['supply_rpm', 'extract_rpm', 'outdoor_temperature'].map(key => explanationField(key, { optional: true })),
    FIELD('free_cooling_state', 'Frikjøling – rapportert tilstand (valgfri)', 'sensor', '', { optional: true }),
    FIELD('free_cooling_reliable', 'Frikjøling – temperaturer pålitelige (valgfri)', 'binary_sensor', 'binary_sensor.loft_systemair_save_frikjoling_temperaturer_palitelige', { optional: true }),
    FIELD('free_cooling_diagnosis', 'Frikjøling – lokal HA-diagnose (valgfri)', 'sensor', 'sensor.systemair_frikjoling_kandidat', { optional: true }),
    FIELD('outdoor_max_24h', 'Utetemperatur – maks siste 24t (valgfri)', 'sensor', 'sensor.systemair_ute_max_siste_24t', { optional: true }),
    FIELD('free_cooling_day_min', 'Frikjøling – daggrense (°C, valgfri)', 'number', 'number.systemair_save_frikjoling_dag_min_temperatur', { optional: true }),
    FIELD('free_cooling_night_high', 'Frikjøling – natt høy (°C, valgfri)', 'number', 'number.systemair_save_frikjoling_natt_hoy_grense', { optional: true }),
    FIELD('free_cooling_night_low', 'Frikjøling – natt lav (°C, valgfri)', 'number', 'number.systemair_save_frikjoling_natt_lav_grense', { optional: true }),
    FIELD('free_cooling_room_cancel', 'Frikjøling – rom avbryt (°C, valgfri)', 'number', 'number.systemair_save_frikjoling_rom_avbryt_temperatur', { optional: true }),
    FIELD('electric_power', 'Målt elektrisk effekt (W/kW, valgfri)', 'sensor', 'sensor.vsr300_power', { optional: true }),
    FIELD('electric_energy', 'Målt energi (valgfri)', 'sensor', 'sensor.vsr300_energy', { optional: true }),
    FIELD('supply_setpoint', 'Tilluftsettpunkt (valgfri)', 'number', 'number.systemair_save_tilluft_setpunkt_degc', { optional: true }),
    FIELD('eco_offset', 'ECO – varmeoffset (valgfri)', 'number', 'number.systemair_save_oko_varmeoffset', { optional: true }),
    FIELD('overheat_temperature', 'Overheat-temperatur (valgfri)', 'sensor', 'sensor.systemair_save_overheat_temperature', { optional: true }),
    FIELD('air_quality', 'Rapportert luftkvalitetsnivå (valgfri)', 'sensor', 'sensor.systemair_save_luftkvalitet', { optional: true }),
  ];
  const EXPLANATION_TOPICS = [
  {
    "key": "balance",
    "name": "Balanse",
    "title": "Balanse",
    "icon": "mdi:scale-balance",
    "text": "**Balanse** sammenligner integrasjonens estimerte tilluft- og avtrekksmengde.\n\nLuftmengdene beregnes fra vifteoutput og nominell modellkapasitet (368 m³/h for referansemodellen VSR300). De er **ikke fysisk målte luftmengder**.\n\n**Positiv verdi** betyr at estimert tilluftmengde er større enn estimert avtrekksmengde.\n\n**Negativ verdi** betyr at estimert avtrekksmengde er større enn estimert tilluftmengde.\n\n**Nær null** betyr at estimatene er like. Det bekrefter ikke fysisk balansert ventilasjon eller et bestemt trykk i huset.\n\nVifteinnstillinger og aktiv modus påvirker vifteoutput og dermed disse estimatene. Filtermotstand, kanaltrykk og lekkasjer kan påvirke faktisk luftmengde uten at estimatene beskriver dette.",
    "roles": [
      "supply_flow",
      "extract_flow",
      "supply_rpm",
      "extract_rpm"
    ]
  },
  {
    "key": "free_cooling",
    "name": "Frikjøling",
    "title": "Frikjøling",
    "icon": "mdi:snowflake",
    "text": "**Frikjøling** bruker kaldere uteluft til å kjøle boligen uten mekanisk kjøling.\n\nKjøleeffekt vises gjennom **Huslast**. Når frikjøling rapporteres aktiv og Huslast er positiv, viser Huslast-knappen verdien som **W kjøl**. Verdien er et lokalt effektestimat basert på estimert luftmengde.\n\nStatusknappen kan vise flere tilstander:\n\n**Av**  \nFrikjøling er ikke aktivert/tillatt i aggregatet.\n\n**På**  \nFrikjøling er tillatt, men HA-diagnosen matcher ikke en mer spesifikk tilstand akkurat nå.\n\n**Aktiv**  \nIntegrasjonen rapporterer frikjøling aktiv nå. Da er det normalt at tillufttemperaturen blir lavere enn valgt tilluftssettpunkt, fordi hensikten er å kjøle huset.\n\n**Kandidat**  \nDe eksponerte verdiene i HA tyder på at frikjøling kan starte eller burde kunne kjøre nå. Dette er en HA-diagnose, ikke nødvendigvis Systemair sin interne beslutning.\n\n**Venter tid**  \nTemperaturvilkårene ser ut til å kunne være OK, men nåværende tidspunkt er utenfor start-/sluttvinduet for frikjøling.\n\n**Dag ikke OK**  \nMaks utetemperatur siste 24 timer er lavere enn `Frikjøling – dag min. temperatur`. Aggregatet skal normalt bare nattkjøle hvis dagen har vært varm nok.\n\n**For varmt**  \nAktuell utetemperatur er over `Frikjøling – natt høy grense`. Natteluften er da ikke kjølig nok til nyttig frikjøling.\n\n**For kaldt**  \nAktuell utetemperatur er under `Frikjøling – natt lav grense`. Aggregatet bør da stoppe/blokkere frikjøling for å unngå for kald tilluft/overkjøling.\n\n**Rom kaldt**  \nAvtrekk-/romtemperaturen er på eller under `Frikjøling – rom avbryt temperatur`. Huset er da kaldt nok, og frikjøling skal ikke fortsette.\n\n**Rapportert diagnostikk** kan vise Dagfase eller Temperaturer usikre når tilsvarende integrasjonsentiteter er valgt. Dette vises separat fra en valgfri lokal HA-diagnose.\n\n**Lokal HA-diagnose** er kilden til Kandidat, Venter tid og de lokale temperaturvurderingene. Disse brukes bare når en slik sensor er valgt og har en kjent verdi. De er ikke avleste begrunnelser fra firmware. Uten diagnosen vises fortsatt rapportert aktivitet og tillatelse.\n\nEn maksimumstemperatur over siste døgn krever historikk. Kortet utleder ikke denne fra en enkelt temperaturavlesning og oppretter ingen historikksensor.",
    "roles": [
      "free_cooling_active",
      "free_cooling_enabled",
      "free_cooling_state",
      "free_cooling_reliable",
      "free_cooling_diagnosis",
      "outdoor_temperature",
      "outdoor_max_24h",
      "free_cooling_day_min",
      "free_cooling_night_high",
      "free_cooling_night_low",
      "free_cooling_room_cancel"
    ]
  },
  {
    "key": "eco",
    "name": "ECO",
    "title": "ECO",
    "icon": "mdi:leaf",
    "text": "**ECO** vises med to uavhengige avlesninger fra aggregatet.\n\n- **På / Av** er ECO-valget fra bryteren: om funksjonen er aktivert.\n- **Aktiv / Inaktiv** er aggregatets rapporterte ECO-status (IR2521).\n- **Valg ukjent / Status ukjent** betyr at den aktuelle avlesningen mangler\n  eller er utilgjengelig.\n\n**På · Inaktiv** betyr at ECO er aktivert, mens aggregatet rapporterer\nfunksjonen inaktiv ved avlesningen. **På · Aktiv** betyr at begge er på.\nHvis valget og statusen avviker, vises de hver for seg uten å korrigere verdiene.\n\nGrønn kant markerer rapportert aktiv ECO-status. Grå kant betyr\nrapportert inaktiv status. Gul kant betyr ukjent aktiv-status.\n\nAktiv-statusen er en firmwarebeslutning. Den dokumenterer ikke alene hvor\nmange watt som spares, eller at TRIAC-pådraget begrenses i dette øyeblikket.\nKortet utleder heller ingen egen ECO-status fra frikjølingssignalet.\n\nDet eldre signalet IR2506 kan vurderes som separat diagnostikk. Det brukes ikke til å beregne denne statusvisningen.",
    "roles": [
      "eco_enabled",
      "eco_active",
      "eco_offset",
      "heater_output",
      "supply_setpoint"
    ]
  },
  {
    "key": "hood",
    "name": "Hette",
    "title": "Hette",
    "icon": "mdi:chef-hat",
    "text": "**Hette** viser om kjøkkenhettefunksjonen i aggregatet er aktiv.\n\n**Av** betyr at kjøkkenhetteinngangen ikke påvirker ventilasjonen akkurat nå.  \n**Aktiv** betyr at aggregatet har registrert kjøkkenhettefunksjon/ekstern inngang og kan kompensere med endret luftmengde.\n\nTypiske effekter:\n- endret tilluft-/avtrekksbalanse\n- høyere viftehastighet\n- midlertidig overstyring av normal drift\n- mulig avvik mellom valgt og rapportert driftsmodus",
    "roles": [
      "cooker_hood_active",
      "supply_flow",
      "extract_flow",
      "supply_rpm",
      "extract_rpm"
    ]
  },
  {
    "key": "heater",
    "name": "Ettervarme",
    "title": "Ettervarme",
    "icon": "mdi:heat-wave",
    "text": "**Ettervarme** er det elektriske varmeelementet på tilluftssiden.\n\nVarmestatus og pådrag vises separat:\n\n- **Aktiv farge** betyr at aggregatet rapporterer varmefunksjonen aktiv.\n- **Inaktiv farge** betyr at aggregatet rapporterer varmefunksjonen inaktiv.\n- **Gul markering / Ukjent** betyr at varmestatusen mangler eller er utilgjengelig.\n- **Prosenttallet** er rapportert TRIAC-pådrag. Manglende pådrag vises som ukjent.\n\n**0 %** betyr null rapportert TRIAC-pådrag ved avlesningen. Prosenttallet\nbrukes ikke alene til å avgjøre om varmefunksjonen er aktiv. Et pådrag over\nnull er et utgangssignal, ikke en måling av elektrisk effekt i W.\n\nStatusknappens farge kommer fra `{{heater_active}}`\n(IR3103). Prosenttallet kommer fra `{{heater_output}}`\n(IR2149). Hvis signalene avviker, vises de hver for seg.\n\nEttervarme bestemmes ikke av én enkelt sensor. Den styres av aggregatets\ntemperaturregulering og kan påvirkes av tilluftstemperatur, tilluftssettpunkt,\nutetemperatur, avtrekk-/romtemperatur, reguleringsmodus, aktiv sesong, ECO,\nfrikjøling og spesialmoduser.",
    "roles": [
      "heater_active",
      "heater_output",
      "overheat_temperature",
      "supply_temperature",
      "supply_setpoint",
      "electric_power",
      "eco_active"
    ]
  },
  {
    "key": "electric",
    "name": "Elektrisk",
    "title": "Elektrisk forbruk",
    "icon": "mdi:flash",
    "text": "**Elektrisk** er målt elektrisk effekt fra en valgfri effektmåler på aggregatet, for eksempel Shelly.\n\nDette inkluderer:\n- vifter\n- styringselektronikk\n- eventuell elektrisk ettervarme\n\nTolkning:\n- Lav effekt: vanlig viftedrift uten ettervarme.\n- Moderat/høyere effekt: høyere viftehastighet, for eksempel frikjøling, boost eller kjøkkenhette.\n- Tydelig høy effekt: ofte ettervarme.",
    "roles": [
      "electric_power",
      "electric_energy",
      "heater_output",
      "supply_rpm",
      "extract_rpm"
    ]
  },
  {
    "key": "house_load",
    "name": "Huslast",
    "title": "Huslast",
    "icon": "mdi:home-thermometer-outline",
    "text": "**Huslast** er et estimat beregnet i kortet av termisk effekt fra temperaturforskjellen mellom avtrekk og tilluft og estimert tilluftmengde.\n\nFormelen er:\n\n`0,335 × tilluft m³/h × (avtrekkstemperatur − tilluftstemperatur)`\n\nLuftmengden er beregnet av integrasjonen, ikke fysisk målt. Resultatet er derfor et effektestimat i W. Det inkluderer ikke ekstra varmebehov fra eventuell infiltrasjon ved ubalanse.\n\n**Positiv verdi** betyr at tilluften er kaldere enn avtrekk/rom.  \nI normal drift betyr det varmebehov/ventilasjonsvarmetap.  \nVed frikjøling betyr det ønsket kjøleeffekt mot huset.\n\n**Negativ verdi** betyr at tilluften er varmere enn avtrekk/rom.  \nDa tilfører ventilasjonen varme til huset.\n\nKortet beregner denne verdien fra integrasjonens luftmengde og temperaturer. Det opprettes ingen HA-sensor, og beregningen bruker ikke den elektriske effektmåleren.",
    "roles": [
      "supply_flow",
      "supply_temperature",
      "extract_temperature",
      "free_cooling_active"
    ]
  },
  {
    "key": "auto",
    "name": "Auto-styring",
    "title": "Auto-styring",
    "icon": "mdi:fan-auto",
    "text": "**Auto-styring** viser aggregatets rapporterte styrekilde når rapportert\ndriftsmodus er Auto. Kilden kommer fra IR1062.\n\n- **Styres av ukeprogram**: aggregatet rapporterer ukeprogram som styrekilde.\n- **Behovsstyring**: aggregatet rapporterer behovsstyring som styrekilde.\n- **Ekstern styring**: aggregatet rapporterer ekstern styring som styrekilde.\n- **Konfigurasjonsfeil**: aggregatet rapporterer denne statusen som Auto-kilde.\n- **Styrekilde ukjent**: driftsmodusen er Auto, men kildeverdien mangler,\n  er utilgjengelig eller ikke gjenkjennes.\n- **Ikke aktiv**: aggregatet rapporterer en annen driftsmodus enn Auto.\n- **Modus ukjent**: avlesningen av driftsmodus mangler eller er utilgjengelig.\n\nStyrekilden beskriver hvem som styrer Auto. Den er ingen avlesning av aktivt\nviftenivå eller fysisk luftmengde. Luftkvalitetsnivået Economy/Good/Improve\noversettes derfor ikke til Lav/Normal/Høy. Kortet beregner heller ikke\nviftenivå fra luftmengdegrenser.\n\nRapportert driftsmodus, manuelle innstillinger, vifteoutput og RPM må\nvurderes som forskjellige signaler. Integrasjonens luftmengder er estimater\nbasert på vifteoutput og modellkapasitet.",
    "roles": [
      "auto_source",
      "mode",
      "air_quality",
      "supply_rpm",
      "extract_rpm",
      "supply_flow",
      "extract_flow"
    ]
  }
];
  const EXPLANATION_STYLE = `
    :host{container-type:inline-size}
    ha-card{display:block;background:var(--card-background-color,#1c1c1c);color:var(--primary-text-color,#e2e8f0);border-radius:20px;padding:16px}
    .status-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .status-button{min-height:112px;padding:10px 6px;gap:6px;border-radius:18px;border-color:var(--accent);background:var(--tile-tint);overflow-wrap:anywhere}
    .status-button[aria-expanded=true]{outline:2px solid var(--accent);outline-offset:2px}
    .status-button strong{font-size:14px}.status-button .reading{font-size:16px;font-weight:850;line-height:1.3}.status-button .kind{font-size:12px;line-height:1.3;color:var(--secondary-text-color,#9b9b9b)}
    .status-button ha-icon{--mdc-icon-size:28px}.explanation-panel{margin-top:20px;border-top:1px solid var(--divider-color,#636363);padding-top:16px;font-size:15px;line-height:1.55}
    .explanation-panel[hidden]{display:none}.explanation-panel h3{margin:0 0 8px;font-size:20px}.summary{font-weight:700;margin:0 0 12px}.explanation-panel p{margin:0 0 14px}.explanation-panel ul{padding-left:22px;margin:0 0 14px}
    code{font-size:.9em;overflow-wrap:anywhere}.values{width:100%;border-collapse:collapse;table-layout:fixed;margin:12px 0 16px}.values td{padding:7px 4px;border-bottom:1px solid var(--divider-color,#636363);vertical-align:top;overflow-wrap:anywhere}.values td:first-child{width:58%}.values .source{display:block;font-weight:400;font-size:12px;color:var(--secondary-text-color,#9b9b9b)}
    .close-row{display:flex;justify-content:flex-end}.close-button{min-height:44px;flex-direction:row;padding:8px 16px;gap:8px;border-radius:12px}.close-button ha-icon{--mdc-icon-size:20px}
    @media(max-width:380px){ha-card{padding:12px}.status-grid{gap:6px}.status-button{padding:8px 4px}}
  `;
  // This deliberately supports only the static paragraphs, lists, bold and code
  // used by the reviewed source card. Escape first; never execute source YAML/JS.
  function explanationHtml(text) {
    const inline = value => escape(value).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    const result = []; let paragraph = [], items = [];
    const flush = () => {
      if (paragraph.length) result.push(`<p>${inline(paragraph.join(' '))}</p>`);
      if (items.length) result.push(`<ul>${items.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`);
      paragraph = []; items = [];
    };
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line) { flush(); continue; }
      if (line.startsWith('- ')) {
        if (paragraph.length) { result.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; }
        items.push(line.slice(2));
      } else if (items.length) items[items.length - 1] += ' ' + line;
      else paragraph.push(line);
    }
    flush(); return result.join('');
  }

  class Vsr300ExplanationsCard extends BaseCard {
    static fields = EXPLANATION_FIELDS;
    static defaultTitle = 'Status og forklaringer';
    constructor() {
      super(); this._selected = null;
      this.shadowRoot.addEventListener('click', event => {
        const button = event.composedPath().find(el => el instanceof HTMLElement && el.matches('button[data-topic],button[data-close]'));
        if (!button) return;
        const closing = button.hasAttribute('data-close'), previous = this._selected;
        if (closing) this._selected = null;
        else if (EXPLANATION_TOPICS.some(topic => topic.key === button.dataset.topic)) this._selected = previous === button.dataset.topic ? null : button.dataset.topic;
        this._renderIfReady();
        if (closing && previous) this.shadowRoot.querySelector(`button[data-topic="${previous}"]`)?.focus({ preventScroll: true });
      });
    }
    setConfig(config) {
      if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('Kortoppsettet må være et objekt.');
      if (config?.show_sources != null && typeof config.show_sources !== 'boolean') throw new Error('Vis datakilder må være på eller av.');
      const tolerance = config?.balance_tolerance ?? 15;
      if (typeof tolerance !== 'number' || !Number.isFinite(tolerance) || tolerance < 0) throw new Error('Balansegrensen må være et tall fra 0 og oppover.');
      super.setConfig({ ...config, show_title: config?.show_title ?? true, show_sources: config?.show_sources ?? false, balance_tolerance: tolerance });
    }
    static getStubConfig() { return { ...super.getStubConfig(), show_title: true, show_sources: false, balance_tolerance: 15 }; }
    static getConfigForm() {
      const form = super.getConfigForm(), helper = form.computeHelper, label = form.computeLabel;
      form.schema.find(field => field.name === 'show_title').default = true;
      form.schema.splice(2, 0, { name: 'show_sources', default: false, selector: { boolean: {} } }, { name: 'balance_tolerance', default: 15, selector: { number: { min: 0, mode: 'box', unit_of_measurement: 'm³/h' } } });
      form.computeLabel = field => ({ show_sources: 'Vis entitets-ID-er i forklaringene', balance_tolerance: 'Grense for markering av estimert ubalanse' })[field.name] || label(field);
      form.computeHelper = field => field.name === 'free_cooling_diagnosis' ? 'Valgfri lokal tolkning fra eksisterende HA-sensor. Bevarer Kandidat/Venter tid og temperaturdiagnoser; er ikke en firmwarestatus.' : field.name === 'outdoor_max_24h' ? 'Valgfri historikkbasert HA-verdi. Kortet oppretter ingen døgnsensor.' : field.name === 'electric_power' ? 'Valgfri faktisk måling, for eksempel Shelly. Brukes ikke i Huslast-beregningen.' : helper(field);
      return form;
    }
    getCardSize() { return this._selected ? 16 : 8; }
    _raw(role) {
      const value = state(this._hass.states, this._config.entities[role]);
      return value == null || String(value).trim() === '' || ['unknown', 'unavailable'].includes(value) ? undefined : String(value);
    }
    _quantity(role, kind) {
      const id = this._config.entities[role], value = number(this._hass.states, id);
      if (value === null) return null;
      const unit = this._hass.states[id]?.attributes?.unit_of_measurement;
      if (kind === 'flow') {
        if (value < 0) return null;
        return !unit || ['m³/h', 'm3/h'].includes(unit) ? value : unit === 'l/s' ? value * 3.6 : null;
      }
      if (kind === 'temperature') return !unit || unit === '°C' ? value : unit === '°F' ? (value - 32) * 5 / 9 : null;
      if (kind === 'power') return !unit || unit === 'W' ? value : unit === 'kW' ? value * 1000 : null;
      return value;
    }
    _freeCooling() {
      const e = this._config.entities, s = this._hass.states;
      const active = binary(s, e.free_cooling_active), enabled = binary(s, e.free_cooling_enabled);
      if (active === true) return { label: 'Aktiv', color: '#38bdf8', kind: 'Rapportert' };
      if (enabled === false) return { label: active === null ? 'Av · status ukjent' : 'Av', color: active === null ? '#facc15' : '#64748b', kind: 'Rapportert' };
      if (active === null) return { label: 'Status ukjent', color: '#facc15', kind: 'Mangler avlesning' };
      if (enabled === null) return { label: 'Valg ukjent', color: '#facc15', kind: 'Mangler avlesning' };
      const diagnostic = this._raw('free_cooling_state');
      if (['disabled', '0'].includes(diagnostic)) return { label: 'Tilstand: av', color: '#64748b', kind: 'Rapportert diagnostikk' };
      if (['daytime', '2'].includes(diagnostic)) return { label: 'Dagfase', color: '#38bdf8', kind: 'Rapportert diagnostikk' };
      if (['temperatures_not_reliable', '3'].includes(diagnostic) || binary(s, e.free_cooling_reliable) === false) return { label: 'Temperaturer usikre', color: '#facc15', kind: 'Rapportert diagnostikk' };
      const local = this._raw('free_cooling_diagnosis');
      for (const [fragment, label] of [['Kandidat nå', 'Kandidat'], ['utenfor', 'Venter tid'], ['Dagvilkår', 'Dag ikke OK'], ['For varmt', 'For varmt'], ['For kaldt', 'For kaldt'], ['Rom kaldt', 'Rom kaldt']]) {
        if (local?.includes(fragment)) return { label, color: '#38bdf8', kind: 'Lokal HA-diagnose' };
      }
      return { label: 'På', color: '#38bdf8', kind: 'Rapportert · inaktiv' };
    }
    _statuses() {
      const e = this._config.entities, s = this._hass.states;
      const supply = this._quantity('supply_flow', 'flow'), extract = this._quantity('extract_flow', 'flow');
      const supplyT = this._quantity('supply_temperature', 'temperature'), extractT = this._quantity('extract_temperature', 'temperature');
      const difference = supply === null || extract === null ? null : Math.round(supply - extract);
      const load = supply === null || supplyT === null || extractT === null ? null : 0.335 * supply * (extractT - supplyT);
      const cooling = binary(s, e.free_cooling_active), eco = binary(s, e.eco_active), enabled = binary(s, e.eco_enabled), hood = binary(s, e.cooker_hood_active), heat = binary(s, e.heater_active);
      const heater = number(s, e.heater_output), power = this._quantity('electric_power', 'power');
      const mode = this._raw('mode'), source = this._raw('auto_source');
      const loadLabel = load === null ? 'Ukjent' : Math.round(Math.abs(load)) === 0 ? '≈ 0 W' : load < 0 ? `≈ ${Math.abs(load).toFixed(0)} W varme` : `≈ ${load.toFixed(0)} W${cooling === true ? ' kjøl' : cooling === false ? ' tap' : ''}`;
      return {
        balance: { label: difference === null ? 'Ukjent' : `≈ ${difference > 0 ? '+' : ''}${difference} m³/h`, color: difference === null ? '#facc15' : Math.abs(difference) < this._config.balance_tolerance ? '#4ade80' : '#fb923c', kind: 'Estimat' },
        free_cooling: this._freeCooling(),
        eco: { label: `${enabled === null ? 'Valg ukjent' : enabled ? 'På' : 'Av'} · ${eco === null ? 'status ukjent' : eco ? 'Aktiv' : 'Inaktiv'}`, color: eco === null ? '#facc15' : eco ? '#a3e635' : '#64748b', kind: 'Rapportert' },
        hood: { label: hood === null ? 'Ukjent' : hood ? 'Aktiv' : 'Av', color: hood === null ? '#facc15' : '#fb923c', kind: 'Rapportert' },
        heater: { label: heater === null ? 'Pådrag ukjent' : `${heat === null ? 'Ukjent · ' : ''}${heater.toFixed(0)} %`, color: heat === null ? '#facc15' : heat ? '#f87171' : '#fb923c', kind: heat === null ? 'Varmestatus ukjent' : heat ? 'Varmefunksjon aktiv' : 'Varmefunksjon inaktiv' },
        electric: { label: power === null ? 'Ikke tilgjengelig' : `${power.toFixed(0)} W`, color: power === null ? '#94a3b8' : '#38bdf8', kind: 'Valgfri måling' },
        house_load: { label: loadLabel, color: load === null ? '#facc15' : cooling === true ? '#38bdf8' : '#fb923c', kind: 'Beregnet i kortet' },
        auto: { label: !Object.hasOwn(MODE_NAMES, mode) ? 'Modus ukjent' : mode !== 'auto' ? 'Ikke aktiv' : AUTO_NAMES[source] || 'Styrekilde ukjent', color: !Object.hasOwn(MODE_NAMES, mode) || mode === 'auto' && (!Object.hasOwn(AUTO_NAMES, source) || source === 'configuration_fault') ? '#facc15' : '#84cc16', kind: 'Rapportert styrekilde' },
      };
    }
    _value(role) {
      const id = this._config.entities[role], entity = this._hass.states[id];
      if (!this._raw(role)) return 'Ukjent';
      if (entity.state === 'on') return 'På';
      if (entity.state === 'off') return 'Av';
      if (this._hass.formatEntityState) return this._hass.formatEntityState(entity);
      return `${entity.state}${entity.attributes?.unit_of_measurement ? ' ' + entity.attributes.unit_of_measurement : ''}`;
    }
    _details(topic, status) {
      const text = topic.text.replace(/\{\{([a-z0-9_]+)\}\}/g, (_, role) => EXPLANATION_FIELDS.find(field => field.key === role)?.label || 'Beregnet i kortet');
      const rows = topic.roles.filter(role => this._config.entities[role]).map(role => {
        const field = EXPLANATION_FIELDS.find(item => item.key === role), id = this._config.entities[role];
        return `<tr><td>${escape(field.label)}${this._config.show_sources ? `<code class="source">${escape(id)}</code>` : ''}</td><td>${escape(this._value(role))}</td></tr>`;
      }).join('');
      return `<h3 id="explanation-title">${escape(topic.title)}</h3><p class="summary">${escape(status.label)} · ${escape(status.kind)}</p>${explanationHtml(text)}${rows ? `<table class="values" aria-label="Relevante verdier"><tbody>${rows}</tbody></table>` : ''}<div class="close-row"><button class="close-button" data-close type="button"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon>Lukk</button></div>`;
    }
    _render() {
      const focus = this.shadowRoot.activeElement?.dataset.topic, statuses = this._statuses();
      const topic = EXPLANATION_TOPICS.find(item => item.key === this._selected);
      this.shadowRoot.innerHTML = `<style>${SHARED_STYLE}${EXPLANATION_STYLE}</style><ha-card>${this._heading()}${this._missingNotice()}<div class="status-grid">${EXPLANATION_TOPICS.map(item => {
        const status = statuses[item.key];
        return `<button class="status-button" type="button" data-topic="${item.key}" aria-expanded="${this._selected === item.key}" aria-controls="explanation-panel" style="--accent:${status.color};--tile-tint:${status.color}12"><ha-icon icon="${item.icon}" aria-hidden="true"></ha-icon><strong>${escape(item.name)}</strong><span class="reading">${escape(status.label)}</span><span class="kind">${escape(status.kind)}</span></button>`;
      }).join('')}</div><section id="explanation-panel" class="explanation-panel" aria-labelledby="explanation-title" ${topic ? '' : 'hidden'}>${topic ? this._details(topic, statuses[topic.key]) : ''}</section></ha-card>`;
      if (focus) this.shadowRoot.querySelector(`button[data-topic="${focus}"]`)?.focus({ preventScroll: true });
    }
  }

  // Home Assistant renders native graphical editors from getConfigForm().
  for (const [name, constructor] of [['vsr300-svg-card', Vsr300SvgCard], ['vsr300-control-card', Vsr300ControlCard], ['vsr300-explanations-card', Vsr300ExplanationsCard]]) {
    if (!customElements.get(name)) customElements.define(name, constructor);
  }
  window.customCards = window.customCards || [];
  for (const [type, name, description] of [
    ['vsr300-svg-card', 'Systemair SVG', 'Prosessillustrasjon med temperaturer, pådrag, filterstatus og rapportert resttid.'],
    ['vsr300-control-card', 'Systemair Kontrollpanel', 'Modusknapper med betjening gjennom Systemair-integrasjonen.'],
    ['vsr300-explanations-card', 'Systemair Status og forklaringer', 'Åtte statusfelt og forklaringer med lokalt menyvalg og beregnet Huslast.'],
  ]) if (!window.customCards.some(card => card.type === type)) window.customCards.push({ type, name, description, preview: true });
})();
