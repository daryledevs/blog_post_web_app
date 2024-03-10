function FollowToggleButton({ followId, fetchType, removedUsers, onClick }: any) {
  const isRemove = removedUsers?.includes(followId);
  const removedText = fetchType === "followers" ? "Removed" : "Follow";
  const notRemovedText = fetchType === "followers" ? "Remove" : "Following";
  const className = fetchType === "followers" ? "item-card__rmv-btn" : `item-card__${isRemove ? "rmv-flw" : "flw"}-btn`;

  return (
    <button
      disabled={fetchType === "followers" && isRemove}
      onClick={onClick}
      className={className}
    >
      {isRemove ? removedText : notRemovedText}
    </button>
  );
}

export default FollowToggleButton
