import { WebSocketEvent } from "../../src/WebSocket/WebSocketEvent";

describe("WebSocketEvent module", () => {
  test("Can be created with WebSocketEventType and callback function", () => {
    const wse = new WebSocketEvent("open", () => {});
    expect(wse).toBeInstanceOf(WebSocketEvent);
  });

  test("Returns valid type when getType is called", () => {
    const expectedType = "open";
    const wse = new WebSocketEvent(expectedType, () => {});

    const actualType = wse.getType();
    expect(actualType).toBe(expectedType);
  });

  test("Executes callback without parameter when not provided", () => {
    const callbackMock = jest.fn();
    const wse = new WebSocketEvent("open", callbackMock);

    wse.execute();

    expect(callbackMock.mock.calls.length).toBe(1);
    expect(callbackMock.mock.calls[0][0]).toBe(undefined);
  });

  test("Executes callback with message when provided", () => {
    const message = "some message";
    const callbackMock = jest.fn();
    const wse = new WebSocketEvent("open", callbackMock);

    wse.execute(message);

    expect(callbackMock.mock.calls.length).toBe(1);
    expect(callbackMock.mock.calls[0][0]).toBe(message);
  });
});
