export type WebSocketEventType = "open" | "close" | "error" | "message";

export class WebSocketEvent {
  constructor(private type: WebSocketEventType, private callback: Function) {}

  public getType(): WebSocketEventType {
    return this.type;
  }

  public getCallback(): Function {
    return this.callback;
  }

  public execute(message?: string): void {
    return this.callback(message);
  }
}
