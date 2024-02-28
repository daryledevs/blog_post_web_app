import ProfileGalleryPictures from "./ProfileGalleryPictures";

const ProfileGallery = function ({ posts }: any) {
  return (
    <div className="profile-gallery__container">
      {posts.post.map((post: any, index: number) => (
        <ProfileGalleryPictures
          key={index}
          post={post}
        />
      ))}
    </div>
  );
};

export default ProfileGallery;
