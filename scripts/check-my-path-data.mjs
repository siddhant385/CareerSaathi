import assert from "node:assert/strict";
import { getCareerPaths } from "../src/app/my-path/components/data.ts";

const pathsEn = getCareerPaths("en");
const pathsHi = getCareerPaths("hi");

assert.equal(pathsEn.length, 6, "English career paths must have 6 realistic recommendations");
assert.equal(pathsHi.length, 6, "Hindi career paths must have 6 realistic recommendations");

for (const path of pathsEn) {
  assert.ok(path.title, "Title required");
  assert.ok(path.startingPay, "Starting pay required");
  assert.ok(path.duration, "Duration required");
  assert.ok(path.verifiedCentresCount > 0, "Verified centers required");
  assert.ok(path.evidenceLevel, "Evidence level required");
}

console.log("Self-check passed: Career paths data model is complete and bilingual.");
