export interface SemanticResult {
  semanticScore: number;
  lexicalScore: number;
  combinedScore: number;
  synonymPairs: Array<{
    resume: string;
    jd: string;
    similarity: number;
  }>;
}
