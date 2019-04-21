export class WebSocket {
  public static NativeImplementation: any = null;

  public static CreateUsingNativeImplementation(url: string) {
    return new WebSocket.NativeImplementation(url);
  }
}
