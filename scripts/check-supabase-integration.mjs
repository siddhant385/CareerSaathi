import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// 1. Verify SQL migrations & DDL
const sqlPath = path.resolve(process.cwd(), "supabase/migrations/20261005000000_initial_schema.sql");
assert.ok(fs.existsSync(sqlPath), "Supabase initial migration SQL file must exist");
const sqlContent = fs.readFileSync(sqlPath, "utf-8");
assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.profiles"), "profiles table defined");
assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.vocational_trades"), "vocational_trades table defined");
assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.households"), "households table defined");
assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.family_callbacks"), "family_callbacks table defined");
assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.student_documents"), "student_documents table defined");
assert.ok(sqlContent.includes("CREATE TABLE IF NOT EXISTS public.admission_timelines"), "admission_timelines table defined");

// 2. Verify TypeScript database definitions
const tsTypesPath = path.resolve(process.cwd(), "src/lib/supabase/database.types.ts");
assert.ok(fs.existsSync(tsTypesPath), "Database TypeScript definitions file must exist");
const tsContent = fs.readFileSync(tsTypesPath, "utf-8");
assert.ok(tsContent.includes("export type Database = {"), "Database interface exported");
assert.ok(tsContent.includes("vocational_trades: {"), "vocational_trades table typed");
assert.ok(tsContent.includes("family_callbacks: {"), "family_callbacks table typed");

// 3. Verify Server Actions
const authActionPath = path.resolve(process.cwd(), "src/app/actions/auth.ts");
const profileActionPath = path.resolve(process.cwd(), "src/app/actions/profile.ts");
const tradesActionPath = path.resolve(process.cwd(), "src/app/actions/trades.ts");
const leadsActionPath = path.resolve(process.cwd(), "src/app/actions/leads.ts");

assert.ok(fs.existsSync(authActionPath), "auth server actions exist");
assert.ok(fs.existsSync(profileActionPath), "profile server actions exist");
assert.ok(fs.existsSync(tradesActionPath), "trades server actions exist");
assert.ok(fs.existsSync(leadsActionPath), "leads server actions exist");

console.log("Self-check passed: Supabase DDL, database types, and Server Actions successfully verified!");
