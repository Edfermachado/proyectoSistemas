import { db } from "./src/db/index";
import 'dotenv/config';

async function main() {
  try {
    console.log("Running query...");
    const result = await db.query.users.findMany({
      with: { tenant: true },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
    console.log("Success:", result.length);
  } catch (err: any) {
    console.error("RAW ERROR:", err);
  }
  process.exit(0);
}
main();
