import React, { useState, forwardRef } from "react";
import useFetchLastScroll              from "@/hooks/useFetchLastScroll";
import useFetchFeedOnScroll            from "@/hooks/useFetchFeedOnScroll";

import FeedLoading                     from "@/components/feed/FeedLoading";
import FeedListPost                    from "@/components/feed/FeedListPost";

import { IPost }                      from "@/interfaces/interface";
import { useGetUserFeedMutation }      from "@/redux/api/feedApi";

type FeedProps = {
  feeds: { feed: IPost[] };
  userTotalFeedApi: any;
  setAddFeedTrigger: any;
};

const Feed = forwardRef((props: FeedProps, ref ) => {
    const { feeds, userTotalFeedApi, setAddFeedTrigger } = props;
    
    const [hasShownLoading, setHasShownLoading] = useState<boolean>(false);

    const [fetchUserFeed, userFeedApi] = useGetUserFeedMutation({
      fixedCacheKey: "feed-api",
    });

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
          <div className="feed-list">
            <FeedListPost
              feeds={feeds}
              userFeedStatus={userFeedApi.status}
            />
            <FeedLoading
              isLoading={userFeedApi.isLoading}
              className="img-loading"
            />
          </div>
        )}
      </div>
    );
  }
);

export default Feed;
