import React, { useState, useEffect, useRef } from "react";
import PostCard from "../components/PostCard";
import { useAppSelector } from "../redux/hooks/hooks";
import api from "../assets/data/api";

function Feed() {
  const user = useAppSelector((state) => state.user);
  const token: any = sessionStorage.getItem("token");
  const header = { headers: { Authorization: `Bearer ${token}` } };
  const feedRef = useRef<HTMLDivElement>(null);
  const [userFeed, setUserFeed] = useState<any>({ feeds: [] });
  const [addFeedTrigger, setAddFeedTrigger] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(userFeed.feeds.length === 0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalFeed, setTotalFeed] = useState<any>(0);
  const [noPostTrigger, setNoPostTrigger] = useState<boolean>(false);

  useEffect(() => {
    const getIds = userFeed.feeds.map((feed: any) => {
      return feed.post_id;
    });

    const getUserFeed = async () => {
      try {
        const response = await api.post(
          "users/feed",
          { post_id_arr: getIds },
          header
        );
        return setUserFeed({ feeds: [...userFeed.feeds, ...response.data.feed] });
      } catch (error) {
        console.log(error);
        return;
      } finally {
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    };

    getUserFeed();
  }, [addFeedTrigger]);

  useEffect(() => {
    const win: Window = window;
    const isBottom = (element: any) => { return element.getBoundingClientRect().bottom <= window.innerHeight; };

    const promptState = () => {
      setAddFeedTrigger(true);
      setIsLoading(true);
    };

    const getTotalFeed = async () => {
      try {
        const response = await api.get("users/feed/count", header);
        return setTotalFeed(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const onScroll: EventListener = (event: Event) => {
      const feedLength = userFeed.feeds.length;
      if (isBottom(feedRef.current)) {
        if (totalFeed <= feedLength) {
          getTotalFeed();
          if (totalFeed <= feedLength) return setNoPostTrigger(true);
          promptState();
        } else {
          promptState();
        }
      }
    };

    win?.addEventListener("scroll", onScroll);
    return () => win?.removeEventListener("scroll", onScroll);
  }, []);

  if (isFirstLoad) return <></>;

  return (
    <div ref={feedRef} className="feed-container">
      {userFeed.feeds?.map((feed: any) => {
        return <PostCard postData={feed} />;
      })}
      {noPostTrigger && <>No Post To Show</>}
    </div>
  );
}

export default Feed;
