import { cosineSimilarity } from "@ats-scanner/core";
import type { SemanticResult } from "./types.js";

const LEXICAL_WEIGHT = 0.60;
const SEMANTIC_WEIGHT = 0.40;

export function combinedScore(
  lexicalScore: number,
  semanticScore: number,
): number {
  return LEXICAL_WEIGHT * lexicalScore + SEMANTIC_WEIGHT * semanticScore;
}

export function buildSemanticResult(
  lexicalScore: number,
  semanticScore: number,
  synonymPairs: SemanticResult["synonymPairs"] = [],
): SemanticResult {
  return {
    semanticScore,
    lexicalScore,
    combinedScore: combinedScore(lexicalScore, semanticScore),
    synonymPairs,
  };
}

export { cosineSimilarity };
