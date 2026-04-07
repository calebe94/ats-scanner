import { describe, it, expect } from "vitest";
import { estimateResumeYoe } from "../src/index.js";

describe("YoE Temporal Accuracy", () => {
  const CURRENT_YEAR = 2026;

  const DATE_FORMATS: [string, number, string][] = [
    ["Jan 2020 - Present", 6, "Month YYYY - Present"],
    ["January 2020 - December 2022", 2, "Full month YYYY - Full month YYYY"],
    ["2019 - 2023", 4, "YYYY - YYYY"],
    ["2020 - present", 6, "YYYY - present (lowercase)"],
    ["2020 - Current", 6, "YYYY - Current"],
    ["Mar 2018 - Jun 2021", 3, "Abbreviated month"],
    ["Jan 2020 \u2013 Dec 2022", 2, "En-dash separator"],
    ["Jan 2020 \u2014 Dec 2022", 2, "Em-dash separator"],
    ["Jan 2020 to Dec 2022", 2, "'to' separator"],
    ["2021 - 2021", 0, "Same year (short tenure)"],
    ["Sep 2015 - Present", 11, "Long tenure (11 years)"],
  ];

  for (const [input, expectedYears, desc] of DATE_FORMATS) {
    it(`parses "${desc}" correctly`, () => {
      const resume = `Software Engineer\n${input}\nBuilt stuff`;
      const yoe = estimateResumeYoe(resume, CURRENT_YEAR);
      expect(yoe.has_dates).toBe(true);
      expect(Math.abs(yoe.total_years - expectedYears)).toBeLessThanOrEqual(1);
    });
  }

  it("merges overlapping date ranges correctly", () => {
    const resume = [
      "Role A: Jan 2018 - Dec 2021",
      "Role B: Jun 2020 - Dec 2023",
      "Role C: Jan 2024 - Present",
    ].join("\n");
    const yoe = estimateResumeYoe(resume, CURRENT_YEAR);
    expect(yoe.total_years).toBeGreaterThanOrEqual(7);
    expect(yoe.total_years).toBeLessThanOrEqual(9);
  });

  it("does not double-count concurrent roles", () => {
    const resume = [
      "Full-time: 2020 - 2024",
      "Freelance: 2020 - 2024",
    ].join("\n");
    const yoe = estimateResumeYoe(resume, CURRENT_YEAR);
    expect(yoe.total_years).toBeLessThanOrEqual(5);
  });

  it("returns zero for text with no dates", () => {
    const resume = "Experienced developer with many years of coding";
    const yoe = estimateResumeYoe(resume, CURRENT_YEAR);
    expect(yoe.has_dates).toBe(false);
    expect(yoe.total_years).toBe(0);
  });

  it("handles multiple non-overlapping ranges", () => {
    const resume = [
      "Role A: Jan 2015 - Dec 2017",
      "Role B: Jan 2019 - Dec 2021",
      "Role C: Jan 2023 - Present",
    ].join("\n");
    const yoe = estimateResumeYoe(resume, CURRENT_YEAR);
    expect(yoe.total_years).toBeGreaterThanOrEqual(8);
    expect(yoe.total_years).toBeLessThanOrEqual(10);
  });
});
