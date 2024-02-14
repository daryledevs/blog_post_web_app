import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import svg_loading from "../assets/icons/loading.svg";
import PostCard from "../components/PostCard";
import {  changeTime } from "../redux/reducer/feed";
import { useGetUserFeedMutation, useGetTotalFeedMutation } from "../redux/api/FeedApi";

function Feed() {
  const dispatch = useAppDispatch();
  const feedRef = useRef<HTMLDivElement>(null);
  const lastRequest = useAppSelector((state) => state.feed.lastRequest);

  const [getUserFeed, { data: feedApiData, isLoading, status: feedStatus }] = useGetUserFeedMutation();
  const [getTotalFeed, { data: totalFeedApiData, isLoading: isTotalFeedLoading, status: totalFeedStatus }] = useGetTotalFeedMutation({});

  const [addFeedTrigger, setAddFeedTrigger] = useState<boolean>(false);
  const [noPostTrigger, setNoPostTrigger] = useState<boolean>(false);
  const [hasShownLoading, setHasShownLoading] = useState<boolean>(false);
  const [feeds, setFeeds] = useState<any>({ feed: [] });

  useEffect(() => {
    if (feedStatus === "fulfilled") {
      setFeeds({ feed: [...feeds.feed, ...feedApiData.feed] });
    }
  }, [feedStatus]);

  useEffect(() => {
    const win: Window = window;
    getUserFeed({ post_ids: [] });
    getTotalFeed({});

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
  }, [getTotalFeed, getUserFeed]);

  useEffect(() => {
    if (feedStatus !== "fulfilled") return;

    const getIds = feeds.feed?.map((feed: any) => {
      return feed.post_id;
    });

    getUserFeed({ post_ids: [...getIds] });
  }, [addFeedTrigger]);

  useEffect(() => {
    const isBottom = (element: any) => {
      return element.scrollHeight - element.scrollTop === element.clientHeight;
    };

    const onScroll: EventListener = (event: Event) => {
      if (isBottom(feedRef.current)) {
        const feedLength = feeds.feed?.length ?? 0;
        // The purpose is to prevent the website to request every single time
        if (totalFeedApiData?.count > feedLength && !noPostTrigger) {
          getTotalFeed({});
          const getIds = feeds.feed?.map((post: any) => post.post_id);
          getUserFeed({ post_ids: [...getIds] });
          setAddFeedTrigger(!addFeedTrigger);
        } else {
          const minutes = getMinutes();
          if (lastRequest && minutes < 5) return setNoPostTrigger(true);
          const value = new Date();
          dispatch(changeTime(value.getTime()));
        }
      }
    };

    const currentFeedRef = feedRef.current;
    currentFeedRef?.addEventListener("scroll", onScroll);
    return () => currentFeedRef?.removeEventListener("scroll", onScroll);

    // Put userFeed here to let this handler know
    // that it has a new data update.
  }, [addFeedTrigger, feeds.feed, getTotalFeed, getUserFeed, totalFeedApiData?.count]);

  function getMinutes() {
    const last = new Date(lastRequest);
    const current = new Date();
    const diff = Math.abs(last.valueOf() - current.valueOf());
    return Math.floor(diff / 1000 / 60);
  }

  if ((isLoading || isTotalFeedLoading) && !hasShownLoading) {
    setHasShownLoading(true);
    return (
      <img
        src={svg_loading}
        className="first-load"
        alt=""
      />
    );
  }

  return (
    <div
      ref={feedRef}
      className={`feed-container ${isLoading && "test"}`}
    >
      {feeds.feed.length ? (
        feeds.feed.map((feed: any, index: number) => {
          return (
            <PostCard
              postData={feed}
              key={index}
            />
          );
        })
      ) : (
        <>No Post To Show</>
      )}

      {isLoading ? (
        <img
          src={svg_loading}
          className="img-loading"
          alt=""
        />
      ) : null}
    </div>
  );
}

export default Feed;
