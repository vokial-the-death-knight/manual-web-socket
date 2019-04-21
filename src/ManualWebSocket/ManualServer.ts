export interface ManualServerCallback {
  message: string;
  callback: Function;
}

export class ManualServer {
  private callbacks: ManualServerCallback[] = [];

  public findAndRunServerCallback(message: string): void {
    const index = this.callbacks.findIndex(
      (callback: ManualServerCallback) => callback.message === message
    );

    if (index > -1) {
      const callback: ManualServerCallback = this.callbacks[index];
      this.callbacks.splice(index, 1);
      callback.callback();
    }
  }

  public addCallback(callback: ManualServerCallback): void {
    this.callbacks.push(callback);
  }
}
