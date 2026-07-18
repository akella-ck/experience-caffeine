"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

type AccessibleDialogOptions = {
  open: boolean;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
};

type InertRecord = {
  element: HTMLElement;
  wasInert: boolean;
};

function inertBackground(dialog: HTMLElement) {
  const records: InertRecord[] = [];
  let current: HTMLElement | null = dialog;

  while (current?.parentElement) {
    const parent: HTMLElement = current.parentElement;
    for (const sibling of Array.from(parent.children)) {
      if (sibling === current || !(sibling instanceof HTMLElement)) continue;
      const wasInert = sibling.hasAttribute("inert");
      records.push({ element: sibling, wasInert });
      if (!wasInert) sibling.setAttribute("inert", "");
    }
    current = parent;
    if (parent === document.body) break;
  }

  return () => {
    for (const { element, wasInert } of records) {
      if (!wasInert) element.removeAttribute("inert");
    }
  };
}

export function useAccessibleDialog({ open, onClose, initialFocusRef }: AccessibleDialogOptions) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const initialFocusTargetRef = useRef(initialFocusRef);

  useEffect(() => {
    onCloseRef.current = onClose;
    initialFocusTargetRef.current = initialFocusRef;
  }, [initialFocusRef, onClose]);

  const captureDialogTrigger = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const currentDialog = dialogRef.current;
    if (!currentDialog) return;
    const dialog: HTMLDivElement = currentDialog;

    const previousOverflow = document.body.style.overflow;
    const restoreBackground = inertBackground(dialog);
    document.body.style.overflow = "hidden";

    const focusInitialTarget = () => {
      const requestedTarget = initialFocusTargetRef.current?.current;
      const fallbackTarget = dialog.querySelector<HTMLElement>(focusableSelector);
      (requestedTarget ?? fallbackTarget ?? dialog).focus();
    };
    const frame = window.requestAnimationFrame(focusInitialTarget);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute("disabled") && element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreBackground();
      const returnTarget = returnFocusRef.current;
      if (returnTarget?.isConnected) returnTarget.focus();
      returnFocusRef.current = null;
    };
  }, [open]);

  return { captureDialogTrigger, dialogRef };
}
