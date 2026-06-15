import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { initSchema } from "./schema";
import db from "./connection";

const SEED_COUNT = 500;

const HOBBIES = [
  "reading",
  "cycling",
  "photography",
  "cooking",
  "hiking",
  "gaming",
  "painting",
  "yoga",
  "gardening",
  "swimming",
  "running",
  "travelling",
  "knitting",
  "chess",
  "dancing",
  "fishing",
  "surfing",
  "birdwatching",
  "woodworking",
  "meditation",
  "rock climbing",
  "archery",
  "pottery",
  "astronomy",
  "martial arts",
];

function ensureDataDir(): void {
  const dataDir = path.resolve(__dirname, "../../data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function seed(): void {
  ensureDataDir();
  initSchema();

  const existingCount = (db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
  if (existingCount > 0) {
    console.log(`Database already seeded with ${existingCount} users. Skipping.`);
    return;
  }

  const insertUser = db.prepare(`
    INSERT INTO users (avatar, first_name, last_name, age, nationality)
    VALUES (@avatar, @first_name, @last_name, @age, @nationality)
  `);

  const insertHobby = db.prepare(`
    INSERT OR IGNORE INTO hobbies (name) VALUES (@name)
  `);

  const getHobbyId = db.prepare(`
    SELECT id FROM hobbies WHERE name = @name
  `);

  const insertUserHobby = db.prepare(`
    INSERT OR IGNORE INTO user_hobbies (user_id, hobby_id) VALUES (@user_id, @hobby_id)
  `);

  // Pre-insert all hobbies
  for (const name of HOBBIES) {
    insertHobby.run({ name });
  }

  const runSeed = db.transaction(() => {
    for (let i = 0; i < SEED_COUNT; i++) {
      const userId = i + 1;

      const result = insertUser.run({
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 75 }),
        nationality: faker.location.country(),
      });

      const actualId = result.lastInsertRowid as number;

      const hobbyCount = faker.number.int({ min: 0, max: 10 });
      const shuffled = [...HOBBIES].sort(() => Math.random() - 0.5);
      const userHobbies = shuffled.slice(0, hobbyCount);

      for (const name of userHobbies) {
        const hobby = getHobbyId.get({ name }) as { id: number };
        insertUserHobby.run({ user_id: actualId, hobby_id: hobby.id });
      }
    }
  });

  runSeed();
  console.log(`Seeded ${SEED_COUNT} users successfully.`);
}

// Only run when executed directly (yarn seed), not when imported by the server
if (require.main === module) {
  seed();
}
