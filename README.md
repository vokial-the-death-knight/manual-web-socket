# Project status
Greeting,

Unfortunately I never had time to finish this project (add tests, modify codebase, add source maps and so on).
As you can see it's abandoned for some time.

If you're interested in improving or further developing this project, please fork or contact me - I can move the ownership to you.

# Manual WebSocket

Table of Contents:

1. [Example](#example)
1. [Motivation](#motivation)
1. [Documentation](#documentation)

   1. [The big picture](#the-big-picture)
   1. [Global scope](#global-scope)
   1. [Public API](#public-api)

      1. [Global object](#1-global-object)

         1. [mws._`track`_ (method)](#1-mwstrack)
         1. [mws._`untrack`_ (method)](#2-mwsuntrack)
         1. [mws._`readyState`_ (object with constants)](#3-mwsreadystate)
         1. [mws._`trackedConnections`_ (object with methods)](#4-mwstrackedconnections)
            1. mws.trackedConnections._`getAll`_ (method)
            1. mws.trackedConnections._`getByUrl`_ (method)
            1. mws.trackedConnections._`when`_ (method)
         1. [mws._`when`_ (method)](#5-mwswhen)
         1. [mws._`bus`_ (event emitter)](#6-mwsbus)
         1. [mws._`busEvent`_ (object with constants)](#7-mwsbusevent)

      1. [Instance of `ManualWebSocketConnection`](#2-instance-of-manualwebsocketconnection)
         - WebSocket methods
         - ability to change **readyState** by hand
         - [connection._`addServerScenario`_ (method)](#1-connectionaddServerScenario)

1. [How to use it in your project](#how-to-use-it-in-your-project)
   1. [Setup using `module` - Cypress example](#1-setup-using-module---cypress-example)
   1. [Setup without `module` - raw html](#2-setup-without-module---raw-html)

---

## Example:

- https://github.com/baal-cadar/manual-web-socket-example

## Motivation:

There are many ways for stubbing http responses, for example in cypress we can use `cy.route()`.
But there is no _out of the box_ way to stub WebSocket communication.

Manual WebSocket is built to serve that purpose.

Check repository `https://github.com/baal-cadar/manual-web-socket-example` for working example.

# Documentation

## The big picture

1. Replace native `WebSocket` constructor with `ManualWebSocketConnection`
1. Tell `ManualWebSocket` which addresses to **track**
1. When `new WebSocket(addr)` is executed:
   1. Check if `addr` is marked to be **tracked**
      1. If **yes** - create `ManualWebSocketConnection` instance
      1. If **not** - create `WebSocket` instance

`ManualWebSocket` object gives you access to tracked connections, so you can manipulate them with no need to make any changes in your application code. Also can act as a server, creating fake communication channel.

---

### Global scope:

```js
window.ManualWebSocket = window.MWS = window.mws;
```

---

## Public API:

### 1. Global object:

#### 1. mws._`track`_

Add addresses you want to be tracked.

Can be used multiple times, each time it will add new addresses to the tracked list.

Be aware that `track` will not close nor replace active connection.
Just next time when WebSocket will be created using given address, it will be marked as `tracked`.

```js
public track: (addresses: Array<string | RegExp>): void
```

Example:

```js
mws.track([address1, address2, ...]);

/* address can be string or RegExp */
mws.track(["wss://127.0.0.1:777", /other\.domain/]);

```

#### 2. MWS._`untrack`_

Remove addresses you want don't want to be tracked next time.

Be aware that `untrack` will not close nor replace active connection.
Just next time when WebSocket will be created using given address, it won't be marked as `tracked`.

```js
public untrack: (addresses: Array<string | RegExp>): void
```

Example:

```js
mws.untrack([address1, address2]);

/* address can be string or RegExp */
mws.untrack(["wss://127.0.0.1:777", /other\.domain/]);
```

#### 3. MWS._`readyState`_

WebSocket ready state constants:

```js
enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}
```

Example:

```js
connection.readyState = mws.readyState.OPEN;

/**
 * By the way - setting a new state will trigger proper callbacks
 * For example `OPEN` will trigger `onOpen` and callbacks registered with `.on('open', ...)`
 */
```

#### 4. MWS._`trackedConnections`_

Container with all tracked connections. Exposes public interface:

```js
public getAll(): ManualWebSocket[]
public getByUrl(url: string): ManualWebSocket | undefined
public when(url: string): Promise<ManualWebSocket>
```

1. trackedConnections.`getAll` - returns list of all active tracked connections

   ```js
     public getAll(): ManualWebSocket[]
   ```

   Example:

   ```js
   mws.trackedConnections.getAll().forEach(connection => {
     console.log(connection.url);
   });
   ```

2. trackedConnections.`getByUrl` - returns connection with given url (explicit)

   ```js
   public getByUrl(url: string): ManualWebSocket | undefined
   ```

   Example:

   ```js
   const connection = mws.trackedConnections.getByUrl("wss://127.0.0.1:777");
   ```

3. trackedConnections.`when` - returns a promise that will resolve into a valid connection. If connection already exists, will resolve immediately

   ```js
   public when(url: string): Promise<ManualWebSocket>
   ```

   Example:

   ```js
   const promise = mws.trackedConnections.when("wss://127.0.0.1:777")

   // or
   mws.trackedConnections.when("wss://127.0.0.1:777").then(connection => {...})
   ```

#### 5. MWS._`when`_

Alias to `mws.trackedConnections.when`

#### 6. MWS._`bus`_

Event emitter. Will trigger callbacks upon ManualWebSocket creation - if you need to do some `private business`.

Example:

```js
mws.bus.on(mws.busEvent.MANUAL_WEBSOCKET_CREATED, connection => {
  console.log("from bus");
});

// or just simply
mws.bus.on("MANUAL_WEBSOCKET_CREATED", connection => {
  console.log("from bus");
});
```

#### 7. MWS._`busEvent`_

List of events that you can subscribe to on `mws.bus`.

Currently there is only one event

- **MANUAL_WEBSOCKET_CREATED** : will run given callback with created `connection` (see example above)

Example:

```js
console.log(mws.busEvent);
```

---

### 2. Instance of `ManualWebSocketConnection`:

#### 1. connection._`addServerScenario`_

Prepare server response for given message. Use `connection.send()` to trigger scenario.

```js
public addServerScenario(clientMessage: string, callback: Function): void
```

Example:

```js
const message = "some message";
connection.addServerScenario(message, (connection, message) => {
  connection.receiveMessage(messageThatServerWouldGenerate);
});

connection.send(message);
```

# How to use it in your project?

### 1. Setup using `module` - Cypress example:

1.  Install package

```js
yarn add manual-web-socket --dev
```

2.  Require in test

```js
const manualWebSocket = require("manual-web-socket");
```

3.  Inject script at the top of `header` section in `onBeforeLoad` stage. Use `getScript` and place it manually

```js
cy.visit("/", {
  onBeforeLoad(win) {
    var script = win.document.createElement("script");
    script.innerText = manualWebSocket.getScript();
    win.document.head.appendChild(script);
  }
});
```

4. Now you'll have access to `ManualWebSocket` object in `win` scope.

### 2. Setup without `module` - raw html:

1.  Download `manual-web-socket.raw.js` file
2.  Place it on top of `<head>` in your `index.html`
