import React from "react";
import heart from "../assets/icons/heart-filled-white.png";
import comment from "../assets/icons/comment-filled.png";

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
        <div
          key={index}
          className="profile-gallery__hover"
        >
          <img
            src={icon.picture}
            alt={icon.alt}
            className={icon.className}
          />
          <p>{icon.count}</p>
        </div>
      ))}
    </React.Fragment>
  );
}

export default ProfileGalleryPicturesHover;
