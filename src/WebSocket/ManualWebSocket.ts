import { ReadyState, IsReadyState } from "./ReadyState";
import { WebSocketEvent, WebSocketEventType } from "./WebSocketEvent";
import { MessageBus } from "../Communication/MessageBus";
import { SIMPLIFIED_WEBSOCKET_CREATED } from "../tokens";

interface ManualWebSocketReadyState {
  readyState: ReadyState;
}

interface ServerCallback {
  message: string;
  callback: Function;
}

const ManualReadyState = new WeakMap<
  ManualWebSocket,
  ManualWebSocketReadyState
>();

export class ManualWebSocket {
  private events: WebSocketEvent[] = [];
  private serverCallbacks: ServerCallback[] = [];

  static NativeWebSocketImplementation: any;
  static AffectedAddresses: string[] = [];

  constructor(private url: string) {
    if (ManualWebSocket.AffectedAddresses.includes(url)) {
      ManualReadyState.set(this, { readyState: ReadyState.CONNECTING });
      MessageBus.emit(SIMPLIFIED_WEBSOCKET_CREATED, this);
    } else {
      return new ManualWebSocket.NativeWebSocketImplementation(url);
    }
  }

  get readyState(): ReadyState {
    return ManualReadyState.get(this).readyState;
  }

  set readyState(readyState: ReadyState) {
    if (!IsReadyState(readyState)) {
      throw new Error(`Given ${readyState} is not a valid ReadyState`);
    }

    ManualReadyState.set(this, { readyState: readyState });

    switch (readyState) {
      case ReadyState.OPEN: {
        this.onopen();
        this.events
          .filter((event: WebSocketEvent) => event.getType() === "open")
          .forEach((event: WebSocketEvent) => event.execute());
        break;
      }

      case ReadyState.CLOSED: {
        this.onclose();
        this.events
          .filter((event: WebSocketEvent) => event.getType() === "close")
          .forEach((event: WebSocketEvent) => event.execute());
      }
    }
  }

  public getUrl(): string {
    return this.url;
  }

  public addEventListener(type: WebSocketEventType, callback: Function): void {
    this.events.push(new WebSocketEvent(type, callback));
  }

  public removeEventListener(
    type: WebSocketEventType,
    callback: Function
  ): void {
    const index = this.events.findIndex(
      e => e.getType() === type && e.getCallback() === callback
    );

    if (index > -1) {
      this.events.splice(index, 1);
    }
  }

  public publishMessage(message: string) {
    if (ManualReadyState.get(this).readyState !== ReadyState.OPEN) {
      throw new Error(
        `Message can be sent only when ready state is *OPEN*, 
        current state is *${ManualReadyState.get(this).readyState}*`
      );
    }

    this.onmessage(message);
    this.events
      .filter((event: WebSocketEvent) => event.getType() === "message")
      .forEach((event: WebSocketEvent) => event.execute(message));
  }

  public onopen() {
    console.info(`default @onopen`);
  }
  public onclose() {
    console.info(`default @onclose`);
  }
  public onmessage(message: string) {
    console.info(`default @onmessage *${message}*`);
  }
  public onerror() {
    console.info(`default @onerror`);
  }

  public close() {}

  public send(message: string) {
    this.findAndRunServerCallback(message);
  }

  public prepareServerCallback(callbacks: ServerCallback[]) {
    callbacks.forEach(callback => this.serverCallbacks.push(callback));
  }

  private findAndRunServerCallback(message: string) {
    const index = this.serverCallbacks.findIndex(
      (callback: ServerCallback) => callback.message === message
    );

    if (index > -1) {
      const callback: ServerCallback = this.serverCallbacks[index];
      this.serverCallbacks.splice(index, 1);
      callback.callback();
    }
  }
}
