import "dotenv/config";
import { defineConfig } from "prisma/config";

// Type assertion needed for Prisma 7 earlyAccess features
// This config is used for local migrations, not at runtime
export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const { Pool } = await import("pg");
      
      const pool = new Pool({ 
        connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL 
      });
      
      return new PrismaPg(pool);
    },
  },
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);
