import React from "react";
import styled from "styled-components";
import { ReactComponent as RemoveIcon } from "../../../global/assets/dashboard-remove.svg";

import ImageUploadForm from "../images/ImageUpload";
import ImagePreview from "../images/ImagePreview";
import IconButton from "../buttons/IconButton";

import { validateInput } from "../../../global/helpers/validation";
import { ERROR_MESSAGE, FORM_STATUS } from "../../../global/helpers/variables";
import Spacer from "../../../global/helpers/spacer";

const ProjectForm = React.forwardRef(
  (
    {
      projIndex,
      userId,
      projectId,
      userProjectName,
      projectName,
      userProjectImage,
      projectImage,
      userProjectLink,
      projectLink,
      userProjectDescription,
      projectDescription,
      updateProject,
      removeProject,
      removeProjectFocusManagement,
      isSubmitting,
    },
    removeBtnRef
  ) => {
    function setProjectNameInput(value) {
      if (value === userProjectName) {
        updateProject(
          projIndex,
          {
            projectNameInput: value,
            projectChange: false,
            projectStatus: FORM_STATUS.idle,
          },
          true
        );
        return;
      }

      updateProject(projIndex, {
        projectNameInput: value,
        projectChange: true,
      });
    }

    function validateProjectName(value) {
      if (isSubmitting.current) return;
      if (!projectName.projectChange && value) return;
      if (value.trim() === "") {
        updateProject(projIndex, {
          projectNameInput: "",
          projectStatus: FORM_STATUS.error,
        });
      } else if (validateInput("name", value)) {
        updateProject(projIndex, {
          projectStatus: FORM_STATUS.success,
        });
      } else {
        updateProject(projIndex, {
          projectStatus: FORM_STATUS.error,
        });
      }
    }

    function setImageInput(image) {
      updateProject(projIndex, {
        imageInput: image,
        imageChange: true,
      });
    }

    function removeImageInput() {
      updateProject(
        projIndex,
        {
          imageInput: "",
          imageChange: false,
          shouldRemoveUserImage: false,
        },
        true
      );
    }

    function removeUserImage() {
      updateProject(projIndex, {
        imageChange: true,
        shouldRemoveUserImage: true,
      });
    }

    function setLinkInput(value) {
      if (value === userProjectLink) {
        updateProject(
          projIndex,
          {
            linkInput: value,
            linkStatus: FORM_STATUS.idle,
            linkChange: false,
          },
          true
        );
        return;
      }

      updateProject(projIndex, {
        linkInput: value,
        linkChange: true,
      });
    }

    function validateLink(value) {
      if (isSubmitting.current) return;
      if (!projectLink.linkChange && value) return;
      if (value.trim() === "") {
        updateProject(projIndex, {
          linkInput: "",
          linkStatus: FORM_STATUS.error,
        });
      } else if (validateInput("url", value)) {
        updateProject(projIndex, {
          linkStatus: FORM_STATUS.success,
        });
      } else {
        updateProject(projIndex, {
          linkStatus: FORM_STATUS.error,
        });
      }
    }

    function setDescriptionInput(value) {
      if (value === userProjectDescription) {
        updateProject(
          projIndex,
          {
            descriptionInput: value,
            descriptionStatus: FORM_STATUS.idle,
            descriptionChange: false,
          },
          true
        );
        return;
      }

      updateProject(projIndex, {
        descriptionInput: value,
        descriptionChange: true,
      });
    }

    function validateDescription(value) {
      if (isSubmitting.current) return;
      if (!projectDescription.descriptionChange && value) return;
      if (value.trim() === "") {
        updateProject(projIndex, {
          descriptionInput: "",
          descriptionStatus: FORM_STATUS.error,
        });
      } else if (validateInput("summary", value)) {
        updateProject(projIndex, {
          descriptionStatus: FORM_STATUS.success,
        });
      } else {
        updateProject(projIndex, {
          descriptionStatus: FORM_STATUS.error,
        });
      }
    }

    return (
      <Fieldset>
        <div className="info-heading">
          <legend>
            Project: {projectName.projectNameInput || "New Project"}
          </legend>
          <IconButton
            ref={removeBtnRef}
            type="button"
            size="sm"
            ariaLabel={`Remove ${
              projectName.projectNameInput || "New"
            } Project`}
            icon={<RemoveIcon className="icon" />}
            onClick={() => removeProject(projIndex)}
            onKeyDown={(e) => removeProjectFocusManagement(e, projIndex)}
          />
        </div>
        <Spacer axis="vertical" size="5" />
        <InputContainer>
          <label htmlFor={`project-${projectId}`}>Project:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            autoComplete="organization"
            id={`project-${projectId}`}
            data-input
            name="project"
            className={`input ${
              projectName.projectStatus === FORM_STATUS.error ? "input-err" : ""
            }`}
            aria-describedby={`project-${projectId}-error project-${projectId}-success`}
            aria-invalid={
              projectName.projectNameInput.trim() === "" ||
              projectName.projectStatus === FORM_STATUS.error
            }
            value={projectName.projectNameInput}
            onChange={(e) => setProjectNameInput(e.target.value)}
            onBlur={(e) => validateProjectName(e.target.value)}
          />
          <Spacer axis="vertical" size="5" />
          {projectName.projectStatus === FORM_STATUS.error ? (
            <div id={`project-${projectId}-error`} className="err-mssg">
              <span>{ERROR_MESSAGE.nameShort}</span>
              <Spacer axis="vertical" size="3" />
              <span>{ERROR_MESSAGE.required}</span>
            </div>
          ) : null}
          {projectName.projectStatus === FORM_STATUS.success ? (
            <span id={`project-${projectId}-success`} className="success-mssg">
              Project name is validated
            </span>
          ) : null}
        </InputContainer>

        <Spacer axis="vertical" size="20" />

        <div className="image-upload-container">
          <ImageUploadForm
            userId={userId}
            imageId={projectId}
            setImageInput={setImageInput}
          />
          <ImagePreview
            uploadedImage={projectImage.imageInput}
            removeUploadedImage={removeImageInput}
            savedUserImage={
              !projectImage.shouldRemoveUserImage && userProjectImage
            }
            removeSavedUserImage={removeUserImage}
          />
        </div>

        <Spacer axis="vertical" size="20" />
        <InputContainer>
          <label htmlFor={`link-${projectId}`}>Link:</label>
          <Spacer axis="vertical" size="5" />
          <input
            type="text"
            autoComplete="url"
            id={`link-${projectId}`}
            data-input
            name="link"
            className={`input ${
              projectLink.linkStatus === FORM_STATUS.error ? "input-err" : ""
            }`}
            aria-describedby={`link-${projectId}-error link-${projectId}-success`}
            aria-invalid={
              projectLink.linkInput.trim() === "" ||
              projectLink.linkStatus === FORM_STATUS.error
            }
            value={projectLink.linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onBlur={(e) => validateLink(e.target.value)}
          />
          <Spacer axis="vertical" size="5" />
          {projectLink.linkStatus === FORM_STATUS.error ? (
            <div id={`link-${projectId}-error`} className="err-mssg">
              <span>{ERROR_MESSAGE.urlShort}</span>
              <Spacer axis="vertical" size="3" />
              <span>{ERROR_MESSAGE.required}</span>
            </div>
          ) : null}
          {projectLink.linkStatus === FORM_STATUS.success ? (
            <span id={`link-${projectId}-success`} className="success-mssg">
              Link is validated
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
            data-input
            name="description"
            className={`input ${
              projectDescription.descriptionStatus === FORM_STATUS.error
                ? "input-err"
                : ""
            }`}
            aria-describedby={`description-${projectId}-error description-${projectId}-success`}
            aria-invalid={
              projectDescription.descriptionInput.trim() === "" ||
              projectDescription.descriptionStatus === FORM_STATUS.error
            }
            value={projectDescription.descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            onBlur={(e) => validateDescription(e.target.value)}
          />
          <Spacer axis="vertical" size="5" />
          {projectDescription.descriptionStatus === FORM_STATUS.error ? (
            <div id={`description-${projectId}-error`} className="err-mssg">
              <span>{ERROR_MESSAGE.summaryShort}</span>
              <Spacer axis="vertical" size="3" />
              <span>{ERROR_MESSAGE.required}</span>
            </div>
          ) : null}
          {projectDescription.descriptionStatus === FORM_STATUS.success ? (
            <span
              id={`description-${projectId}-success`}
              className="success-mssg"
            >
              Description is validated
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
    gap: 4px;
  }

  .image-upload-container {
    max-width: 225px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    & > div:last-child {
      align-self: center;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

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

ProjectForm.displayName = "ProjectForm";

export default ProjectForm;
