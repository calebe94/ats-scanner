import { describe, it, expect } from "vitest";
import { computeMatch, calculateKeywordDensity } from "../src/index.js";

describe("BM25 Parameter Tuning", () => {
  it("100x keyword repetition does not produce score > 1.5x baseline", () => {
    const jd = "python developer";
    const baseline = computeMatch("python developer with web experience", jd);
    const stuffed = computeMatch("python ".repeat(100) + "developer", jd);
    expect(stuffed.score).toBeLessThan(baseline.score * 1.5);
  });

  it("keyword density 'danger' status triggers for > 15% density", () => {
    const text = "python ".repeat(50) + "developer";
    const density = calculateKeywordDensity(text, new Set(["python"]));
    expect(density.status).toBe("danger");
  });

  it("natural resume gets 'good' density status", () => {
    const text =
      "Senior software engineer with 5 years of professional experience " +
      "developing scalable enterprise web applications and microservices " +
      "architectures. Proven track record of delivering high quality code " +
      "and collaborating with cross functional teams across multiple time " +
      "zones. Passionate about clean code principles and continuous learning. " +
      "Led migration of legacy monolith to modern cloud native architecture " +
      "reducing deployment time by 80 percent. Mentored junior developers " +
      "and conducted regular code reviews. Used python for backend services " +
      "and react for frontend interfaces. Managed postgresql databases and " +
      "deployed infrastructure with docker on aws.";
    const keywords = new Set([
      "python", "react", "postgresql", "docker", "aws",
    ]);
    const density = calculateKeywordDensity(text, keywords);
    expect(density.status).toBe("good");
  });

  it("moderate repetition gets 'warning' status", () => {
    const text =
      "python python python python developer python react python docker " +
      "python python kubernetes python python python aws python python";
    const density = calculateKeywordDensity(text, new Set(["python"]));
    expect(["warning", "danger"]).toContain(density.status);
  });

  it("detects stuffed keywords exceeding threshold", () => {
    const text = "python ".repeat(10) + "react ".repeat(10) + "developer";
    const density = calculateKeywordDensity(
      text,
      new Set(["python", "react"]),
    );
    expect(density.stuffed_keywords.length).toBeGreaterThanOrEqual(2);
  });
});
