const PRICING: Record<string, { input: number; output: number }> = {
  "gemini-2.5-flash": { input: 0.3, output: 2.5 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
};

export function calcCost(args: {
  inputTokens: number;
  outputTokens: number;
  model: string;
}) {
  const price = PRICING[args.model];
  if (!price) return 0;
  const inputPrice = (args.inputTokens / 1_000_000) * price.input;
  const outputPrice = (args.outputTokens / 1_000_000) * price.output;
  const totalPrice = inputPrice + outputPrice;

  return totalPrice;
}
