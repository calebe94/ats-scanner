import { describe, it, expect } from "vitest";
import { stripLatex } from "../src/index.js";

describe("LaTeX Extraction Robustness", () => {
  it("strips \\textbf{} and preserves content", () => {
    const input = "\\textbf{Python} and \\textit{React}";
    const result = stripLatex(input);
    expect(result).toContain("Python");
    expect(result).toContain("React");
  });

  it("strips custom resume macros (content lost — known limitation)", () => {
    const input =
      "\\resumeSubheading{Software Engineer}{2020 - Present}{Google}{NYC}";
    const result = stripLatex(input);
    expect(result).not.toContain("\\resumeSubheading");
    expect(result).not.toContain("{");
  });

  it("removes math environments without corrupting surrounding text", () => {
    const input = "Optimized $O(n \\log n)$ algorithm for Python sorting";
    const result = stripLatex(input);
    expect(result).toContain("Python");
    expect(result).not.toContain("\\log");
  });

  it("handles \\href{} by preserving link text", () => {
    const input = "\\href{https://github.com}{GitHub} profile";
    const result = stripLatex(input);
    expect(result).toContain("GitHub");
    expect(result).not.toContain("https");
  });

  it("strips display math ($$...$$)", () => {
    const input = "Used $$E = mc^2$$ in Python calculations";
    const result = stripLatex(input);
    expect(result).toContain("Python");
    expect(result).not.toContain("mc^2");
  });

  it("handles \\texttt{} formatting", () => {
    const input = "Proficient in \\texttt{Docker} and \\texttt{Kubernetes}";
    const result = stripLatex(input);
    expect(result).toContain("Docker");
    expect(result).toContain("Kubernetes");
  });

  it("strips \\item and preserves list content", () => {
    const input = "\\begin{itemize}\n\\item Python\n\\item React\n\\end{itemize}";
    const result = stripLatex(input);
    expect(result).toContain("Python");
    expect(result).toContain("React");
  });

  it("strips LaTeX comments", () => {
    const input = "Python developer % this is a comment\nReact engineer";
    const result = stripLatex(input);
    expect(result).toContain("Python");
    expect(result).toContain("React");
    expect(result).not.toContain("comment");
  });
});
