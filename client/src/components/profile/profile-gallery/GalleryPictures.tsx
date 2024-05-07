import Picture from "./Picture";

function GalleryPictures({ post }: any) {
  return (
    <div
      role="button"
      key={post?.post_id}
      className="gallery-pictures"
    >
      <Picture image_url={post?.image_url} />
    </div>
  );
}

export default GalleryPictures;
