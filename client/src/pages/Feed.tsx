import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../redux/hooks/hooks";
import svg_loading from "../assets/icons/loading.svg";
import PostCard from "../components/PostCard";
import api from "../assets/data/api";

function Feed() {
  const heightDimension = 1300;
  const user = useAppSelector((state) => state.user);
  const token: any = sessionStorage.getItem("token");
  const header = { headers: { Authorization: `Bearer ${token}` } };
  const feedRef = useRef<HTMLDivElement>(null);
  const [userFeed, setUserFeed] = useState<any>({ feeds: [] });
  const [addFeedTrigger, setAddFeedTrigger] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(userFeed.feeds.length === 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalFeed, setTotalFeed] = useState<any>(0);
  const [noPostTrigger, setNoPostTrigger] = useState<boolean>(false);

  useEffect(() => {
    const getIds = userFeed.feeds.map((feed: any) => { return feed.post_id; });
    const getUserFeed = async () => {
      try {
        const response = await api.post(
          "users/feed",
          { post_id_arr: getIds },
          header
        );
        setIsFirstLoad(false);
        setUserFeed(() => ({ feeds: [...userFeed.feeds, ...response.data.feed] }));
      } catch (error) {
        console.log(error);
        return;
      } finally {
        setIsFirstLoad(false);
      }
    };
    
   getUserFeed();
  }, [addFeedTrigger]);

  useEffect(() => {
    const win: Window = window;
    const stateTriggers = () => {setAddFeedTrigger(!addFeedTrigger); setIsLoading(true); };
    const isBottom = (element: any) => { return element.getBoundingClientRect().bottom <= heightDimension; };

    const getTotalFeed = async () => {
      try {
        const response = await api.get("users/feed/count", header);
        setIsLoading(false);
        return response.data.count;
      } catch (error) {
        console.log(error);
      }
    };

    const onScroll: EventListener = (event: Event) => {
      if (isBottom(feedRef.current)) {
        const feedLength = userFeed.feeds.length;

        // The purpose is to prevent the website to request every single time
        if (totalFeed <= feedLength) {
          getTotalFeed()
            .then((response) => {
              if (response > feedLength) {
                setTotalFeed(response);
                stateTriggers();
              } else {
                setNoPostTrigger(true);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setNoPostTrigger(false);
          stateTriggers();
        }
      }
    };

    win?.addEventListener("scroll", onScroll);
    return () => win?.removeEventListener("scroll", onScroll);

    // Put userFeed here to let this handler know 
    // that it has a new data update.
  }, [userFeed]);

  if (isFirstLoad) return <></>;

  return (
    <div
      ref={feedRef}
      className={`feed-container ${isLoading && "test"}`}
    >
      {userFeed.feeds?.map((feed: any) => {
        return <PostCard postData={feed} key={feed.post_id} />;
      })}
      {isLoading ? (
        <img src={svg_loading} className="img-loading"/>
      ) : (
        noPostTrigger && <>No Post To Show</>
      )}
    </div>
  );
}

export default Feed;
