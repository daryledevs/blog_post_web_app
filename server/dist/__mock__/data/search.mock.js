"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecentSearch = void 0;
const faker_1 = require("@faker-js/faker");
const createRecentSearch = (user_id, search_user_id) => ({
    recent_id: faker_1.faker.number.int({ min: 1, max: 1000 }),
    user_id: user_id,
    search_user_id: search_user_id,
    create_time: new Date(faker_1.faker.date.past().toISOString()),
});
exports.createRecentSearch = createRecentSearch;
