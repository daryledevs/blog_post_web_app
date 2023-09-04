import React, { useState, useEffect } from "react";
import api from "../config/api";
import GridPost from "../components/GridPost";
import { useGetExploreFeedQuery, useGetUserDataQuery } from "../redux/api/FeedApi";
import { useFetchUserData } from "../redux/hooks/userApiHook";

function Explore() {
  const [feedApi, setFeedApi] = useState<any>({ feed: [] });
  const [hover, setHover] = useState<any>({ post_id: null });
  const userApiRequest = useFetchUserData();
  const exploreApiRequest: any = useGetExploreFeedQuery(
    userApiRequest.data?.user?.user_id, 
    { skip: !userApiRequest.isSuccess }
  );

  useEffect(() => {
    if (exploreApiRequest.isLoading || userApiRequest.isLoading) return;
    setFeedApi({ feed: exploreApiRequest.data?.feed });
  }, [exploreApiRequest, userApiRequest.isLoading]);


  if (exploreApiRequest.isLoading || userApiRequest.isLoading) return <></>;

  return (
    <div className="explore__container">
      <div className="explore__parent">
        {feedApi.feed && feedApi.feed.length ? (
          GridPost({
            posts: {
              post: feedApi.feed,
            },
            hover,
            setHover,
          })
        ) : (
          <p style={{ textAlign: "center", marginTop: "5vh" }}>
            No Post To Show
          </p>
        )}
      </div>
    </div>
  );
}

export default Explore;
