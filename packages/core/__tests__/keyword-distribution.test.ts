import { describe, it, expect } from "vitest";
import { analyzeKeywordDistribution } from "../src/index.js";

describe("Keyword Distribution Z-Score", () => {
  it("flags a skills section with abnormal keyword density", () => {
    const resume = [
      "Summary\n",
      "Experienced software developer with passion for building " +
        "reliable scalable applications and collaborating effectively\n",
      "Skills\n",
      "python python java java react react docker docker aws aws " +
        "python java react docker aws python java react docker aws\n",
      "Experience\n",
      "Worked at a large technology company doing various general tasks " +
        "including meetings planning documentation and team coordination\n",
      "Projects\n",
      "Built several open source tools for internal productivity " +
        "automation and team workflow improvement over multiple years\n",
      "Education\n",
      "Bachelor of Science from university with focus on general studies " +
        "and theoretical foundations of computing and mathematics\n",
    ].join("");

    const keywords = new Set(["python", "java", "react", "docker", "aws"]);
    const dist = analyzeKeywordDistribution(resume, keywords);

    expect(dist.isNatural).toBe(false);
    expect(dist.anomalies.length).toBeGreaterThan(0);
    expect(dist.anomalies[0].section).toBe("skills");
  });

  it("marks naturally distributed keywords as isNatural=true", () => {
    const resume = [
      "Summary\nPython developer with react experience\n",
      "Skills\npython react docker aws\n",
      "Experience\nUsed python and react at company. Deployed with docker on aws.\n",
    ].join("");

    const keywords = new Set(["python", "react", "docker", "aws"]);
    const dist = analyzeKeywordDistribution(resume, keywords);
    expect(dist.isNatural).toBe(true);
  });

  it("returns isNatural=true for single-section resumes", () => {
    const resume = "python java react docker kubernetes aws developer";
    const keywords = new Set(["python", "java", "react"]);
    const dist = analyzeKeywordDistribution(resume, keywords);
    expect(dist.isNatural).toBe(true);
    expect(dist.anomalies).toHaveLength(0);
  });

  it("computes mean and stdDev correctly", () => {
    const resume = [
      "Summary\nSome intro text without keywords\n",
      "Skills\npython react docker\n",
      "Experience\nUsed python react docker in real projects daily\n",
    ].join("");

    const keywords = new Set(["python", "react", "docker"]);
    const dist = analyzeKeywordDistribution(resume, keywords);
    expect(dist.mean).toBeGreaterThan(0);
    expect(dist.stdDev).toBeGreaterThanOrEqual(0);
  });

  it("detects extreme buzzword dump", () => {
    const resume = [
      "John Doe\njohndoe@email.com\nSan Francisco California\n",
      "Summary\n",
      "Experienced professional with background in software development " +
        "and general technology industry work over many productive years\n",
      "Skills\n",
      "python python python react react react docker docker docker " +
        "aws aws aws kubernetes kubernetes kubernetes terraform terraform " +
        "ansible ansible jenkins jenkins python react docker aws\n",
      "Experience\n",
      "Worked at various companies doing general professional work " +
        "including planning meetings documentation and coordination " +
        "across many different departments and teams globally\n",
      "Projects\n",
      "Built multiple internal tools for team productivity and process " +
        "automation using various frameworks and deployment strategies\n",
      "Education\n",
      "Completed academic program at accredited university with " +
        "general coursework in technology and related subjects\n",
    ].join("");

    const keywords = new Set([
      "python", "react", "docker", "aws", "kubernetes",
      "terraform", "ansible", "jenkins",
    ]);
    const dist = analyzeKeywordDistribution(resume, keywords);
    expect(dist.isNatural).toBe(false);
    expect(dist.anomalies.some((a) => a.zScore > 2.0)).toBe(true);
  });
});
