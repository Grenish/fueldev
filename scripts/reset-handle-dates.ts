import { config } from "dotenv";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Load environment variables
config();

import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Resetting handleUpdatedAt to null for all existing records...");

  const result = await prisma.userLinks.updateMany({
    data: {
      handleUpdatedAt: null,
    },
  });

  console.log(`✅ Updated ${result.count} records`);
  console.log("All users can now change their handle without restriction!");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
