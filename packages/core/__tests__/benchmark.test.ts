import { describe, it, expect } from "vitest";
import {
  computeMatch,
  extractKeywords,
  normalizeText,
  estimateResumeYoe,
  SKILL_TAXONOMY,
} from "../src/index.js";
import { GROUND_TRUTH } from "./fixtures/ground-truth.js";
import {
  calculateConfusionMatrix,
  precision,
  recall,
  f1Score,
} from "./metrics.js";

function buildUniverse(jdText: string): Set<string> {
  const normalized = normalizeText(jdText.toLowerCase());
  const jdKws = extractKeywords(normalized);
  return new Set(Object.values(jdKws).flat());
}

describe("Baseline Benchmark", () => {
  it("achieves F1-Score >= 0.85 for keyword extraction", () => {
    let totalTp = 0;
    let totalFp = 0;
    let totalFn = 0;

    for (const sample of GROUND_TRUTH) {
      const result = computeMatch(sample.resume, sample.jd);
      const predicted = new Set(
        Object.values(result.matched_by_category).flat(),
      );
      const actual = new Set(sample.expected.truePositives);
      const universe = buildUniverse(sample.jd);

      const cm = calculateConfusionMatrix(predicted, actual, universe);
      totalTp += cm.tp;
      totalFp += cm.fp;
      totalFn += cm.fn;
    }

    const aggregated = { tp: totalTp, fp: totalFp, fn: totalFn, tn: 0 };
    const f1 = f1Score(aggregated);
    expect(f1).toBeGreaterThanOrEqual(0.85);
  });

  it("achieves score MAE < 10 against ground truth ranges", () => {
    let totalError = 0;

    for (const sample of GROUND_TRUTH) {
      const result = computeMatch(sample.resume, sample.jd);
      const [min, max] = sample.expected.scoreRange;
      const midpoint = (min + max) / 2;
      totalError += Math.abs(result.score - midpoint);
    }

    const mae = totalError / GROUND_TRUTH.length;
    expect(mae).toBeLessThan(10);
  });

  it("achieves Recall >= 0.95 for synonym samples (7–9)", () => {
    const synonymSamples = GROUND_TRUTH.filter((s) =>
      s.id.startsWith("synonym-"),
    );

    for (const sample of synonymSamples) {
      const result = computeMatch(sample.resume, sample.jd);
      const predicted = new Set(
        Object.values(result.matched_by_category).flat(),
      );
      const actual = new Set(sample.expected.truePositives);
      const universe = buildUniverse(sample.jd);

      const cm = calculateConfusionMatrix(predicted, actual, universe);
      const r = recall(cm);
      expect(r).toBeGreaterThanOrEqual(0.95);
    }
  });

  it("produces higher scores for Skills-section placement", () => {
    const skillsSample = GROUND_TRUTH.find(
      (s) => s.id === "section-skills-placement",
    )!;
    const noHeaderSample = GROUND_TRUTH.find(
      (s) => s.id === "section-no-headers",
    )!;

    const skillsResult = computeMatch(skillsSample.resume, skillsSample.jd);
    const noHeaderResult = computeMatch(
      noHeaderSample.resume,
      noHeaderSample.jd,
    );

    expect(skillsResult.score).toBeGreaterThanOrEqual(noHeaderResult.score);
  });

  it("scores identical text at >= 95%", () => {
    const sample = GROUND_TRUTH.find(
      (s) => s.id === "identical-text-ceiling",
    )!;
    const result = computeMatch(sample.resume, sample.jd);
    expect(result.score).toBeGreaterThanOrEqual(95);
  });

  it("all 20 ground truth samples fall within expected score ranges", () => {
    for (const sample of GROUND_TRUTH) {
      const result = computeMatch(sample.resume, sample.jd);
      const [min, max] = sample.expected.scoreRange;
      expect(result.score).toBeGreaterThanOrEqual(min);
      expect(result.score).toBeLessThanOrEqual(max);
    }
  });

  it("correctly extracts YoE for annotated samples", () => {
    const yoeSamples = GROUND_TRUTH.filter((s) => s.expected.yoe);

    for (const sample of yoeSamples) {
      const result = computeMatch(sample.resume, sample.jd);
      expect(result.resume_yoe.has_dates).toBe(true);
      const { totalYears, tolerance } = sample.expected.yoe!;
      expect(
        Math.abs(result.resume_yoe.total_years - totalYears),
      ).toBeLessThanOrEqual(tolerance);
    }
  });

  it("per-sample precision never drops below 0.70", () => {
    for (const sample of GROUND_TRUTH) {
      const result = computeMatch(sample.resume, sample.jd);
      const predicted = new Set(
        Object.values(result.matched_by_category).flat(),
      );
      const actual = new Set(sample.expected.truePositives);
      const universe = buildUniverse(sample.jd);

      const cm = calculateConfusionMatrix(predicted, actual, universe);
      if (actual.size > 0) {
        expect(precision(cm)).toBeGreaterThanOrEqual(0.7);
      }
    }
  });
});
