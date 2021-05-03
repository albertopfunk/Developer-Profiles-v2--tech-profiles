import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import ImagePreview from "./ImagePreview";
import ImageUploadForm from "./ImageUpload";

function ImageBox({ setImageChange }) {
  const { user, userImage, setUserImage } = useContext(ProfileContext);

  const avatarRadioRefs = useRef({
    "blue-1": React.createRef(),
    "redblue-1": React.createRef(),
    "whitegreen-1": React.createRef(),
    "greenblack-1": React.createRef(),
    "white-1": React.createRef(),
    "greenwhite-1": React.createRef(),
  });

  useEffect(() => {
    return () => {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
    };
  }, []);

  function setSelectedAvatar(value) {
    const urlStart =
      "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

    // no need to set saved avatar
    if (`${urlStart}${value}.svg` === user.avatar_image) {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: userImage.removeUserImage,
        removeSavedAvatar: false,
      });
      setImageChange(userImage.removeUserImage);

      return;
    }

    setUserImage({
      ...userImage,
      previewAvatar: `${urlStart}${value}.svg`,
    });
    setImageChange(true);
  }

  function setImageUpload(image) {
    setUserImage({
      ...userImage,
      previewImage: image,
    });
    setImageChange(true);
  }

  // top most layer, 5
  function removeUploadedImage() {
    const { previewAvatar } = userImage;

    // layer 4
    // fallback to selected avatar
    // remove image upload
    if (previewAvatar) {
      setUserImage({
        ...userImage,
        previewImage: "",
      });
      setImageChange(true);

      return;
    }

    // layer 3
    // fallback to user image with reset
    if (user.profile_image) {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setImageChange(false);

      return;
    }

    // layer 2
    // fallback to avatar image and select correct radio with reset
    if (user.avatar_image) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      for (const avatarRadio in avatarRadioRefs.current) {
        const { value } = avatarRadioRefs.current[avatarRadio].current;
        if (user.avatar_image === `${urlStart}${value}.svg`) {
          avatarRadioRefs.current[avatarRadio].current.checked = true;
        } else {
          avatarRadioRefs.current[avatarRadio].current.checked = false;
        }
      }

      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setImageChange(false);

      return;
    }

    // layer 1
    // set selected avatar if any radio is selected
    // remove image upload
    let checkedAvatar = null;
    for (const avatarRadio in avatarRadioRefs.current) {
      if (avatarRadioRefs.current[avatarRadio].current.checked) {
        checkedAvatar = avatarRadioRefs.current[avatarRadio].current.value;
      }
    }

    if (checkedAvatar) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      setUserImage({
        previewImage: "",
        previewAvatar: `${urlStart}${checkedAvatar}.svg`,
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setImageChange(true);

      return;
    }

    // layer 0, default reset
    setUserImage({
      previewImage: "",
      previewAvatar: "",
      removeUserImage: false,
      removeSavedAvatar: false,
    });
    setImageChange(false);
  }

  // layer 4
  function removeSelectedAvatar() {
    // layer 3
    // fallback to user image with reset
    if (user.profile_image) {
      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setImageChange(false);

      return;
    }

    // layer 2
    // fallback to avatar image and select correct radio with reset
    if (user.avatar_image) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      console.log(avatarRadioRefs.current);
      for (const avatarRadio in avatarRadioRefs.current) {
        const { value } = avatarRadioRefs.current[avatarRadio].current;
        if (user.avatar_image === `${urlStart}${value}.svg`) {
          avatarRadioRefs.current[avatarRadio].current.checked = true;
        } else {
          avatarRadioRefs.current[avatarRadio].current.checked = false;
        }
      }

      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: false,
        removeSavedAvatar: false,
      });
      setImageChange(false);

      return;
    }

    // layer 1 && default
    // unselect radios with reset
    for (const avatarRadio in avatarRadioRefs.current) {
      avatarRadioRefs.current[avatarRadio].current.checked = false;
    }

    setUserImage({
      previewImage: "",
      previewAvatar: "",
      removeUserImage: false,
      removeSavedAvatar: false,
    });
    setImageChange(false);
  }

  // layer 3
  function removeUserImage() {
    // layer 2
    // fallback to avatar image and select correct radio with reset
    // set remove user image
    if (user.avatar_image) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      for (const avatarRadio in avatarRadioRefs.current) {
        const { value } = avatarRadioRefs.current[avatarRadio].current;
        if (user.avatar_image === `${urlStart}${value}.svg`) {
          avatarRadioRefs.current[avatarRadio].current.checked = true;
        } else {
          avatarRadioRefs.current[avatarRadio].current.checked = false;
        }
      }

      setUserImage({
        previewImage: "",
        previewAvatar: "",
        removeUserImage: true,
        removeSavedAvatar: false,
      });
      setImageChange(true);

      return;
    }

    // layer 1
    // set selected avatar if any radio is selected
    // set remove user image
    let checkedAvatar = null;
    for (const avatarRadio in avatarRadioRefs.current) {
      if (avatarRadioRefs.current[avatarRadio].current.checked) {
        checkedAvatar = avatarRadioRefs.current[avatarRadio].current.value;
      }
    }

    if (checkedAvatar) {
      const urlStart =
        "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/";

      setUserImage({
        previewImage: "",
        previewAvatar: `${urlStart}${checkedAvatar}.svg`,
        removeUserImage: true,
        removeSavedAvatar: false,
      });
      setImageChange(true);

      return;
    }

    // layer 0, default reset
    // set remove user image
    setUserImage({
      previewImage: "",
      previewAvatar: "",
      removeUserImage: true,
      removeSavedAvatar: false,
    });
    setImageChange(true);
  }

  // layer 2
  function removeSavedAvatar() {
    // layer 1 && default
    // unselect radios with reset
    // set remove saved avatar
    for (const avatarRadio in avatarRadioRefs.current) {
      avatarRadioRefs.current[avatarRadio].current.checked = false;
    }

    setUserImage({
      previewImage: "",
      previewAvatar: "",
      removeUserImage: userImage.removeUserImage,
      removeSavedAvatar: true,
    });
    setImageChange(true);
  }

  return (
    <ImageBoxContainer>
      <div className="grid-container">
        <div className="image-upload-container">
          <ImageUploadForm userId={user.id} setImageInput={setImageUpload} />
          <ImagePreview
            uploadedImage={userImage.previewImage}
            removeUploadedImage={removeUploadedImage}
            selectedAvatar={userImage.previewAvatar}
            removeSelectedAvatar={removeSelectedAvatar}
            savedUserImage={!userImage.removeUserImage && user.profile_image}
            removeSavedUserImage={removeUserImage}
            savedAvatar={!userImage.removeSavedAvatar && user.avatar_image}
            removeSavedAvatar={removeSavedAvatar}
          />
        </div>

        <fieldset
          disabled={
            userImage.previewImage ||
            (user.profile_image && !userImage.removeUserImage)
          }
        >
          <legend>Choose an avatar image:</legend>

          {/* avatars main container */}
          <div className="flex-container">
            <div className="flex-item">
              <label htmlFor="blue-1">
                <input
                  ref={avatarRadioRefs.current["blue-1"]}
                  type="radio"
                  name="profile-avatar"
                  id="blue-1"
                  value="blue-1"
                  defaultChecked={
                    user.avatar_image ===
                    "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/blue-1.svg"
                  }
                  onClick={(e) => setSelectedAvatar(e.target.value)}
                />
                Blue female avatar, medium skin tone, pink hair
              </label>
            </div>
            <div className="flex-item">
              <label htmlFor="redblue-1">
                <input
                  ref={avatarRadioRefs.current["redblue-1"]}
                  type="radio"
                  name="profile-avatar"
                  id="redblue-1"
                  value="redblue-1"
                  defaultChecked={
                    user.avatar_image ===
                    "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/redblue-1.svg"
                  }
                  onClick={(e) => setSelectedAvatar(e.target.value)}
                />
                Red and blue female avatar, light skin tone, red hair
              </label>
            </div>
            <div className="flex-item">
              <label htmlFor="whitegreen-1">
                <input
                  ref={avatarRadioRefs.current["whitegreen-1"]}
                  type="radio"
                  name="profile-avatar"
                  id="whitegreen-1"
                  value="whitegreen-1"
                  defaultChecked={
                    user.avatar_image ===
                    "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/whitegreen-1.svg"
                  }
                  onClick={(e) => setSelectedAvatar(e.target.value)}
                />
                White and green male avatar, dark skin tone, black hair
              </label>
            </div>
            <div className="flex-item">
              <label htmlFor="greenblack-1">
                <input
                  ref={avatarRadioRefs.current["greenblack-1"]}
                  type="radio"
                  name="profile-avatar"
                  id="greenblack-1"
                  value="greenblack-1"
                  defaultChecked={
                    user.avatar_image ===
                    "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/greenblack-1.svg"
                  }
                  onClick={(e) => setSelectedAvatar(e.target.value)}
                />
                green and black female avatar, medium skin tone, black hair
              </label>
            </div>
            <div className="flex-item">
              <label htmlFor="white-1">
                <input
                  ref={avatarRadioRefs.current["white-1"]}
                  type="radio"
                  name="profile-avatar"
                  id="white-1"
                  value="white-1"
                  defaultChecked={
                    user.avatar_image ===
                    "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/white-1.svg"
                  }
                  onClick={(e) => setSelectedAvatar(e.target.value)}
                />
                White male avatar, light skin tone, blue hair
              </label>
            </div>
            <div className="flex-item">
              <label htmlFor="greenwhite-1">
                <input
                  ref={avatarRadioRefs.current["greenwhite-1"]}
                  type="radio"
                  name="profile-avatar"
                  id="greenwhite-1"
                  value="greenwhite-1"
                  defaultChecked={
                    user.avatar_image ===
                    "https://res.cloudinary.com/dy5hgr3ht/image/upload/v1618796810/tech-pros-v1-avatars/greenwhite-1.svg"
                  }
                  onClick={(e) => setSelectedAvatar(e.target.value)}
                />
                Green and white male avatar, light skin tone, black hair
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </ImageBoxContainer>
  );
}

const ImageBoxContainer = styled.div`
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);

  .grid-container {
    display: grid;
    overflow-x: auto;
    grid-template-columns: 1fr auto;
  }

  fieldset {
    border: none;

    .flex-container {
      display: flex;
      gap: 20px;

      .flex-item {
        width: 100px;
        height: auto;
      }
    }
  }
`;

export default ImageBox;
