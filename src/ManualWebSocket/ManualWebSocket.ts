import { ReadyState, IsReadyState } from "../WebSocket/ReadyState";
import { GlobalTrackedAddresses } from "./TrackedAddresses";
import { PrivateReadyState } from "./PrivateReadyState";
import { WebSocket } from "../WebSocket/WebSocket";
import { Event, EventType } from "../WebSocket/Events";
import { ManualServer } from "./ManualServer";
import { TrackedConnectionsContainer } from "../Container/Container";
import { MessageBus } from "../Communication/MessageBus";
import { MANUAL_WEBSOCKET_CREATED } from "../Communication/Tokens";

export class ManualWebSocket {
  private events: Event[] = [];
  private server: ManualServer = new ManualServer();

  constructor(private url: string) {
    if (GlobalTrackedAddresses.isTracked(url)) {
      this.readyState = ReadyState.CONNECTING;

      TrackedConnectionsContainer.add(this);
      MessageBus.emit(MANUAL_WEBSOCKET_CREATED, this);
    } else {
      return WebSocket.CreateUsingNativeImplementation(url);
    }
  }

  get readyState(): ReadyState {
    return PrivateReadyState.get(this).readyState;
  }

  set readyState(readyState: ReadyState) {
    if (!IsReadyState(readyState)) {
      throw new Error(`Given ${readyState} is not a valid ReadyState`);
    }

    PrivateReadyState.set(this, { readyState: readyState });

    switch (readyState) {
      case ReadyState.OPEN: {
        this.onopen();
        this.events
          .filter((event: Event) => event.getType() === "open")
          .forEach((event: Event) => event.execute());
        break;
      }

      case ReadyState.CLOSED: {
        this.onclose();
        this.events
          .filter((event: Event) => event.getType() === "close")
          .forEach((event: Event) => event.execute());
      }
    }
  }

  public getUrl(): string {
    return this.url;
  }

  public addEventListener(type: EventType, callback: Function): void {
    this.events.push(new Event(type, callback));
  }

  public removeEventListener(type: EventType, callback: Function): void {
    const index = this.events.findIndex(
      e => e.getType() === type && e.getCallback() === callback
    );

    if (index > -1) {
      this.events.splice(index, 1);
    }
  }

  public isOpened() {
    if (PrivateReadyState.get(this).readyState !== ReadyState.OPEN) {
      throw new Error(
        `Message can be sent only when ready state is *OPEN*, 
        current state is *${PrivateReadyState.get(this).readyState}*`
      );
    }
  }

  public reciveMessage(message: string) {
    this.isOpened();

    this.onmessage(message);
    this.events
      .filter((event: Event) => event.getType() === "message")
      .forEach((event: Event) => event.execute(message));
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
    this.isOpened();
    this.server.findAndRunServerCallback(message);
  }

  public addServerScenario(clientMessage: string, callback: Function): void {
    this.server.addCallback({
      message: clientMessage,
      callback
    });
  }
}
