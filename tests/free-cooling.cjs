// Offline behavior checks. No HA connection, history query, services or Modbus.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let now = Date.parse('2026-07-10T21:00:00Z'), nextTimer = 0;
const timers = new Map(), definitions = new Map();
class Clock extends Date { static now() { return now; } }
const source = fs.readFileSync(path.join(__dirname, '..', 'vsr300-cards.js'), 'utf8');
vm.runInNewContext(source, {
  HTMLElement: class {}, window: {}, Date: Clock, Intl,
  customElements: { get: key => definitions.get(key), define: (key, value) => definitions.set(key, value) },
  setTimeout: (callback, delay) => { const id = ++nextTimer; timers.set(id, { callback, delay }); return id; },
  clearTimeout: id => timers.delete(id),
});
const Card = definitions.get('vsr300-explanations-card');
const base = JSON.parse(JSON.stringify(Card.getStubConfig()));
const timeRoles = ['cooling_start_hour', 'cooling_start_minute', 'cooling_end_hour', 'cooling_end_minute'];
const temperatureRoles = ['outdoor_max_24h', 'free_cooling_day_min', 'outdoor_temperature', 'free_cooling_night_high', 'free_cooling_night_low', 'extract_temperature', 'free_cooling_room_cancel'];
const values = {
  free_cooling_active: 'off', free_cooling_enabled: 'on', free_cooling_reliable: 'on',
  outdoor_max_24h: '25', free_cooling_day_min: '22', outdoor_temperature: '16',
  free_cooling_night_high: '23', free_cooling_night_low: '12', extract_temperature: '24',
  free_cooling_room_cancel: '18', cooling_start_hour: '22', cooling_start_minute: '30',
  cooling_end_hour: '7', cooling_end_minute: '15',
};
function card(overrides = {}, config = base, zone = 'Europe/Oslo') {
  const c = Object.create(Card.prototype);
  c._renderIfReady = () => {};
  c.setConfig(JSON.parse(JSON.stringify(config)));
  c._hass = { config: { time_zone: zone }, states: {} };
  for (const [role, value] of Object.entries({ ...values, ...overrides })) {
    const id = c.config.entities[role];
    if (id) c._hass.states[id] = { state: value, attributes: temperatureRoles.includes(role) ? { unit_of_measurement: '°C' } : {} };
  }
  return c;
}
const results = [];
function check(name, fn) { fn(); results.push(name); }
function label(overrides, time = '2026-07-10T21:00:00Z') {
  now = Date.parse(time); return card(overrides)._freeCooling().label;
}
check('Preserves the candidate, blockers and threshold equality rules', () => {
  assert.equal(label({}), 'Kandidat');
  assert.equal(label({ outdoor_max_24h: '21.9' }), 'Dag ikke OK');
  assert.equal(label({ outdoor_max_24h: '22' }), 'Kandidat');
  assert.equal(label({ outdoor_temperature: '23.1' }), 'For varmt');
  assert.equal(label({ outdoor_temperature: '23' }), 'Kandidat');
  assert.equal(label({ outdoor_temperature: '11.9' }), 'For kaldt');
  assert.equal(label({ outdoor_temperature: '12' }), 'Kandidat');
  assert.equal(label({ extract_temperature: '18' }), 'Rom kaldt');
  assert.equal(label({ extract_temperature: '18.1' }), 'Kandidat');
  assert.equal(label({ outdoor_max_24h: '0', free_cooling_day_min: '0', outdoor_temperature: '0', free_cooling_night_low: '-5', free_cooling_night_high: '0' }), 'Kandidat');
  assert.equal(label({ outdoor_max_24h: '21', outdoor_temperature: '30', extract_temperature: '15' }), 'Dag ikke OK');
});
check('Uses HA time zone, minute boundaries, midnight and both DST occurrences', () => {
  assert.equal(label({}, '2026-07-10T20:29:59Z'), 'Venter tid');
  assert.equal(label({}, '2026-07-10T20:30:00Z'), 'Kandidat');
  assert.equal(label({}, '2026-07-10T22:00:00Z'), 'Kandidat');
  assert.equal(label({}, '2026-07-11T05:14:59Z'), 'Kandidat');
  assert.equal(label({}, '2026-07-11T05:15:00Z'), 'Venter tid');
  const daytime = { cooling_start_hour: '8', cooling_start_minute: '30', cooling_end_hour: '18', cooling_end_minute: '45' };
  assert.equal(label(daytime, '2026-07-10T06:30:00Z'), 'Kandidat');
  assert.equal(label(daytime, '2026-07-10T16:45:00Z'), 'Venter tid');
  assert.equal(label({ cooling_end_hour: '22', cooling_end_minute: '30' }), 'Venter tid');
  const repeatedHour = { cooling_start_hour: '2', cooling_start_minute: '0', cooling_end_hour: '3', cooling_end_minute: '0' };
  assert.equal(label(repeatedHour, '2026-10-25T00:30:00Z'), 'Kandidat');
  assert.equal(label(repeatedHour, '2026-10-25T01:30:00Z'), 'Kandidat');
  now = Date.parse('2026-07-10T21:00:00Z');
  assert.equal(card({}, base, 'America/Los_Angeles')._freeCooling().label, 'Venter tid');
});
check('Every required missing or invalid input is unknown, without fallbacks', () => {
  for (const role of [...temperatureRoles, ...timeRoles]) {
    for (const value of ['unknown', 'unavailable', '', 'NaN', 'Infinity']) {
      const status = card({ [role]: value })._freeCooling();
      assert.equal(status.label, 'Ukjent', role + ': ' + value);
      assert.equal(status.kind, 'Mangler datagrunnlag');
      assert.ok(status.detail.length > 0);
    }
    const c = card(); delete c._hass.states[c.config.entities[role]];
    assert.equal(c._freeCooling().label, 'Ukjent', role + ': nonexistent');
    c._config.entities[role] = '';
    assert.equal(c._freeCooling().label, 'Ukjent', role + ': unmapped');
  }
  for (const [role, value] of [['cooling_start_hour', '24'], ['cooling_end_hour', '-1'], ['cooling_start_minute', '60'], ['cooling_end_minute', '1.5']]) assert.equal(label({ [role]: value }), 'Ukjent');
  assert.equal(label({ free_cooling_night_low: '24' }), 'Ukjent');
  assert.equal(card({}, base, '')._freeCooling().label, 'Ukjent');
  assert.equal(card({}, base, 'Invalid/Zone')._freeCooling().label, 'Ukjent');
  const c = card(); c._hass.states[c.config.entities.outdoor_max_24h].attributes.source_value_valid = false;
  assert.equal(c._freeCooling().label, 'Ukjent');
});
check('Normalizes Fahrenheit and rejects unsupported temperature units', () => {
  const c = card({ outdoor_max_24h: '22' });
  for (const role of temperatureRoles) {
    const entity = c._hass.states[c.config.entities[role]];
    entity.state = String(Number(entity.state) * 9 / 5 + 32);
    entity.attributes.unit_of_measurement = '°F';
  }
  assert.equal(c._freeCooling().label, 'Kandidat');
  c._hass.states[c.config.entities.free_cooling_day_min] = { state: '22', attributes: { unit_of_measurement: '°C' } };
  assert.equal(c._freeCooling().label, 'Kandidat', 'mixed units at equality');
  c._hass.states[c.config.entities.outdoor_temperature].attributes.unit_of_measurement = 'K';
  assert.equal(c._freeCooling().label, 'Ukjent');
});
check('Reported active/disabled/unknown states and native diagnostics retain priority', () => {
  assert.equal(label({ free_cooling_active: 'on', outdoor_max_24h: 'unavailable', free_cooling_enabled: 'off' }), 'Aktiv');
  assert.equal(label({ free_cooling_enabled: 'off', outdoor_max_24h: 'unavailable' }), 'Av');
  assert.equal(label({ free_cooling_active: 'unavailable' }), 'Status ukjent');
  assert.equal(label({ free_cooling_active: 'unavailable', free_cooling_enabled: 'off' }), 'Av · status ukjent');
  assert.equal(label({ free_cooling_enabled: 'unavailable' }), 'Valg ukjent');
  assert.equal(label({ free_cooling_reliable: 'off', outdoor_max_24h: 'unavailable' }), 'Temperaturer usikre');
  const cfg = JSON.parse(JSON.stringify(base)); cfg.entities.free_cooling_state = 'sensor.test_native_state';
  for (const [value, expected] of [['disabled', 'Tilstand: av'], ['0', 'Tilstand: av'], ['daytime', 'Dagfase'], ['2', 'Dagfase'], ['temperatures_not_reliable', 'Temperaturer usikre'], ['3', 'Temperaturer usikre'], ['enabled', 'Kandidat'], ['1', 'Kandidat']]) {
    const c = card({ free_cooling_state: value }, cfg);
    assert.equal(c._freeCooling().label, expected);
  }
});
check('Old candidate binding is ignored; saved mappings and input validation are retained', () => {
  assert.equal(base.entities.free_cooling_diagnosis, undefined);
  const cfg = JSON.parse(JSON.stringify(base));
  cfg.entities.free_cooling_diagnosis = 'sensor.systemair_frikjoling_kandidat';
  cfg.entities.outdoor_temperature = 'sensor.my_temperature';
  const c = card({}, cfg);
  assert.equal(c.config.entities.free_cooling_diagnosis, undefined);
  assert.equal(c.config.entities.outdoor_temperature, 'sensor.my_temperature');
  assert.equal(c._freeCooling().label, 'Kandidat');
  for (const role of timeRoles) delete cfg.entities[role];
  const old = card({}, cfg);
  for (const role of timeRoles) assert.equal(old.config.entities[role], '');
  assert.equal(old._freeCooling().label, 'Ukjent');
  assert.throws(() => card({}, { ...base, entities: [] }));
  const fields = Card.getConfigForm().schema.find(field => field.name === 'entities').schema;
  assert.equal(fields.some(field => field.name === 'free_cooling_diagnosis'), false);
  for (const role of timeRoles) assert.ok(fields.some(field => field.name === role));
});
check('One local timer tracks minute boundaries and is cleaned up on detach', () => {
  const c = card(); c.isConnected = true;
  now = Date.parse('2026-07-10T20:29:30Z');
  let observed;
  c._renderIfReady = () => { observed = c._freeCooling().label; c._scheduleCoolingClock(c._freeCooling().kind === 'Beregnet i kortet'); };
  c._scheduleCoolingClock(true);
  assert.equal(timers.size, 1); assert.equal([...timers.values()][0].delay, 30020);
  c._scheduleCoolingClock(true); assert.equal(timers.size, 1);
  const [id, timer] = [...timers.entries()][0]; timers.delete(id);
  now = Date.parse('2026-07-10T20:30:00.020Z'); timer.callback();
  assert.equal(observed, 'Kandidat'); assert.equal(timers.size, 1);
  c.disconnectedCallback(); assert.equal(timers.size, 0);
  c.isConnected = false; c._scheduleCoolingClock(true); assert.equal(timers.size, 0);
  c.isConnected = true; c._scheduleCoolingClock(false); assert.equal(timers.size, 0);
});
assert.equal(/\b(fetch|WebSocket)\s*\(/.test(source), false);
console.log(JSON.stringify({ passed: results.length, checks: results, live_home_assistant: false, modbus_access: false }, null, 2));
