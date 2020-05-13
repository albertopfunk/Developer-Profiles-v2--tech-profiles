import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../../global/context/user-profile/ProfileContext";
import { deleteImage } from "../http-requests/profile-dashboard";

function ImageUploadForm({ imageInput, setImageInput }) {
  const { setPreviewImg } = useContext(ProfileContext);
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorImage, setErrorImage] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("img_prev")) {
      const imgPrev = localStorage.getItem("img_prev");
      localStorage.removeItem("img_prev");
      deleteImage(imgPrev);
    }
  }, []);

  useEffect(() => {
    return () => {
      setPreviewImg("");
    };
  }, [setPreviewImg]);

  async function onImageInputChange(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const data = new FormData();
    data.append("image", file);
    const XHR = new XMLHttpRequest();
    setLoadingImage(true);

    XHR.addEventListener("load", e => {
      if (e.target.status === 200) {
        if (imageInput) {
          deleteImage(imageInput);
        }
        const { url, id } = JSON.parse(e.target.response);
        const imageInfo = `${url},${id}`;
        localStorage.setItem("img_prev", imageInfo);
        setPreviewImg(url);
        setImageInput(imageInfo);
        setLoadingImage(false);
        setErrorImage(false);
      } else {
        console.error("Error uploading to cloudinary", e.target.statusText);
        setLoadingImage(false);
        setErrorImage(true);
      }
    });

    XHR.addEventListener("error", err => {
      console.error("Error uploading to cloudinary", err);
      setLoadingImage(false);
      setErrorImage(true);
    });

    XHR.open("POST", `${process.env.REACT_APP_SERVER}/api/upload-image`);
    XHR.send(data);
  }

  console.log("=====IMAGEUPLOADFORM + IMG INPUTTTT=====", imageInput);

  return (
    <div>
      <input
        type="file"
        name="image-upload"
        placeholder="Upload Image"
        onChange={e => onImageInputChange(e)}
      />
      {loadingImage ? <p>Loading...</p> : null}
      {errorImage ? <p>Error uploading image. Please try again</p> : null}
      {imageInput ? <p>Success!</p> : null}
    </div>
  );
}

export default ImageUploadForm;
