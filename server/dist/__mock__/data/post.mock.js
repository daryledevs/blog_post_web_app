"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const createPost = (user_id) => ({
    post_id: faker_1.faker.number.int({ min: 1, max: 999 }),
    image_id: faker_1.faker.string.uuid(),
    image_url: faker_1.faker.image.url(),
    user_id: user_id,
    caption: faker_1.faker.lorem.text(),
    privacy_level: faker_1.faker.string.fromCharacters(["public", "private"]),
    post_date: new Date(faker_1.faker.date.past().toISOString()),
});
exports.default = createPost;
