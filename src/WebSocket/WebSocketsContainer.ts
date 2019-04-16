import { ManualWebSocket } from "./ManualWebSocket";

export class WebSocketsContainer {
  private websockets: ManualWebSocket[] = [];

  public getByUrl(url: string): ManualWebSocket | undefined {
    return this.websockets.find(ws => ws.getUrl() === url);
  }

  public add(websocket: ManualWebSocket): void {
    this.websockets.push(websocket);
  }
}

export const GlobalWebSocketsContainer = new WebSocketsContainer();
