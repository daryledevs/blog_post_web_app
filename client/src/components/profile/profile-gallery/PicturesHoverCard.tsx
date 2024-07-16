export interface PicturesHoverCardProps {
  picture: any;
  alt: string;
  className: string;
  count: number;
}

function PicturesHoverCard({
  picture,
  alt,
  className,
  count,
}: PicturesHoverCardProps) {
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
