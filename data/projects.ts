export type ContactLink = {
  label: string;
  href: string;
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export type ProjectOverride = {
  repoName: string;
  displayName: string;
  slug: string;
  liveUrl?: string;
  oneLiner: string;
  challenge: string;
  architecture: string;
  impact: string[];
  highlights: string[];
  featuredRank: number;
  priority: "primary" | "secondary";
};

export const profileConfig = {
  fullName: "Ahkar Min Oo",
  targetRole: "Software Developer Intern · Local AI & Full-Stack Engineering",
  heroSummary:
    "I design and ship product-ready systems with modern frontend experiences, resilient backend architecture, and local-first AI workflows.",
  availability: "Open to internship and junior software roles",
  email: "ahkarminoo88@gmail.com",
  resumePath: "/Ahkar Min Oo.pdf",
  githubUsername: "ahkarminoo",
  education: {
    school: "Assumption University of Thailand",
    degree: "BSc Computer Science",
    timeline: "Expected May 2026",
    location: "Bangkok, Thailand"
  },
  certifications: ["Java Intermediate", "AWS Cloud"]
};

export const contactLinks: ContactLink[] = [
  { label: "Email", href: "mailto:ahkarminoo88@gmail.com" },
  { label: "GitHub", href: "https://github.com/ahkarminoo" },
  { label: "Live Product", href: "https://foodloft.vercel.app/" }
];

export const skillGroups: SkillGroup[] = [
  {
    group: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "SQL"]
  },
  {
    group: "AI and Data",
    items: ["LangChain", "Ollama", "RAG pipelines", "ChromaDB", "OCR workflows"]
  },
  {
    group: "Web and Cloud",
    items: ["Next.js", "React", "Node.js", "MongoDB", "Firebase", "AWS EC2"]
  },
  {
    group: "Engineering",
    items: ["System design", "Role-based auth", "API design", "Performance tuning"]
  }
];

export const projectOverrides: ProjectOverride[] = [
  {
    repoName: "FoodLoft",
    displayName: "FoodLoft",
    slug: "foodloft",
    liveUrl: "https://foodloft.vercel.app/",
    oneLiner:
      "Workflow-driven restaurant operations platform across customer, owner, staff, and admin roles.",
    challenge:
      "Restaurants need one system for discovery, reservations, staff workflows, and business controls while preserving clear role boundaries and operational consistency.",
    architecture:
      "Role-oriented frontend surfaces with domain-segmented APIs for auth, reservations, floorplans, staff, admin governance, and subscription-aware policy enforcement.",
    impact: [
      "Built a unified full-stack platform where every actor shares a consistent reservation state model.",
      "Enforced critical constraints server-side, including booking availability, lifecycle transitions, and permission checks.",
      "Integrated payments and operational messaging into core product workflows instead of add-on features."
    ],
    highlights: [
      "Multi-actor role experiences (customer, owner, staff, admin)",
      "Reservation lifecycle flow with conflict-aware availability validation",
      "Payment and notification orchestration with webhook-capable integrations"
    ],
    featuredRank: 1,
    priority: "primary"
  },
  {
    repoName: "OCR-Document-Categorizer",
    displayName: "OCR Document Categorizer",
    slug: "ocr-document-categorizer",
    oneLiner: "Local-first OCR API that only uses AI fallback when confidence is low.",
    challenge:
      "Typical OCR pipelines are either expensive AI-only flows or brittle local-only setups on noisy mobile captures.",
    architecture:
      "OpenCV preprocessing, local OCR-first extraction, heuristic classification, optional Gemini fallback, and API artifact endpoints.",
    impact: [
      "Balanced cost and quality with confidence-based fallback instead of always-on AI calls.",
      "Packaged for deployment with health checks, readiness checks, and reproducible API outputs.",
      "Handled mobile capture constraints through cropping and perspective correction."
    ],
    highlights: [
      "Local OCR -> fallback chain",
      "Structured output with scan artifacts",
      "Deployment-ready backend and frontend split"
    ],
    featuredRank: 2,
    priority: "primary"
  },
  {
    repoName: "AI_waiter",
    displayName: "AI Waiter",
    slug: "ai-waiter",
    oneLiner: "Local AI waiter assistant using semantic routing, memory, and RAG retrieval.",
    challenge:
      "Conversational assistants need context handling and intent routing to avoid over-querying retrieval for simple visual requests.",
    architecture:
      "LangChain orchestration with semantic intent routing, memory-aware query rewriting, ChromaDB retrieval, and Ollama local inference.",
    impact: [
      "Built a practical local LLM workflow with privacy-first operation.",
      "Improved answer relevance by splitting visual and semantic query paths.",
      "Demonstrated memory and retrieval trade-offs in a compact architecture."
    ],
    highlights: [
      "Semantic routing before retrieval",
      "Memory-aware follow-up handling",
      "Local LLM inference with Ollama"
    ],
    featuredRank: 3,
    priority: "primary"
  },
  {
    repoName: "EarthquakeTracker",
    displayName: "Earthquake Tracker",
    slug: "earthquake-tracker",
    oneLiner: "Client-side earthquake monitoring interface using public data feeds.",
    challenge: "Present real-time event updates in a simple, readable user interface.",
    architecture: "Frontend web app using JavaScript and geospatial/event feed rendering.",
    impact: ["Demonstrates API consumption and interactive frontend delivery."],
    highlights: ["Live data display", "Clear event timeline UI"],
    featuredRank: 10,
    priority: "secondary"
  },
  {
    repoName: "tradebarterhub",
    displayName: "Trade Barter Hub",
    slug: "trade-barter-hub",
    oneLiner: "Marketplace-style barter trading prototype built for academic collaboration.",
    challenge: "Support item exchange workflows in a web application setting.",
    architecture: "JavaScript web stack with collaborative project development.",
    impact: ["Shows early product-building and team collaboration experience."],
    highlights: ["Barter exchange concept", "Collaborative final project"],
    featuredRank: 11,
    priority: "secondary"
  }
];
