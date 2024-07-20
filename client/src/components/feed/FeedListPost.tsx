import React    from 'react'
import PostCard from './PostCard';

type FeedListPostProps = {
  feeds: { feed: any[] };
  userFeedStatus: string;
};

function FeedListPost({ feeds, userFeedStatus }: FeedListPostProps) {
  
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
        <p className="feed-list-post__no-post">No Post To Show</p>
      )}
    </React.Fragment>
  );
}

export default FeedListPost
