import { SpamScoreResult } from "@/types/email";

const BANNED_MARKETING_KEYWORDS = [
  "free",
  "winner",
  "congratulations",
  "act now",
  "limited time",
  "exclusive",
  "offer",
  "deal",
  "cheap",
  "bonus",
  "prize",
  "discount",
  "cash",
  "instant access",
  "no credit card",
];

const LEGAL_RISK_PATTERNS = [
  /!!!+/g,
  /[$]{2,}/g,
  /\bclick here\b/gi,
  /\b100%\b/gi,
  /\bguarantee\b/gi,
];

export function calculateSpamScore(html: string): SpamScoreResult {
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (text.length < 10) {
    return {
      score: 6,
      level: "low",
      issues: ["Email body too short for formal communication"],
    };
  }

  let score = 0;
  const issues: string[] = [];

  BANNED_MARKETING_KEYWORDS.forEach((word) => {
    if (text.includes(word)) {
      score += 8;
      issues.push(`Contains marketing-spam keyword: "${word}"`);
    }
  });

  LEGAL_RISK_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      score += 10;
      issues.push(`High-risk pattern detected: ${pattern}`);
    }
  });

  const linkCount = (html.match(/<a\s+/g) || []).length;
  if (linkCount > 2) {
    score += 8;
    issues.push(`Too many external links (${linkCount})`);
  }

  const capsMatches = html.match(/[A-Z]{8,}/g);
  if (capsMatches) {
    score += 6;
    issues.push("Contains excessive ALL CAPS text");
  }

  if (text.length < 80) {
    score += 6;
    issues.push("Email body too short for formal communication");
  }

  if (text.length > 6000) {
    score += 6;
    issues.push("Email body unusually long (may reduce credibility)");
  }

  score = Math.min(score, 100);

  let level: "low" | "medium" | "high" = "low";
  if (score >= 60) level = "high";
  else if (score >= 30) level = "medium";

  return { score, level, issues };
}
