import React             from "react";
import heart             from "@/assets/icons/heart-filled-white.png";
import comment           from "@/assets/icons/comment-filled.png";
import PicturesHoverCard from "./PicturesHoverCard";

const images = [
  {
    count: 0,
    picture: heart,
    alt: "heart icon",
    className: "pictures-hover__icon-heart",
  },
  {
    count: 0,
    picture: comment,
    alt: "comment icon",
    className: "pictures-hover__icon-comment",
  },
];

function PicturesHover() {
  return (
    <React.Fragment>
      {images.map((icon, index) => (
        <PicturesHoverCard
          key={index}
          picture={icon.picture}
          alt={icon.alt}
          className={icon.className}
          count={icon.count}
        />
      ))}
    </React.Fragment>
  );
}

export default PicturesHover;
