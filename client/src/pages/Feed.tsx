import React, { useState } from "react";
import useFetchLastScroll from "../hooks/useFetchLastScroll";
import FeedLoading from "../shared/components/FeedLoading";
import FeedListPost from "../components/FeedListPost";
import { IEPost } from "../interfaces/interface";

type FeedProps = {
  feeds: { feed: IEPost[] };
  feedRef: React.MutableRefObject<HTMLDivElement | null>;
  isFeedApiLoading: boolean;
  isFeedTotalApiLoading: boolean;
};

function Feed({
  feeds,
  feedRef,
  isFeedApiLoading,
  isFeedTotalApiLoading,
}: FeedProps) {
  useFetchLastScroll({ feedRef, feeds });
  const [hasShownLoading, setHasShownLoading] = useState<boolean>(false);

  if(!hasShownLoading) {
    return (
      <FeedLoading
        isLoading={isFeedApiLoading || isFeedTotalApiLoading}
        className="first-load"
        setHasShownLoading={setHasShownLoading}
      />
    );
  };

  return (
    <div
      ref={feedRef}
      className="feed-container"
    >
      <FeedListPost feeds={feeds} />
      <FeedLoading
        isLoading={isFeedApiLoading}
        className="img-loading"
      />
    </div>
  );
}

export default Feed;
