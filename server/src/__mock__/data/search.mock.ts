import { faker }          from "@faker-js/faker";
import { SelectSearches } from "@/types/table.types";

const createRecentSearch = (user_id: number, search_user_id: number): SelectSearches => ({
  recent_id: faker.number.int({ min: 1, max: 1000 }),
  user_id: user_id,
  search_user_id: search_user_id,
  create_time: new Date(faker.date.past().toISOString()),
});

export { createRecentSearch };