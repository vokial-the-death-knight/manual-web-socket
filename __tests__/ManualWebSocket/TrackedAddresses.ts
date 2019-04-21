import { TrackedAddresses } from "../../src/ManualWebSocket/TrackedAddresses";

describe("TrackedAddresses module", () => {
  test("Should track address when added", () => {
    const t = new TrackedAddresses();

    t.add("abc");

    expect(t.isTracked("abc")).toBeTruthy();

    t.add(/efgh/);

    expect(t.isTracked("xxxxefghxxxxx")).toBeTruthy();

    t.add(/ooo$/);

    expect(t.isTracked("iiiooo")).toBeTruthy();
  });

  test("Should not find when address does not match", () => {
    const t = new TrackedAddresses();

    t.add("abc");

    expect(t.isTracked("efg")).toBeFalsy();

    t.add(/ooo$/);

    expect(t.isTracked("ooox")).toBeFalsy();
  });
});
