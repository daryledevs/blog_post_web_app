import FollowUserAvatar from "./FollowUserAvatar";
import FollowUserInfo from "./FollowUserInfo";
import FollowToggleButton from "./FollowToggleButton";

type FollowUserCardProps = {
  item: any;
  path: any;
  removedUsers: any;
  removeUserHandler: (userFollowId: number) => void;
  addUserHandler: (userFollowId: number) => void;
};

function FollowUserCard({
  item,
  path,
  removedUsers,
  removeUserHandler,
  addUserHandler,
}: FollowUserCardProps) {
  return (
    <div className="item-card">
      <FollowUserAvatar avatar_url={item?.avatar_url} />
      <div className="item-card__item">
        <FollowUserInfo
          username={item.username}
          first_name={item.first_name}
          last_name={item.last_name}
        />
        <FollowToggleButton
          followId={item.user_id}
          fetchType={path}
          removedUsers={removedUsers}
          onClickRemove={() => removeUserHandler(item.user_id)}
          onClickAdd={() => addUserHandler(item.user_id)}
        />
      </div>
    </div>
  );
}

export default FollowUserCard;
