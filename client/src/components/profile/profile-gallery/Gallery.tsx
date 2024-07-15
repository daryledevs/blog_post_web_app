import GalleryPictures from "./GalleryPictures";

const ProfileGallery = function ({ posts }: any) {
  return (
    <div className="gallery">
      {posts?.length
        ? posts?.map((post: any, index: number) => (
            <GalleryPictures
              key={index}
              post={post}
            />
          ))
        : null}
    </div>
  );
};

export default ProfileGallery;
