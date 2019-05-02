import { WebSocketsContainer } from "../../src/Container/Container";
const {
  ManualWebSocketConnection
} = require("../../src/ManualWebSocket/ManualWebSocketConnection");
jest.mock("../../src/ManualWebSocket/ManualWebSocketConnection");

describe("WebSocketsContainer module", () => {
  describe("getConnectionByUrl", () => {
    test("Should return undefined when connection is not found", () => {
      const wsc = new WebSocketsContainer();
      expect(wsc.getByUrl("ws://c")).toBeUndefined();
    });

    test("Should return connection when found", () => {
      const url = "ws://d";

      ManualWebSocketConnection.mockImplementation(() => {
        return {
          getUrl: () => {
            return url;
          }
        };
      });

      const wsc = new WebSocketsContainer();

      const c = new ManualWebSocketConnection(url);
      wsc.add(c);

      expect(wsc.getByUrl(url)).toBe(c);
    });
  });
  describe("Promises", () => {
    it("Should resolve when connection is registered", () => {
      const url = "wss://127.0.0.1";

      ManualWebSocketConnection.mockImplementation(() => {
        return {
          getUrl: () => {
            return url;
          }
        };
      });

      const connection = new ManualWebSocketConnection(url);

      const wsc = new WebSocketsContainer();
      wsc.when(url).then(conn => {
        expect(conn).toBe(connection);
      });

      wsc.add(connection);
    });
  });
});
