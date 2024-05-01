import { useEffect } from "react";
import svg_loading   from "../../assets/icons/svg/loading.svg";

type FeedLoadingProps = {
  isLoading: boolean;
  className: string;
  setHasShownLoading?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | (() => null);
};

function FeedLoading({
  isLoading,
  className,
  setHasShownLoading,
}: FeedLoadingProps) {
  useEffect(() => {
    if (setHasShownLoading) setHasShownLoading(true);
  }, [isLoading, setHasShownLoading]);

  if (!isLoading) return null;

  return (
    <img
      src={svg_loading}
      className={className}
      alt=""
    />
  );
}

export default FeedLoading;
