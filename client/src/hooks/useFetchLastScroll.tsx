import { useEffect } from 'react'

type useFetchLastScrollProps = {
  feedRef: React.RefObject<HTMLDivElement>;
  feeds: { feed: any[] };
};

function useFetchLastScroll({ feedRef, feeds }: useFetchLastScrollProps) {
  useEffect(() => {
    const onScroll: EventListener = (event: Event) => {
      sessionStorage.setItem(
        "scrollPosition",
        feedRef.current?.scrollTop?.toString() ?? ""
      );
    };

    requestAnimationFrame(() => {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      feedRef.current?.scrollTo(0, parseInt(scrollPosition ?? "0"));
      setTimeout(() => sessionStorage.removeItem("scrollPosition"), 100);
    });

    const currentFeedRef = feedRef.current;
    currentFeedRef?.addEventListener("scroll", onScroll);
    return () => currentFeedRef?.removeEventListener("scroll", onScroll);
  }, [feedRef, feeds.feed]);
}

export default useFetchLastScroll
