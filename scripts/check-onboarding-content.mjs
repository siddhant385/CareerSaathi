import assert from "node:assert/strict";
import { getOnboardingSteps } from "../src/app/onboarding/components/questions.ts";

const stepsEn = getOnboardingSteps("en");
const stepsHi = getOnboardingSteps("hi");

assert.equal(stepsEn.length, 8, "English steps count should be 8");
assert.equal(stepsHi.length, 8, "Hindi steps count should be 8");

const optionalIds = ["goals", "resume", "portals"];
for (const id of optionalIds) {
  const step = stepsEn.find((s) => s.id === id);
  assert.ok(step, `Step ${id} should exist`);
  assert.equal(step?.isOptional, true, `Step ${id} should be optional`);
}

console.log("Self-check passed: 8 bilingual steps defined with required optional rules.");
