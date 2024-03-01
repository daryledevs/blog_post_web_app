import React, { useState, useEffect } from "react";
import GridPost from "../components/ProfileGallery";
import { useGetExploreFeedQuery } from "../redux/api/feedApi";
import { useGetUserDataQuery } from "../redux/api/userApi";

type FeedApiData = {
  feed: any[]; 
};

type HoverData = {
  post_id: string | null; 
};

function Explore() {
  const [feedApi, setFeedApi] = useState<FeedApiData>({ feed: [] });
  const [hover, setHover] = useState<HoverData>({ post_id: null });

  const {
    data: userApiData,
    isLoading: isUserApiLoading,
    isError: isUserApiError,
    error: userApiError,
    isSuccess: isUserApiSuccess,
  } = useGetUserDataQuery({ person: ""});

  const {
    data: exploreApiData,
    isLoading: isExploreApiLoading,
    isError: isExploreApiError,
    error: exploreApiError,
    isSuccess: isExploreApiSuccess,
  } = useGetExploreFeedQuery(
    userApiData?.user?.user_id, {
    skip: !isUserApiSuccess,
  });

  useEffect(() => {
    if (isExploreApiLoading || isUserApiLoading) return;
    setFeedApi({ feed: exploreApiData?.data?.feed || [] });
  }, [exploreApiData, isExploreApiLoading, isUserApiLoading]);

  
  if (isUserApiError || isExploreApiError) {
    console.log("USER ERROR: ", userApiError, " EXPLORE ERROR: ", exploreApiError);
  }
  
  if (isExploreApiLoading || isUserApiLoading) return <></>;
  
  return (
    <div className="explore__container">
      <div className="explore__parent">
        {feedApi.feed && feedApi.feed.length ? (
          <GridPost posts={{ post: feedApi.feed }} hover={hover} setHover={setHover} />
        ) : (
          <p style={{ textAlign: "center", marginTop: "5vh" }}>No Post To Show</p>
        )}
      </div>
    </div>
  );
}

export default Explore;
