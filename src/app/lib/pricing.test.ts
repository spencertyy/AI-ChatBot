import { calcCost } from "./pricing";

describe("calcCost", () => {
  it("calculates cost for a known model (gemini)", () => {
    expect(
      calcCost({
        inputTokens: 1000000,
        outputTokens: 1000000,
        model: "gemini-2.5-flash",
      }),
    ).toBeCloseTo(2.8);
  });
});

describe("calcCost", () => {
  it("calculates cost for gpt-4o-mini", () => {
    expect(
      calcCost({
        inputTokens: 1000000,
        outputTokens: 1000000,
        model: "gpt-4o-mini",
      }),
    ).toBeCloseTo(0.75);
  });
});

describe("returns 0 for an unknown model", () => {
  it("should return the correct cost", () => {
    expect(
      calcCost({
        inputTokens: 1000000,
        outputTokens: 1000000,
        model: "unknown-model",
      }),
    ).toBe(0);
  });
});
