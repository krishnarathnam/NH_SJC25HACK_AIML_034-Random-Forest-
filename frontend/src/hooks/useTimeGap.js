// src/hooks/useTimeGap.js
import { useRef } from "react";

export function useTimeGap() {
  const askTsRef = useRef(null);
  const markQuestionShown = () => { askTsRef.current = Date.now(); };
  const computeGapSeconds = () =>
    askTsRef.current ? (Date.now() - askTsRef.current) / 1000 : 0;
  return { markQuestionShown, computeGapSeconds };
}
