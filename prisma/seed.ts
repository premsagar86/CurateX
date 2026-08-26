// Dev/staging seed data. Seeds the 3 founder TEAM users per PLAN.md §31.2
// ("TEAM users are created via a seed script at initial setup").
import { PrismaClient, UserRole } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const founders = [
    { name: "Founder One", email: "Bavana_Sruthi@forgedigital.in" },
    { name: "Founder Two", email: "Selvin_Joel@forgedigital.in" },
    { name: "Founder Three", email: "Prem_Sagar@forgedigital.in" },
  ];

  for (const founder of founders) {
    await db.user.upsert({
      where: { email: founder.email },
      update: {},
      create: {
        name: founder.name,
        email: founder.email,
        role: UserRole.TEAM,
        emailVerified: true,
      },
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
