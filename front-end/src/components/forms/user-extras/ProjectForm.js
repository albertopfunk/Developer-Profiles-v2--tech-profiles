import React from "react";
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
          <button
            ref={removeBtnRef}
            type="button"
            className="button remove-button"
            aria-label={`Remove ${
              projectName.projectNameInput || "New"
            } Project`}
            onClick={() => removeProject(projIndex)}
            onKeyDown={(e) => removeProjectFocusManagement(e, projIndex)}
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
          {projectName.projectStatus === FORM_STATUS.error ? (
            <span id={`project-${projectId}-error`} className="err-mssg">
              Input is required. Project can only be alphabelical characters, no
              numbers
            </span>
          ) : null}
          {projectName.projectStatus === FORM_STATUS.success ? (
            <span id={`project-${projectId}-success`} className="success-mssg">
              Project is Validated
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
          {projectLink.linkStatus === FORM_STATUS.error ? (
            <span id={`link-${projectId}-error`} className="err-mssg">
              Input is required. Link can only be alphabelical characters, no
              numbers
            </span>
          ) : null}
          {projectLink.linkStatus === FORM_STATUS.success ? (
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
          {projectDescription.descriptionStatus === FORM_STATUS.error ? (
            <span id={`description-${projectId}-error`} className="err-mssg">
              Input is required. description can only be alphabelical
              characters, no numbers
            </span>
          ) : null}
          {projectDescription.descriptionStatus === FORM_STATUS.success ? (
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
      width: 30px;
      height: 30px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:focus-visible {
        outline-width: 3px;
        outline-color: transparent;
        box-shadow: inset 0 0 1px 2.5px #2727ad;
      }

      &:hover .icon {
        fill: #2727ad;
      }

      .button-icon {
        display: inline-block;

        .icon {
          height: 20px;
          width: 20px;
        }
      }
    }
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
