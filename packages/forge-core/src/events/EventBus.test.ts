import { describe, it, expect, vi } from "vitest";
import { InMemoryEventBus } from "./EventBus";

interface Events {
  "user:login": { id: string };
  "cache:clear": void;
}

describe("InMemoryEventBus", () => {
  it("delivers emitted payloads to subscribers", () => {
    const bus = new InMemoryEventBus<Events>();
    const handler = vi.fn();
    bus.on("user:login", handler);

    bus.emit("user:login", { id: "u1" });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ id: "u1" });
  });

  it("unsubscribe function stops further delivery", () => {
    const bus = new InMemoryEventBus<Events>();
    const handler = vi.fn();
    const off = bus.on("user:login", handler);

    off();
    bus.emit("user:login", { id: "u1" });

    expect(handler).not.toHaveBeenCalled();
  });

  it("off removes a specific handler", () => {
    const bus = new InMemoryEventBus<Events>();
    const a = vi.fn();
    const b = vi.fn();
    bus.on("user:login", a);
    bus.on("user:login", b);

    bus.off("user:login", a);
    bus.emit("user:login", { id: "u1" });

    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledOnce();
  });

  it("once fires at most one time", () => {
    const bus = new InMemoryEventBus<Events>();
    const handler = vi.fn();
    bus.once("user:login", handler);

    bus.emit("user:login", { id: "u1" });
    bus.emit("user:login", { id: "u2" });

    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not throw when emitting an event with no subscribers", () => {
    const bus = new InMemoryEventBus<Events>();
    expect(() => bus.emit("cache:clear", undefined)).not.toThrow();
  });
});
