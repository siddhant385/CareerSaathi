import { initialSentimentMetrics, initialFamilyLeads, initialEditableTrades } from "../src/app/admin/components/data.ts";
import assert from "node:assert/strict";

assert(initialSentimentMetrics.length >= 4, "Must have at least 4 key sentiment metrics");
assert(initialFamilyLeads.length >= 4, "Must have sample leads across different sentiment categories");
assert(initialEditableTrades.length >= 3, "Must have editable trade records");

for (const lead of initialFamilyLeads) {
  assert(lead.id && lead.parentName && lead.targetTrade, "Lead record must have id, parentName, targetTrade");
  assert(lead.preferredDialect, "Lead must have preferred dialect specified");
}

console.log("Self-check passed: Admin & Counsellor data models validated.");
