import { useState, useCallback, useRef }  from "react";
import Cropper                            from "react-easy-crop";
import { useLocation }                    from "react-router-dom";
import ImageUploading, { ImageListType }  from "react-images-uploading";
import { Area }                           from "react-easy-crop/types";

import api                                from "@/config/api";
import { useGetUserDataQuery }            from "@/redux/api/userApi";
import { navigatedPage, selectSidebar }   from "@/redux/slices/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

import close                              from "@/assets/icons/close-modal.png";
import image_gallery                      from "@/assets/icons/image-gallery.png";
import arrow_left                         from "@/assets/icons/left-arrow.png";
import avatar                             from "@/assets/icons/avatar.png";

export interface IEGetCroppedImg {
  image: any;
  crop: any;
  fileName: string;
}

function CreatePost() {
  let rootElement: HTMLElement = document.querySelector<HTMLElement>("div")!;
  const win: Window = window;

  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const sidebarState = useAppSelector(selectSidebar);

  const userDataApi = useGetUserDataQuery();
  const user = userDataApi?.data?.user;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [next, setNext] = useState("Crop");
  const [zoom, setZoom] = useState(1);
  const [images, setImage] = useState<any[]>([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [imageToUpload, setImageToUpload] = useState<any>(null);
  const [imageToShare, setImageToShare] = useState<any>(null);
  const [caption, setCaption] = useState<string>("");

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedArea, setCroppedArea] = useState<any>({ width: 0, height: 0 });

  function getImage(imageList: ImageListType) {
    setImage(imageList as never);
  }

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedArea);
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      // reference for to avoid cross-origin issues on CodeSandbox
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  async function getCroppedImg({ image, crop, fileName }: IEGetCroppedImg) {
    const imageHtml: HTMLImageElement = await createImage(image);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set the size of the cropped canvas
    canvas.width = crop.width;
    canvas.height = crop.height;

    if (!ctx) return;

    // Draw the cropped image onto the new canvas
    ctx.drawImage(
      imageHtml,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    // reference for returning a Base64 string
    // return croppedCanvas.toDataURL('image/jpeg');

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        // to fix this error "Property 'name' does not exist on type 'Blob'"
        const file = new File([blob], fileName, { type: "image/jpeg" }); //  use the type File that extends Blob.
        setImageToUpload({ image: file });
        resolve(window.URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  }

  async function handleOnClick() {
    if (next === "Crop") {
      const response = await getCroppedImg({
        image: images[0].dataURL,
        crop: croppedAreaPixels,
        fileName: images[0].file.name,
      });
      setImageToShare(response);
      setNext("Post");
    }
    if (next === "Post") await onSubmit();
  }

  async function onSubmit() {
    try {
      if (!user?.uuid) {
        throw new Error("User not found");
      }

      const form = new FormData();
      form.append("img", imageToUpload.image as File);
      form.append("caption", caption);
      form.append("userUuid", user?.uuid);
      await api.post("/posts", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(
        navigatedPage({
          previous: sidebarState.current,
          current: "Create",
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  // useEffect(() => {
  // document.body.classList.add("scrollView");
  // rootElement.style.overflowY = "scroll";
  // const onScroll: EventListener = (event: Event) => event.preventDefault();
  // rootElement?.addEventListener("wheel", onScroll);

  // return () => {
  //   rootElement?.removeEventListener("wheel", onScroll);
  //   rootElement.style.removeProperty("overflow-y");
  //   document.body.classList.remove("scrollView");
  // };
  // }, []);

  if (userDataApi.isLoading || sidebarState.current !== "Create") return null;

  return (
    <div className="create-post__parent">
      <img
        src={close}
        alt=""
        className="create-post__close-modal"
        onClick={() =>
          dispatch(
            navigatedPage({
              previous: sidebarState.current,
              current: sidebarState.previous,
            })
          )
        }
      />

      <div
        className={
          next === "Crop"
            ? "create-post__container"
            : "create-post__new-post-container"
        }
      >
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
                onClick={async () => {
                  if (next === "Crop") setImage([]);
                  if (next === "Post") setNext("Crop");
                }}
              />
              <p>{next === "Crop" ? "Crop" : "Create new post"}</p>
              <p
                onClick={handleOnClick}
                style={{ color: "rgba(0, 149, 246)", cursor: "pointer" }}
              >
                {next === "Post" ? "Share" : "Next"}
              </p>
            </div>
          )}
        </div>

        <div style={{ height: "100%", position: "relative" }}>
          {images.length === 0 ? (
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
                    <img
                      src={image_gallery}
                      className="create-post__gallery-icon"
                      alt=""
                    />
                    <p>Click or Drop here</p>
                    <button
                      className="create-post__select-image-btn"
                      onClick={onImageUpload}
                    >
                      Select from computer
                    </button>
                  </div>
                );
              }}
            </ImageUploading>
          ) : null}

          {images.length && next === "Crop" ? (
            <Cropper
              image={images[0].dataURL}
              crop={crop}
              zoom={zoom}
              aspect={
                // crop size depending on the image dimension
                croppedArea.width > croppedArea.height ? 10 / 9 : 12 / 11
              }
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit={
                croppedArea.width > croppedArea.height
                  ? "horizontal-cover"
                  : "vertical-cover"
              }
            />
          ) : null}

          {images.length && next === "Post" ? (
            <div className="create-post__post-container">
              <img
                src={imageToShare}
                style={{ width: "60%" }}
                alt=""
              />
              <div className="create-post__post-meta">
                <div className="create-post__post-user">
                  <div>
                    <img
                      src={user?.avatarUrl ? user?.avatarUrl : avatar}
                      alt=""
                    />
                  </div>
                  <p>{user?.username}</p>
                </div>
                <textarea
                  defaultValue={caption}
                  ref={textareaRef}
                  maxLength={2200}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Write a caption here..."
                ></textarea>
                <p>{caption.length}/2200</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
