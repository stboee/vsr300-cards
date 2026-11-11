// Offline reproduction of delayed duration reporting; no live HA or Modbus.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const definitions=new Map(),timers=new Map();let now=Date.parse('2026-11-11T12:00:00Z'),nextId=0;
class Clock extends Date{static now(){return now;}}
const context={HTMLElement:class{},window:{confirm:()=>true},Date:Clock,Intl,
  customElements:{get:k=>definitions.get(k),define:(k,v)=>definitions.set(k,v)},
  setInterval:(callback,delay)=>{const id=++nextId;timers.set(id,{callback,delay});return id;},clearInterval:id=>timers.delete(id)};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','vsr300-cards.js'),'utf8'),context);
const Control=definitions.get('vsr300-control-card'),Svg=definitions.get('vsr300-svg-card');
const defaults=JSON.parse(JSON.stringify(Control.getStubConfig()));
const stamp=()=>new Date(now).toISOString();
function control(){
 const c=Object.create(Control.prototype);c._renderIfReady=()=>{};c.shadowRoot={activeElement:null,querySelectorAll:()=>[]};
 c.setConfig(JSON.parse(JSON.stringify(defaults)));c._durationRole='boost_duration';c._hass={states:{},callService:async()=>{}};
 for(const[role,id]of Object.entries(c.config.entities))if(id)c._hass.states[id]={entity_id:id,state:role==='mode'?'auto':role==='mode_select'?'Auto':role.endsWith('_duration')?'2':'unknown',attributes:role.endsWith('_duration')?{min:1,max:365,step:1}:{},last_updated:stamp()};
 c._hass.states[c.config.entities.countdown]={state:'60',attributes:{unit_of_measurement:'s'},last_updated:stamp()};
 return c;
}
function report(c,role,value){const id=c.config.entities[role];c._hass.states={...c._hass.states,[id]:{...c._hass.states[id],state:String(value),last_updated:stamp()}};}
const checks=[];async function check(name,fn){await fn();checks.push(name);}
(async()=>{
 await check('All five modes use the same elapsed-time countdown as Cockpit',()=>{
  for(const mode of ['boost','fireplace','party','away','holiday']){
   now=Date.parse('2026-11-11T12:00:00Z');const c=control();report(c,'mode',mode);
   const svg=Object.create(Svg.prototype);svg._config={entities:{...c.config.entities}};svg._hass=c._hass;
   for(const elapsed of [0,1100,12345,59999,60000,120000]){now=Date.parse('2026-11-11T12:00:00Z')+elapsed;assert.deepEqual(JSON.parse(JSON.stringify(c._modeTiming())),JSON.parse(JSON.stringify(svg._modeTiming())));}
   assert.equal(c._modeTiming().text,'0:00 igjen');assert.equal(c._hass.states[c.config.entities.mode].state,mode);
  }
 });
 await check('Fresh reports resynchronize; unrelated updates do not restart time; unknown time is never guessed',()=>{
  now=Date.parse('2026-11-11T12:00:00Z');const c=control();report(c,'mode','boost');assert.equal(c._modeTiming().text,'1:00 igjen');
  now+=10000;report(c,'boost_duration','2');assert.equal(c._modeTiming().text,'0:50 igjen');
  report(c,'countdown','45');assert.equal(c._modeTiming().text,'0:45 igjen');now+=2000;assert.equal(c._modeTiming().text,'0:43 igjen');
  for(const value of ['unknown','unavailable','-1','']){report(c,'countdown',value);assert.equal(c._modeTiming().text,'Resttid ukjent');}
  c._config.entities.countdown='';assert.equal(c._modeTiming().text,'Resttid ukjent');
  report(c,'mode','auto');assert.equal(c._modeTiming().text,'Ikke tidsstyrt');
 });
 await check('Save and start retains the sent value while HA still reports the old duration',async()=>{
  for(const[action,role]of [['boost','boost_duration'],['party','party_duration'],['away','away_duration'],['holiday','holiday_duration']]){
   const c=control(),calls=[];c._durationRole=role;c._drafts[role]='1';
   c._hass.callService=async(...args)=>{calls.push(args);if(args[0]==='button'){report(c,'mode',action);report(c,'countdown','60');}};
   await c._commitDuration(role,true);
   assert.equal(calls.length,2);assert.equal(calls[0][2].value,1);assert.equal(c._entity(role).state,'2');
   assert.equal(c._durationInput(role),'1');assert.match(c._duration(role,'min'),/1 min · sendt/);assert.equal(c._modeTiming().text,'1:00 igjen');
   report(c,role,'2');assert.equal(c._durationInput(role),'1','repeated old report is not confirmation');
   report(c,role,'1');assert.equal(c._sentDuration(role),undefined);assert.equal(c._durationInput(role),'1');
  }
 });
 await check('Save alone does not start; plus/minus and reverting to the stale reported value use the current request',async()=>{
  const c=control(),calls=[];c._drafts.boost_duration='1';c._hass.callService=async(...a)=>calls.push(a);
  await c._commitDuration('boost_duration',false);assert.equal(calls.length,1);assert.equal(c._entity('mode').state,'auto');
  assert.equal(c._durationInput('boost_duration'),'1');c._step('boost_duration',1);assert.equal(c._drafts.boost_duration,'2');
  await c._commitDuration('boost_duration',false);assert.equal(calls.length,2);assert.equal(calls.at(-1)[2].value,2,'must actually send the reversal although old HA was already 2');
  assert.ok(c._sentDuration('boost_duration'),'unchanged old object is not a new confirmation');
  report(c,'boost_duration','2');assert.equal(c._sentDuration('boost_duration'),undefined);
 });
 await check('Failures, cancellation, invalid values and partial starts remain explicit',async()=>{
  const c=control();let calls=[];c._drafts.boost_duration='1';
  context.window.confirm=()=>false;await c._commitDuration('boost_duration',true);assert.equal(c._sentDuration('boost_duration'),undefined);
  context.window.confirm=()=>true;c._drafts.boost_duration='0';await c._commitDuration('boost_duration',true);assert.equal(c._sentDuration('boost_duration'),undefined);
  c._drafts.boost_duration='1';c._hass.callService=async(...a)=>{calls.push(a);throw Error('failed save');};
  await c._commitDuration('boost_duration',true);assert.equal(calls.length,1);assert.equal(c._durationInput('boost_duration'),'1');assert.equal(c._sentDuration('boost_duration'),undefined);assert.match(c._error,/Ingen startkommando/);
  calls=[];c._hass.callService=async(...a)=>{calls.push(a);if(calls.length===2)throw Error('failed start');};
  await c._commitDuration('boost_duration',true);assert.equal(calls.length,2);assert.match(c._error,/men modusen kunne ikke startes/);assert.ok(c._sentDuration('boost_duration'));assert.equal(c._entity('mode').state,'auto');
 });
 await check('New authoritative values, remapping and reset clear request display safely',async()=>{
  const c=control();c._drafts.boost_duration='1';await c._commitDuration('boost_duration',false);
  report(c,'boost_duration','3');assert.equal(c._sentDuration('boost_duration'),undefined);assert.equal(c._durationInput('boost_duration'),'3');
  c._drafts.boost_duration='1';await c._commitDuration('boost_duration',false);c.setConfig(JSON.parse(JSON.stringify(defaults)));assert.equal(c._sentDuration('boost_duration'),undefined);
  const old=JSON.parse(JSON.stringify(defaults));delete old.entities.countdown;c.setConfig(old);assert.equal(c.config.entities.countdown,'');
  c._durationRole='boost_duration';c._drafts.boost_duration='1';let release,calls=0;
  c._hass.callService=async()=>{calls++;await new Promise(r=>release=r);};
  const pending=c._commitDuration('boost_duration',true);const cfg=JSON.parse(JSON.stringify(defaults));cfg.entities.boost_duration='number.other_duration';c.setConfig(cfg);release();await pending;
  assert.equal(calls,1);assert.equal(c._sentDuration('boost_duration'),undefined);assert.match(c._error,/men modusen kunne ikke startes/);
 });
 await check('One-second ticks change only visible countdown text and clean up on detach',()=>{
  now=Date.parse('2026-11-11T12:00:00Z');const c=control(),node={textContent:''};report(c,'mode','boost');c.isConnected=true;c.shadowRoot.querySelectorAll=()=>[node];
  c._updateCountdown();assert.equal(node.textContent,'1:00 igjen');assert.equal(timers.size,1);c._updateCountdown();assert.equal(timers.size,1);
  now+=1100;[...timers.values()][0].callback();assert.equal(node.textContent,'0:59 igjen');
  c.disconnectedCallback();assert.equal(timers.size,0);c.isConnected=false;c._updateCountdown();assert.equal(timers.size,0);
 });
 console.log(JSON.stringify({passed:checks.length,checks,live_home_assistant:false,modbus_access:false},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
