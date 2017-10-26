/**
 * Created by gbl17 on 2017/6/15.
 */
const EventEmitter = require('events').EventEmitter;
let emitter = new EventEmitter;
emitter.on(name, f);
emitter.once(name, f);
emitter.listeners(name);
emitter.removeListener(name, f);
emitter.removeAllListeners(name);