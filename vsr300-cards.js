/* VSR300 custom cards · version 1.6.0 · 2026-11-10
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2026 stboee
 * Based on Systemair SVG / Kontrollpanel 4.8.1.
 * Uses Home Assistant states and services; Howard owns all Modbus communication.
 * User-specific defaults are initial entity bindings, never measurement fallbacks.
 * Source and local verification: see README.md and VERIFIKASJON.md.
 */
(() => {
  'use strict';
  const VERSION = '1.6.0';
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

  const SVG_ACTION_STYLE = `
    .entity-hit{fill:transparent;stroke:transparent;stroke-width:3;pointer-events:none}
    [data-entity-role]{cursor:pointer;touch-action:manipulation}
    [data-entity-role]>.entity-hit{pointer-events:all}
    .systemair-svg [data-entity-role]:focus{outline:none}
    [data-entity-role]:focus-visible{outline:none}
    [data-entity-role]:focus-visible>.entity-hit{stroke:#fde047;stroke-width:5}
    @media(hover:hover){[data-entity-role]:hover>.entity-hit{fill:rgba(255,255,255,.08)}}
    .filter-status[data-entity-role]:focus-visible{outline:3px solid var(--primary-color,#03a9f4);outline-offset:2px}
  `;
  class Vsr300SvgCard extends BaseCard {
    static fields = SVG_FIELDS;
    static defaultTitle = '';
    static supportsAnimation = true;
    constructor() {
      super();
      const activate = event => {
        const target = event.composedPath().find(el => el instanceof Element && el.hasAttribute('data-entity-role'));
        if (!target || event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
        if (event.type === 'keydown') { event.preventDefault(); if (event.repeat) return; }
        const id = this._config?.entities[target.dataset.entityRole];
        if (!id || !this._hass?.states?.[id]) return;
        this.dispatchEvent(new CustomEvent('hass-action', {
          bubbles: true, composed: true,
          detail: { config: { entity: id, tap_action: { action: 'more-info' } }, action: 'tap' },
        }));
      };
      this.shadowRoot.addEventListener('click', activate);
      this.shadowRoot.addEventListener('keydown', activate);
    }
    _entityActionAttributes(role) {
      const id = this._config?.entities[role];
      if (!id || !this._hass?.states?.[id]) return '';
      const label = SVG_FIELDS.find(field => field.key === role)?.label || role;
      return `data-entity-role="${escape(role)}" role="button" tabindex="0" aria-label="${escape('Vis detaljer og historikk: ' + label)}"`;
    }
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
const filterRole = filterAlarm === true ? 'filter_alarm' : filterWarning === true ? 'filter_warning' : filterAlarm === null ? 'filter_alarm' : filterWarning === null ? 'filter_warning' : 'filter_alarm';
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
const action = role => this._entityActionAttributes(role);
const portRow = (role, x, y, height, content) => `<g ${action(role)}><rect class="entity-hit" x="${x}" y="${y}" width="260" height="${height}" rx="16"/>${content}</g>`;

  return `
    <div class="svg-wrap" data-animation="${this._config.animation}">
      <svg role="group" aria-label="Systemair prosessillustrasjon med klikkbare verdier" class="systemair-svg" viewBox="0 -250 1300 1255" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
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
          <rect class="intake-info" x="28" y="-200" width="280" height="330" rx="28" fill="#1e40af" stroke="#93c5fd" stroke-width="4" />
          <text x="168" y="-140" text-anchor="middle" class="label port-text">INNTAK</text>
          ${portRow('outdoor_temperature', 38, -112, 112, `<text x="168" y="-45" text-anchor="middle" class="value port-text">${uteT}</text>`)}
          ${portRow('outdoor_humidity', 38, 0, 112, `<text x="168" y="70" text-anchor="middle" class="small port-text">${uteRh}</text>`)}

          <rect class="supply-info" x="28" y="255" width="280" height="420" rx="28" fill="#166534" stroke="#86efac" stroke-width="4" />
          <text x="168" y="315" text-anchor="middle" class="label port-text">TILLUFT</text>
          ${portRow('supply_temperature', 38, 332, 112, `<text x="168" y="405" text-anchor="middle" class="value port-text">${tilluftT}</text>`)}
          ${portRow('supply_flow', 38, 444, 112, `<text x="168" y="515" text-anchor="middle" class="small port-text">${tilluftFlow}</text>`)}
          ${portRow('supply_rpm', 38, 556, 112, `<text x="168" y="625" text-anchor="middle" class="small port-text supply-rpm">${tilluftRpm}</text>`)}

          <rect class="exhaust-info" x="992" y="-200" width="280" height="420" rx="28" fill="#334155" stroke="#cbd5e1" stroke-width="4" />
          <text x="1132" y="-140" text-anchor="middle" class="label port-text">AVKAST</text>
          ${portRow('extract_flow', 1002, -90, 150, `<text x="1132" y="-20" text-anchor="middle" class="small port-text">${avkastFlow}</text><text x="1132" y="27" text-anchor="middle" class="micro port-text">estimert</text>`)}
          ${portRow('extract_rpm', 1002, 85, 120, `<text x="1132" y="155" text-anchor="middle" class="small port-text extract-rpm">${avtrekkRpm}</text>`)}

          <rect class="extract-info" x="992" y="345" width="280" height="330" rx="28" fill="#9a3412" stroke="#fdba74" stroke-width="4" />
          <text x="1132" y="405" text-anchor="middle" class="label port-text">AVTREKK</text>
          ${portRow('extract_temperature', 1002, 430, 112, `<text x="1132" y="500" text-anchor="middle" class="value port-text">${avtrekkT}</text>`)}
          ${portRow('extract_humidity', 1002, 542, 112, `<text x="1132" y="615" text-anchor="middle" class="small port-text">${inneRh}</text>`)}
        </g>

        <g opacity="${exchangerOpacity}" pointer-events="${freeCoolingActive ? 'none' : 'auto'}" ${freeCoolingActive ? '' : action('recovery_output')}>
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

          <rect class="entity-hit" x="490" y="110" width="320" height="280" rx="24"/>
          <text x="650" y="235" text-anchor="middle" class="label unit-text recovery-title">Vekslerpådrag</text>
          <text x="650" y="315" text-anchor="middle" class="value unit-text">${gjenv}</text>
        </g>

        <g opacity="${freeOpacity}" pointer-events="${freeCoolingActive ? 'auto' : 'none'}" ${freeCoolingActive ? action('free_cooling_active') : ''}>
          <rect x="510" y="150" width="280" height="205" rx="30" fill="rgba(12,74,110,0.88)" stroke="#38bdf8" stroke-width="5" />
          <text x="650" y="223" text-anchor="middle" class="label port-text">FRIKJØLING</text>
          <text x="650" y="285" text-anchor="middle" class="small port-text">utenom</text>
          <text x="650" y="333" text-anchor="middle" class="small port-text">veksler</text>
          <rect class="entity-hit" x="510" y="150" width="280" height="205" rx="30"/>
        </g>

        <g ${action(filterRole)}>
        <rect x="392" y="-170" width="66" height="135" rx="14" class="supply-filter" data-status="${filterState}" fill="${fc ? fc[0] : '#1e3a8a'}" stroke="${fc ? fc[1] : '#93c5fd'}" stroke-width="${fc ? 7 : 4}" />
        <line x1="407" y1="-145" x2="443" y2="-60" stroke="#bfdbfe" stroke-width="6" />
        <line x1="443" y1="-145" x2="407" y2="-60" stroke="#bfdbfe" stroke-width="6" />
        <line x1="425" y1="-150" x2="425" y2="-55" stroke="rgba(255,255,255,0.42)" stroke-width="4" />
        ${filterBadge(458, -165)}
        <rect class="entity-hit" x="380" y="-188" width="100" height="165" rx="16"/>
        </g>

        <g ${action(filterRole)}>
        <rect x="842" y="500" width="66" height="135" rx="14" class="extract-filter" data-status="${filterState}" fill="${fc ? fc[0] : '#7c2d12'}" stroke="${fc ? fc[1] : '#fdba74'}" stroke-width="${fc ? 7 : 4}" />
        <line x1="857" y1="525" x2="893" y2="610" stroke="#fed7aa" stroke-width="6" />
        <line x1="893" y1="525" x2="857" y2="610" stroke="#fed7aa" stroke-width="6" />
        <line x1="875" y1="520" x2="875" y2="615" stroke="rgba(255,255,255,0.42)" stroke-width="4" />
        ${filterBadge(908, 505)}
        <rect class="entity-hit" x="830" y="485" width="100" height="160" rx="16"/>
        </g>

        <g filter="${heaterGlow}">
          <g ${action('heater_active')}>
          <rect x="603" y="395" width="94" height="86" rx="18" fill="${heaterFill}" stroke="${heaterStroke}" stroke-width="4" />
          <path d="M621 429 C636 409, 656 449, 674 427" fill="none" stroke="${heaterWave}" stroke-width="7" stroke-linecap="round" />
          <path d="M621 457 C636 437, 656 477, 674 455" fill="none" stroke="${heaterWave}" stroke-width="7" stroke-linecap="round" />
          <text x="650" y="525" text-anchor="middle" class="heater-text unit-text">${heaterTitle}</text>
          <rect class="entity-hit" x="550" y="385" width="200" height="150" rx="18"/>
          </g>
          <g ${action('heater_output')}>
          <text x="650" y="600" text-anchor="middle" class="heater-text heater-value unit-text${Number.isFinite(triacNum) ? '' : ' heater-value-unknown'}">${ettervarmeSub}</text>
          <rect class="entity-hit" x="550" y="540" width="200" height="100" rx="18"/>
          </g>
        </g>

        <g ${action('supply_rpm')}>
        <circle cx="405" cy="565" r="60" fill="#064e3b" stroke="#86efac" stroke-width="5" />
        <circle cx="405" cy="565" r="14" fill="#dcfce7" opacity="0.9" />
        <g class="fan-blade" style="transform-origin: 405px 565px;">
          <path d="M405 565 L405 518 Q431 534 418 565 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L452 565 Q436 591 405 578 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L405 612 Q379 596 392 565 Z" fill="#86efac" opacity="0.93" />
          <path d="M405 565 L358 565 Q374 539 405 552 Z" fill="#86efac" opacity="0.93" />
        </g>
        <rect class="entity-hit" x="335" y="495" width="140" height="140" rx="60"/>
        </g>

        <g ${action('extract_rpm')}>
        <circle cx="875" cy="-110" r="60" fill="#334155" stroke="#e2e8f0" stroke-width="5" />
        <circle cx="875" cy="-110" r="14" fill="#f8fafc" opacity="0.9" />
        <g class="fan-blade" style="transform-origin: 875px -110px;">
          <path d="M875 -110 L875 -157 Q901 -141 888 -110 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L922 -110 Q906 -84 875 -97 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L875 -63 Q849 -79 862 -110 Z" fill="#e2e8f0" opacity="0.93" />
          <path d="M875 -110 L828 -110 Q844 -136 875 -123 Z" fill="#e2e8f0" opacity="0.93" />
        </g>
        <rect class="entity-hit" x="805" y="-180" width="140" height="140" rx="60"/>
        </g>

        <rect class="mode-box" x="48" y="780" width="1204" height="165" rx="36" fill="var(--card-background-color, #ffffff)" stroke="url(#modeGrad)" stroke-width="4" />
        <g ${action('mode')}>
        <rect class="entity-hit" x="70" y="800" width="660" height="112" rx="18"/>
        <text x="92" y="837" class="mode-title">AKTIV MODUS</text>
        <text x="92" y="900" class="mode-value">${driftText}</text>
        </g>
        <g ${action('countdown')}>
        <rect class="entity-hit" x="740" y="800" width="490" height="112" rx="18"/>
        <text x="760" y="900" class="mode-time">${timeText}</text>
        </g>
        <rect x="92" y="917" width="1110" height="16" rx="8" fill="var(--divider-color, #bdbdbd)" />
        <rect class="mode-progress" x="92" y="917" width="${Math.round(1110 * pct / 100)}" height="16" rx="8" fill="url(#modeGrad)" />
      </svg>
    </div>
  `;
    }
    _alarmLines(states, entities) {
      const rows = [];
      const add = (key, label, level) => rows.push(`<div class="filter-status filter-${level}" data-alarm="${key}" ${this._entityActionAttributes(key) || 'role="status"'}><span role="status">${escape(label)}</span></div>`);
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
      const focused = this.shadowRoot.activeElement, role = focused?.dataset.entityRole;
      const focusIndex = role ? Array.from(this.shadowRoot.querySelectorAll('[data-entity-role]')).filter(el => el.dataset.entityRole === role).indexOf(focused) : -1;
      this.shadowRoot.innerHTML = `<style>${SHARED_STYLE}${SVG_ACTION_STYLE}</style>${this._heading()}${this._diagram()}
        ${this._alarmLines(states, e)}${this._missingNotice()}
        ${freeUnknown ? '<div class="notice" role="status">Frikjølingsstatus ukjent.</div>' : ''}`;
      this._updateCountdown();
      if (focusIndex >= 0) Array.from(this.shadowRoot.querySelectorAll('[data-entity-role]')).filter(el => el.dataset.entityRole === role)[focusIndex]?.focus({ preventScroll: true });
    }
  }

  // Shared native entity controls: the integration remains the sole Modbus owner.
  const UI_STYLE = `
    :host{color-scheme:light dark;container-type:inline-size;
      --vsr-surface:var(--card-background-color,light-dark(#ffffff,#20262e));
      --vsr-field:light-dark(#f5f7f9,#29313b);--vsr-text:light-dark(#17212b,#f3f5f7);
      --vsr-secondary:light-dark(#4d5966,#bec7d0);--vsr-rule:light-dark(#d5dce3,#46515e);
      --vsr-control-border:light-dark(#7b8794,#778698);--vsr-blue:light-dark(#135bbb,#8db9ff);
      --vsr-on-blue:light-dark(#ffffff,#101a26);--vsr-blue-soft:light-dark(#e8f0fc,#233954);
      --vsr-green:light-dark(#17653b,#8adbaa);--vsr-green-soft:light-dark(#eaf5ee,#143626);
      --vsr-amber:light-dark(#8a4d00,#ffd17a);--vsr-amber-soft:light-dark(#fff3d6,#493611);
      --vsr-red:light-dark(#b4232b,#ffb4b9);--vsr-red-soft:light-dark(#ffeded,#411f26);
      --vsr-muted:light-dark(#eef1f4,#303842);color:var(--vsr-text)}
    ha-card{display:block;box-sizing:border-box;padding:16px;border:1px solid var(--vsr-rule);border-radius:16px;background:var(--vsr-surface);color:var(--vsr-text)}
    h2,h3{font-weight:600;line-height:1.4}h2{margin:0 0 14px;padding:0;font-size:20px}h3{margin:18px 0 10px;font-size:16px}
    button{background:var(--vsr-field);border:1px solid var(--vsr-control-border);border-radius:12px;color:var(--vsr-text);box-shadow:none;line-height:1.4;touch-action:manipulation}
    button strong{font-weight:600;font-size:15px}button small{color:var(--vsr-secondary);opacity:1;font-size:13px}
    ha-icon{color:var(--vsr-secondary);--mdc-icon-size:26px}.large{border-radius:12px;min-height:130px}.large ha-icon{--mdc-icon-size:30px}.large strong{font-size:20px}
    button.active,.status-button[aria-expanded=true],.setting-topic[aria-expanded=true],.duration-toggle[aria-expanded=true],.duration-choice[aria-expanded=true]{border:1px solid var(--vsr-blue);box-shadow:inset 0 0 0 1px var(--vsr-blue);background:var(--vsr-blue-soft);outline:none}
    button.active>ha-icon,button[aria-expanded=true]>ha-icon{color:var(--vsr-blue)}
    button:focus-visible,button.entity-row:focus-visible,.status-button:focus-visible,.setting-topic:focus-visible,.duration-choice:focus-visible,.duration-toggle:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid var(--vsr-blue);outline-offset:2px}
    button:disabled,input:disabled,select:disabled{opacity:1;cursor:not-allowed;color:var(--vsr-secondary)}button:disabled{border-style:dashed}button:disabled>ha-icon{color:var(--vsr-secondary)}
    @media(hover:hover){button:not(:disabled):hover{box-shadow:inset 0 0 0 1px var(--vsr-control-border)}button.active:hover,button[aria-expanded=true]:hover{box-shadow:inset 0 0 0 1px var(--vsr-blue)}}
    .state-chip{display:inline-flex;align-items:center;justify-content:center;gap:4px;max-width:100%;box-sizing:border-box;padding:3px 7px;border-radius:6px;font-size:13px;font-weight:500;line-height:1.4;background:var(--vsr-muted);color:var(--vsr-secondary);overflow-wrap:anywhere}
    .state-chip ha-icon{--mdc-icon-size:15px;color:inherit}
    .state-chip[data-tone=active]{background:var(--vsr-green-soft);color:var(--vsr-green)}
    .state-chip[data-tone=attention]{background:var(--vsr-amber-soft);color:var(--vsr-amber)}
    .state-chip[data-tone=danger]{background:var(--vsr-red-soft);color:var(--vsr-red)}
    .state-chip[data-tone=selected]{background:var(--vsr-blue-soft);color:var(--vsr-blue)}
    .notice{background:var(--vsr-amber-soft);color:var(--vsr-amber);border-radius:10px;font-size:14px}
    .error,.setting-error{background:var(--vsr-red-soft);color:var(--vsr-red)}
    .setting-feedback:not(.setting-error){background:var(--vsr-blue-soft);color:var(--vsr-text)}
    .grid{gap:8px;margin-bottom:16px}.grid:last-child{margin-bottom:0}
    .status-button,.setting-topic,.duration-choice{border-color:var(--vsr-control-border);border-radius:12px;background:var(--vsr-field);box-shadow:none}
    .status-button{min-height:124px;gap:7px}.status-button .reading{font-size:17px;font-weight:500;line-height:1.35;color:var(--vsr-text);font-variant-numeric:tabular-nums}
    .status-button .reading.state-chip{font-size:14px}.status-button .reading[data-tone=active]{color:var(--vsr-green)}.status-button .reading[data-tone=attention]{color:var(--vsr-amber)}.status-button .reading[data-tone=danger]{color:var(--vsr-red)}
    .status-button .kind,.setting-sub,.reported,.draft-note,.values .source,.readout span,.duration-readonly small,.info-button .source{color:var(--vsr-secondary);font-size:13px;line-height:1.4}
    .status-button .kind.state-chip[data-tone=active]{color:var(--vsr-green)}.status-button .kind.state-chip[data-tone=attention]{color:var(--vsr-amber)}
    .status-button ha-icon,.setting-topic ha-icon,.panel-title ha-icon{--mdc-icon-size:26px}
    .summary{font-weight:600}.values td,.info-table td{border-color:var(--vsr-rule)}
    .entity-row{background:transparent;border:0;border-radius:6px;box-shadow:none}.entity-row .entity-value{font-variant-numeric:tabular-nums;font-weight:500}
    @media(hover:hover){button.entity-row:hover{background:var(--vsr-field);box-shadow:none}}
    .explanation-panel,.settings-panel{border-color:var(--vsr-rule)}.explanation-panel h3,.settings-panel h3{font-size:20px}
    .technical-data,details,.setting-control{border:1px solid var(--vsr-rule);border-radius:12px;background:var(--vsr-field)}
    .readout{border-radius:12px;background:var(--vsr-field)}.setting-reading{font-size:22px;font-weight:500;font-variant-numeric:tabular-nums}
    .setting-control label,.control-label,summary{font-weight:600}.draft-note[data-pending=true]{color:var(--vsr-blue)}
    input,select{background:var(--vsr-surface);border:1px solid var(--vsr-control-border);color:var(--vsr-text);font-size:16px;border-radius:8px}
    input[type=number],input[type=time]{font-size:20px;font-variant-numeric:tabular-nums}
    .apply,.switch-button[aria-checked=true]{background:var(--vsr-blue);border:1px solid var(--vsr-blue);color:var(--vsr-on-blue);font-weight:600}
    .apply:disabled{background:var(--vsr-field);border-color:var(--vsr-control-border);color:var(--vsr-secondary)}
    .number-entry button,.apply,.switch-button,.settings-close,.close-button,.info-button{border-radius:8px;min-height:44px}
    .settings-close ha-icon,.close-button ha-icon{--mdc-icon-size:20px}.info-button{background:transparent;border:0}
    .duration-panel{border:1px solid var(--vsr-rule);border-radius:12px;background:var(--vsr-surface)}.duration-choice{min-height:84px}.duration-choice ha-icon{--mdc-icon-size:24px}
    .setting-topic{min-height:144px}.settings-menu{gap:8px}.panel-title ha-icon{color:var(--vsr-secondary)}
    @container(max-width:380px){ha-card{padding:12px}.status-grid,.duration-mode-grid{gap:6px}.status-button,.duration-choice{padding:9px 4px}.setting-topic{min-height:144px}}
  `;
  // Presentation is scoped to these three cards; Cockpit keeps its own palette.
  class StyledCard extends BaseCard {
    set hass(value) {
      // Update the palette even when HA reports identical state objects.
      // With no explicit HA preference, inherit the browser's color scheme.
      this.style.colorScheme = typeof value?.themes?.darkMode === 'boolean' ? (value.themes.darkMode ? 'dark' : 'light') : '';
      super.hass = value;
    }
    get hass() { return super.hass; }
  }
  const uiText = value => escape(value).replace(/Behovsstyring/g, 'Behovs&shy;styring').replace(/Varmefunksjon/g, 'Varme&shy;funksjon');
  class NativeSettingsCard extends StyledCard {
    constructor() {
      super();this._drafts={};this._busy=false;this._error='';this._message='';
      this.shadowRoot.addEventListener('input',event=>this._rememberDraft(event));
      this.shadowRoot.addEventListener('change',event=>this._rememberDraft(event));
      this.shadowRoot.addEventListener('submit',event=>{
        const form=event.target;if(!(form instanceof HTMLFormElement)||!form.dataset.numberForm)return;
        event.preventDefault();if(!this._busy)this._setNumber(form.dataset.numberForm);
      });
      this.shadowRoot.addEventListener('click',event=>{
        const button=event.composedPath().find(el=>el instanceof HTMLElement&&el.matches('button'));
        if(!button||button.disabled)return;
        if(button.dataset.stepRole)this._step(button.dataset.stepRole,Number(button.dataset.delta));
        else if(button.dataset.infoRole)this._moreInfo(button.dataset.infoRole);
      });
    }
    setConfig(config){this._drafts={};this._error='';this._message='';super.setConfig(config);}
    _field(role){return(this.constructor.settingFields||this.constructor.fields).find(f=>f.key===role);}
    _entity(role){return this._hass?.states?.[this._config?.entities[role]];}
    _available(role){const entity=this._entity(role);return !!entity&&!['unavailable','unknown'].includes(entity.state);}
    _display(role){
      const entity=this._entity(role),raw=knownText(entity?.state);if(raw===null)return'Ukjent';
      if(role==='regulation_mode')return REGULATION_NAMES[raw]||raw;
      if(role==='active_season')return SEASON_NAMES[raw]||raw;
      if(raw==='on')return'På';if(raw==='off')return'Av';
      if(this._hass.formatEntityState)return this._hass.formatEntityState(entity);
      return raw+(entity.attributes?.unit_of_measurement?' '+entity.attributes.unit_of_measurement:'');
    }
    _numberModel(role){
      const entity=this._entity(role),a=entity?.attributes||{},value=number(this._hass.states,this._config.entities[role]);
      const strict=raw=>raw==null||String(raw).trim()===''?null:Number.isFinite(Number(raw))?Number(raw):null;
      const min=strict(a.min),max=strict(a.max),step=strict(a.step);
      return{value,min,max,step,valid:this._field(role)?.domain==='number'&&value!==null&&min!==null&&max!==null&&max>=min&&step!==null&&step>0};
    }
    _validateNumber(role,value){
      const model=this._numberModel(role);
      if(!model.valid)throw new Error('Innstillingen er ikke tilgjengelig. Kontroller entiteten i kortoppsettet.');
      if(!Number.isFinite(value)||value<model.min-1e-8||value>model.max+1e-8||Math.abs((value-model.min)/model.step-Math.round((value-model.min)/model.step))>1e-6)throw new Error('Velg en verdi innenfor grensene og trinnene som vises.');
      return value;
    }
    _rememberDraft(event){
      const input=event.target,key=input?.dataset?.draftKey;if(!key||this._busy)return;
      this._drafts[key]=input.value;
      const note=input.closest('form')?.querySelector('[data-draft-note]');if(note){note.textContent='Ikke lagret';note.dataset.pending='true';}
    }
    _step(role,delta){
      if(this._busy||![-1,1].includes(delta))return;
      const m=this._numberModel(role);if(!m.valid)return;
      const raw=Object.hasOwn(this._drafts,role)?this._drafts[role]:String(m.value),parsed=raw.trim()===''?NaN:Number(raw);
      const start=Number.isFinite(parsed)?parsed:m.value;
      this._drafts[role]=String(Number(Math.min(m.max,Math.max(m.min,start+delta*m.step)).toFixed(8)));this._renderIfReady();
    }
    _setNumber(role){
      const raw=this._drafts[role]??String(this._numberModel(role).value??'');
      this._run([[role,raw.trim()===''?NaN:Number(raw)]],role);
    }
    _command(role,value){
      const field=this._field(role),entity=this._entity(role),id=this._config.entities[role];
      if(!field||!entity||entity.state==='unavailable')throw new Error('Innstillingen er ikke tilgjengelig.');
      if(field.domain==='number'){this._validateNumber(role,value);return{role,domain:'number',service:'set_value',data:{entity_id:id,value},same:Number(entity.state)===value};}
      if(field.domain==='switch'&&typeof value==='boolean'&&binary(this._hass.states,id)!==null)return{role,domain:'switch',service:value?'turn_on':'turn_off',data:{entity_id:id},same:(entity.state==='on')===value};
      if(field.domain==='select'&&typeof value==='string'&&Array.isArray(entity.attributes?.options)&&entity.attributes.options.includes(value))return{role,domain:'select',service:'select_option',data:{entity_id:id,option:value},same:entity.state===value};
      throw new Error('Velg et tilgjengelig alternativ fra listen.');
    }
    async _run(changes,draftKey){
      if(this._busy)return;
      this._error='';this._message='';this._serviceError='';let commands;
      try{commands=changes.map(([role,value])=>this._command(role,value)).filter(c=>!c.same);}catch(error){this._error=error.message;this._renderIfReady();return;}
      if(!commands.length){delete this._drafts[draftKey];this._message='Valget er allerede rapportert.';this._renderIfReady();return;}
      this._pendingFocus=this.shadowRoot.activeElement?.dataset.focusKey;this._busy=true;this._message='Sender innstilling …';this._renderIfReady();let sent=0;
      try{
        for(const command of commands){await this._hass.callService(command.domain,command.service,command.data);sent++;}
        delete this._drafts[draftKey];this._message='Innstilling sendt. Verdiene viser siste rapportering.';
      }catch(error){this._message='';this._error=sent?'Bare deler av klokkeslettet ble sendt. Kontroller rapporterte verdier før nytt forsøk.':'Kunne ikke sende innstillingen. Kontroller integrasjonen og prøv igjen.';}
      finally{this._busy=false;this._renderIfReady();this._pendingFocus=undefined;}
    }
    _moreInfo(role){const id=this._config.entities[role];if(this._field(role)&&id&&this._entity(role))this.dispatchEvent(new CustomEvent('hass-action',{bubbles:true,composed:true,detail:{config:{entity:id,tap_action:{action:'more-info'}},action:'tap'}}));}
    _numberControl(role,label,options={}){
      if(!this._config.entities[role])return'';
      const m=this._numberModel(role),disabled=this._busy||!m.valid,raw=this._drafts[role]??(m.value===null?'':String(m.value)),n=raw.trim()===''?NaN:Number(raw),pending=Object.hasOwn(this._drafts,role);
      const submitLabel=options.submitLabel||'Bruk';
      const actions=options.actions??`<button class="apply" type="submit" data-focus-key="apply-${role}" ${disabled?'disabled':''}>${escape(submitLabel)}</button>`;
      return`<form class="setting-control" data-number-form="${role}"><label for="input-${role}">${escape(label||SETTING_LABELS[role]||this._field(role).label)}</label><div class="reported">Rapportert: ${escape(this._display(role))}</div><div class="number-entry"><button type="button" data-step-role="${role}" data-delta="-1" data-focus-key="minus-${role}" aria-label="Reduser ${escape(this._field(role).label)}" ${disabled||n<=m.min?'disabled':''}>−</button><input id="input-${role}" type="number" inputmode="decimal" data-draft-key="${role}" data-focus-key="input-${role}" value="${escape(raw)}" ${m.valid?`min="${m.min}" max="${m.max}" step="${m.step}"`:''} ${disabled?'disabled':''} required/><button type="button" data-step-role="${role}" data-delta="1" data-focus-key="plus-${role}" aria-label="Øk ${escape(this._field(role).label)}" ${disabled||n>=m.max?'disabled':''}>+</button></div><div class="draft-note" data-draft-note data-pending="${pending}">${pending?'Ikke lagret':m.valid?'Velg verdi og trykk '+escape(submitLabel)+'.':'Innstillingen er ikke tilgjengelig.'}</div>${actions}</form>`;
    }
  }

  const CONTROL_MODES = [
    {action:'fireplace',role:'fireplace_duration',name:'Ildsted',unit:'min',icon:'mdi:fireplace'},
    {action:'boost',role:'boost_duration',name:'Boost',unit:'min',icon:'mdi:fan-plus'},
    {action:'party',role:'party_duration',name:'Party',unit:'t',icon:'mdi:account-group-outline'},
    {action:'away',role:'away_duration',name:'Borte',unit:'t',icon:'mdi:home-export-outline'},
    {action:'holiday',role:'holiday_duration',name:'Ferie',unit:'d',icon:'mdi:bag-suitcase-outline'},
  ];
  class Vsr300ControlCard extends NativeSettingsCard {
    static fields = CONTROL_FIELDS;
    static defaultTitle = '';
    static settingFields = CONTROL_FIELDS.filter(field=>field.key.endsWith('_duration'));
    constructor() {
      super();this._durationRole=null;
      this.shadowRoot.addEventListener('click',event=>{
        const button=event.composedPath().find(el=>el instanceof HTMLElement&&el.matches('button'));
        if(!button||button.disabled)return;
        if(button.dataset.modeChoice){
          const mode=CONTROL_MODES.find(mode=>mode.action===button.dataset.modeChoice);if(!mode||this._busy)return;
          this._durationRole=this._durationRole===mode.role?null:mode.role;
          this._message='';this._error='';this._serviceError='';this._renderIfReady();
        }else if(button.hasAttribute('data-duration-close')){
          if(this._busy)return;
          const mode=CONTROL_MODES.find(mode=>mode.role===this._durationRole);this._durationRole=null;this._renderIfReady();
          this.shadowRoot.querySelector(`[data-mode-choice="${mode?.action}"]`)?.focus({preventScroll:true});
        }else if(button.dataset.saveStart)this._commitDuration(button.dataset.saveStart,true);
        else if(button.dataset.action)this._activate(button.dataset.action);
      });
    }
    _available(role) {
      const entity=this._hass.states[this._config.entities[role]];
      // HA buttons legitimately report unknown before their first press.
      return !!entity&&entity.state!=='unavailable';
    }
    _modeCommand(action){
      if(!['auto','manual','low','normal','high','fireplace','boost','party','away','holiday'].includes(action))throw new Error('Ukjent modusvalg.');
      const option={manual:'Manual',fireplace:'Fireplace'}[action],role=option?'mode_select':action+'_button';
      if(!this._available(role))throw new Error('Modusbetjeningen er ikke tilgjengelig. Kontroller entitetskoblingen og integrasjonen.');
      return{role,domain:option?'select':'button',service:option?'select_option':'press',data:{entity_id:this._config.entities[role],...(option?{option}:{})}};
    }
    _button(action,name,label,icon,active,large=false){
      const timed=CONTROL_MODES.find(mode=>mode.action===action),expanded=timed?.role===this._durationRole;
      const enabled=!this._busy&&(timed||this._available(['manual','fireplace'].includes(action)?'mode_select':action+'_button'));
      const speed=['low','normal','high'].includes(action);
      return`<button type="button" ${timed?`data-mode-choice="${action}" aria-expanded="${expanded}" aria-controls="duration-settings"`:`data-action="${action}" aria-pressed="${active}"`} data-focus-key="mode-${action}" class="${large?'large ':''}${active?'active ':''}${expanded?'mode-open':''}" ${enabled?'':'disabled'} title="${escape(timed?'Åpne varighet og startvalg for '+name:enabled?name:name+' – betjening utilgjengelig')}"><ha-icon icon="${icon}" aria-hidden="true"></ha-icon><strong>${name}</strong>${active?`<span class="state-chip" data-tone="${speed?'selected':'active'}"><ha-icon icon="mdi:check" aria-hidden="true"></ha-icon>${speed?'Valgt':'Aktiv'}</span>`:''}<small>${escape(label)}</small>${timed?`<span class="mode-disclosure"><ha-icon icon="${expanded?'mdi:chevron-up':'mdi:chevron-down'}" aria-hidden="true"></ha-icon><span class="visually-hidden">${expanded?'Lukk':'Åpne'} valg</span></span>`:''}</button>`;
    }
    _duration(role,unit){const v=number(this._hass.states,this._config.entities[role]);return v===null||v<0?'Varighet ukjent':`${v} ${unit}`;}
    _render(){
      const focus=this.shadowRoot.activeElement?.dataset.focusKey||this._pendingFocus;
      const states=this._hass.states,e=this._config.entities,mode=state(states,e.mode),source=state(states,e.auto_source),speed=state(states,e.manual_speed);
      const modeKnown=Object.hasOwn(MODE_NAMES,mode),manual=typeof mode==='string'&&mode.startsWith('manual_');
      const autoLabel=!modeKnown?'Modus ukjent':mode!=='auto'?'Ikke aktiv':AUTO_NAMES[source]||'Styrekilde ukjent';
      const speedName={Low:'Lav',Normal:'Normal',High:'Høy',Stop:'Stopp'}[speed]||'Ukjent';
      const showManual=manual||state(states,e.mode_select)==='Manual';
      this.shadowRoot.innerHTML=`<style>${SHARED_STYLE}${SETTINGS_STYLE}${UI_STYLE}${DURATION_STYLE}</style><ha-card>${this._heading()}${this._missingNotice()}
        <div class="grid two">${this._button('auto','Auto',autoLabel,'mdi:fan-auto',mode==='auto',true)}${this._button('manual','Manuell','Manuell · '+speedName,'mdi:hand-back-right-outline',manual,true)}</div>
        ${showManual?`<h3>Manuell viftehastighet</h3><div class="grid three">${this._button('low','Lav','Manuell','mdi:fan-speed-1',speed==='Low')}${this._button('normal','Normal','Manuell','mdi:fan-speed-2',speed==='Normal')}${this._button('high','Høy','Manuell','mdi:fan-speed-3',speed==='High')}</div>`:''}
        <h3>Tidsstyrte og spesialmoduser</h3><div class="grid three">${CONTROL_MODES.map(item=>this._button(item.action,item.name,this._duration(item.role,item.unit),item.icon,mode===item.action)).join('')}</div>
        <div class="error" role="alert"></div><div class="setting-feedback" role="status">${escape(this._message)}</div><div class="setting-feedback setting-error" role="alert">${escape(this._error)}</div>
        ${this._durationRole?this._durationPanel():''}</ha-card>`;
      if(this._serviceError)this.shadowRoot.querySelector('.error').textContent=this._serviceError;
      if(focus)Array.from(this.shadowRoot.querySelectorAll('[data-focus-key]')).find(el=>el.dataset.focusKey===focus)?.focus({preventScroll:true});
    }
    getCardSize(){return this._durationRole?13:8;}
    _durationPanel(){
      const mode=CONTROL_MODES.find(mode=>mode.role===this._durationRole);if(!mode)return'';
      const {role,name,action}=mode,editable=role!=='fireplace_duration'&&!!this._config.entities[role]&&this._numberModel(role).valid;
      let startAvailable=false;try{this._modeCommand(action);startAvailable=true;}catch{}
      const close=`<button type="button" class="settings-close" data-duration-close data-focus-key="duration-close" ${this._busy?'disabled':''}><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon>Lukk</button>`;
      let content;
      if(editable){
        const actions=`<div class="duration-actions"><button class="apply duration-save" type="submit" data-focus-key="apply-${role}" ${this._busy?'disabled':''}>Lagre</button><button class="apply duration-start" type="button" data-save-start="${role}" data-focus-key="save-start-${role}" ${this._busy||!startAvailable?'disabled':''}>Lagre og start</button>${close}</div>`;
        content=this._numberControl(role,name+' ('+({min:'minutter',t:'timer',d:'døgn'})[mode.unit]+')',{submitLabel:'Lagre',actions});
      }else{
        const explanation=role==='fireplace_duration'?'Avlesning. Ildsted-varigheten endres i Systemair-appen eller på aggregatets betjeningspanel.':!this._config.entities[role]?'Velg varighetsentiteten i kortets oppsett for å kunne redigere den.':'Varigheten kan ikke redigeres nå. Kontroller entitetens verdi og grenser.';
        content=`<div class="readout duration-readonly"><span>Rapportert varighet</span><button type="button" class="info-button" data-info-role="${role}" data-focus-key="info-${role}" ${this._entity(role)?'':'disabled'}>${escape(this._display(role))}</button><small>${explanation} Start bruker varigheten som allerede ligger i aggregatet.</small></div><div class="duration-actions"><button class="apply duration-start" type="button" data-action="${action}" data-focus-key="start-${role}" ${this._busy||!startAvailable?'disabled':''}>Start</button>${close}</div>`;
      }
      return`<section id="duration-settings" class="settings-panel duration-panel" aria-labelledby="duration-title"><div class="panel-title"><ha-icon icon="${mode.icon}" aria-hidden="true"></ha-icon><h3 id="duration-title">${name} · varighet og start</h3></div>${content}${startAvailable?'':'<p class="duration-help">Start er utilgjengelig. Kontroller modusentiteten i kortets oppsett.</p>'}</section>`;
    }
    _setNumber(role){this._commitDuration(role,false);}
    async _commitDuration(role,start){
      if(this._busy||role!==this._durationRole)return;
      const mode=CONTROL_MODES.find(mode=>mode.role===role);if(!mode||role==='fireplace_duration')return;
      this._error='';this._message='';this._serviceError='';let duration,activation;
      try{
        const raw=this._drafts[role]??String(this._numberModel(role).value??'');
        duration=this._command(role,raw.trim()===''?NaN:Number(raw));
        if(start)activation=this._modeCommand(mode.action);
      }catch(error){this._error=error.message;this._renderIfReady();return;}
      if(start&&!window.confirm(`Starte ${mode.name}-modus med varighet ${duration.data.value} ${mode.unit}?`))return;
      if(!start&&duration.same){delete this._drafts[role];this._message='Varigheten er allerede rapportert.';this._renderIfReady();return;}
      const durationId=this._config.entities[role];
      this._pendingFocus=this.shadowRoot.activeElement?.dataset.focusKey;this._busy=true;
      this._message=start?'Lagrer varighet og sender startkommando …':'Lagrer varighet …';this._renderIfReady();let saved=duration.same;
      try{
        if(!duration.same)await this._hass.callService(duration.domain,duration.service,duration.data);
        saved=true;
        if(start){
          const current=this._modeCommand(mode.action);
          if(this._config.entities[role]!==durationId||current.data.entity_id!==activation.data.entity_id)throw new Error('Entitetskobling endret.');
          await this._hass.callService(activation.domain,activation.service,activation.data);
        }
        delete this._drafts[role];
        this._message=start?'Startkommando sendt. Verdiene viser siste rapportering.':'Varighet sendt. Verdien viser siste rapportering.';
      }catch(error){
        this._message='';
        this._error=start&&saved?'Varigheten er sendt eller allerede rapportert, men modusen kunne ikke startes. Kontroller status før nytt forsøk.':start?'Kunne ikke lagre varigheten. Ingen startkommando ble sendt.':'Kunne ikke lagre varigheten. Kontroller integrasjonen og prøv igjen.';
      }finally{this._busy=false;this._renderIfReady();this._pendingFocus=undefined;}
    }
    async _activate(action){
      if(this._busy)return;
      let command;try{command=this._modeCommand(action);}catch(error){this._error=error.message;this._renderIfReady();return;}
      const mode=CONTROL_MODES.find(mode=>mode.action===action);
      if(mode&&!window.confirm(`Starte ${mode.name}-modus?`))return;
      this._busy=true;this._serviceError='';this._error='';this._message='';this._render();
      try{await this._hass.callService(command.domain,command.service,command.data);}
      catch(error){this._serviceError='Kunne ikke endre modus. Kontroller integrasjonens status i Home Assistant.';console.warn('VSR300: service call failed',error);}
      finally{this._busy=false;this._render();}
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
    FIELD('eco_offset', 'ECO – senking av ettervarmegrense (valgfri)', 'number', 'number.systemair_save_oko_varmeoffset', { optional: true }),
    FIELD('overheat_temperature', 'Overheat-temperatur (valgfri)', 'sensor', 'sensor.systemair_save_overheat_temperature', { optional: true }),
    FIELD('air_quality', 'Rapportert luftkvalitetsnivå (valgfri)', 'sensor', 'sensor.systemair_save_luftkvalitet', { optional: true }),
    FIELD('regulation_mode', 'Reguleringstype', 'sensor', 'sensor.systemair_save_regulering', { optional: true }),
    FIELD('active_season', 'Behovsstyring – sesong', 'sensor', 'sensor.systemair_save_aktiv_sesong', { optional: true }),
    explanationField('recovery_output', { optional: true }),
    FIELD('legacy_triac', 'Eldre TRIAC-råsignal (IR14381)', 'sensor', 'sensor.systemair_save_triac_control_signal', { optional: true }),
    FIELD('legacy_eco', 'Eldre ECO-status (IR2506)', 'binary_sensor', 'binary_sensor.systemair_save_oko_funksjon_aktiv', { optional: true }),
    FIELD('pressure_guard_active', 'Trykkvakt – rapportert funksjon', 'binary_sensor', 'binary_sensor.systemair_save_trykkvakt_aktiv', { optional: true }),
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
    "icon": "mdi:weather-windy",
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
    "text": "**ECO** vises med to uavhengige avlesninger fra aggregatet.\n\n- **På / Av** er ECO-valget fra bryteren: om funksjonen er aktivert.\n- **Aktiv / Inaktiv** er aggregatets rapporterte ECO-status (IR2521).\n- **Valg ukjent / Status ukjent** betyr at den aktuelle avlesningen mangler\n  eller er utilgjengelig.\n\n**På · Inaktiv** betyr at ECO er aktivert, mens aggregatet rapporterer\nfunksjonen inaktiv ved avlesningen. **På · Aktiv** betyr at begge er på.\nHvis valget og statusen avviker, vises de hver for seg uten å korrigere verdiene.\n\nGrønn kant markerer rapportert aktiv ECO-status. Grå kant betyr\nrapportert inaktiv status. Gul kant betyr ukjent aktiv-status.\n\nAktiv-statusen er en firmwarebeslutning. Den dokumenterer ikke alene hvor\nmange watt som spares, eller at TRIAC-pådraget begrenses i dette øyeblikket.\nKortet utleder heller ingen egen ECO-status fra frikjølingssignalet.\n\nDet eldre signalet IR2506 kan vurderes som separat diagnostikk. Det brukes ikke til å beregne denne statusvisningen.\n\n**ECO – senking av ettervarmegrense** angir hvor mange grader temperaturgrensen for bruk av ettervarme senkes når ECO-funksjonen er aktiv. Formålet er å redusere bruken av varmeelementet. Dette er en temperaturforskjell, ikke prosent eller watt.\n\nEt forenklet eksempel ved tilluftsregulering: Med temperatursettpunkt 20 °C og ECO-senking 5 °C blir ettervarmegrensen omtrent 15 °C. Dette er en forklaring av prinsippet, ikke en beregnet, faktisk regulatorgrense for ditt aggregat. Andre innstillinger og aktive funksjoner kan påvirke driften.\n\nVarmegjenvinneren kan fortsatt levere varmere luft. Eksemplet betyr derfor ikke at tilluften skal være 15 °C. Rapportert ECO-aktivitet og faktisk ettervarmepådrag må leses hver for seg. Innstillingen endres under Temperatur og ECO i Innstillinger-kortet.",
    "roles": [
      "eco_enabled",
      "eco_active",
      "eco_offset",
      "heater_output",
      "supply_setpoint"
    ],
    "technicalRoles": [
      "legacy_eco"
    ]
  },
  {
    "key": "hood",
    "name": "Hette",
    "title": "Hette",
    "icon": "mdi:fan",
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
    "icon": "mdi:radiator",
    "text": "**Ettervarme** er det elektriske varmeelementet på tilluftssiden.\n\nVarmestatus og pådrag vises separat:\n\n- **Aktiv farge** betyr at aggregatet rapporterer varmefunksjonen aktiv.\n- **Inaktiv farge** betyr at aggregatet rapporterer varmefunksjonen inaktiv.\n- **Gul markering / Ukjent** betyr at varmestatusen mangler eller er utilgjengelig.\n- **Prosenttallet** er rapportert TRIAC-pådrag. Manglende pådrag vises som ukjent.\n\n**0 %** betyr null rapportert TRIAC-pådrag ved avlesningen. Prosenttallet\nbrukes ikke alene til å avgjøre om varmefunksjonen er aktiv. Et pådrag over\nnull er et utgangssignal, ikke en måling av elektrisk effekt i W.\n\nStatusknappens farge kommer fra `{{heater_active}}`\n(IR3103). Prosenttallet kommer fra `{{heater_output}}`\n(IR2149). Hvis signalene avviker, vises de hver for seg.\n\nEttervarme bestemmes ikke av én enkelt sensor. Den styres av aggregatets\ntemperaturregulering og kan påvirkes av tilluftstemperatur, tilluftssettpunkt,\nutetemperatur, avtrekk-/romtemperatur, reguleringsmodus, aktiv sesong, ECO,\nfrikjøling og spesialmoduser.",
    "roles": [
      "heater_active",
      "heater_output",
      "overheat_temperature",
      "supply_temperature",
      "supply_setpoint",
      "electric_power",
      "eco_active",
      "regulation_mode"
    ],
    "technicalRoles": [
      "legacy_triac"
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
    "text": "**Auto-styring** viser aggregatets rapporterte styrekilde når rapportert\ndriftsmodus er Auto. Kilden kommer fra IR1062.\n\n- **Styres av ukeprogram**: aggregatet rapporterer ukeprogram som styrekilde.\n- **Behovsstyring**: aggregatet rapporterer behovsstyring som styrekilde.\n- **Ekstern styring**: aggregatet rapporterer ekstern styring som styrekilde.\n- **Konfigurasjonsfeil**: aggregatet rapporterer denne statusen som Auto-kilde.\n- **Styrekilde ukjent**: driftsmodusen er Auto, men kildeverdien mangler,\n  er utilgjengelig eller ikke gjenkjennes.\n- **Ikke aktiv**: aggregatet rapporterer en annen driftsmodus enn Auto.\n- **Modus ukjent**: avlesningen av driftsmodus mangler eller er utilgjengelig.\n\nStyrekilden beskriver hvem som styrer Auto. Den er ingen avlesning av aktivt\nviftenivå eller fysisk luftmengde. Luftkvalitetsnivået Economy/Good/Improve\noversettes derfor ikke til Lav/Normal/Høy. Kortet beregner heller ikke\nviftenivå fra luftmengdegrenser.\n\nRapportert driftsmodus, manuelle innstillinger, vifteoutput og RPM må\nvurderes som forskjellige signaler. Integrasjonens luftmengder er estimater\nbasert på vifteoutput og modellkapasitet.\n\n**Behovsstyring – sesong** er integrasjonens rapporterte Sommer / Vinter-status. Systemair beskriver sesongstatusen under behovsstyring, med egne sommer- og vintersettpunkt for relativ luftfuktighet. Vinter viser hvilken sesonginnstilling behovsstyringen rapporterer; det er ikke en melding om at ettervarmen er aktiv, eller en årstid kortet beregner fra dato eller utetemperatur. Verdien kan fortsatt vises når en annen styrekilde eller driftsmodus er aktiv.\n\nSystemairs dokumentasjon har også tilstanden «Identifiserer». Integrasjon v1.3.0 oversetter bare Sommer og Vinter; andre verdier blir Ukjent. Kortet gjetter ikke sesong eller årsaken til en ukjent verdi.",
    "roles": [
      "auto_source",
      "mode",
      "air_quality",
      "supply_rpm",
      "extract_rpm",
      "supply_flow",
      "extract_flow",
      "active_season"
    ]
  },
  {
    "key": "temperature",
    "name": "Temperatur",
    "title": "Temperaturstyring",
    "icon": "mdi:thermometer",
    "text": "**Temperaturstyring** beskriver hvilken temperatur aggregatet regulerer etter. Dette er et annet valg enn Manuell / Auto for viftestyringen.\n\n- **Tilluftsregulering**: aggregatet forsøker å holde valgt temperatur på luften som blåses inn i huset.\n- **Romregulering**: aggregatet regulerer etter en egen romføler. Romregulering krever denne føleren; avtrekksføleren blir ikke automatisk en romføler.\n- **Avtrekksregulering**: aggregatet regulerer etter temperaturen på luften som trekkes ut av huset.\n\nVed rom- og avtrekksregulering tilpasses tilluftstemperaturen innenfor aggregatets konfigurerte grenser. Settpunktsentiteten heter tilluftsettpunkt i integrasjonen; den må vurderes sammen med rapportert reguleringsmåte. Kortet oppretter ingen ny regulator eller romsensor.\n\nReguleringsmåten er en avlesning i integrasjon v1.3.0. Endring gjøres på aggregatets betjeningspanel. Temperatursettpunkt og ECO-valg finnes i Innstillinger-kortet.\n\nECO, frikjøling og spesialmoduser kan påvirke driften. En forskjell mellom settpunkt og temperatur avslører ikke alene årsaken. Verdiene er siste tilgjengelige HA-avlesninger og trenger ikke være fra samme Modbus-uttak.",
    "roles": [
      "supply_setpoint",
      "regulation_mode",
      "supply_temperature",
      "extract_temperature",
      "outdoor_temperature",
      "heater_active",
      "heater_output",
      "eco_active",
      "free_cooling_active"
    ]
  },
  {
    "key": "recovery",
    "name": "Veksler",
    "title": "Veksler og varmegjenvinning",
    "icon": "mdi:swap-horizontal",
    "text": "**Vekslerpådrag** er integrasjonens rapporterte pådrag i prosent. **100 % betyr ikke 100 % temperaturvirkningsgrad.**\n\nKortet viser pådrag, temperaturer og frikjølingsstatus hver for seg. Det utleder ikke overført varme i W eller fysisk gjenvinningsgrad fra pådraget.\n\nTilluftstemperaturen kan påvirkes av både veksleren og ettervarmen. Estimerte luftmengder er ikke fysisk målte luftmengder. En temperaturforskjell alene skiller derfor ikke sikkert alle bidragene.\n\nAvkasttemperatur er ikke tilgjengelig som verifisert måling i vårt oppsett. Kortet lager ingen avkasttemperatur eller restvarmeberegning. Verdiene under er grunnlaget for å følge driften, ikke en ny regulator.\n\nVelg integrasjonens Vekslerpådrag (%) i dette kortets entitetskoblinger. Hvis du bruker Cockpit, velg samme entitet i begge kort. Koblingene lagres hver for seg; kortet gjetter ikke en kilde når feltet er tomt.",
    "roles": [
      "recovery_output",
      "outdoor_temperature",
      "supply_temperature",
      "extract_temperature",
      "heater_output",
      "heater_active",
      "free_cooling_active",
      "supply_flow",
      "extract_flow"
    ]
  },
  {
    "key": "pressure_guard",
    "name": "Trykkvakt",
    "title": "Trykkvakt",
    "icon": "mdi:gauge",
    "text": "**Trykkvakt** er en valgfri, separat funksjon i SAVE. Den er ikke det samme som sentralstøvsugermodus.\n\nVis emnet bare når funksjonen er relevant for installasjonen. At entiteten finnes og viser av, bekrefter ikke at en fysisk trykkvakt er montert eller tilkoblet.\n\nIntegrasjonens binære status bygger på rapportert trykkvaktfunksjon. Den er ikke en trykkmåling i Pa. Vifteverdier og modus vises som separate observasjoner.",
    "roles": [
      "pressure_guard_active",
      "mode",
      "supply_rpm",
      "extract_rpm",
      "supply_flow",
      "extract_flow"
    ]
  },
  {
    "key": "vacuum",
    "name": "Sentralstøvsuger",
    "title": "Sentralstøvsuger",
    "icon": "mdi:vacuum",
    "text": "**Sentralstøvsuger** er en valgfri funksjon som bare bør vises når den er i bruk i installasjonen.\n\nKortet viser om rapportert driftsmodus er støvsugermodus. Det er ikke en direkte avlesning av strømforbruk eller fysisk drift i en støvsuger.\n\nEn annen kjent driftsmodus vises som ikke rapportert aktiv; den bekrefter ikke om utstyret er tilkoblet. Trykkvakt er en separat inngangsfunksjon. RPM og luftmengdeestimater beholdes som egne signaler.",
    "roles": [
      "mode",
      "supply_rpm",
      "extract_rpm",
      "supply_flow",
      "extract_flow"
    ]
  }
];
  const EXTRA_TOPIC_OPTIONS = { temperature: ['show_temperature', 'Vis temperaturstyring', true], recovery: ['show_recovery', 'Vis veksler', true], pressure_guard: ['show_pressure_guard', 'Trykkvakt er i bruk – vis emne', false], vacuum: ['show_vacuum', 'Sentralstøvsuger er i bruk – vis emne', false] };
  const REGULATION_NAMES = { supply_air: 'Tilluftsregulering', room: 'Romregulering', exhaust: 'Avtrekksregulering' };
  const SEASON_NAMES = { summer: 'Sommer', winter: 'Vinter' };
  const knownText = raw => raw == null || String(raw).trim() === '' || ['unknown','unavailable'].includes(String(raw).toLowerCase()) ? null : String(raw);
  const EXPLANATION_STYLE = `
    :host{container-type:inline-size}
    ha-card{display:block;background:var(--card-background-color,#1c1c1c);color:var(--primary-text-color,#e2e8f0);border-radius:20px;padding:16px}
    .status-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .status-button{min-height:112px;padding:10px 6px;gap:6px;border-radius:18px;overflow-wrap:anywhere}
    .status-button strong{font-size:14px}.status-button .reading{font-size:16px;font-weight:850;line-height:1.3}.status-button .kind{font-size:12px;line-height:1.3;color:var(--secondary-text-color,#9b9b9b)}
    .status-button ha-icon{--mdc-icon-size:28px}.explanation-panel{margin-top:20px;border-top:1px solid var(--divider-color,#636363);padding-top:16px;font-size:15px;line-height:1.55}
    .explanation-panel[hidden]{display:none}.explanation-panel h3{margin:0 0 8px;font-size:20px}.summary{font-weight:700;margin:0 0 12px}.explanation-panel p{margin:0 0 14px}.explanation-panel ul{padding-left:22px;margin:0 0 14px}
    code{font-size:.9em;overflow-wrap:anywhere}.values{width:100%;border-collapse:collapse;table-layout:fixed;margin:12px 0 16px}.values td{padding:0;border-bottom:1px solid var(--divider-color,#636363);vertical-align:top;overflow-wrap:anywhere}.values .source{display:block;font-weight:400;font-size:12px;color:var(--secondary-text-color,#9b9b9b)}
    .entity-row{display:grid;grid-template-columns:minmax(0,58fr) minmax(0,42fr);align-items:start;gap:8px;width:100%;min-height:44px;box-sizing:border-box;margin:0;padding:8px 4px;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;line-height:inherit;text-align:left;cursor:default}
    .entity-row>span{min-width:0;overflow-wrap:anywhere}button.entity-row{cursor:pointer;touch-action:manipulation}button.entity-row:focus-visible{outline:3px solid var(--primary-color,#03a9f4);outline-offset:-3px}
    @media(hover:hover){button.entity-row:hover{background:rgba(127,127,127,.10)}}
    .technical-data{border:1px solid var(--divider-color,#636363);border-radius:14px;padding:0 12px;margin:16px 0}.technical-data summary{cursor:pointer;min-height:44px;box-sizing:border-box;padding:12px 0;font-weight:650}.technical-data p{margin-top:12px}
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

  class Vsr300ExplanationsCard extends StyledCard {
    static fields = EXPLANATION_FIELDS;
    static defaultTitle = 'Status og forklaringer';
    constructor() {
      super(); this._selected = null; this._technicalOpen = {};
      this.shadowRoot.addEventListener('click', event => {
        const button = event.composedPath().find(el => el instanceof HTMLElement && el.matches('button[data-topic],button[data-close],button[data-entity-role]'));
        if (!button) return;
        if (button.dataset.entityRole) {
          const role = button.dataset.entityRole, id = this._config?.entities[role];
          if (EXPLANATION_FIELDS.some(field => field.key === role) && id && this._hass?.states?.[id]) {
            this.dispatchEvent(new CustomEvent('hass-action', {
              bubbles: true, composed: true,
              detail: { config: { entity: id, tap_action: { action: 'more-info' } }, action: 'tap' },
            }));
          }
          return;
        }
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
      const visibility = {};
      for (const [key, , initial] of Object.values(EXTRA_TOPIC_OPTIONS)) {
        if (config[key] != null && typeof config[key] !== 'boolean') throw new Error('Emnevalg må være på eller av.');
        visibility[key] = config[key] ?? initial;
      }
      super.setConfig({ ...config, ...visibility, show_title: config?.show_title ?? true, show_sources: config?.show_sources ?? false, balance_tolerance: tolerance });
    }
    static getStubConfig() { return { ...super.getStubConfig(), show_title: true, show_sources: false, balance_tolerance: 15, ...Object.fromEntries(Object.values(EXTRA_TOPIC_OPTIONS).map(([key, , initial]) => [key, initial])) }; }
    static getConfigForm() {
      const form = super.getConfigForm(), helper = form.computeHelper, label = form.computeLabel;
      form.schema.find(field => field.name === 'show_title').default = true;
      form.schema.splice(2, 0, { name: 'show_sources', default: false, selector: { boolean: {} } }, { name: 'balance_tolerance', default: 15, selector: { number: { min: 0, mode: 'box', unit_of_measurement: 'm³/h' } } });
      form.schema.splice(4, 0, ...Object.values(EXTRA_TOPIC_OPTIONS).map(([name, , initial]) => ({ name, default: initial, selector: { boolean: {} } })));
      form.computeLabel = field => ({ show_sources: 'Vis entitets-ID-er i forklaringene', balance_tolerance: 'Grense for markering av estimert ubalanse', ...Object.fromEntries(Object.values(EXTRA_TOPIC_OPTIONS).map(([key, text]) => [key, text])) })[field.name] || label(field);
      form.computeHelper = field => field.name === 'free_cooling_diagnosis' ? 'Valgfri lokal tolkning fra eksisterende HA-sensor. Bevarer Kandidat/Venter tid og temperaturdiagnoser; er ikke en firmwarestatus.' : field.name === 'outdoor_max_24h' ? 'Valgfri historikkbasert HA-verdi. Kortet oppretter ingen døgnsensor.' : field.name === 'electric_power' ? 'Valgfri faktisk måling, for eksempel Shelly. Brukes ikke i Huslast-beregningen.' : helper(field);
      return form;
    }
    _visibleTopics() { return EXPLANATION_TOPICS.filter(topic => !EXTRA_TOPIC_OPTIONS[topic.key] || this._config[EXTRA_TOPIC_OPTIONS[topic.key][0]]); }
    getCardSize() { return this._selected ? 18 : 11; }
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
      if (active === true) return { label: 'Aktiv', tone: 'active', kind: 'Rapportert' };
      if (enabled === false) return { label: active === null ? 'Av · status ukjent' : 'Av', tone: active === null ? 'attention' : 'neutral', kind: 'Rapportert' };
      if (active === null) return { label: 'Status ukjent', tone: 'attention', kind: 'Mangler avlesning' };
      if (enabled === null) return { label: 'Valg ukjent', tone: 'attention', kind: 'Mangler avlesning' };
      const diagnostic = this._raw('free_cooling_state');
      if (['disabled', '0'].includes(diagnostic)) return { label: 'Tilstand: av', tone: 'neutral', kind: 'Rapportert diagnostikk' };
      if (['daytime', '2'].includes(diagnostic)) return { label: 'Dagfase', tone: 'neutral', kind: 'Rapportert diagnostikk' };
      if (['temperatures_not_reliable', '3'].includes(diagnostic) || binary(s, e.free_cooling_reliable) === false) return { label: 'Temperaturer usikre', tone: 'attention', kind: 'Rapportert diagnostikk' };
      const local = this._raw('free_cooling_diagnosis');
      for (const [fragment, label] of [['Kandidat nå', 'Kandidat'], ['utenfor', 'Venter tid'], ['Dagvilkår', 'Dag ikke OK'], ['For varmt', 'For varmt'], ['For kaldt', 'For kaldt'], ['Rom kaldt', 'Rom kaldt']]) {
        if (local?.includes(fragment)) return { label, tone: 'neutral', kind: 'Lokal HA-diagnose' };
      }
      return { label: 'På', tone: 'neutral', kind: 'Rapportert · inaktiv' };
    }
    _recoveryStatus(){
      const id=this._config.entities.recovery_output,entity=this._hass.states[id],value=number(this._hass.states,id);
      const problem=!id?'Velg entitet':!entity?'Entitet ikke funnet':value===null?'Pådrag ukjent':null;
      return{label:problem||`${value.toFixed(0)} %`,tone:problem?'attention':'neutral',kind:!id||!entity?'Kontroller entitetskobling':'Rapportert pådrag'};
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
        balance: { label: difference === null ? 'Ukjent' : `≈ ${difference > 0 ? '+' : ''}${difference} m³/h`, tone: difference === null ? 'attention' : 'neutral', detailTone: difference !== null && Math.abs(difference) >= this._config.balance_tolerance ? 'attention' : null, kind: difference !== null && Math.abs(difference) >= this._config.balance_tolerance ? 'Estimat · ulik luftmengde' : 'Estimat' },
        free_cooling: this._freeCooling(),
        eco: { label: `${enabled === null ? 'Valg ukjent' : enabled ? 'På' : 'Av'} · ${eco === null ? 'status ukjent' : eco ? 'Aktiv' : 'Inaktiv'}`, tone: eco === null || enabled === null ? 'attention' : eco ? 'active' : 'neutral', kind: 'Rapportert' },
        hood: { label: hood === null ? 'Ukjent' : hood ? 'Aktiv' : 'Av', tone: hood === null ? 'attention' : hood ? 'active' : 'neutral', kind: 'Rapportert' },
        heater: { label: heater === null ? 'Pådrag ukjent' : `${heat === null ? 'Ukjent · ' : ''}${heater.toFixed(0)} %`, tone: heater === null || heat === null ? 'attention' : 'neutral', detailTone: heat === null ? 'attention' : heat ? 'active' : null, kind: heat === null ? 'Varmestatus ukjent' : heat ? 'Varmefunksjon aktiv' : 'Varmefunksjon inaktiv' },
        electric: { label: power === null ? 'Ikke tilgjengelig' : `${power.toFixed(0)} W`, tone: power === null && e.electric_power ? 'attention' : 'neutral', kind: 'Valgfri måling' },
        house_load: { label: loadLabel, tone: load === null ? 'attention' : 'neutral', kind: 'Beregnet i kortet' },
        auto: { label: !Object.hasOwn(MODE_NAMES, mode) ? 'Modus ukjent' : mode !== 'auto' ? 'Ikke aktiv' : AUTO_NAMES[source] || 'Styrekilde ukjent', tone: !Object.hasOwn(MODE_NAMES, mode) || mode === 'auto' && !Object.hasOwn(AUTO_NAMES, source) ? 'attention' : mode === 'auto' && source === 'configuration_fault' ? 'danger' : 'neutral', kind: 'Rapportert styrekilde' },
        temperature: { label: this._raw('supply_setpoint') ? this._value('supply_setpoint') : 'Settpunkt ukjent', tone: this._raw('supply_setpoint') ? 'neutral' : 'attention', detailTone: this._raw('regulation_mode') ? null : 'attention', kind: ({supply_air:'Tilluft',room:'Rom',exhaust:'Avtrekk'})[this._raw('regulation_mode')] || 'Regulering ukjent' },
        recovery: this._recoveryStatus(),
        pressure_guard: { label: binary(s, e.pressure_guard_active) === null ? 'Ukjent' : binary(s, e.pressure_guard_active) ? 'Aktiv' : 'Inaktiv', tone: binary(s, e.pressure_guard_active) === null ? 'attention' : binary(s, e.pressure_guard_active) ? 'active' : 'neutral', kind: 'Rapportert funksjon' },
        vacuum: { label: !Object.hasOwn(MODE_NAMES, mode) ? 'Modus ukjent' : mode === 'vacuum_cleaner' ? 'Aktiv' : 'Ikke rapportert aktiv', tone: !Object.hasOwn(MODE_NAMES, mode) ? 'attention' : mode === 'vacuum_cleaner' ? 'active' : 'neutral', kind: 'Rapportert modus' },
      };
    }
    _value(role) {
      const id = this._config.entities[role], entity = this._hass.states[id];
      if (!this._raw(role)) return 'Ukjent';
      if (entity.state === 'on') return 'På';
      if (entity.state === 'off') return 'Av';
      if (role === 'regulation_mode') return REGULATION_NAMES[entity.state] || entity.state;
      if (role === 'active_season') return SEASON_NAMES[entity.state] || entity.state;
      if (this._hass.formatEntityState) return this._hass.formatEntityState(entity);
      return `${entity.state}${entity.attributes?.unit_of_measurement ? ' ' + entity.attributes.unit_of_measurement : ''}`;
    }
    _entityRows(roles) {
      const rows = roles.filter(role => this._config.entities[role]).map(role => {
        const field = EXPLANATION_FIELDS.find(item => item.key === role), id = this._config.entities[role];
        const content = `<span class="entity-label">${escape(field.label)}${this._config.show_sources ? `<code class="source">${escape(id)}</code>` : ''}</span><span class="entity-value">${escape(this._value(role))}</span>`;
        const row = this._hass.states[id]
          ? `<button class="entity-row" type="button" data-entity-role="${escape(role)}" aria-label="${escape('Vis detaljer og historikk: ' + field.label)}">${content}</button>`
          : `<div class="entity-row">${content}</div>`;
        return `<tr><td colspan="2">${row}</td></tr>`;
      }).join('');
      return rows ? `<table class="values" aria-label="Relevante verdier"><tbody>${rows}</tbody></table>` : '';
    }
    _details(topic, status) {
      const text = topic.text.replace(/\{\{([a-z0-9_]+)\}\}/g, (_, role) => EXPLANATION_FIELDS.find(field => field.key === role)?.label || 'Beregnet i kortet');
      const technical = this._entityRows(topic.technicalRoles || []);
      const recoveryHint=topic.key==='recovery'&&(!this._config.entities.recovery_output||!this._hass.states[this._config.entities.recovery_output])?'<div class="notice" role="status">Velg Vekslerpådrag (%) i Entitetskoblinger. Bruk samme entitet som i Cockpit hvis begge kort brukes.</div>':'';
      return `<h3 id="explanation-title">${escape(topic.title)}</h3><p class="summary">${escape(status.label)} · ${escape(status.kind)}</p>${recoveryHint}${explanationHtml(text)}${this._entityRows(topic.roles)}${technical ? `<details class="technical-data" data-technical-topic="${topic.key}" ${this._technicalOpen[topic.key] ? 'open' : ''}><summary>Teknisk grunnlag</summary><p>Separate eldre signaler for sammenligning. De erstatter ikke statusen over.</p>${technical}</details>` : ''}<div class="close-row"><button class="close-button" data-close type="button"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon>Lukk</button></div>`;
    }
    _render() {
      const focused = this.shadowRoot.activeElement, focus = focused?.dataset.topic, focusRole = focused?.dataset.entityRole;
      const focusClose = focused?.hasAttribute('data-close'), statuses = this._statuses();
      const oldDetails = this.shadowRoot.querySelector('details[data-technical-topic]');
      if (oldDetails) this._technicalOpen[oldDetails.dataset.technicalTopic] = oldDetails.open;
      const topics = this._visibleTopics(), topic = topics.find(item => item.key === this._selected);
      if (!topic) this._selected = null;
      this.shadowRoot.innerHTML = `<style>${SHARED_STYLE}${EXPLANATION_STYLE}${UI_STYLE}</style><ha-card>${this._heading()}${this._missingNotice()}<div class="status-grid">${topics.map(item => {
        const status = statuses[item.key];
        const marked = status.tone && status.tone !== 'neutral';
        const marker = status.tone === 'active' ? 'mdi:check' : status.tone === 'danger' ? 'mdi:alert-circle-outline' : 'mdi:information-outline';
        return `<button class="status-button" type="button" data-topic="${item.key}" aria-expanded="${this._selected === item.key}" aria-controls="explanation-panel"><ha-icon icon="${item.icon}" aria-hidden="true"></ha-icon><strong>${escape(item.name)}</strong><span class="reading${marked ? ' state-chip' : ''}" data-tone="${status.tone || 'neutral'}">${marked ? `<ha-icon icon="${marker}" aria-hidden="true"></ha-icon>` : ''}${uiText(status.label)}</span><span class="kind${status.detailTone ? ' state-chip' : ''}" ${status.detailTone ? `data-tone="${status.detailTone}"` : ''}>${uiText(status.kind)}</span></button>`;
      }).join('')}</div><section id="explanation-panel" class="explanation-panel" aria-labelledby="explanation-title" ${topic ? '' : 'hidden'}>${topic ? this._details(topic, statuses[topic.key]) : ''}</section></ha-card>`;
      if (focus) this.shadowRoot.querySelector(`button[data-topic="${focus}"]`)?.focus({ preventScroll: true });
      else if (focusRole) this.shadowRoot.querySelector(`button[data-entity-role="${focusRole}"]`)?.focus({ preventScroll: true });
      else if (focusClose) this.shadowRoot.querySelector('button[data-close]')?.focus({ preventScroll: true });
      else if (focused?.tagName === 'SUMMARY') this.shadowRoot.querySelector('details summary')?.focus({ preventScroll: true });
    }
  }

  const settingsField = (role, extra = {}) => ({ ...EXPLANATION_FIELDS.find(field => field.key === role), optional: true, ...extra });
  const SETTINGS_FIELDS = [
    ...['supply_setpoint','eco_enabled','eco_offset','regulation_mode','free_cooling_enabled','free_cooling_active','free_cooling_day_min','free_cooling_night_high','free_cooling_night_low','free_cooling_room_cancel'].map(role => settingsField(role)),
    FIELD('cooling_start_hour','Frikjøling – start time','number','number.systemair_save_frikjoling_start_time',{optional:true}),
    FIELD('cooling_start_minute','Frikjøling – start minutt','number','number.systemair_save_frikjoling_start_min',{optional:true}),
    FIELD('cooling_end_hour','Frikjøling – slutt time','number','number.systemair_save_frikjoling_slutt_time',{optional:true}),
    FIELD('cooling_end_minute','Frikjøling – slutt minutt','number','number.systemair_save_frikjoling_slutt_min',{optional:true}),
    FIELD('cooling_min_supply','Frikjøling – minste tilluftnivå','select','select.systemair_save_frikjoling_min_tilluft',{optional:true}),
    FIELD('cooling_min_extract','Frikjøling – minste avtrekksnivå','select','select.systemair_save_frikjoling_min_avtrekk',{optional:true}),
  ];
  const SETTING_SECTIONS = [
    {key:'temperature',name:'Temperatur og ECO',icon:'mdi:thermometer'},
    {key:'cooling',name:'Frikjøling',icon:'mdi:weather-windy'},
  ];
  const SETTING_LABELS = {free_cooling_day_min:'Daggrense',free_cooling_night_high:'Øvre nattgrense',free_cooling_night_low:'Nedre nattgrense',free_cooling_room_cancel:'Avbryt ved rom-/avtrekkstemperatur',cooling_min_supply:'Minste tilluftnivå',cooling_min_extract:'Minste avtrekksnivå'};
  const SETTINGS_STYLE = `
    :host{container-type:inline-size}ha-card{display:block;padding:18px;border-radius:22px;background:var(--card-background-color,#1c1c1c);color:var(--primary-text-color,#e2e8f0)}
    .settings-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.setting-topic{min-height:150px;padding:16px 10px;gap:8px;border-radius:20px;text-align:center;overflow-wrap:anywhere}
    .setting-topic ha-icon{--mdc-icon-size:32px}.setting-topic strong{font-size:16px}.setting-reading{font-size:22px;font-weight:800;line-height:1.25}.setting-sub{font-size:12px;color:var(--secondary-text-color,#9b9b9b);line-height:1.35}.setting-topic:last-child:nth-child(odd){grid-column:1/-1}
    .settings-panel{margin-top:20px;padding-top:18px;border-top:1px solid var(--divider-color,#636363);font-size:15px;line-height:1.5}.settings-panel[hidden]{display:none}.settings-panel h3{font-size:21px;margin:0 0 8px}.settings-panel p{margin:8px 0 16px}.panel-title{display:flex;align-items:center;gap:10px}.panel-title ha-icon{--mdc-icon-size:28px;}
    .readouts{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 18px}.readout{flex:1 1 130px;padding:10px 12px;border-radius:14px;background:rgba(127,127,127,.07);overflow-wrap:anywhere}.readout[data-role="regulation_mode"]{flex-basis:100%}.readout span{display:block;font-size:12px;color:var(--secondary-text-color,#9b9b9b)}.readout strong{display:block;margin-top:2px;font-size:16px}
    .setting-control{margin:12px 0;padding:14px;border:1px solid var(--divider-color,#636363);border-radius:16px;background:rgba(127,127,127,.035)}.setting-control label,.control-label{display:block;font-size:15px;font-weight:650;margin-bottom:5px;overflow-wrap:anywhere}.reported,.draft-note{font-size:12px;line-height:1.4;color:var(--secondary-text-color,#9b9b9b);margin:4px 0}.draft-note[data-pending=true]{color:var(--primary-color,#03a9f4)}
    .number-entry{display:grid;grid-template-columns:44px minmax(0,1fr) 44px;gap:8px;margin-top:10px}.number-entry button,.apply,.switch-button,.settings-close,.info-button{min-height:44px;border-radius:12px;padding:8px 12px;font-size:15px;line-height:1.3;gap:4px}.number-entry button{font-size:24px;padding:4px}.apply{margin-top:10px;min-width:78px;width:auto;margin-left:auto;background:rgba(3,169,244,.14);color:inherit;border:1px solid var(--primary-color,#03a9f4);font-weight:700}
    input,select{font:inherit;line-height:1.4;min-width:0;min-height:44px;box-sizing:border-box;width:100%;padding:8px 10px;border:1px solid var(--divider-color,#636363);border-radius:10px;background:var(--card-background-color,#1c1c1c);color:inherit}input[type=number]{font-size:20px;text-align:center}input[type=time]{font-size:20px}input:focus-visible,select:focus-visible{outline:2px solid var(--primary-color,#03a9f4);outline-offset:1px}input:disabled,select:disabled{opacity:.55}
    .switch-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.switch-row .control-label{margin:0}.switch-button{min-width:76px;flex-direction:row}.switch-button[aria-checked=true]{background:rgba(3,169,244,.16);color:inherit;border-color:var(--primary-color,#03a9f4)}
    .time-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.time-grid .setting-control{min-width:0;margin-top:0}.select-control select{margin-top:6px}
    details{border:1px solid var(--divider-color,#636363);border-radius:14px;margin:16px 0;padding:0 12px}summary{cursor:pointer;min-height:44px;box-sizing:border-box;padding:12px 0;font-weight:650}details>div{padding-bottom:10px}
    .info-table{width:100%;border-collapse:collapse;table-layout:fixed}.info-table td{padding:10px 4px;border-bottom:1px solid var(--divider-color,#636363);vertical-align:top;overflow-wrap:anywhere}.info-table td:first-child{width:48%}.info-button{display:block;width:100%;text-align:left;background:transparent;border:0;padding:8px 0;font:inherit;overflow-wrap:anywhere}.info-button .source{display:block;font:12px/1.4 monospace;color:var(--secondary-text-color,#9b9b9b);margin-top:4px}
    .settings-foot{display:flex;justify-content:flex-end;margin-top:16px}.settings-close{flex-direction:row}.settings-close ha-icon{--mdc-icon-size:20px}.setting-feedback{font-size:14px;line-height:1.5;padding:10px 12px;border-radius:12px;margin:12px 0;background:rgba(3,169,244,.10)}.setting-feedback:empty{display:none}.setting-error{background:rgba(239,68,68,.12);color:var(--error-color,#ef4444)}
    @container(max-width:380px){ha-card{padding:12px}.settings-menu{gap:8px}.setting-topic{padding:14px 6px;min-height:144px}.setting-reading{font-size:20px}.setting-control{padding:10px}.time-grid{grid-template-columns:minmax(0,1fr)}}
  `;
  const DURATION_STYLE = `
    button.active,button.mode-open{background:var(--vsr-blue);border-color:var(--vsr-blue);color:var(--vsr-on-blue);box-shadow:none}
    button.active>ha-icon,button.active>small,button.mode-open>ha-icon,button.mode-open>small{color:inherit}
    button.active .mode-disclosure,button.mode-open .mode-disclosure{color:inherit}
    button.active:hover,button.mode-open:hover{box-shadow:inset 0 0 0 1px var(--vsr-on-blue)}
    .state-chip[data-tone=active]{background:var(--vsr-green);color:light-dark(#ffffff,#101a26)}
    .state-chip[data-tone=selected]{background:var(--vsr-surface);color:var(--vsr-blue)}
    .state-chip ha-icon{color:inherit}
    .mode-disclosure{display:inline-flex;justify-content:center;color:var(--vsr-secondary);margin-top:0}.mode-disclosure ha-icon{--mdc-icon-size:18px;color:inherit}
    .visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
    .duration-panel{padding:14px;border:2px solid var(--vsr-blue);border-radius:12px;margin:16px 0;background:var(--vsr-surface)}
    .duration-panel h3{font-size:18px;margin:0}.duration-panel .panel-title{margin-bottom:12px}.duration-panel .panel-title ha-icon{color:var(--vsr-blue);flex:none}
    .duration-panel .setting-control{margin-bottom:0}.duration-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:14px}
    .duration-actions .apply{margin:0;width:auto;min-width:78px;white-space:normal}.duration-save{background:var(--vsr-field);color:var(--vsr-blue);border-color:var(--vsr-blue)}
    .duration-readonly{margin-top:12px}.duration-readonly .info-button{font-size:20px;font-weight:600}.duration-readonly small{display:block;font-size:13px;line-height:1.5;color:var(--vsr-secondary)}.duration-help{margin-top:12px!important}
    .notice{background:var(--vsr-amber);color:light-dark(#ffffff,#101a26)}
    .error,.setting-error{background:var(--vsr-red);color:light-dark(#ffffff,#101a26)}
    .setting-feedback:not(.setting-error){background:var(--vsr-field);border-left:4px solid var(--vsr-blue)}
    @container(max-width:380px){.duration-panel{padding:10px}.duration-actions{gap:6px}}
  `;

  class Vsr300SettingsCard extends NativeSettingsCard {
    static fields = SETTINGS_FIELDS;
    static defaultTitle = 'Innstillinger';
    constructor() {
      super();this._section=null;this._detailsOpen={};
      this.shadowRoot.addEventListener('submit',event=>{
        event.preventDefault();const form=event.target;
        if(!(form instanceof HTMLFormElement)||this._busy)return;
        if(form.dataset.selectForm)this._setSelect(form.dataset.selectForm);
        else if(form.dataset.timeForm)this._setTime(form.dataset.timeForm);
      });
      this.shadowRoot.addEventListener('click',event=>{
        const button=event.composedPath().find(el=>el instanceof HTMLElement&&el.matches('button'));
        if(!button||button.disabled)return;
        if(button.dataset.section){this._section=this._section===button.dataset.section?null:button.dataset.section;this._renderIfReady();}
        else if(button.hasAttribute('data-settings-close')){const previous=this._section;this._section=null;this._renderIfReady();this.shadowRoot.querySelector(`[data-section="${previous}"]`)?.focus({preventScroll:true});}
        else if(button.dataset.switchRole){const role=button.dataset.switchRole,current=binary(this._hass.states,this._config.entities[role]);if(current!==null)this._run([[role,!current]],role);}
      });
    }
    setConfig(config) {
      if(!config||typeof config!=='object'||Array.isArray(config))throw new Error('Kortoppsettet må være et objekt.');
      const options={};for(const section of SETTING_SECTIONS){const key='show_'+section.key;if(config[key]!=null&&typeof config[key]!=='boolean')throw new Error('Temavalg må være på eller av.');options[key]=config[key]??true;}
      super.setConfig({...config,...options,show_title:config.show_title??true});
    }
    static getStubConfig(){return{...super.getStubConfig(),show_title:true,...Object.fromEntries(SETTING_SECTIONS.map(s=>['show_'+s.key,true]))};}
    static getConfigForm(){
      const form=super.getConfigForm(),label=form.computeLabel;
      form.schema.find(f=>f.name==='show_title').default=true;
      form.schema.splice(2,0,...SETTING_SECTIONS.map(s=>({name:'show_'+s.key,default:true,selector:{boolean:{}}})));
      form.computeLabel=f=>SETTING_SECTIONS.find(s=>'show_'+s.key===f.name)?'Vis '+SETTING_SECTIONS.find(s=>'show_'+s.key===f.name).name:label(f);
      form.computeHelper=f=>SETTINGS_FIELDS.find(x=>x.key===f.name)?'Valgfri kobling. Bruk din egen entitet eller tøm feltet.':undefined;
      return form;
    }
    getCardSize(){return this._section?15:6;}
    _setSelect(role){this._run([[role,this._drafts[role]??this._entity(role)?.state]],role);}
    _timeValue(kind){
      const hour=number(this._hass.states,this._config.entities['cooling_'+kind+'_hour']),minute=number(this._hass.states,this._config.entities['cooling_'+kind+'_minute']);
      return Number.isInteger(hour)&&hour>=0&&hour<=23&&Number.isInteger(minute)&&minute>=0&&minute<=59?String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0'):null;
    }
    _setTime(kind){
      if(!['start','end'].includes(kind))return;
      const raw=this._drafts['time_'+kind]??this._timeValue(kind),match=typeof raw==='string'&&raw.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
      if(!match){this._error='Velg et gyldig klokkeslett.';this._renderIfReady();return;}
      this._run([['cooling_'+kind+'_hour',Number(match[1])],['cooling_'+kind+'_minute',Number(match[2])]],'time_'+kind);
    }
    _switchControl(role,label){
      if(!this._config.entities[role])return'';const current=binary(this._hass.states,this._config.entities[role]);
      return`<div class="setting-control switch-row"><span class="control-label">${escape(label)}</span><button class="switch-button" type="button" role="${current===null?'button':'switch'}" aria-label="${escape(label+(current===null?' – status ukjent':''))}" ${current===null?'':`aria-checked="${current}"`} data-switch-role="${role}" data-focus-key="switch-${role}" ${this._busy||current===null?'disabled':''}>${current===null?'Ukjent':current?'På':'Av'}</button></div>`;
    }
    _selectControl(role){
      if(!this._config.entities[role])return'';const entity=this._entity(role),options=Array.isArray(entity?.attributes?.options)?entity.attributes.options.filter(v=>typeof v==='string'):[],raw=this._drafts[role]??entity?.state,disabled=this._busy||!entity||entity.state==='unavailable'||!options.length;
      const names={normal:'Normal',high:'Høy',maximum:'Maksimum'};
      return`<form class="setting-control select-control" data-select-form="${role}"><label for="input-${role}">${escape(SETTING_LABELS[role]||this._field(role).label)}</label><div class="reported">Rapportert: ${escape(names[entity?.state]||this._display(role))}</div><select id="input-${role}" data-draft-key="${role}" data-focus-key="input-${role}" ${disabled?'disabled':''} required><option value="" ${options.includes(raw)?'':'selected'} disabled>Velg nivå</option>${options.map(option=>`<option value="${escape(option)}" ${option===raw?'selected':''}>${escape(names[option]||option)}</option>`).join('')}</select><div class="draft-note" data-draft-note>${Object.hasOwn(this._drafts,role)?'Ikke lagret':''}</div><button class="apply" type="submit" data-focus-key="apply-${role}" ${disabled?'disabled':''}>Bruk</button></form>`;
    }
    _timeControl(kind){
      const hour='cooling_'+kind+'_hour',minute='cooling_'+kind+'_minute';if(!this._config.entities[hour]&&!this._config.entities[minute])return'';
      const disabled=this._busy||!this._numberModel(hour).valid||!this._numberModel(minute).valid,value=this._drafts['time_'+kind]??this._timeValue(kind)??'';
      return`<form class="setting-control" data-time-form="${kind}"><label for="time-${kind}">${kind==='start'?'Start':'Slutt'}</label><div class="reported">Rapportert: ${escape(this._timeValue(kind)||'Ukjent')}</div><input id="time-${kind}" type="time" step="60" data-draft-key="time_${kind}" data-focus-key="time-${kind}" value="${escape(value)}" ${disabled?'disabled':''} required/><div class="draft-note" data-draft-note>${Object.hasOwn(this._drafts,'time_'+kind)?'Ikke lagret':''}</div><button class="apply" type="submit" data-focus-key="apply-time-${kind}" ${disabled?'disabled':''}>Bruk</button></form>`;
    }
    _readouts(roles){return`<div class="readouts">${roles.filter(role=>this._config.entities[role]).map(role=>`<div class="readout" data-role="${role}"><span>${escape(this._field(role).label)}</span><strong>${escape(this._display(role))}</strong></div>`).join('')}</div>`;}
    _details(key,label,content){return`<details data-details="${key}" ${this._detailsOpen[key]?'open':''}><summary data-focus-key="details-${key}">${label}</summary><div>${content}</div></details>`;}
    _summaries(){
      const start=this._timeValue('start'),end=this._timeValue('end');
      return{
        temperature:{label:this._display('supply_setpoint'),sub:'ECO '+this._display('eco_enabled')},
        cooling:{label:this._display('free_cooling_enabled'),sub:start&&end?start+'–'+end:'Tidsvindu ukjent'},
      };
    }
    _panel(section){
      let content='';
      if(section.key==='temperature')content=`<p>Valgt temperatur og ECO. Rapportert reguleringstype viser hvordan settpunktet skal vurderes.</p>${this._config.entities.regulation_mode?`<p class="regulation-note">Regulerer etter: <strong>${escape(({supply_air:'Tilluft',room:'Rom',exhaust:'Avtrekk'})[this._entity('regulation_mode')?.state]||this._display('regulation_mode'))}</strong></p>`:''}${this._numberControl('supply_setpoint','Temperatursettpunkt')}${this._switchControl('eco_enabled','ECO aktivert')}${this._details('eco','Flere innstillinger',this._numberControl('eco_offset','ECO – senking av ettervarmegrense'))}`;
      if(section.key==='cooling')content=`<p>Tillat frikjøling og velg tidsvindu. Aktiv drift rapporteres separat av aggregatet.</p>${this._readouts(['free_cooling_active'])}${this._switchControl('free_cooling_enabled','Frikjøling tillatt')}<div class="time-grid">${this._timeControl('start')}${this._timeControl('end')}</div>${this._details('cooling','Flere innstillinger',['free_cooling_day_min','free_cooling_night_high','free_cooling_night_low','free_cooling_room_cancel'].map(role=>this._numberControl(role)).join('')+this._selectControl('cooling_min_supply')+this._selectControl('cooling_min_extract'))}`;
      return`<section class="settings-panel" aria-labelledby="settings-panel-title"><div class="panel-title"><ha-icon icon="${section.icon}" aria-hidden="true"></ha-icon><h3 id="settings-panel-title">${section.name}</h3></div>${content}<div class="settings-foot"><button type="button" class="settings-close" data-settings-close data-focus-key="close"><ha-icon icon="mdi:close" aria-hidden="true"></ha-icon>Lukk</button></div></section>`;
    }
    _render(){
      for(const detail of this.shadowRoot.querySelectorAll('details[data-details]'))this._detailsOpen[detail.dataset.details]=detail.open;
      const focus=this.shadowRoot.activeElement?.dataset.focusKey||this._pendingFocus;
      const sections=SETTING_SECTIONS.filter(s=>this._config['show_'+s.key]),section=sections.find(s=>s.key===this._section),summaries=this._summaries();if(!section)this._section=null;
      this.shadowRoot.innerHTML=`<style>${SHARED_STYLE}${SETTINGS_STYLE}${UI_STYLE}</style><ha-card>${this._heading()}<div class="settings-menu">${sections.map(s=>`<button class="setting-topic" type="button" data-section="${s.key}" data-focus-key="topic-${s.key}" aria-expanded="${this._section===s.key}" aria-controls="settings-content"><ha-icon icon="${s.icon}" aria-hidden="true"></ha-icon><strong>${s.name}</strong><span class="setting-reading">${escape(summaries[s.key].label)}</span><span class="setting-sub">${escape(summaries[s.key].sub)}</span></button>`).join('')}</div><div class="setting-feedback" role="status">${escape(this._message)}</div><div class="setting-feedback setting-error" role="alert">${escape(this._error)}</div><div id="settings-content">${section?this._panel(section):''}</div>${sections.length?'':'<p>Velg hvilke temaer som skal vises i kortets oppsett.</p>'}</ha-card>`;
      if(focus)Array.from(this.shadowRoot.querySelectorAll('[data-focus-key]')).find(el=>el.dataset.focusKey===focus)?.focus({preventScroll:true});
    }
  }

  // Home Assistant renders native graphical editors from getConfigForm().
  for (const [name, constructor] of [['vsr300-svg-card', Vsr300SvgCard], ['vsr300-control-card', Vsr300ControlCard], ['vsr300-explanations-card', Vsr300ExplanationsCard], ['vsr300-settings-card', Vsr300SettingsCard]]) {
    if (!customElements.get(name)) customElements.define(name, constructor);
  }
  window.customCards = window.customCards || [];
  for (const [type, name, description] of [
    ['vsr300-svg-card', 'Systemair SVG', 'Prosessillustrasjon med temperaturer, pådrag, filterstatus og rapportert resttid.'],
    ['vsr300-control-card', 'Systemair Kontrollpanel', 'Modusknapper og justerbare varigheter gjennom Systemair-integrasjonen.'],
    ['vsr300-explanations-card', 'Systemair Status og forklaringer', 'Driftsstatuser, forklaringer, teknisk grunnlag og beregnet Huslast.'],
    ['vsr300-settings-card', 'Systemair Innstillinger', 'Temperatur, ECO og frikjøling.'],
  ]) if (!window.customCards.some(card => card.type === type)) window.customCards.push({ type, name, description, preview: true });
})();
