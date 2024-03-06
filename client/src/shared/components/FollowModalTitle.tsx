import React from 'react'
import FollowCloseModal from './FollowCloseModal';

function capitalizedFetch(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function FollowModalTitle({ state }:any) {
  return (
    <div className="follow-modal__title">
      <p>{capitalizedFetch(state.fetch)}</p>
      <FollowCloseModal />
    </div>
  );
}

export default FollowModalTitle
