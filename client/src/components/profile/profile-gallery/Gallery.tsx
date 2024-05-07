import GalleryPictures from "./GalleryPictures";

const ProfileGallery = function ({ posts }: any) {
  return (
    <div className="gallery">
      {posts.post.map((post: any, index: number) => (
        <GalleryPictures
          key={index}
          post={post}
        />
      ))}
    </div>
  );
};

export default ProfileGallery;
