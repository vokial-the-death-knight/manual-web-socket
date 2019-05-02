import { ManualWebSocketConnection } from "./ManualWebSocketConnection";
import { ReadyState } from "../WebSocket/ReadyState";

export interface PrivateReadyState {
  readyState: ReadyState;
}

export const PrivateReadyState = new WeakMap<
  ManualWebSocketConnection,
  PrivateReadyState
>();
