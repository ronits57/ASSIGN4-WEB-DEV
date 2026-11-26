const EventEmitter = require("events");

// one shared emitter used by the whole app
const appEvents = new EventEmitter();

module.exports = appEvents;
