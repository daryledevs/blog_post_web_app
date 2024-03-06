import FollowCloseModal from './FollowCloseModal';

function capitalizedFetch(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function FollowModalTitle({ path }:any) {
  return (
    <div className="follow-modal__title">
      <p>{capitalizedFetch(path)}</p>
      <FollowCloseModal />
    </div>
  );
}

export default FollowModalTitle
