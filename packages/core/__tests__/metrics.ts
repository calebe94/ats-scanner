export interface ConfusionMatrix {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
}

/**
 * Builds a confusion matrix for keyword extraction evaluation.
 *
 * @param predicted - keywords the engine identified as matching
 * @param actual    - keywords annotated as true matches in ground truth
 * @param universe  - all keywords that COULD have matched (bounds TN calculation)
 *
 * TN = universe − (predicted ∪ actual)
 */
export function calculateConfusionMatrix(
  predicted: Set<string>,
  actual: Set<string>,
  universe: Set<string>,
): ConfusionMatrix {
  let tp = 0;
  let fp = 0;
  let fn = 0;

  for (const item of predicted) {
    if (actual.has(item)) tp++;
    else fp++;
  }

  for (const item of actual) {
    if (!predicted.has(item)) fn++;
  }

  const union = new Set([...predicted, ...actual]);
  const tn = [...universe].filter((item) => !union.has(item)).length;

  return { tp, fp, fn, tn };
}

export function precision(cm: ConfusionMatrix): number {
  const denom = cm.tp + cm.fp;
  return denom === 0 ? 0 : cm.tp / denom;
}

export function recall(cm: ConfusionMatrix): number {
  const denom = cm.tp + cm.fn;
  return denom === 0 ? 0 : cm.tp / denom;
}

export function f1Score(cm: ConfusionMatrix): number {
  const p = precision(cm);
  const r = recall(cm);
  const denom = p + r;
  return denom === 0 ? 0 : (2 * p * r) / denom;
}
