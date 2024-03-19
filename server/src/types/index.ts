import UsersTable from "./users-table";
import FollowerTable from "./followers";
import ConversationTable from "./conversations";
import MessageTable from "./messages";
import PostTable from "./posts";
import LikeTable from "./likes";
import ResetPasswordTable from "./reset-password";
import RecentSearchTable from "./recent-searches";

interface Database {
  users: UsersTable;
  followers: FollowerTable;
  conversations: ConversationTable;
  messages: MessageTable;
  posts: PostTable;
  likes: LikeTable;
  recentSearches: RecentSearchTable;
  resetPasswordToken: ResetPasswordTable;
};

export default Database;