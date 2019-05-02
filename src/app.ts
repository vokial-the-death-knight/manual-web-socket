import { ManualWebSocketConnection } from "./ManualWebSocket/ManualWebSocketConnection";
import { TrackedConnectionsContainer } from "./Container/Container";
import { ReadyState } from "./WebSocket/ReadyState";
import { WebSocket } from "./WebSocket/WebSocket";
import { GlobalTrackedAddresses } from "./ManualWebSocket/TrackedAddresses";
import { MessageBus } from "./Communication/MessageBus";

/**
 * Manual WebSocket
 */
WebSocket.NativeImplementation = (window as any).WebSocket;

/**
 * Replace native WebSocket with ManualWebSocket
 */
(window as any).WebSocket = ManualWebSocketConnection;

/**
 * Expose public interface
 */
(window as any).MWS = (window as any).mws = (window as any).ManualWebSocket = {
  trackedConnections: {
    when: (url: string) => TrackedConnectionsContainer.when(url),
    getByUrl: (url: string) => TrackedConnectionsContainer.getByUrl(url),
    getAll: () => TrackedConnectionsContainer.getAll()
  },
  readyState: ReadyState,
  when: (url: string) => TrackedConnectionsContainer.when(url),
  track: (addresses: Array<string | RegExp>) =>
    addresses.forEach(address => GlobalTrackedAddresses.add(address)),
  untrack: (addresses: Array<string | RegExp>) =>
    addresses.forEach(address => GlobalTrackedAddresses.remove(address)),
  bus: MessageBus,
  busEvent: { MANUAL_WEBSOCKET_CREATED: "MANUAL_WEBSOCKET_CREATED" }
};
