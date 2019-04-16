import { ReadyState, IsReadyState } from "../../src/WebSocket/ReadyState";

describe("ReadyState module", () => {
  describe("IsReadyState", () => {
    test("should be true when given ready state is valid", () => {
      const readyState: ReadyState = ReadyState.OPEN;
      expect(IsReadyState(readyState)).toBeTruthy();
    });
    test("should be false when given ready state is invalid", () => {
      const readyState: ReadyState = 999;
      expect(IsReadyState(readyState)).toBeFalsy();
    });
  });
});
