import { describe, expect, it } from "vitest";
import {
  brewTimerReducer,
  clampStepIndex,
  initialBrewTimerState,
} from "./brew-timer";

describe("brew timer", () => {
  it("does not advance elapsed time while paused", () => {
    const next = brewTimerReducer(initialBrewTimerState, {
      type: "tick",
      stepDurationSeconds: 45,
    });

    expect(next).toEqual(initialBrewTimerState);
  });

  it("ticks while running and pauses at the step target", () => {
    const state = {
      stepIndex: 3,
      stepElapsed: 44,
      totalElapsed: 89,
      isRunning: true,
    };
    const next = brewTimerReducer(state, {
      type: "tick",
      stepDurationSeconds: 45,
    });

    expect(next).toEqual({
      stepIndex: 3,
      stepElapsed: 45,
      totalElapsed: 90,
      isRunning: false,
    });
  });

  it("clamps navigation to the available step range", () => {
    expect(clampStepIndex(-2, 8)).toBe(0);
    expect(clampStepIndex(99, 8)).toBe(7);
    expect(clampStepIndex(3, 8)).toBe(3);
  });

  it("synchronizes elapsed time from a wall-clock delta", () => {
    const next = brewTimerReducer(
      { stepIndex: 2, stepElapsed: 4, totalElapsed: 20, isRunning: true },
      {
        type: "sync-time",
        baseStepElapsed: 4,
        baseTotalElapsed: 20,
        elapsedSeconds: 9,
        stepDurationSeconds: 45,
      },
    );

    expect(next.stepElapsed).toBe(13);
    expect(next.totalElapsed).toBe(29);
  });

  it("resets every timer field", () => {
    const reset = brewTimerReducer(
      { stepIndex: 5, stepElapsed: 21, totalElapsed: 174, isRunning: true },
      { type: "restart" },
    );

    expect(reset).toEqual(initialBrewTimerState);
  });
});
