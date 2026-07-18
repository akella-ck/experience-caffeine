"use client";

import { Pause, Play, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";

const previewSteps = [
  {
    title: "Pour to 150 g",
    instruction: "Use a slow spiral, keeping the coffee bed evenly saturated.",
    target: 150,
    pourWindow: 20,
    startsAt: 82,
  },
  {
    title: "Pour to 250 g",
    instruction: "Let the water level fall slightly, then finish with one controlled spiral.",
    target: 250,
    pourWindow: 25,
    startsAt: 105,
  },
  {
    title: "Watch the drawdown",
    instruction: "Keep the brewer still and observe when the coffee bed becomes visible.",
    target: 250,
    pourWindow: 55,
    startsAt: 130,
  },
] as const;

const targetSeconds = 185;

type PreviewState = {
  paused: boolean;
  activeStep: number;
  elapsed: number;
};

const initialPreviewState: PreviewState = {
  paused: false,
  activeStep: 0,
  elapsed: previewSteps[0].startsAt,
};

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function GuidedSessionPreview() {
  const [{ paused, activeStep, elapsed }, setPreviewState] = useState(initialPreviewState);
  const step = previewSteps[activeStep];
  const isLastStep = activeStep === previewSteps.length - 1;
  const isComplete = elapsed >= targetSeconds;
  const progress = Math.min(100, Math.round((elapsed / targetSeconds) * 100));

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setPreviewState((current) => {
        if (current.elapsed >= targetSeconds) return { ...current, paused: true };
        const nextElapsed = Math.min(targetSeconds, current.elapsed + 1);
        const nextStepStart = previewSteps[current.activeStep + 1]?.startsAt;
        const nextActiveStep = nextStepStart && nextElapsed >= nextStepStart
          ? Math.min(previewSteps.length - 1, current.activeStep + 1)
          : current.activeStep;
        return {
          paused: nextElapsed >= targetSeconds,
          activeStep: nextActiveStep,
          elapsed: nextElapsed,
        };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused]);

  function advancePreview() {
    if (isComplete) {
      setPreviewState(initialPreviewState);
      return;
    }
    if (isLastStep) {
      setPreviewState({ paused: true, activeStep, elapsed: targetSeconds });
      return;
    }
    const nextStep = Math.min(previewSteps.length - 1, activeStep + 1);
    setPreviewState({ paused: false, activeStep: nextStep, elapsed: previewSteps[nextStep].startsAt });
  }

  function togglePreview() {
    if (isComplete) {
      setPreviewState(initialPreviewState);
      return;
    }
    setPreviewState((current) => ({ ...current, paused: !current.paused }));
  }

  return (
    <div className="relative mx-auto max-w-[24rem] rounded-[2.4rem] border border-white/[0.12] bg-[#100b08] p-3 shadow-[0_35px_100px_rgba(0,0,0,.5)]">
      <div className="overflow-hidden rounded-[1.8rem] border border-white/[0.07] bg-[radial-gradient(circle_at_50%_15%,rgba(185,105,50,.18),transparent_42%),#0b0806] p-5 sm:p-7">
        <div className="flex items-center justify-between font-mono text-[0.54rem] uppercase tracking-[0.15em] text-[#7d7164]">
          <span>V60 · Step {String(activeStep + 4).padStart(2, "0")}</span>
          <span className="flex items-center gap-1.5 text-[#a9bd96]"><span className="size-1.5 rounded-full bg-[#95aa82]" /> {isComplete ? "Complete" : paused ? "Paused" : "Live"}</span>
        </div>

        <div
          aria-label={`${progress}% of preview brew complete`}
          className="relative mx-auto mt-8 grid aspect-square w-[78%] place-items-center rounded-full p-[2px]"
          style={{ background: `conic-gradient(#df9f55 0 ${progress}%, rgba(255,255,255,.07) ${progress}%)` }}
        >
          <div className="grid size-full place-items-center rounded-full bg-[#0e0a07] text-center">
            <div>
              <span className="block font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#897b6b]">Elapsed</span>
              <strong className="mt-2 block text-5xl font-light tabular-nums tracking-[-0.06em] text-[#f3e8d6]">{formatTime(elapsed)}</strong>
              <span className="mt-2 block text-xs text-[#9e907e]">of 03:05 target</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="font-mono text-[0.56rem] uppercase tracking-[0.15em] text-[#9a7149]">Current step</span>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.03em]">{step.title}</h3>
          <p className="mx-auto mt-2 max-w-[16rem] text-xs leading-5 text-[#a39787]">{step.instruction}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-center">
            <span className="block text-[0.58rem] text-[#998b7c]">Target water</span>
            <strong className="mt-1 block text-lg font-medium text-[#e9b875]">{step.target} g</strong>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-center">
            <span className="block text-[0.58rem] text-[#998b7c]">Pour window</span>
            <strong className="mt-1 block text-lg font-medium text-[#e7dcc9]">{step.pourWindow} sec</strong>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button type="button" className="button-secondary flex-1 !min-h-12" onClick={togglePreview} aria-label={isComplete ? "Replay timer preview" : paused ? "Continue timer preview" : "Pause timer preview"}>
            {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />} {isComplete ? "Replay" : paused ? "Continue" : "Pause"}
          </button>
          <button type="button" className="button-primary flex-1 !min-h-12" aria-label={isComplete ? "Restart timer preview" : isLastStep ? "Finish timer preview" : "Advance timer preview"} onClick={advancePreview}>
            {isComplete ? "Restart" : isLastStep ? "Finish" : "Next"} <SkipForward size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
