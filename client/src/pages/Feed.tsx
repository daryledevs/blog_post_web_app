import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import svg_loading from "../assets/icons/loading.svg";
import PostCard from "../components/PostCard";
import api from "../assets/data/api";
import { changeStatus, getFeeds, changeTime } from "../redux/reducer/feed";

function Feed() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const feeds = useAppSelector((state) => state.feed.feeds);
  const feedStatus = useAppSelector((state) => state.feed.feedStatus);
  const lastRequest = useAppSelector((state) => state.feed.lastRequest);

  const isMount = useRef(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const token: any = sessionStorage.getItem("token");
  const header = { headers: { Authorization: `Bearer ${token}` } };

  const [totalFeed, setTotalFeed] = useState<any>(0);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addFeedTrigger, setAddFeedTrigger] = useState<boolean>(false);
  const [noPostTrigger, setNoPostTrigger] = useState<boolean>(false);

  useEffect(() => {
    const win: Window = window;

    const getLastScroll = () => {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if(scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem("scrollPosition");
      }
    };

    const onScroll: EventListener = (event: Event) => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    getLastScroll();

    win?.addEventListener("scroll", onScroll);
    return () => win?.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if(feedStatus) return;

    const getIds = feeds.map((feed: any) => {
      return feed.post_id;
    });
    const getUserFeed = async () => {
      try {
        const response = await api.post(
          "users/feed",
          { post_ids: getIds },
          header
        );
        setIsFirstLoad(false);
        dispatch(getFeeds([...feeds, ...response.data.feed]));
      } catch (error) {
        console.log(error);
        return;
      } finally {
        setIsFirstLoad(false);
        dispatch(changeStatus(true));
      }
    };

    getUserFeed();
  }, [addFeedTrigger]);

  useEffect(() => {
    const win: Window = window;
    const heightDimension = 1300;
    const stateTriggers = () => {
      dispatch(changeStatus(false));
      setAddFeedTrigger(!addFeedTrigger);
      setIsLoading(false);
    };

    const isBottom = (element: any) => {
      return element.getBoundingClientRect().bottom <= heightDimension;
    };
    
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
      if(isBottom(feedRef.current)) {
        const feedLength = feeds.length;
        // The purpose is to prevent the website to request every single time
        if(totalFeed > feedLength && !noPostTrigger) {
          getTotalFeed()
            .then((response) => {
              if(response > feedLength) {
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
          const minutes = getMinutes();
          if(lastRequest && minutes < 5) return setNoPostTrigger(true);
          stateTriggers();
          const value = new Date();
          dispatch(changeTime(value.getTime()));
        }
      }
    };

    win?.addEventListener("scroll", onScroll);
    return () => win?.removeEventListener("scroll", onScroll);

    // Put userFeed here to let this handler know
    // that it has a new data update.
  }, [feeds]);

  function getMinutes() {
    const last = new Date(lastRequest);
    const current = new Date();
    const diff = Math.abs(last.valueOf() - current.valueOf());
    return Math.floor(diff / 1000 / 60);
  }

  if(isFirstLoad) return <img src={svg_loading} className="first-load" />;

  return (
    <div
      ref={feedRef}
      className={`feed-container ${isLoading && "test"}`}
    >
      {feeds?.map((feed: any) => {
        return (
          <PostCard
            postData={feed}
            key={feed.post_id}
          />
        );
      })}
      {isLoading ? (
        <img src={svg_loading} className="img-loading" />
      ) : (
        noPostTrigger && <>No Post To Show</>
      )}
    </div>
  );
}

export default Feed;
