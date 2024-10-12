import FollowUserInfo     from "./FollowUserInfo";
import FollowUserAvatar   from "./FollowUserAvatar";
import FollowToggleButton from "./FollowToggleButton";

type FollowUserCardProps = {
  item: any;
  path: any;
  removedUsers: any;
  onClick: (userFollowUuid: string) => void;
};

function FollowUserCard({
  item,
  path,
  removedUsers,
  onClick,
}: FollowUserCardProps) {
  return (
    <div className="item-card">
      <FollowUserAvatar avatarUrl={item?.avatarUrl} />
      <div className="item-card__item">
        <FollowUserInfo
          username={item.username}
          firstName={item.firstName}
          lastName={item.lastName}
        />
        <FollowToggleButton
          followId={item.userUuid}
          fetchType={path}
          removedUsers={removedUsers}
          onClick={() => onClick(item.userUuid)}
        />
      </div>
    </div>
  );
}

export default FollowUserCard;
