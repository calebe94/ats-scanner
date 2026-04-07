import { describe, it, expect } from "vitest";
import { computeMatch, estimateResumeYoe } from "../src/index.js";

describe("Character Encoding Resilience", () => {
  it("preserves keywords near unicode bullets", () => {
    const text = "\u25CF Python\n\u25B8 React\n\u25C6 Docker\n\u2605 AWS";
    const result = computeMatch(text, "requires python react docker aws");
    expect(result.matched_count).toBeGreaterThanOrEqual(4);
  });

  it("handles smart quotes without breaking extraction", () => {
    const text = "Proficient in \u201CJavaScript\u201D and \u2018TypeScript\u2019";
    const result = computeMatch(text, "javascript typescript");
    expect(result.matched_count).toBeGreaterThanOrEqual(2);
  });

  it("handles em-dashes in date ranges", () => {
    const text = "Software Engineer \u2014 Jan 2020 \u2014 Present";
    const yoe = estimateResumeYoe(text, 2026);
    expect(yoe.has_dates).toBe(true);
    expect(yoe.total_years).toBeGreaterThanOrEqual(5);
  });

  it("handles non-breaking spaces", () => {
    const text = "python\u00A0developer\u00A0with\u00A0react";
    const result = computeMatch(text, "python react developer");
    expect(result.matched_count).toBeGreaterThanOrEqual(2);
  });

  it("handles emoji bullets", () => {
    const text = "\uD83D\uDD27 Git\n\uD83D\uDCBB JavaScript";
    const result = computeMatch(text, "git javascript");
    expect(result.matched_count).toBeGreaterThanOrEqual(2);
  });

  it("handles en-dash in date ranges", () => {
    const text = "Developer\nJan 2020 \u2013 Dec 2023";
    const yoe = estimateResumeYoe(text, 2026);
    expect(yoe.has_dates).toBe(true);
    expect(yoe.total_years).toBeGreaterThanOrEqual(3);
  });
});
