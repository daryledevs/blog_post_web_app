import React                      from "react";
import heart                      from "@/assets/icons/heart-filled-white.png";
import comment                    from "@/assets/icons/comment-filled.png";
import ProfileGalleryPicturesCard from "./ProfileGalleryPicturesHoverCard";

const images = [
  {
    count: 0,
    picture: heart,
    alt: "heart icon",
    className: "profile-gallery__icon-heart",
  },
  {
    count: 0,
    picture: comment,
    alt: "comment icon",
    className: "profile-gallery__icon-comment",
  },
];

function ProfileGalleryPicturesHover() {
  return (
    <React.Fragment>
      {images.map((icon, index) => (
        <ProfileGalleryPicturesCard
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

export default ProfileGalleryPicturesHover;
