// Tiny isomorphic EventEmitter (build-time alias for the `events` builtin).
class EventEmitter {
  constructor() { this._events = Object.create(null); }
  on(type, listener) {
    (this._events[type] || (this._events[type] = [])).push(listener);
    return this;
  }
  addListener(type, listener) { return this.on(type, listener); }
  once(type, listener) {
    const wrap = (...args) => { this.removeListener(type, wrap); listener.apply(this, args); };
    wrap.listener = listener;
    return this.on(type, wrap);
  }
  removeListener(type, listener) {
    const arr = this._events[type];
    if (!arr) return this;
    this._events[type] = arr.filter(l => l !== listener && l.listener !== listener);
    return this;
  }
  removeAllListeners(type) {
    if (type === undefined) this._events = Object.create(null);
    else delete this._events[type];
    return this;
  }
  emit(type, ...args) {
    const arr = this._events[type];
    if (!arr || arr.length === 0) return false;
    for (const l of arr.slice()) l.apply(this, args);
    return true;
  }
  listeners(type) { return (this._events[type] || []).slice(); }
  listenerCount(type) { return (this._events[type] || []).length; }
}
EventEmitter.EventEmitter = EventEmitter;

module.exports = EventEmitter;
module.exports.default = EventEmitter;
module.exports.EventEmitter = EventEmitter;
