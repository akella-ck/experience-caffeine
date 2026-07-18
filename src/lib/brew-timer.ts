export type BrewTimerState = {
  stepIndex: number;
  stepElapsed: number;
  totalElapsed: number;
  isRunning: boolean;
};

export type BrewTimerAction =
  | { type: "toggle-running" }
  | { type: "pause" }
  | { type: "tick"; stepDurationSeconds: number }
  | {
      type: "sync-time";
      baseStepElapsed: number;
      baseTotalElapsed: number;
      elapsedSeconds: number;
      stepDurationSeconds: number;
    }
  | { type: "go-to-step"; index: number; stepCount: number }
  | { type: "restart" };

export const initialBrewTimerState: BrewTimerState = {
  stepIndex: 0,
  stepElapsed: 0,
  totalElapsed: 0,
  isRunning: false,
};

export function clampStepIndex(index: number, stepCount: number) {
  return Math.min(Math.max(0, stepCount - 1), Math.max(0, index));
}

export function brewTimerReducer(
  state: BrewTimerState,
  action: BrewTimerAction,
): BrewTimerState {
  switch (action.type) {
    case "toggle-running":
      return { ...state, isRunning: !state.isRunning };
    case "pause":
      return { ...state, isRunning: false };
    case "tick": {
      if (!state.isRunning) return state;
      const nextElapsed = state.stepElapsed + 1;
      const reachesTarget =
        action.stepDurationSeconds > 0 && nextElapsed >= action.stepDurationSeconds;
      return {
        ...state,
        stepElapsed: reachesTarget ? action.stepDurationSeconds : nextElapsed,
        totalElapsed: state.totalElapsed + 1,
        isRunning: reachesTarget ? false : state.isRunning,
      };
    }
    case "sync-time": {
      if (!state.isRunning) return state;
      const rawStepElapsed = action.baseStepElapsed + action.elapsedSeconds;
      const reachesTarget =
        action.stepDurationSeconds > 0 && rawStepElapsed >= action.stepDurationSeconds;
      return {
        ...state,
        stepElapsed: reachesTarget ? action.stepDurationSeconds : rawStepElapsed,
        totalElapsed: action.baseTotalElapsed + action.elapsedSeconds,
        isRunning: reachesTarget ? false : state.isRunning,
      };
    }
    case "go-to-step":
      return {
        ...state,
        stepIndex: clampStepIndex(action.index, action.stepCount),
        stepElapsed: 0,
        isRunning: false,
      };
    case "restart":
      return initialBrewTimerState;
    default:
      return state;
  }
}
