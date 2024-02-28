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

const ProfileGallery = function ({ posts }: any) {
  return (
    <div className="profile-gallery__container">
      {posts.post.map((post: any, index: number) => (
        <div
          role="button"
          key={post?.post_id}
          className="profile-gallery__card"
        >
          <div
            className="profile-gallery__post-container"
            style={{ backgroundImage: `url(${post.image_url})` }}
          >
            {images.map((icon, index) => (
              <div className="profile-gallery__hover">
                <img
                  src={icon.picture}
                  alt={icon.alt}
                  className={icon.className}
                />
                <p>{icon.count}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileGallery;
