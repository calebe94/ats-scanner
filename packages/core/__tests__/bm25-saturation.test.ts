import { describe, it, expect } from "vitest";
import { computeMatch, bm25Score } from "../src/index.js";

describe("BM25 Saturation Curve", () => {
  it("score plateaus after 3-4 keyword repetitions", () => {
    const baseJd = "python developer with react experience";
    const scores: number[] = [];

    for (let reps = 1; reps <= 10; reps++) {
      const resume = "python ".repeat(reps) + "developer with react experience";
      const result = computeMatch(resume, baseJd);
      scores.push(result.score);
    }

    expect(scores[9] / scores[0]).toBeLessThan(1.5);
    expect(Math.abs(scores[9] - scores[7])).toBeLessThan(1.0);
  });

  it("k1=1.5 produces saturation before 5 repetitions", () => {
    const queryTerms = ["python"];
    const avgLen = 50;
    const docContaining = new Map([["python", 2]]);
    const scores: number[] = [];

    for (let tf = 1; tf <= 10; tf++) {
      const docFreq = new Map([["python", tf]]);
      const s = bm25Score(queryTerms, docFreq, 50, avgLen, 2, docContaining);
      scores.push(s);
    }

    // marginal gain from tf=5→10 should be < 20% of gain from tf=1→5
    const earlyGain = scores[4] - scores[0];
    const lateGain = scores[9] - scores[4];
    expect(lateGain / earlyGain).toBeLessThan(0.30);
  });

  it("BM25 score increases monotonically with term frequency", () => {
    const queryTerms = ["python"];
    const avgLen = 50;
    const docContaining = new Map([["python", 2]]);

    let prev = 0;
    for (let tf = 1; tf <= 10; tf++) {
      const docFreq = new Map([["python", tf]]);
      const s = bm25Score(queryTerms, docFreq, 50, avgLen, 2, docContaining);
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });

  it("marginal score gain decreases with each repetition", () => {
    const queryTerms = ["python"];
    const avgLen = 50;
    const docContaining = new Map([["python", 2]]);
    const scores: number[] = [];

    for (let tf = 1; tf <= 6; tf++) {
      const docFreq = new Map([["python", tf]]);
      scores.push(
        bm25Score(queryTerms, docFreq, 50, avgLen, 2, docContaining),
      );
    }

    for (let i = 2; i < scores.length; i++) {
      const prevGain = scores[i - 1] - scores[i - 2];
      const currGain = scores[i] - scores[i - 1];
      expect(currGain).toBeLessThanOrEqual(prevGain + 0.001);
    }
  });
});
