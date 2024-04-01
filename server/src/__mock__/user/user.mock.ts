import { SelectUsers } from "@/types/table.types";
import { faker } from "@faker-js/faker";

const createUser = (): SelectUsers => ({
  user_id: faker.number.int({ min: 1, max: 1000 }),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  roles: faker.string.fromCharacters(["admin", "user"]),
  age: faker.number.int({ min: 18, max: 99 }),
  avatar_url: faker.image.avatar(),
  birthday: faker.date.past().toISOString(),
  created_at: new Date(faker.date.past().toISOString()),
});

const createUserList = (count: number): SelectUsers[] => {
  return Array.from({ length: count }, createUser);
};

export { createUser, createUserList };