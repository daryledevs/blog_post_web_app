"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSearchList = exports.createRecentSearch = void 0;
const faker_1 = require("@faker-js/faker");
const createRecentSearch = () => ({
    recent_id: faker_1.faker.number.int({ min: 1, max: 1000 }),
    search_user_id: faker_1.faker.number.int({ min: 1, max: 1000 }),
    user_id: faker_1.faker.number.int({ min: 1, max: 1000 }),
    create_time: new Date(faker_1.faker.date.past().toISOString()),
});
exports.createRecentSearch = createRecentSearch;
const createSearchList = (count) => {
    return Array.from({ length: count }, createRecentSearch);
};
exports.createSearchList = createSearchList;
