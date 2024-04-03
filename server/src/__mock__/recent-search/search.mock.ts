import { SelectSearches } from "@/types/table.types";
import { faker } from "@faker-js/faker";

const createRecentSearch = (): SelectSearches => ({
  recent_id: faker.number.int({ min: 1, max: 1000 }),
  search_user_id: faker.number.int({ min: 1, max: 1000 }),
  user_id: faker.number.int({ min: 1, max: 1000 }),
  create_time: new Date(faker.date.past().toISOString()),
});

const createSearchList = (count: number): SelectSearches[] => {
  return Array.from({ length: count }, createRecentSearch);
};

export { createRecentSearch, createSearchList };