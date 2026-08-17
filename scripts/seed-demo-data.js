#!/usr/bin/env node
/**
 * UniVibe — Demo Data Seeder
 * ---------------------------------------------------------------
 * Inserts demo gossips + chat messages into a running Supabase
 * project via the PostgREST REST API (no SDK / install needed).
 *
 * It uses the service_role key so it can write directly to the
 * tables (posting through the public RPC functions instead is the
 * "human" path — this script is for quickly bootstrapping a
 * database with content).
 *
 * Usage
 *   $env:SUPABASE_URL="https://<ref>.supabase.co"          # PowerShell
 *   $env:SUPABASE_SERVICE_ROLE_KEY="<service_role key>"
 *   node scripts/seed-demo-data.js
 */
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const REST = `${SUPABASE_URL}/rest/v1`;
const AUTH = { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` };
const HEADERS = { ...AUTH, "Content-Type": "application/json", Prefer: "return=minimal" };

async function insert(table, rows) {
  const res = await fetch(`${REST}/${table}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`${table} -> HTTP ${res.status}: ${await res.text()}`);
  console.log(`  ✔ inserted ${rows.length} row(s) into ${table}`);
}

const DEMO_GOSSIPS = [
  ["chai_buddy", "Hot take: 9 AM lectures should be illegal 🛏️", "Nobody is emotionally prepared for thermodynamics at 9AM. The professor literally greets us with \"good morning, survivors\". Surviving WHAT sir.", 132],
  ["library_phantom", "The library quiet floor is a myth 💀", "Someone pulled up with a full Bluetooth speaker on the \"silent\" floor yesterday. The librarian stared for 30 seconds and walked away.", 89],
  ["canteen_critic", "Rating the canteen burgers so you don't have to 🍔", "The 'Double Decker Deluxe' is 60% bread, 30% hope, and 10% mystery patty. 6/10 with tears.", 57],
  ["assignment_gremlin", "PSA: there are only 3 days left for the DBMS project", "That is all. Go touch grass, then come back and finish your ER diagram. You know who you are (it's me).", 214],
  ["lecture_slides", "Prof, if you could please send the slides BEFORE the exam 🥲", "72 slides covering the full semester, dropped 6 hours before the exam. Breathtaking. Unhinged.", 178],
  ["campus_wifi", "Campus wifi when you actually need it: 📶", "Randomly faster at 2am in the parking lot than at 11am in the main building.", 98],
  ["mysterio_senpai", "Confession: I charge my laptop in the projector room", "The door is 'staff only' but nobody locks it after 6. I have brought peace to my dying battery.", 333],
];

const DEMO_MESSAGES = [
  ["night_owl", "Anyone else still up for the ACM hackathon?"],
  ["chai_buddy", "Count me in, bringing snacks 🍪"],
  ["canteen_critic", "If the snacks contain mayo I am walking out"],
  ["wingman_wyatt", "LMAOOO the canteen has traumatized them"],
  ["campus_wifi", "Me, but only if the wifi cooperates at 3am 😭"],
];

async function main() {
  console.log("Seeding UniVibe demo data…\n");

  const gossips = DEMO_GOSSIPS.map(([u, title, content, likes], i) => ({
    user_id: null,          // guest/demo rows; attach to your id after signup
    username: u,
    title,
    content: `<p>${content}</p>`,
    images: null,
    likes,
    created_at: new Date(Date.now() - (i + 1) * 45 * 60 * 1000).toISOString(),
  }));
  await insert("gossipbar", gossips);

  const messages = DEMO_MESSAGES.map(([u, msg], i) => ({
    user_id: null,
    username: u,
    message: msg,
    created_at: new Date(Date.now() - (i + 1) * 30_000).toISOString(),
  }));
  await insert("messages", messages);

  console.log("\nDone. Open the feed (gossip.html) and Campus Connect (livechat.html).");
}

main().catch((e) => {
  console.error("Seeding failed:", e.message);
  process.exit(1);
});