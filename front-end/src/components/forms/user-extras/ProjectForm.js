import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as RemoveIcon } from "../../../global/assets/dashboard-remove.svg";

import ImageUploadForm from "../images/ImageUpload";
import ImagePreview from "../images/ImagePreview";

import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

const ProjectForm = React.forwardRef(
  (
    {
      projIndex,
      userId,
      projectId,
      userProjectName,
      userProjectImage,
      shouldRemoveImage,
      userProjectLink,
      userProjectDescription,
      updateProject,
      removeProject,
    },
    removeBtnRef
  ) => {
    const [project, setProject] = useState({
      projectNameInput: userProjectName,
      projectChange: false,
      projectStatus: FORM_STATUS.idle,
    });

    const [image, setImage] = useState({
      imageInput: "",
      imageChange: false,
      shouldRemoveUserImage: false,
    });

    const [link, setLink] = useState({
      linkInput: userProjectLink,
      linkChange: false,
      linkStatus: FORM_STATUS.idle,
    });

    const [description, setDescription] = useState({
      descriptionInput: userProjectDescription,
      descriptionChange: false,
      descriptionStatus: FORM_STATUS.idle,
    });

    function setProjectInput(value) {
      setProject({
        ...project,
        projectNameInput: value,
        projectChange: true,
      });
    }

    function validateProject(value) {
      let newState;

      if (value.trim() === "") {
        newState = {
          ...project,
          projectNameInput: "",
          projectStatus: FORM_STATUS.error,
        };
        setProject(newState);
        updateProject(projIndex, newState);
        return;
      }

      if (value === userProjectName) {
        newState = {
          projectNameInput: value,
          projectChange: false,
          projectStatus: FORM_STATUS.idle,
        };
        setProject(newState);
        updateProject(projIndex, newState);
        return;
      }

      if (validateInput("name", value)) {
        newState = {
          ...project,
          projectStatus: FORM_STATUS.success,
        };
      } else {
        newState = {
          ...project,
          projectStatus: FORM_STATUS.error,
        };
      }
      setProject(newState);
      updateProject(projIndex, newState);
    }

    function setImageInput(image) {
      const newState = {
        ...image,
        imageInput: image,
        imageChange: true,
      };
      setImage(newState);
      updateProject(projIndex, newState);
    }

    function removeImageInput() {
      const newState = {
        imageInput: "",
        imageChange: false,
        shouldRemoveUserImage: false,
      };
      setImage(newState);
      updateProject(projIndex, newState);
    }

    function removeUserImage() {
      let newState;
      newState = {
        ...image,
        shouldRemoveUserImage: true,
        imageChange: true,
      };
      setImage(newState);
      updateProject(projIndex, newState);
    }

    function setLinkInput(value) {
      setLink({
        ...link,
        linkInput: value,
        linkChange: true,
      });
    }

    function validateLink(value) {
      let newState;

      if (value.trim() === "") {
        newState = {
          ...link,
          linkInput: "",
          linkStatus: FORM_STATUS.error,
        };
        setLink(newState);
        updateProject(projIndex, newState);
        return;
      }

      if (value === userProjectLink) {
        newState = {
          linkInput: value,
          linkChange: false,
          linkStatus: FORM_STATUS.idle,
        };
        setLink(newState);
        updateProject(projIndex, newState);
        return;
      }

      if (validateInput("url", value)) {
        newState = {
          ...link,
          linkStatus: FORM_STATUS.success,
        };
      } else {
        newState = {
          ...link,
          linkStatus: FORM_STATUS.error,
        };
      }
      setLink(newState);
      updateProject(projIndex, newState);
    }

    function setDescriptionInput(value) {
      setDescription({
        ...description,
        descriptionInput: value,
        descriptionChange: true,
      });
    }

    function validateDescription(value) {
      let newState;

      if (value.trim() === "") {
        newState = {
          ...description,
          descriptionInput: "",
          descriptionStatus: FORM_STATUS.error,
        };
        setDescription(newState);
        updateProject(projIndex, newState);
        return;
      }

      if (value === userProjectDescription) {
        newState = {
          descriptionInput: value,
          descriptionChange: false,
          descriptionStatus: FORM_STATUS.idle,
        };
        setDescription(newState);
        updateProject(projIndex, newState);
        return;
      }

      if (validateInput("summary", value)) {
        newState = {
          ...description,
          descriptionStatus: FORM_STATUS.success,
        };
      } else {
        newState = {
          ...description,
          descriptionStatus: FORM_STATUS.error,
        };
      }
      setDescription(newState);
      updateProject(projIndex, newState);
    }

    return (
      <Fieldset>
        <div className="info-heading">
          <legend>Project: {project.projectNameInput || "New Project"}</legend>
          <button
            ref={removeBtnRef}
            type="button"
            className="button remove-button"
            aria-label={`Remove ${project.projectNameInput || "New"} Project`}
            onClick={() => removeProject(projIndex)}
          >
            <span className="sr-only">Remove Project</span>
            <span className="button-icon">
              <RemoveIcon className="icon" />
            </span>
          </button>
        </div>
        <Spacer axis="vertical" size="5" />
        <InputContainer>
          <label htmlFor={`project-${projectId}`}>Project:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            autoComplete="organization"
            id={`project-${projectId}`}
            name="project"
            className={`input ${
              project.projectStatus === FORM_STATUS.error ? "input-err" : ""
            }`}
            aria-describedby={`project-${projectId}-error project-${projectId}-success`}
            aria-invalid={
              project.projectNameInput.trim() === "" ||
              project.projectStatus === FORM_STATUS.error
            }
            value={project.projectNameInput}
            onChange={(e) => setProjectInput(e.target.value)}
            onBlur={(e) => validateProject(e.target.value)}
          />
          {project.projectStatus === FORM_STATUS.error ? (
            <span id={`project-${projectId}-error`} className="err-mssg">
              Input is required. Project can only be alphabelical characters, no
              numbers
            </span>
          ) : null}
          {project.projectStatus === FORM_STATUS.success ? (
            <span id={`project-${projectId}-success`} className="success-mssg">
              Project is Validated
            </span>
          ) : null}
        </InputContainer>
        <Spacer axis="vertical" size="20" />
        <ImageUploadForm
          userId={userId}
          imageId={projectId}
          setImageInput={setImageInput}
        />
        <Spacer axis="vertical" size="5" />
        <ImagePreview
          uploadedImage={image.imageInput}
          removeUploadedImage={removeImageInput}
          savedUserImage={!shouldRemoveImage && userProjectImage}
          removeSavedUserImage={removeUserImage}
        />
        <Spacer axis="vertical" size="20" />
        <InputContainer>
          <label htmlFor={`link-${projectId}`}>Link:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            autoComplete="url"
            id={`link-${projectId}`}
            name="link"
            className={`input ${
              link.linkStatus === FORM_STATUS.error ? "input-err" : ""
            }`}
            aria-describedby={`link-${projectId}-error link-${projectId}-success`}
            aria-invalid={
              link.linkInput.trim() === "" ||
              link.linkStatus === FORM_STATUS.error
            }
            value={link.linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onBlur={(e) => validateLink(e.target.value)}
          />
          {link.linkStatus === FORM_STATUS.error ? (
            <span id={`link-${projectId}-error`} className="err-mssg">
              Input is required. Link can only be alphabelical characters, no
              numbers
            </span>
          ) : null}
          {link.linkStatus === FORM_STATUS.success ? (
            <span id={`link-${projectId}-success`} className="success-mssg">
              Link is Validated
            </span>
          ) : null}
        </InputContainer>
        <Spacer axis="vertical" size="20" />
        <InputContainer>
          <label htmlFor={`description-${projectId}`}>Description:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            id={`description-${projectId}`}
            name="description"
            className={`input ${
              description.descriptionStatus === FORM_STATUS.error
                ? "input-err"
                : ""
            }`}
            aria-describedby={`description-${projectId}-error description-${projectId}-success`}
            aria-invalid={
              description.descriptionInput.trim() === "" ||
              description.descriptionStatus === FORM_STATUS.error
            }
            value={description.descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            onBlur={(e) => validateDescription(e.target.value)}
          />
          {description.descriptionStatus === FORM_STATUS.error ? (
            <span id={`description-${projectId}-error`} className="err-mssg">
              Input is required. description can only be alphabelical
              characters, no numbers
            </span>
          ) : null}
          {description.descriptionStatus === FORM_STATUS.success ? (
            <span
              id={`description-${projectId}-success`}
              className="success-mssg"
            >
              description is Validated
            </span>
          ) : null}
        </InputContainer>
      </Fieldset>
    );
  }
);

const Fieldset = styled.fieldset`
  min-width: 0;

  .info-heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .remove-button {
      width: 100%;
      max-width: 32px;
      border-radius: 10px;
      height: 32px;
      padding: 8px;

      &:focus-visible {
        outline-width: 3px;
        outline-color: transparent;
        box-shadow: inset 0 0 1px 2.5px #2727ad;
      }

      &:hover .icon {
        fill: #2727ad;
      }

      .icon {
        height: 100%;
      }
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 450px;

  .input-err {
    border: solid red;
  }
  .err-mssg {
    color: red;
    font-size: 0.7rem;
  }
  .success-mssg {
    color: green;
    font-size: 0.7rem;
  }
`;

export default ProjectForm;
