import { ManualWebSocket } from "./ManualWebSocket";
import { ReadyState } from "../WebSocket/ReadyState";

export interface PrivateReadyState {
  readyState: ReadyState;
}

export const PrivateReadyState = new WeakMap<
  ManualWebSocket,
  PrivateReadyState
>();
