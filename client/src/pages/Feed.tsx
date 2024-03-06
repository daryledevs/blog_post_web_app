import React, { useState, forwardRef } from "react";
import useFetchLastScroll from "../hooks/useFetchLastScroll";
import useFetchFeedOnScroll from "../hooks/useFetchFeedOnScroll";
import FeedLoading from "../shared/components/FeedLoading";
import FeedListPost from "../components/FeedListPost";
import { IEPost } from "../interfaces/interface";
import { useGetUserFeedMutation } from "redux/api/feedApi";

type FeedProps = {
  feeds: { feed: IEPost[] };
  userTotalFeedApi: any;
  setAddFeedTrigger: any;
};

const Feed = forwardRef(
  (
    {
      feeds,
      userTotalFeedApi,
      setAddFeedTrigger,
    }: FeedProps,
    ref 
  ) => {
    const [hasShownLoading, setHasShownLoading] = useState<boolean>(false);
    const [fetchUserFeed, userFeedApi] = useGetUserFeedMutation({ fixedCacheKey: "shared-update-post" });

    useFetchLastScroll({
      feedRef: ref as React.RefObject<HTMLDivElement>,
      feeds,
    });

    useFetchFeedOnScroll({
      feeds,
      feedRef: ref as React.RefObject<HTMLDivElement>,
      userTotalFeedApi,
      fetchUserFeed,
      setAddFeedTrigger,
    });

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="feed-container"
      >
        {!hasShownLoading ? (
          <FeedLoading
            isLoading={userFeedApi.isLoading || userTotalFeedApi.isLoading}
            className="first-load"
            setHasShownLoading={setHasShownLoading}
          />
        ) : (
          <React.Fragment>
            <FeedListPost
              feeds={feeds}
              userFeedStatus={userFeedApi.status}
            />
            <FeedLoading
              isLoading={userFeedApi.isLoading}
              className="img-loading"
            />
          </React.Fragment>
        )}
      </div>
    );
  }
);

export default Feed;
