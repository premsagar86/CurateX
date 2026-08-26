// Dev/staging seed data. Seeds the 3 founder TEAM users per PLAN.md §31.2
// ("TEAM users are created via a seed script at initial setup"). Goes through
// Better Auth's signUpEmail (not a raw Prisma upsert) so each founder gets a
// real Account/password credential and can actually log in at /login — a bare
// db.user.upsert leaves no Account row, which is why founders previously
// couldn't sign in at all.
import { UserRole } from "@prisma/client";
import { db } from "../lib/db";
import { auth } from "../lib/auth";

const SEED_PASSWORD = process.env.SEED_FOUNDER_PASSWORD;

async function main() {
  if (!SEED_PASSWORD) {
    throw new Error("SEED_FOUNDER_PASSWORD is not set — see .env.example");
  }

  const founders = [
    { name: "Founder One", email: "Bavana_Sruthi@forgedigital.in" },
    { name: "Founder Two", email: "Selvin_Joel@forgedigital.in" },
    { name: "Founder Three", email: "Prem_Sagar@forgedigital.in" },
  ];

  for (const founder of founders) {
    const existing = await db.user.findUnique({ where: { email: founder.email } });

    if (!existing) {
      await auth.api.signUpEmail({
        body: { email: founder.email, password: SEED_PASSWORD, name: founder.name },
      });
    }

    await db.user.update({
      where: { email: founder.email },
      data: { role: UserRole.TEAM, emailVerified: true },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
