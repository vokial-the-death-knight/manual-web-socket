import { ManualWebSocketConnection } from "../ManualWebSocket/ManualWebSocketConnection";

interface AwaitingPromise {
  url: string;
  resolveFn: Function;
}

export class WebSocketsContainer {
  private websockets: ManualWebSocketConnection[] = [];
  private awaitingPromises: AwaitingPromise[] = [];

  public getByUrl(url: string): ManualWebSocketConnection | undefined {
    return this.websockets.find(ws => ws.getUrl() === url);
  }

  public getAll(): ManualWebSocketConnection[] {
    return this.websockets;
  }

  public add(websocket: ManualWebSocketConnection): void {
    this.websockets.push(websocket);
    this.resolve(websocket);
  }

  private resolve(websocket: ManualWebSocketConnection) {
    this.awaitingPromises
      .filter(promise => promise.url === websocket.getUrl())
      .forEach(promise => promise.resolveFn(websocket));

    this.awaitingPromises = this.awaitingPromises.filter(
      promise => promise.url !== websocket.getUrl()
    );
  }

  private wait(url: string, resolveFn: Function) {
    this.awaitingPromises.push({ url, resolveFn });
  }

  public when(url: string): Promise<ManualWebSocketConnection> {
    return new Promise<ManualWebSocketConnection>((resolve, reject) => {
      const connection = this.getByUrl(url);

      if (connection) {
        resolve(connection);
      } else {
        this.wait(url, resolve);
      }
    });
  }
}

export const TrackedConnectionsContainer = new WebSocketsContainer();
