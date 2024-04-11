import { faker }       from "@faker-js/faker";
import { SelectPosts } from "@/types/table.types";

const createPost = (user_id: number): SelectPosts => ({
  post_id: faker.number.int({ min: 1, max: 999 }),
  image_id: faker.string.uuid(),
  image_url: faker.image.url(),
  user_id: user_id,
  caption: faker.lorem.text(),
  privacy_level: faker.string.fromCharacters(["public", "private"]),
  post_date: new Date(faker.date.past().toISOString()),
});

export default createPost;