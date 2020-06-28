import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";

function ImageUploadForm({ imageInput, setImageInput }) {
  const { setPreviewImg } = useContext(ProfileContext);
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorImage, setErrorImage] = useState(false);

  // removing unused preview image on unmount caused bugs
  // current fix is using local storage to remove on mount
  useEffect(() => {
    if (localStorage.getItem("image_id")) {
      let id = localStorage.getItem("image_id");
      localStorage.removeItem("image_id");
      httpClient("POST", "/api/delete-image", {
        id
      });
    }
    return () => {
      setPreviewImg({ image: "", id: "" });
    };
  }, [setPreviewImg]);

  async function onImageInputChange(e) {
    if (e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const data = new FormData();
    data.append("image", file);
    setLoadingImage(true);

    const [res, err] = await httpClient("POST", "/api/upload-image", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setLoadingImage(false);
      setErrorImage(true);
      return;
    }

    if (imageInput.id) {
      httpClient("POST", "/api/delete-image", {
        id: imageInput.id
      });
    }

    localStorage.setItem("image_id", res.data.id);
    setPreviewImg(res.data);
    setImageInput(res.data);
    setLoadingImage(false);
    setErrorImage(false);
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
      {imageInput.image ? <p>Success!</p> : null}
    </div>
  );
}

export default ImageUploadForm;
