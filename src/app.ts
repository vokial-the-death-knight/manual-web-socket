import { ManualWebSocket } from "./ManualWebSocket/ManualWebSocket";
import { GlobalWebSocketsContainer } from "./Container/Container";
import { ReadyState } from "./WebSocket/ReadyState";
import { WebSocket } from "./WebSocket/WebSocket";
import { GlobalTrackedAddresses } from "./ManualWebSocket/TrackedAddresses";

/**
 * Manual WebSocket
 */
WebSocket.NativeImplementation = (window as any).WebSocket;

/**
 * Replace native WebSocket with ManualWebSocket
 */
(window as any).WebSocket = ManualWebSocket;

/**
 * Expose public interface
 */
(window as any).MWS = (window as any).ManualWebSocket = {
  GlobalWebSocketsContainer: GlobalWebSocketsContainer,
  ReadyState: ReadyState,
  when: (url: string) => GlobalWebSocketsContainer.when(url),
  useFor: (addresses: Array<string | RegExp>) =>
    addresses.forEach(address => GlobalTrackedAddresses.add(address))
};
