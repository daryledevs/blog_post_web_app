import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import close from "../../assets/icons/close-modal.png";
import image_gallery from "../../assets/icons/image-gallery.png";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Cropper from "react-easy-crop";
import arrow_left from "../../assets/icons/left-arrow.png";
import { Point, Area } from "react-easy-crop/types";

interface Modal {
  setClickedLink: (message: string) => void;
}

function CreatePost({ setClickedLink }: Modal) {
  let rootElement: HTMLElement = document.querySelector<HTMLElement>("div")!;
  const win: Window = window;

  const { pathname } = useLocation();
  const [zoom, setZoom] = useState(1);
  const [images, setImage] = useState<any[]>([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [dimension, setDimension] = useState({
    width: 0,
    height: 0,
  });

  function getImage(imageList: ImageListType) {
    setImage(imageList as never);
  }

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      console.log(croppedArea, croppedAreaPixels);
      setDimension(croppedArea);
    },
    []
  );

  useEffect(() => {
    // document.body.classList.add("scrollView");
    // rootElement.style.overflowY = "scroll";
    // const onScroll: EventListener = (event: Event) => event.preventDefault();
    // rootElement?.addEventListener("wheel", onScroll);

    // return () => {
    //   rootElement?.removeEventListener("wheel", onScroll);
    //   rootElement.style.removeProperty("overflow-y");
    //   document.body.classList.remove("scrollView");
    // };
  }, []);

  return (
    <div className="create-post__parent">
      <img
        src={close}
        alt=""
        className="create-post__close-modal"
        onClick={() => setClickedLink(pathname)}
      />

      <div className="create-post__container">
        <div className="create-post__header">
          {images.length === 0 ? (
            <p>Create a new post</p>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flex: 1,
                margin: "0 10px 0 10px",
              }}
            >
              <img
                alt=""
                src={arrow_left}
                style={{ width: 24, cursor: "pointer" }}
                onClick={() => {
                  setImage([]);
                }}
              />
              <p>Crop</p>
              <p style={{ color: "rgba( 0, 149, 246)", cursor: "pointer" }}>
                Next
              </p>
            </div>
          )}
        </div>

        <ImageUploading
          multiple
          value={images}
          onChange={getImage}
          maxNumber={5}
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => {
            return (
              <div
                className="create-post__image-container"
                // allowing the user to drag the image from computer to the container
                {...dragProps}
              >
                {images.length === 0 ? (
                  <>
                    <img
                      src={image_gallery}
                      className="create-post__gallery-icon"
                    />
                    <p>Click or Drop here</p>
                    <button
                      className="create-post__select-image-btn"
                      onClick={onImageUpload}
                    >
                      Select from computer
                    </button>
                  </>
                ) : (
                  <Cropper
                    image={images[0].dataURL}
                    crop={crop}
                    zoom={zoom}
                    aspect={
                      // crop size depending on the image dimension
                      dimension.width > dimension.height 
                      ? 10 / 9 : 12 / 11
                    }
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    objectFit={
                      dimension.width > dimension.height
                        ? "horizontal-cover"
                        : "vertical-cover"
                    }
                  />
                )}
              </div>
            );
          }}
        </ImageUploading>
      </div>
    </div>
  );
}

export default CreatePost;
