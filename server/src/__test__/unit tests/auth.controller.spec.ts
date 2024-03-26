import db                                            from "../../database/database";
import { sql }                                       from "kysely";
import { faker }                                     from "@faker-js/faker";
import AuthRepository                                from "../../repository/auth-repository";
import { describe, it, expect, vi, Mock, afterEach } from "vitest";

let user = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  roles: faker.string.fromCharacters(["admin", "user"]),
  age: faker.number.int({ min: 18, max: 99 }),
  avatar_url: faker.image.avatar(),
  birthday: faker.date.past().toISOString(),
};

describe("AuthRepository", () => {
  afterEach(async () => {
    await sql`SET FOREIGN_KEY_CHECKS = 0`.execute(db);
    await sql`TRUNCATE USERS`.execute(db);
    await sql`SET FOREIGN_KEY_CHECKS = 1`.execute(db);
  });

  it("should create a user and return the user data", async () => {
    const result = await AuthRepository.createUser(user);
    expect(result).toEqual(expect.objectContaining(user));
  });
});
