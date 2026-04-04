import { md } from "./markdown.js";

import aboutRaw from "../content/about.md?raw";
import scoringRaw from "../content/learn-more/01-scoring.md?raw";
import limitationsRaw from "../content/learn-more/02-limitations.md?raw";
import categoriesRaw from "../content/learn-more/03-categories.md?raw";
import whatIsAtsRaw from "../content/questions/01-what-is-ats.md?raw";
import goodScoreRaw from "../content/questions/02-good-score.md?raw";
import guaranteeRaw from "../content/questions/03-guarantee.md?raw";
import dataSafetyRaw from "../content/questions/04-data-safety.md?raw";
import keywordStuffingRaw from "../content/questions/05-keyword-stuffing.md?raw";
import demoResumeRaw from "../content/demo-data/resume.md?raw";
import demoJdRaw from "../content/demo-data/job-description.md?raw";

interface Parsed {
  title: string;
  body: string;
}

function parseFrontmatter(raw: string): Parsed {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { title: "", body: raw.trim() };

  let title = "";
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0 && line.slice(0, idx).trim() === "title") {
      title = line.slice(idx + 1).trim();
    }
  }

  return { title, body: match[2].trim() };
}

function parseSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = body.split(/^## /m);

  sections[""] = parts[0].trim();

  for (let i = 1; i < parts.length; i++) {
    const newlineIdx = parts[i].indexOf("\n");
    if (newlineIdx < 0) {
      sections[parts[i].trim()] = "";
      continue;
    }
    sections[parts[i].slice(0, newlineIdx).trim()] =
      parts[i].slice(newlineIdx + 1).trim();
  }

  return sections;
}

function buildHero(): string {
  const { title, body } = parseFrontmatter(aboutRaw);
  const sections = parseSections(body);

  const subtitle = sections[""] || "";

  const trustItems = (sections["Trust"] || "")
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2));

  const steps = (sections["Steps"] || "")
    .split("\n")
    .filter((l) => /^\d+\.\s/.test(l))
    .map((l) => {
      const text = l.replace(/^\d+\.\s/, "");
      const m = text.match(/^\*\*(.+?)\*\*\s*—\s*(.+)$/);
      return m ? { label: m[1], desc: m[2] } : { label: text, desc: "" };
    });

  const hero = `<section class="hero">
  <h1 class="hero-title">${title}</h1>
  <p class="hero-sub">${subtitle}</p>
  <div class="hero-actions">
    <a href="#resumeCard" class="hero-cta">↓ Analyze Your Resume</a>
    <button class="demo-btn" id="demoBtn" onclick="runDemo()">▶ Try a Demo</button>
  </div>
  <div class="trust-strip">
    ${trustItems.map((t) => `<span class="trust-item">${t}</span>`).join("\n    ")}
  </div>
</section>`;

  const hiw = steps.length
    ? `<section class="how-it-works">
  <h2 class="hiw-title">How It Works</h2>
  <div class="hiw-steps">
    ${steps
      .map(
        (s, i) => `<div class="hiw-step">
      <div class="hiw-num">${i + 1}</div>
      <div class="hiw-label">${s.label}</div>
      <div class="hiw-desc">${s.desc}</div>
    </div>`,
      )
      .join("\n    ")}
  </div>
</section>`
    : "";

  return hero + hiw;
}

function buildDetailsSection(
  sectionClass: string,
  titleClass: string,
  titleText: string,
  itemClass: string,
  bodyClass: string,
  entries: Parsed[],
): string {
  const items = entries
    .map(
      ({ title, body }) =>
        `<details class="${itemClass}">
    <summary>${title}</summary>
    <div class="${bodyClass}">${md(body)}</div>
  </details>`,
    )
    .join("\n  ");

  return `<section class="${sectionClass}">
  <h2 class="${titleClass}">${titleText}</h2>
  ${items}
</section>`;
}

function buildFinalCta(): string {
  return `<section class="final-cta">
  <p class="cta-text">Ready to optimize your resume?</p>
  <a href="#resumeCard" class="hero-cta">↑ Back to Scanner</a>
</section>`;
}

export function renderContent(): void {
  const heroMount = document.getElementById("hero-mount");
  if (heroMount) heroMount.innerHTML = buildHero();

  const learnMoreEntries = [scoringRaw, limitationsRaw, categoriesRaw].map(
    parseFrontmatter,
  );
  const learnMoreMount = document.getElementById("learn-more-mount");
  if (learnMoreMount)
    learnMoreMount.innerHTML = buildDetailsSection(
      "info-section",
      "info-title",
      "Learn More",
      "info-item",
      "info-body",
      learnMoreEntries,
    );

  const faqEntries = [
    whatIsAtsRaw,
    goodScoreRaw,
    guaranteeRaw,
    dataSafetyRaw,
    keywordStuffingRaw,
  ].map(parseFrontmatter);
  const faqMount = document.getElementById("faq-mount");
  if (faqMount)
    faqMount.innerHTML = buildDetailsSection(
      "faq-section",
      "faq-title",
      "Common Questions",
      "faq-item",
      "faq-body",
      faqEntries,
    );

  const ctaMount = document.getElementById("final-cta-mount");
  if (ctaMount) ctaMount.innerHTML = buildFinalCta();
}

export function getDemoData(): { resume: string; jd: string } {
  return { resume: demoResumeRaw.trim(), jd: demoJdRaw.trim() };
}
