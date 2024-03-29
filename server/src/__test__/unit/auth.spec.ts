import { sql }                                         from "kysely";
import { faker }                                       from "@faker-js/faker";
import UsersService                                    from "@/service/user/user.service.impl.js";
import UserRepository                                  from "@/repository/user/user.repository.impl.js";
import FollowRepository                                from "@/repository/follow/follow.repository.impl.js";
import RecentSearchesRepository                        from "@/repository/recent search/recent-search.repository.impl.js";
import { describe, test, expect, vi, Mock, afterEach } from "vitest";

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

describe("UserService", () => {
  test("should create an instance of UserService", () => {
    const userService: UsersService = new UsersService(
      new UserRepository(),
      new FollowRepository(),
      new RecentSearchesRepository()
    );
    expect(userService).toBeInstanceOf(userService);
  });
});
