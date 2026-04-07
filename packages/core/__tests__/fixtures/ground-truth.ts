export interface GroundTruthSample {
  id: string;
  resume: string;
  jd: string;
  expected: {
    /** Keywords the engine SHOULD identify as matched */
    truePositives: string[];
    /** Keywords the engine SHOULD report as missing */
    trueNegatives: string[];
    /** Approximate expected score range [min, max] */
    scoreRange: [number, number];
    /** Expected YoE extraction (if applicable) */
    yoe?: { totalYears: number; tolerance: number };
  };
}

// ── Samples 1–3: Exact match (same keywords in resume and JD) ───────

const sample01: GroundTruthSample = {
  id: "exact-match-full-stack",
  resume:
    "Skills\npython java javascript react flask postgresql docker git agile scrum\n" +
    "Experience\nBuilt web apps using python and react. Managed postgresql databases. " +
    "Deployed with docker. Used git for version control. Practiced agile scrum.",
  jd: "Looking for a developer with python java javascript react flask postgresql docker git agile scrum",
  expected: {
    truePositives: [
      "python", "java", "javascript", "react", "flask",
      "postgresql", "docker", "git", "agile", "scrum",
    ],
    trueNegatives: [],
    scoreRange: [80, 100],
  },
};

const sample02: GroundTruthSample = {
  id: "exact-match-devops",
  resume:
    "Skills\ndocker kubernetes aws terraform github actions ci/cd linux\n" +
    "Experience\nManaged kubernetes clusters on aws. Wrote terraform IaC. " +
    "Set up github actions ci/cd pipelines on linux servers.",
  jd: "DevOps engineer with docker kubernetes aws terraform github actions ci/cd linux",
  expected: {
    truePositives: [
      "docker", "kubernetes", "aws", "terraform",
      "github actions", "ci/cd", "linux",
    ],
    trueNegatives: [],
    scoreRange: [85, 100],
  },
};

const sample03: GroundTruthSample = {
  id: "exact-match-data-science",
  resume:
    "Skills\npython tensorflow pytorch pandas numpy scikit-learn matplotlib\n" +
    "Experience\nTrained models with tensorflow and pytorch. Analyzed data with pandas numpy. " +
    "Built ML pipelines using scikit-learn. Visualized results with matplotlib.",
  jd: "Data scientist with python tensorflow pytorch pandas numpy scikit-learn matplotlib",
  expected: {
    truePositives: [
      "python", "tensorflow", "pytorch", "pandas",
      "numpy", "scikit-learn", "matplotlib",
    ],
    trueNegatives: [],
    scoreRange: [85, 100],
  },
};

// ── Samples 4–6: Partial match (50% keyword overlap) ────────────────

const sample04: GroundTruthSample = {
  id: "partial-match-frontend",
  resume:
    "Skills\njavascript react html css git\n" +
    "Experience\nBuilt UI components with react and javascript. Styled with css.",
  jd: "Frontend developer with javascript react angular vue typescript html css node.js express git webpack",
  expected: {
    truePositives: ["javascript", "react", "html", "css", "git"],
    trueNegatives: ["angular", "vue", "typescript", "node.js", "express", "webpack"],
    scoreRange: [55, 75],
  },
};

const sample05: GroundTruthSample = {
  id: "partial-match-backend",
  resume:
    "Skills\npython flask postgresql redis\n" +
    "Experience\nBuilt APIs with python flask. Used postgresql and redis for storage.",
  jd: "Backend developer with python java flask spring postgresql mongodb redis elasticsearch docker kubernetes",
  expected: {
    truePositives: ["python", "flask", "postgresql", "redis"],
    trueNegatives: ["java", "spring", "mongodb", "elasticsearch", "docker", "kubernetes"],
    scoreRange: [30, 55],
  },
};

const sample06: GroundTruthSample = {
  id: "partial-match-mobile",
  resume:
    "Skills\nkotlin android studio git firebase\n" +
    "Experience\nDeveloped Android apps with kotlin. Used firebase for backend.",
  jd: "Mobile developer with kotlin swift react android studio xcode git firebase typescript flutter",
  expected: {
    truePositives: ["kotlin", "android studio", "git", "firebase"],
    trueNegatives: ["swift", "react", "xcode", "typescript"],
    scoreRange: [50, 70],
  },
};

// ── Samples 7–9: Synonym mismatch (resume uses alias, JD uses canonical) ─

const sample07: GroundTruthSample = {
  id: "synonym-postgres",
  resume:
    "Skills\npython postgres react docker\n" +
    "Experience\nUsed postgres databases. Deployed with docker.",
  jd: "Requires postgresql and docker experience with python and react",
  expected: {
    truePositives: ["postgresql", "docker", "python", "react"],
    trueNegatives: [],
    scoreRange: [55, 100],
  },
};

const sample08: GroundTruthSample = {
  id: "synonym-k8s-js",
  resume:
    "Skills\njs k8s docker aws\n" +
    "Experience\nDeployed js apps on k8s clusters in aws using docker.",
  jd: "Requires javascript kubernetes docker aws experience",
  expected: {
    truePositives: ["javascript", "kubernetes", "docker", "aws"],
    trueNegatives: [],
    scoreRange: [55, 80],
  },
};

const sample09: GroundTruthSample = {
  id: "synonym-multi-word",
  resume:
    "Skills\npython amazon web services golang ci cd\n" +
    "Experience\nDeployed on amazon web services. Built services in golang with ci cd pipelines.",
  jd: "Requires python aws go ci/cd experience",
  expected: {
    truePositives: ["python", "aws", "go", "ci/cd"],
    trueNegatives: [],
    scoreRange: [30, 55],
  },
};

// ── Samples 10–12: Section placement variance ────────────────────────

const sample10: GroundTruthSample = {
  id: "section-skills-placement",
  resume:
    "Skills\npython react docker aws postgresql\n" +
    "Experience\nWorked as software engineer using python and react. Deployed with docker on aws. Used postgresql.",
  jd: "Python developer with react docker aws postgresql experience",
  expected: {
    truePositives: ["python", "react", "docker", "aws", "postgresql"],
    trueNegatives: [],
    scoreRange: [85, 100],
  },
};

const sample11: GroundTruthSample = {
  id: "section-education-only",
  resume:
    "Education\nBachelor of Computer Science\nCoursework: python react docker aws postgresql",
  jd: "Python developer with react docker aws postgresql experience",
  expected: {
    truePositives: ["python", "react", "docker", "aws", "postgresql"],
    trueNegatives: [],
    scoreRange: [70, 95],
  },
};

const sample12: GroundTruthSample = {
  id: "section-no-headers",
  resume: "Experienced with python react docker aws postgresql in various projects",
  jd: "Python developer with react docker aws postgresql experience",
  expected: {
    truePositives: ["python", "react", "docker", "aws", "postgresql"],
    trueNegatives: [],
    scoreRange: [70, 95],
  },
};

// ── Samples 13–15: Dynamic keywords (JD terms not in taxonomy) ───────

const sample13: GroundTruthSample = {
  id: "dynamic-monitoring-tools",
  resume:
    "Skills\npython docker kubernetes aws\n" +
    "Experience\nSet up Datadog monitoring and Grafana dashboards. Used python docker kubernetes on aws.",
  jd: "Requires python docker kubernetes aws experience. Must know Datadog and Grafana for monitoring.",
  expected: {
    truePositives: ["python", "docker", "kubernetes", "aws"],
    trueNegatives: [],
    scoreRange: [75, 100],
  },
};

const sample14: GroundTruthSample = {
  id: "dynamic-niche-tools",
  resume:
    "Skills\njava spring postgresql\n" +
    "Experience\nBuilt microservices with java spring. Used postgresql.",
  jd: "Java developer with spring postgresql experience. Familiarity with Kafka, RabbitMQ and Consul preferred.",
  expected: {
    truePositives: ["java", "spring", "postgresql"],
    trueNegatives: [],
    scoreRange: [55, 85],
  },
};

const sample15: GroundTruthSample = {
  id: "dynamic-all-missing",
  resume:
    "Skills\npython flask\n" +
    "Experience\nBuilt web apps with python and flask.",
  jd: "Python flask developer. Must know Airflow, dbt, and Snowflake for data pipeline management.",
  expected: {
    truePositives: ["python", "flask"],
    trueNegatives: [],
    scoreRange: [50, 80],
  },
};

// ── Samples 16–17: Non-tech text (marketing, finance JDs) ───────────

const sample16: GroundTruthSample = {
  id: "non-tech-marketing",
  resume:
    "Marketing Manager with 8 years of experience in brand strategy, " +
    "digital marketing, social media campaigns, content creation, and " +
    "market research. Led cross-functional teams to drive revenue growth. " +
    "Proficient with analytics tools and CRM platforms.",
  jd: "Marketing Manager with brand strategy digital marketing social media " +
    "content creation market research experience. Must have strong communication " +
    "and leadership skills.",
  expected: {
    truePositives: [],
    trueNegatives: ["communication", "leadership"],
    scoreRange: [5, 20],
  },
};

const sample17: GroundTruthSample = {
  id: "non-tech-finance",
  resume:
    "Financial Analyst with experience in budgeting, forecasting, " +
    "financial modeling, and investment analysis. Strong analytical " +
    "skills with attention to detail. Proficient with Excel and SQL.",
  jd: "Financial Analyst with budgeting forecasting financial modeling " +
    "investment analysis experience. Requires strong analytical skills " +
    "and attention to detail. SQL knowledge preferred.",
  expected: {
    truePositives: ["sql", "analytical", "attention to detail"],
    trueNegatives: [],
    scoreRange: [80, 100],
  },
};

// ── Samples 18–19: YoE requirement with various date formats ────────

const sample18: GroundTruthSample = {
  id: "yoe-standard-dates",
  resume:
    "Skills\npython react postgresql docker\n" +
    "Experience\nSenior Developer\nJan 2018 - Present\n" +
    "Built web apps with python and react. Used postgresql and docker.\n" +
    "Junior Developer\nJun 2015 - Dec 2017\n" +
    "Learned python and web development fundamentals.",
  jd: "Senior developer with 5+ years of python experience. " +
    "Must know react postgresql docker.",
  expected: {
    truePositives: ["python", "react", "postgresql", "docker"],
    trueNegatives: [],
    scoreRange: [80, 100],
    yoe: { totalYears: 11, tolerance: 1 },
  },
};

const sample19: GroundTruthSample = {
  id: "yoe-year-only-dates",
  resume:
    "Skills\njava spring postgresql\n" +
    "Experience\nSoftware Engineer\n2020 - 2024\n" +
    "Used java spring and postgresql.\n" +
    "Intern\n2019 - 2020\nLearned java basics.",
  jd: "Requires 3 years experience with java spring postgresql",
  expected: {
    truePositives: ["java", "spring", "postgresql"],
    trueNegatives: [],
    scoreRange: [75, 100],
    yoe: { totalYears: 5, tolerance: 1 },
  },
};

// ── Sample 20: Identical text (score ceiling validation) ────────────

const sample20: GroundTruthSample = {
  id: "identical-text-ceiling",
  resume:
    "Senior Python developer with 10 years of experience in building scalable " +
    "web applications using react, flask, postgresql, docker, and aws. Proficient " +
    "in javascript typescript node.js kubernetes ci/cd github actions terraform. " +
    "Strong skills in agile scrum tdd unit testing rest api design patterns. " +
    "Bachelor in computer science. Excellent communication and leadership.",
  jd: "Senior Python developer with 10 years of experience in building scalable " +
    "web applications using react, flask, postgresql, docker, and aws. Proficient " +
    "in javascript typescript node.js kubernetes ci/cd github actions terraform. " +
    "Strong skills in agile scrum tdd unit testing rest api design patterns. " +
    "Bachelor in computer science. Excellent communication and leadership.",
  expected: {
    truePositives: [
      "python", "react", "flask", "postgresql", "docker", "aws",
      "javascript", "typescript", "node.js", "kubernetes", "ci/cd",
      "github actions", "terraform", "agile", "scrum", "tdd",
      "unit testing", "rest api", "design patterns", "computer science",
      "communication", "leadership", "bachelor",
    ],
    trueNegatives: [],
    scoreRange: [95, 100],
  },
};

export const GROUND_TRUTH: GroundTruthSample[] = [
  sample01, sample02, sample03,
  sample04, sample05, sample06,
  sample07, sample08, sample09,
  sample10, sample11, sample12,
  sample13, sample14, sample15,
  sample16, sample17,
  sample18, sample19,
  sample20,
];
