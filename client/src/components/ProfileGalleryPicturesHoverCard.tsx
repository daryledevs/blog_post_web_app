function ProfileGalleryPicturesCard({ picture, alt, className, count }: any) {
  return (
    <div className="profile-gallery__hover">
      <img
        src={picture}
        alt={alt}
        className={className}
      />
      <p>{count}</p>
    </div>
  );
}

export default ProfileGalleryPicturesCard;
