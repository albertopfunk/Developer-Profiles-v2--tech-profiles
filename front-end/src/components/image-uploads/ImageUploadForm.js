import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../../global/context/user-profile/ProfileContext";
import { httpClient } from "../http-requests/profile-dashboard";

function ImageUploadForm({ imageInput, setImageInput }) {
  const { setPreviewImg } = useContext(ProfileContext);
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorImage, setErrorImage] = useState(false);

  useEffect(() => {
    return () => {
      if (localStorage.getItem("img_prev")) {
        const imgPrev = localStorage.getItem("img_prev");
        localStorage.removeItem("img_prev");
        let imageToDelete = imgPrev;
        imageToDelete = imageToDelete.split(",");
        httpClient("POST", "/api/delete-image", {
          id: imageToDelete[1]
        });
      }
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

    const { url, id } = res.data;

    if (imageInput) {
      let imageToDelete = imageInput;
      imageToDelete = imageToDelete.split(",");
      httpClient("POST", "/api/delete-image", {
        id: imageToDelete[1]
      });
    }

    const imageInfo = `${url},${id}`;
    localStorage.setItem("img_prev", imageInfo);
    setPreviewImg(url);
    setImageInput(imageInfo);
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
      {imageInput ? <p>Success!</p> : null}
    </div>
  );
}

export default ImageUploadForm;
