/* VSR300 custom cards · version 1.0.0 · 2026-10-21
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 stboee
 * Based on Systemair SVG / Kontrollpanel 4.8.1.
 * Uses Home Assistant states and services; Howard owns all Modbus communication.
 * User-specific defaults are initial entity bindings, never measurement fallbacks.
 * Source and local verification: see README.md and VERIFIKASJON.md.
 */
(() => {
  'use strict';
  const VERSION = '1.0.0';
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
    FIELD('recovery_output', 'Gjenvinningspådrag (%)', 'sensor', 'sensor.systemair_save_varmegjenvinning'),
    FIELD('heater_output', 'Ettervarmepådrag (%)', 'sensor', 'sensor.systemair_save_triac_after_manual_override'),
    FIELD('heater_active', 'Varmefunksjon aktiv', 'binary_sensor', 'binary_sensor.loft_systemair_save_ettervarme_aktiv'),
    FIELD('free_cooling_active', 'Frikjøling aktiv', 'binary_sensor', 'binary_sensor.systemair_save_frikjoling_aktiv'),
    FIELD('countdown', 'Gjenstående modustid (sekunder)', 'sensor', 'sensor.systemair_save_countdown_mode_time'),
    FIELD('filter_warning', 'Filtervarsel', 'binary_sensor', 'binary_sensor.systemair_save_filtervarsel'),
    FIELD('filter_alarm', 'Filteralarm', 'binary_sensor', 'binary_sensor.systemair_save_filteralarm'),
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
  function normalize(config, fields, title) {
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
    return { ...config, title: config.title === undefined ? title : String(config.title), entities };
  }
  const SHARED_STYLE = `
    :host{display:block;color:var(--primary-text-color,#e2e8f0);font-family:var(--paper-font-body1_-_font-family,Arial,sans-serif)}
    h2{font-size:20px;font-weight:600;line-height:1.4;margin:8px 0 14px;padding:0 8px}
    .notice{font-size:13px;line-height:1.45;padding:10px 14px;border-radius:10px;background:rgba(250,204,21,.10);color:var(--primary-text-color,#e2e8f0);margin:8px 0}
    .svg-wrap{width:100%;border-radius:30px;overflow:hidden}.systemair-svg{width:100%;height:auto;display:block}
    .filter-status{font-size:14px;font-weight:700;line-height:1.4;text-align:center;padding:8px 12px;border-radius:12px;margin-top:6px}
    .filter-alarm{background:#7f1d1d;color:#fecaca}.filter-warning{background:#78350f;color:#fde68a}.filter-unknown{background:#334155;color:#e2e8f0}
    .footnote{font-size:12px;opacity:.7;line-height:1.5;margin:6px 10px}
    .grid{display:grid;gap:8px;margin-bottom:16px}.two{grid-template-columns:repeat(2,minmax(0,1fr))}.three{grid-template-columns:repeat(3,minmax(0,1fr))}
    h3{font-size:16px;font-weight:600;margin:20px 8px 12px}
    button{font:inherit;min-width:0;min-height:92px;border:1px solid var(--divider-color,rgba(255,255,255,.16));border-radius:20px;background:rgba(127,127,127,.06);color:inherit;padding:12px 6px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;box-sizing:border-box}
    .large{min-height:104px;border-radius:22px}.large strong{font-size:20px}button strong{font-size:14px;font-weight:900}button small{font-size:12px;opacity:.8;line-height:1.3;white-space:normal}
    ha-icon{--mdc-icon-size:36px;color:var(--accent)}.large ha-icon{--mdc-icon-size:42px}
    button.active{border:2px solid var(--accent);background:linear-gradient(135deg,var(--tint),transparent)}
    button:focus-visible{outline:3px solid var(--primary-color,#03a9f4);outline-offset:2px}button:disabled{opacity:.45;cursor:not-allowed}
    .error{background:rgba(239,68,68,.13);color:var(--error-color,#ef4444);font-size:14px;padding:12px;border-radius:12px;margin:8px 0}.error:empty{display:none}
    @media(prefers-reduced-motion:reduce){.duct-flow,.fan-blade{animation:none!important}}
  `;
  class BaseCard extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); this._previousStates = []; }
    setConfig(config) {
      this._config = normalize(config, this.constructor.fields, this.constructor.defaultTitle);
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
    _heading() { return this._config.title ? `<h2>${escape(this._config.title)}</h2>` : ''; }
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
    static getStubConfig() { return { title: this.defaultTitle, entities: defaults(this.fields) }; }
    static getConfigForm() {
      const fields = this.fields;
      return {
        schema: [
          { name: 'title', selector: { text: {} } },
          { name: 'entities', type: 'expandable', title: 'Entitetskoblinger', schema: fields.map(f => ({ name: f.key, required: !f.optional, selector: { entity: { filter: { domain: f.domain } } } })) },
        ],
        computeLabel: schema => schema.name === 'title' ? 'Overskrift' : fields.find(f => f.key === schema.name)?.label || schema.name,
        computeHelper: schema => fields.find(f => f.key === schema.name)?.optional ? 'Valgfri kobling. Kan stå tom.' : undefined,
      };
    }
  }

  class Vsr300SvgCard extends BaseCard {
    static fields = SVG_FIELDS;
    static defaultTitle = 'Systemair SVG';
    getCardSize() { return 11; }
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
let timeText = modeKnown ? 'Ikke tidsstyrt' : 'Modus ukjent';
let pct = modeKnown ? 100 : 0;
if (TIMED[modeRaw]) {
  const seconds = number(states, e.countdown);
  const [durationRole, scale] = TIMED[modeRaw];
  const duration = number(states, e[durationRole]);
  const total = duration !== null && duration > 0 ? duration * scale : null;
  pct = seconds !== null && seconds >= 0 && total !== null ? Math.max(0, Math.min(100, seconds / total * 100)) : 0;
  if (seconds === null || seconds < 0) timeText = 'Resttid ukjent';
  else {
    const remaining = Math.floor(seconds);
    if (remaining >= 86400) timeText = `${Math.floor(remaining / 86400)}d ${Math.floor(remaining % 86400 / 3600)}t igjen`;
    else if (remaining >= 3600) timeText = `${Math.floor(remaining / 3600)}t ${Math.floor(remaining % 3600 / 60)}m igjen`;
    else timeText = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')} igjen`;
  }
}
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
    <div class="svg-wrap">
      <svg role="img" aria-label="Systemair prosessillustrasjon" class="systemair-svg" viewBox="0 -250 1300 1255" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="panelBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#172033" />
            <stop offset="100%" stop-color="#0b1120" />
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
              fill: #ffffff;
              letter-spacing: 1px;
            }
            .small {
              font-family: Arial, sans-serif;
              font-size: 42px;
              font-weight: 900;
              fill: #e2e8f0;
            }
            .value {
              font-family: Arial, sans-serif;
              font-size: 60px;
              font-weight: 950;
              fill: #ffffff;
            }
            .tiny {
              font-family: Arial, sans-serif;
              font-size: 33px;
              font-weight: 900;
              fill: #dbeafe;
            }
            .micro {
              font-family: Arial, sans-serif;
              font-size: 32px;
              font-weight: 900;
              fill: #e2e8f0;
            }
            .heater-text {
              font-family: Arial, sans-serif;
              font-size: 31px;
              font-weight: 900;
              fill: #ffffff;
            }
            .mode-title {
              font-family: Arial, sans-serif;
              font-size: 32px;
              font-weight: 900;
              fill: #cbd5e1;
            }
            .mode-value {
              font-family: Arial, sans-serif;
              font-size: 58px;
              font-weight: 950;
              fill: #ffffff;
            }
            .mode-time {
              font-family: Arial, sans-serif;
              font-size: 38px;
              font-weight: 900;
              fill: #e2e8f0;
            }
            .duct-base {
              fill: none;
              stroke: rgba(255,255,255,0.16);
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

        <rect x="0" y="-250" width="1300" height="1255" rx="34" fill="url(#panelBg)" />

        <rect x="365" y="-200" width="570" height="875" rx="46" fill="url(#unitBg)" stroke="#64748b" stroke-width="4" />
        <rect x="392" y="-170" width="516" height="815" rx="34" fill="rgba(15,23,42,0.64)" stroke="rgba(148,163,184,0.38)" stroke-width="2" />

        <rect x="28" y="-220" width="280" height="220" rx="28" fill="#1e40af" stroke="#93c5fd" stroke-width="4" />
        <text x="168" y="-160" text-anchor="middle" class="label">INNTAK</text>
        <text x="168" y="-85" text-anchor="middle" class="value">${uteT}</text>
        <text x="168" y="-29" text-anchor="middle" class="small">${uteRh}</text>

        <rect x="28" y="455" width="280" height="220" rx="28" fill="#166534" stroke="#86efac" stroke-width="4" />
        <text x="168" y="515" text-anchor="middle" class="label">TILLUFT</text>
        <text x="168" y="590" text-anchor="middle" class="value">${tilluftT}</text>
        <text x="168" y="646" text-anchor="middle" class="small">${tilluftFlow}</text>

        <rect x="992" y="-220" width="280" height="220" rx="28" fill="#334155" stroke="#cbd5e1" stroke-width="4" />
        <text x="1132" y="-165" text-anchor="middle" class="label">AVKAST</text>
        <text x="1132" y="-85" text-anchor="middle" class="small">${avkastFlow}</text>
        <text x="1132" y="-29" text-anchor="middle" class="micro">estimert</text>

        <rect x="992" y="455" width="280" height="220" rx="28" fill="#9a3412" stroke="#fdba74" stroke-width="4" />
        <text x="1132" y="515" text-anchor="middle" class="label">AVTREKK</text>
        <text x="1132" y="590" text-anchor="middle" class="value">${avtrekkT}</text>
        <text x="1132" y="646" text-anchor="middle" class="small">${inneRh}</text>

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

        <g opacity="${exchangerOpacity}">
          <polygon points="530,135 650,85 770,135 770,370 650,420 530,370"
                   fill="rgba(88,28,135,0.56)" stroke="#d946ef" stroke-width="4" />
          <polygon points="560,165 650,125 740,165 740,345 650,385 560,345"
                   fill="rgba(15,23,42,0.70)" stroke="rgba(255,255,255,0.30)" stroke-width="3" />

          <line x1="575" y1="187" x2="725" y2="320" stroke="rgba(216,180,254,0.66)" stroke-width="10" stroke-linecap="round" />
          <line x1="595" y1="170" x2="745" y2="303" stroke="rgba(216,180,254,0.42)" stroke-width="7" stroke-linecap="round" />
          <line x1="555" y1="215" x2="705" y2="348" stroke="rgba(216,180,254,0.42)" stroke-width="7" stroke-linecap="round" />

          <line x1="725" y1="187" x2="575" y2="320" stroke="rgba(125,211,252,0.66)" stroke-width="10" stroke-linecap="round" />
          <line x1="705" y1="170" x2="555" y2="303" stroke="rgba(125,211,252,0.42)" stroke-width="7" stroke-linecap="round" />
          <line x1="745" y1="215" x2="595" y2="348" stroke="rgba(125,211,252,0.42)" stroke-width="7" stroke-linecap="round" />

          <text x="650" y="225" text-anchor="middle" class="label" style="font-size:25px">GJENVINNINGS-</text>
          <text x="650" y="262" text-anchor="middle" class="label" style="font-size:30px">PÅDRAG</text>
          <text x="650" y="315" text-anchor="middle" class="value">${gjenv}</text>
        </g>

        <g opacity="${freeOpacity}">
          <rect x="510" y="150" width="280" height="205" rx="30" fill="rgba(12,74,110,0.88)" stroke="#38bdf8" stroke-width="5" />
          <text x="650" y="223" text-anchor="middle" class="label">FRIKJØLING</text>
          <text x="650" y="285" text-anchor="middle" class="small">utenom</text>
          <text x="650" y="333" text-anchor="middle" class="small">veksler</text>
        </g>

        <rect x="392" y="-170" width="66" height="135" rx="14" class="supply-filter" data-status="${filterState}" fill="${fc ? fc[0] : '#1e3a8a'}" stroke="${fc ? fc[1] : '#93c5fd'}" stroke-width="${fc ? 7 : 4}" />
        <line x1="407" y1="-145" x2="443" y2="-60" stroke="#bfdbfe" stroke-width="6" />
        <line x1="443" y1="-145" x2="407" y2="-60" stroke="#bfdbfe" stroke-width="6" />
        <line x1="425" y1="-150" x2="425" y2="-55" stroke="rgba(255,255,255,0.42)" stroke-width="4" />
        ${filterBadge(458, -165)}
        <text x="425" y="0" text-anchor="middle" class="micro">FILTER</text>

        <rect x="842" y="500" width="66" height="135" rx="14" class="extract-filter" data-status="${filterState}" fill="${fc ? fc[0] : '#7c2d12'}" stroke="${fc ? fc[1] : '#fdba74'}" stroke-width="${fc ? 7 : 4}" />
        <line x1="857" y1="525" x2="893" y2="610" stroke="#fed7aa" stroke-width="6" />
        <line x1="893" y1="525" x2="857" y2="610" stroke="#fed7aa" stroke-width="6" />
        <line x1="875" y1="520" x2="875" y2="615" stroke="rgba(255,255,255,0.42)" stroke-width="4" />
        ${filterBadge(908, 505)}
        <text x="875" y="670" text-anchor="middle" class="micro">FILTER</text>

        <g filter="${heaterGlow}">
          <rect x="603" y="395" width="94" height="86" rx="18" fill="${heaterFill}" stroke="${heaterStroke}" stroke-width="4" />
          <path d="M621 429 C636 409, 656 449, 674 427" fill="none" stroke="${heaterWave}" stroke-width="7" stroke-linecap="round" />
          <path d="M621 457 C636 437, 656 477, 674 455" fill="none" stroke="${heaterWave}" stroke-width="7" stroke-linecap="round" />
          <text x="650" y="525" text-anchor="middle" class="heater-text">${heaterTitle}</text>
          <text x="650" y="564" text-anchor="middle" class="heater-text">${ettervarmeSub}</text>
        </g>

        <circle cx="405" cy="565" r="60" fill="#064e3b" stroke="#86efac" stroke-width="5" />
        <circle cx="405" cy="565" r="14" fill="#dcfce7" opacity="0.9" />
        <g class="fan-blade" style="transform-origin: 405px 565px;">
          <path d="M405 565 L405 518 Q431 534 418 565 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L452 565 Q436 591 405 578 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L405 612 Q379 596 392 565 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L358 565 Q374 539 405 552 Z" fill="#86efac" opacity="0.93" />
        </g>
        <text x="405" y="710" text-anchor="middle" class="micro">${tilluftRpm}</text>

        <circle cx="875" cy="-110" r="60" fill="#334155" stroke="#e2e8f0" stroke-width="5" />
        <circle cx="875" cy="-110" r="14" fill="#f8fafc" opacity="0.9" />
        <g class="fan-blade" style="transform-origin: 875px -110px;">
          <path d="M875 -110 L875 -157 Q901 -141 888 -110 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L922 -110 Q906 -84 875 -97 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L875 -63 Q849 -79 862 -110 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L828 -110 Q844 -136 875 -123 Z" fill="#e2e8f0" opacity="0.93" />
        </g>
        <text x="875" y="35" text-anchor="middle" class="micro">${avtrekkRpm}</text>

        <rect x="48" y="780" width="1204" height="165" rx="36" fill="#111827" stroke="url(#modeGrad)" stroke-width="4" />
        <text x="92" y="837" class="mode-title">AKTIV MODUS</text>
        <text x="92" y="900" class="mode-value">${driftText}</text>
        <text x="760" y="900" class="mode-time">${timeText}</text>
        <rect x="92" y="917" width="1110" height="16" rx="8" fill="rgba(255,255,255,0.18)" />
        <rect x="92" y="917" width="${Math.round(1110 * pct / 100)}" height="16" rx="8" fill="url(#modeGrad)" />
      </svg>
    </div>
  `;
    }
    _render() {
      const states = this._hass.states || {}, e = this._config.entities;
      const alarm = binary(states, e.filter_alarm), warning = binary(states, e.filter_warning);
      const filter = alarm === true ? 'alarm' : warning === true ? 'warning' : alarm === false && warning === false ? 'normal' : 'unknown';
      const label = { alarm: '⚠ Bytt filtre – filteralarm', warning: '⚠ Filtervarsel – planlegg filterskift', unknown: '? Filterstatus ukjent' }[filter];
      const freeUnknown = binary(states, e.free_cooling_active) === null;
      this.shadowRoot.innerHTML = `<style>${SHARED_STYLE}</style>${this._heading()}${this._missingNotice()}${this._diagram()}
        ${label ? `<div class="filter-status filter-${filter}" role="status">${label}</div>` : ''}
        ${freeUnknown ? '<div class="notice" role="status">Frikjølingsstatus ukjent.</div>' : ''}
        <p class="footnote">≈ Estimert luftmengde. Animasjonene er skjematiske.</p>`;
    }
  }

  class Vsr300ControlCard extends BaseCard {
    static fields = CONTROL_FIELDS;
    static defaultTitle = 'Kontrollpanel';
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

  // Home Assistant renders native graphical editors from getConfigForm().
  for (const [name, constructor] of [['vsr300-svg-card', Vsr300SvgCard], ['vsr300-control-card', Vsr300ControlCard]]) {
    if (!customElements.get(name)) customElements.define(name, constructor);
  }
  window.customCards = window.customCards || [];
  for (const [type, name, description] of [
    ['vsr300-svg-card', 'Systemair SVG', 'Prosessillustrasjon med temperaturer, pådrag, filterstatus og rapportert resttid.'],
    ['vsr300-control-card', 'Systemair Kontrollpanel', 'Modusknapper med betjening gjennom Systemair-integrasjonen.'],
  ]) if (!window.customCards.some(card => card.type === type)) window.customCards.push({ type, name, description, preview: true });
})();
