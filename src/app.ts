import { MessageBus } from "./Communication/MessageBus";
import { SIMPLIFIED_WEBSOCKET_CREATED } from "./tokens";
import { ManualWebSocket } from "./WebSocket/ManualWebSocket";
import { GlobalWebSocketsContainer } from "./WebSocket/WebSocketsContainer";
import { ReadyState } from "./WebSocket/ReadyState";

MessageBus.on(SIMPLIFIED_WEBSOCKET_CREATED, (websocket: ManualWebSocket) => {
  GlobalWebSocketsContainer.add(websocket);
});

/**
 * Manual WebSocket
 */

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
  when: (url: string) => GlobalWebSocketsContainer.when(url)
};
