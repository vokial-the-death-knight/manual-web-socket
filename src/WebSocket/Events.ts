export type EventType = "open" | "close" | "error" | "message";

export class Event {
  constructor(private type: EventType, private callback: Function) {}

  public getType(): EventType {
    return this.type;
  }

  public getCallback(): Function {
    return this.callback;
  }

  public execute(message?: string): void {
    return this.callback(message);
  }
}
