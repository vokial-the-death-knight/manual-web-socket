import { ManualWebSocket } from "../ManualWebSocket/ManualWebSocket";

interface AwaitingPromise {
  url: string;
  resolveFn: Function;
}

export class WebSocketsContainer {
  private websockets: ManualWebSocket[] = [];
  private awaitingPromises: AwaitingPromise[] = [];

  public getByUrl(url: string): ManualWebSocket | undefined {
    return this.websockets.find(ws => ws.getUrl() === url);
  }

  public add(websocket: ManualWebSocket): void {
    this.websockets.push(websocket);
    this.resolve(websocket);
  }

  private resolve(websocket: ManualWebSocket) {
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

  public when(url: string): Promise<ManualWebSocket> {
    return new Promise<ManualWebSocket>((resolve, reject) => {
      const connection = this.getByUrl(url);

      if (connection) {
        resolve(connection);
      } else {
        this.wait(url, resolve);
      }
    });
  }
}

export const GlobalWebSocketsContainer = new WebSocketsContainer();
