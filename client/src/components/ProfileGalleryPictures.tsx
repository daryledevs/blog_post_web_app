import ProfileGalleryPicturesHover from "./ProfileGalleryPicturesHover";

function ProfileGalleryPictures({ post }: any) {
  return (
    <div
      role="button"
      key={post?.post_id}
      className="profile-gallery__card"
    >
      <div
        className="profile-gallery__post-container"
        style={{ backgroundImage: `url(${post.image_url})` }}
      >
        <ProfileGalleryPicturesHover />
      </div>
    </div>
  );
}

export default ProfileGalleryPictures;
