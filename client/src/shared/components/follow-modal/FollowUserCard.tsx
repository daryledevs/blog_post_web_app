import FollowUserInfo     from "./FollowUserInfo";
import FollowUserAvatar   from "./FollowUserAvatar";
import FollowToggleButton from "./FollowToggleButton";

type FollowUserCardProps = {
  item: any;
  path: any;
  removedUsers: any;
  onClick: (userFollowId: number) => void;
};

function FollowUserCard({
  item,
  path,
  removedUsers,
  onClick,
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
          onClick={() => onClick(item.user_id)}
        />
      </div>
    </div>
  );
}

export default FollowUserCard;
