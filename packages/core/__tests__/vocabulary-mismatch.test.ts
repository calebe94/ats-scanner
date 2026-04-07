import { describe, it, expect } from "vitest";
import { computeMatch, cosineSimilarity } from "../src/index.js";

describe("Cosine Similarity", () => {
  it("identical vectors return 1.0", () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1.0);
  });

  it("orthogonal vectors return 0.0", () => {
    expect(cosineSimilarity([1, 0, 0], [0, 1, 0])).toBeCloseTo(0.0);
  });

  it("opposite vectors return -1.0", () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1.0);
  });

  it("zero vector returns 0.0", () => {
    expect(cosineSimilarity([0, 0, 0], [1, 2, 3])).toBe(0);
  });

  it("throws on length mismatch", () => {
    expect(() => cosineSimilarity([1, 2], [1, 2, 3])).toThrow(
      "Vector length mismatch",
    );
  });

  it("handles high-dimensional vectors", () => {
    const a = Array.from({ length: 384 }, (_, i) => Math.sin(i));
    const b = Array.from({ length: 384 }, (_, i) => Math.sin(i));
    expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
  });

  it("similar vectors have high similarity", () => {
    const a = [1, 2, 3, 4, 5];
    const b = [1.1, 2.1, 3.1, 4.1, 5.1];
    expect(cosineSimilarity(a, b)).toBeGreaterThan(0.99);
  });
});

describe("Vocabulary Mismatch (Lexical Baseline)", () => {
  const SYNONYM_PAIRS: [string, string, boolean][] = [
    ["postgres", "postgresql", true],
    ["k8s", "kubernetes", true],
    ["js", "javascript", true],

    ["cloud infrastructure", "aws azure gcp", false],
    ["frontend frameworks", "react angular vue", false],
    ["containerization", "docker kubernetes", false],
    ["version control", "git github", false],
    ["relational databases", "postgresql mysql", false],
    ["ci pipelines", "github actions jenkins", false],
    ["server-side development", "node.js express flask", false],
  ];

  for (const [resumeTerm, jdTerm, resolvable] of SYNONYM_PAIRS) {
    it(`${resolvable ? "resolves" : "CANNOT resolve"}: "${resumeTerm}" \u2194 "${jdTerm}"`, () => {
      const result = computeMatch(
        `Experience with ${resumeTerm}`,
        `Requires ${jdTerm}`,
      );
      if (resolvable) {
        expect(result.matched_count).toBeGreaterThan(0);
      } else {
        expect(result.matched_count).toBe(0);
      }
    });
  }
});
