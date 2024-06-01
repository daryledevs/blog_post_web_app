import {
  SelectChatMembers,
  SelectConversations,
  SelectFollowers,
  SelectLikes,
  SelectMessages,
  SelectPosts,
  SelectSearches,
  SelectUsers,
}                from "@/types/table.types";
import { faker } from "@faker-js/faker";

class GenerateMockData {
  static generateMockData = (
    changeArg: boolean,
    list: any[],
    callback: Function
  ) => {
    return list.flatMap((u, i) => {
      let nextUser = list[i + 1];
      let nextUserId = nextUser ? nextUser.id : u.id;

      const args = changeArg ? [nextUserId, u.id] : [u.id, nextUserId];

      return callback(args[0], args[1]);
    });
  };

  static createUser = (): SelectUsers => ({
    id: faker.number.int({ min: 1, max: 999 }),
    uuid: faker.string.uuid(),
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

  static createUserList = (count: number): SelectUsers[] => {
    return Array.from({ length: count }, this.createUser);
  };

  static createFollower = (
    follower_id: number,
    followed_id: number
  ): SelectFollowers => ({
    follower_id: follower_id,
    followed_id: followed_id,
    created_at: new Date(faker.date.past().toISOString()),
  });

  static createRecentSearch = (
    searcher_id: number,
    searched_id: number
  ): SelectSearches => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    uuid: faker.string.uuid(),
    searcher_id: searcher_id,
    searched_id: searched_id,
    created_at: new Date(faker.date.past().toISOString()),
  });

  static createPost = (user_id: number): SelectPosts => ({
    id: faker.number.int({ min: 1, max: 999 }),
    uuid: faker.string.uuid(),
    image_id: faker.string.uuid(),
    image_url: faker.image.url(),
    user_id: user_id,
    caption: faker.lorem.text(),
    privacy_level: faker.string.fromCharacters(["public", "private"]),
    created_at: new Date(faker.date.past().toISOString()),
  });

  static createLike = (user_id: number, post_id: number): SelectLikes => ({
    id: faker.number.int({ min: 1, max: 999 }),
    uuid: faker.string.uuid(),
    user_id: user_id,
    post_id: post_id,
    created_at: new Date(faker.date.past().toISOString()),
  });

  static createConversation = (): SelectConversations => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    uuid: faker.string.uuid(),
    created_at: new Date(faker.date.past().toISOString()),
  });

  static createConversationMembers = (
    user_id: number,
    conversation_id: number,
  ): SelectChatMembers => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    uuid: faker.string.uuid(),
    user_id: user_id,
    conversation_id: conversation_id,
    joined_at: new Date(faker.date.past().toISOString()),
  });

  static createMessage = (
    user_id: number,
    conversation_id: number,
  ): SelectMessages => ({
    id: faker.number.int({ min: 1, max: 1000 }),
    uuid: faker.string.uuid(),
    sender_id: user_id,
    conversation_id: conversation_id,
    text_message: faker.lorem.text(),
    time_sent: new Date(faker.date.past().toISOString()),
  });
};

export default GenerateMockData;