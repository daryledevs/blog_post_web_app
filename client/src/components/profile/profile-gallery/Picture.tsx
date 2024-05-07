import PicturesHover from './PicturesHover';

function Picture({ image_url }: { image_url: string }) {
  return (
    <div
      className="picture"
      style={{ backgroundImage: `url(${image_url})` }}
    >
      <PicturesHover />
    </div>
  );
}

export default Picture
