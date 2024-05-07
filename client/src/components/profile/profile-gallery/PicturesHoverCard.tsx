function PicturesHoverCard({ picture, alt, className, count }: any) {
  return (
    <div className="pictures-hover-card">
      <img
        src={picture}
        alt={alt}
        className={className}
      />
      <p>{count}</p>
    </div>
  );
}

export default PicturesHoverCard;
