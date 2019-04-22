# Manual WebSocket

## **Under construction**

### `Manual WebSocket` in global scope:

```
window.MWS
window.mws
window.ManualWebSocket
```

## Usage:

### 1. Track addresses:

```js
mws.track([address1, address2, ...]);
```

address can be `string` or `RegExp`

```js
mws.track(["wss://127.0.0.1:999", /other\.domain/]);
```
