import { ManualServer } from "../../src/ManualWebSocket/ManualServer";

describe("ManualServer module", () => {
  test("Should call callback when message matches", () => {
    const server = new ManualServer();
    const callback = jest.fn();

    const message = "abc";

    server.addCallback({ message, callback });

    server.findAndRunServerCallback("abc");

    expect(callback.mock.calls.length).toBe(1);
  });

  test("Should not call callback when message does not match", () => {
    const server = new ManualServer();
    const callback = jest.fn();

    const message = "abc";

    server.addCallback({ message, callback });

    server.findAndRunServerCallback("abcd");

    expect(callback.mock.calls.length).toBe(0);
  });
});
