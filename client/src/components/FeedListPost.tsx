import React from 'react'
import PostCard from './PostCard';

type FeedListPostProps = {
  feeds: { feed: any[] };
};

function FeedListPost({ feeds }: FeedListPostProps) {
  return (
    <React.Fragment>
      {feeds.feed.length ? (
        feeds.feed?.map((feed: any, index: number) => (
          <PostCard
            postData={feed}
            key={index}
          />
        ))
      ) : (
        <>No Post To Show</>
      )}
    </React.Fragment>
  );
}

export default FeedListPost
