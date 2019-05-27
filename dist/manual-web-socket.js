module.exports = { getScript: function(){ return `!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=5)}([function(e,t,n){"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.CONNECTING=0]="CONNECTING",e[e.OPEN=1]="OPEN",e[e.CLOSING=2]="CLOSING",e[e.CLOSED=3]="CLOSED"}(r=t.ReadyState||(t.ReadyState={})),t.IsReadyState=function(e){return e in r}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){this.stringList=[],this.regExpList=[]}return e.prototype.add=function(e){console.log("TrackedAddresses @add"),console.log(e),console.log(e.constructor),console.log(RegExp),console.log(RegExp.name),console.log("RegExp"==e.constructor.name),"RegExp"==e.constructor.name?this.regExpList.push(e):this.stringList.push(e),console.log(this.stringList),console.log(this.regExpList)},e.prototype.remove=function(e){var t;"RegExp"==e.constructor.name?(t=this.regExpList.indexOf(e))>-1&&this.regExpList.splice(t,1):(t=this.stringList.indexOf(e))>-1&&this.stringList.splice(t,1)},e.prototype.isTracked=function(e){return!!this.searchStrings(e)||this.searchRegExps(e)},e.prototype.searchRegExps=function(e){return!!this.regExpList.filter(function(t){return new RegExp(t).exec(e)}).length},e.prototype.searchStrings=function(e){return this.stringList.includes(e)},e}();t.TrackedAddresses=r,t.GlobalTrackedAddresses=new r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){}return e.CreateUsingNativeImplementation=function(t){return new e.NativeImplementation(t)},e.NativeImplementation=null,e}();t.WebSocket=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){this.websockets=[],this.awaitingPromises=[]}return e.prototype.getByUrl=function(e){return this.websockets.find(function(t){return t.getUrl()===e})},e.prototype.getAll=function(){return this.websockets},e.prototype.add=function(e){this.websockets.push(e),this.resolve(e)},e.prototype.resolve=function(e){this.awaitingPromises.filter(function(t){return t.url===e.getUrl()}).forEach(function(t){return t.resolveFn(e)}),this.awaitingPromises=this.awaitingPromises.filter(function(t){return t.url!==e.getUrl()})},e.prototype.wait=function(e,t){this.awaitingPromises.push({url:e,resolveFn:t})},e.prototype.when=function(e){var t=this;return new Promise(function(n,r){var o=t.getByUrl(e);o?n(o):t.wait(e,n)})},e}();t.WebSocketsContainer=r,t.TrackedConnectionsContainer=new r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(10);t.MessageBus=new r.EventEmitter},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(6),o=n(3),i=n(0),s=n(2),u=n(1),c=n(4);s.WebSocket.NativeImplementation=window.WebSocket,window.WebSocket=r.ManualWebSocketConnection,window.MWS=window.mws=window.ManualWebSocket={trackedConnections:{when:function(e){return o.TrackedConnectionsContainer.when(e)},getByUrl:function(e){return o.TrackedConnectionsContainer.getByUrl(e)},getAll:function(){return o.TrackedConnectionsContainer.getAll()}},readyState:i.ReadyState,when:function(e){return o.TrackedConnectionsContainer.when(e)},track:function(e){return e.forEach(function(e){return u.GlobalTrackedAddresses.add(e)})},untrack:function(e){return e.forEach(function(e){return u.GlobalTrackedAddresses.remove(e)})},bus:c.MessageBus,busEvent:{MANUAL_WEBSOCKET_CREATED:"MANUAL_WEBSOCKET_CREATED"}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=n(1),i=n(7),s=n(2),u=n(8),c=n(9),a=n(3),f=n(4),l=n(11),p=function(){function e(e){if(this.url=e,this.events=[],this.server=new c.ManualServer,!o.GlobalTrackedAddresses.isTracked(e))return s.WebSocket.CreateUsingNativeImplementation(e);this.readyState=r.ReadyState.CONNECTING,a.TrackedConnectionsContainer.add(this),f.MessageBus.emit(l.MANUAL_WEBSOCKET_CREATED,this)}return Object.defineProperty(e.prototype,"readyState",{get:function(){return i.PrivateReadyState.get(this).readyState},set:function(e){if(!r.IsReadyState(e))throw new Error("Given "+e+" is not a valid ReadyState");switch(i.PrivateReadyState.set(this,{readyState:e}),e){case r.ReadyState.OPEN:this.onopen(),this.events.filter(function(e){return"open"===e.getType()}).forEach(function(e){return e.execute()});break;case r.ReadyState.CLOSED:this.onclose(),this.events.filter(function(e){return"close"===e.getType()}).forEach(function(e){return e.execute()})}},enumerable:!0,configurable:!0}),e.prototype.getUrl=function(){return this.url},e.prototype.addEventListener=function(e,t){this.events.push(new u.Event(e,t))},e.prototype.removeEventListener=function(e,t){var n=this.events.findIndex(function(n){return n.getType()===e&&n.getCallback()===t});n>-1&&this.events.splice(n,1)},e.prototype.isOpened=function(){if(i.PrivateReadyState.get(this).readyState!==r.ReadyState.OPEN)throw new Error("Message can be sent only when ready state is *OPEN*, \n        current state is *"+i.PrivateReadyState.get(this).readyState+"*")},e.prototype.reciveMessage=function(e){this.isOpened(),this.onmessage(e),this.events.filter(function(e){return"message"===e.getType()}).forEach(function(t){return t.execute(e)})},e.prototype.onopen=function(){console.info("default @onopen")},e.prototype.onclose=function(){console.info("default @onclose")},e.prototype.onmessage=function(e){console.info("default @onmessage *"+e+"*")},e.prototype.onerror=function(){console.info("default @onerror")},e.prototype.close=function(){},e.prototype.send=function(e){this.isOpened(),this.server.findAndRunServerCallback(e)},e.prototype.addServerScenario=function(e,t){this.server.addCallback({message:e,callback:t,connection:this})},e}();t.ManualWebSocketConnection=p},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.PrivateReadyState=new WeakMap},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){this.type=e,this.callback=t}return e.prototype.getType=function(){return this.type},e.prototype.getCallback=function(){return this.callback},e.prototype.execute=function(e){return this.callback(e)},e}();t.Event=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(){this.callbacks=[]}return e.prototype.findAndRunServerCallback=function(e){var t=this.callbacks.findIndex(function(t){return t.message===e});if(t>-1){var n=this.callbacks[t];this.callbacks.splice(t,1),n.callback(n.connection,e)}},e.prototype.addCallback=function(e){this.callbacks.push(e)},e}();t.ManualServer=r},function(e,t,n){"use strict";var r,o="object"==typeof Reflect?Reflect:null,i=o&&"function"==typeof o.apply?o.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};r=o&&"function"==typeof o.ownKeys?o.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var s=Number.isNaN||function(e){return e!=e};function u(){u.init.call(this)}e.exports=u,u.EventEmitter=u,u.prototype._events=void 0,u.prototype._eventsCount=0,u.prototype._maxListeners=void 0;var c=10;function a(e){return void 0===e._maxListeners?u.defaultMaxListeners:e._maxListeners}function f(e,t,n,r){var o,i,s,u;if("function"!=typeof n)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof n);if(void 0===(i=e._events)?(i=e._events=Object.create(null),e._eventsCount=0):(void 0!==i.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),i=e._events),s=i[t]),void 0===s)s=i[t]=n,++e._eventsCount;else if("function"==typeof s?s=i[t]=r?[n,s]:[s,n]:r?s.unshift(n):s.push(n),(o=a(e))>0&&s.length>o&&!s.warned){s.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=s.length,u=c,console&&console.warn&&console.warn(u)}return e}function l(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},o=function(){for(var e=[],t=0;t<arguments.length;t++)e.push(arguments[t]);this.fired||(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,i(this.listener,this.target,e))}.bind(r);return o.listener=n,r.wrapFn=o,o}function p(e,t,n){var r=e._events;if(void 0===r)return[];var o=r[t];return void 0===o?[]:"function"==typeof o?n?[o.listener||o]:[o]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(o):h(o,o.length)}function d(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function h(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}Object.defineProperty(u,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(e){if("number"!=typeof e||e<0||s(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");c=e}}),u.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},u.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||s(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},u.prototype.getMaxListeners=function(){return a(this)},u.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var r="error"===e,o=this._events;if(void 0!==o)r=r&&void 0===o.error;else if(!r)return!1;if(r){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var u=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw u.context=s,u}var c=o[e];if(void 0===c)return!1;if("function"==typeof c)i(c,this,t);else{var a=c.length,f=h(c,a);for(n=0;n<a;++n)i(f[n],this,t)}return!0},u.prototype.addListener=function(e,t){return f(this,e,t,!1)},u.prototype.on=u.prototype.addListener,u.prototype.prependListener=function(e,t){return f(this,e,t,!0)},u.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);return this.on(e,l(this,e,t)),this},u.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);return this.prependListener(e,l(this,e,t)),this},u.prototype.removeListener=function(e,t){var n,r,o,i,s;if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);if(void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(o=-1,i=n.length-1;i>=0;i--)if(n[i]===t||n[i].listener===t){s=n[i].listener,o=i;break}if(o<0)return this;0===o?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,o),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,s||t)}return this},u.prototype.off=u.prototype.removeListener,u.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var o,i=Object.keys(n);for(r=0;r<i.length;++r)"removeListener"!==(o=i[r])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},u.prototype.listeners=function(e){return p(this,e,!0)},u.prototype.rawListeners=function(e){return p(this,e,!1)},u.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):d.call(e,t)},u.prototype.listenerCount=d,u.prototype.eventNames=function(){return this._eventsCount>0?r(this._events):[]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.MANUAL_WEBSOCKET_CREATED="MANUAL_WEBSOCKET_CREATED"}]);`;},}