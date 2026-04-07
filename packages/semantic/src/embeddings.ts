let embeddingPipeline: unknown = null;

export async function initModel(): Promise<void> {
  if (!embeddingPipeline) {
    const { pipeline } = await import("@huggingface/transformers");
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { dtype: "q8" } as Record<string, unknown>,
    );
  }
}

export async function getEmbedding(text: string): Promise<number[]> {
  await initModel();
  const pipe = embeddingPipeline as (
    text: string,
    opts: Record<string, unknown>,
  ) => Promise<{ data: Float32Array }>;
  const output = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

export async function semanticSimilarity(
  textA: string,
  textB: string,
): Promise<number> {
  const { cosineSimilarity } = await import("@ats-scanner/core");
  const [vecA, vecB] = await Promise.all([
    getEmbedding(textA),
    getEmbedding(textB),
  ]);
  return cosineSimilarity(vecA, vecB);
}
