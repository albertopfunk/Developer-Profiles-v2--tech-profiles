import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import ImageUploadForm from "../image-upload";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import { httpClient } from "../../../global/helpers/http-requests";

function ProjectForm({
  projIndex,
  userId,
  userProjectName,
  userProjectImage,
  userProjectImageId,
  userProjectLink,
  userDescription,
  updateProject,
  removeProject,
}) {
  const { user } = useContext(ProfileContext);

  const [project, setProject] = useState({
    project_title: userProjectName,
    projectChange: false,
    projectStatus: FORM_STATUS.idle,
  });

  const [image, setImage] = useState({
    imageInput: "",
    imageInputId: "",
    imageChange: false,
    shouldRemoveUserImage: false,
  });

  const [link, setLink] = useState({
    link: userProjectLink,
    linkChange: false,
    linkStatus: FORM_STATUS.idle,
  });

  const [description, setDescription] = useState({
    project_description: userDescription,
    descriptionChange: false,
    descriptionStatus: FORM_STATUS.idle,
  });

  useEffect(() => {
    return () => {
      if (image.imageInputId) {
        httpClient("POST", "/api/delete-image", {
          id: image.imageInputId,
        });
      }
    };
  }, [image.imageInputId]);

  function setProjectInput(value) {
    setProject({
      ...project,
      project_title: value,
      projectChange: true,
    });
  }

  function validateProject(e) {
    let newState;
    const { value, dataset } = e.target;

    const isUserProject =
      user.projects.length > 0 && !dataset.inputid.includes("new");

    if (isUserProject && value === user.projects[projIndex].project_title) {
      newState = {
        project_title: value,
        projectChange: false,
        projectStatus: FORM_STATUS.idle,
      };
      setProject(newState);
      updateProject(projIndex, newState);
      return;
    }

    if (value.trim() === "") {
      newState = {
        ...project,
        project_title: "",
        projectStatus: FORM_STATUS.error,
      };
      setProject(newState);
      updateProject(projIndex, newState);
      return;
    }

    if (!project.projectChange) return;
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

  function setImageInput(data) {
    const newState = {
      imageInput: data.image,
      imageInputId: data.id,
      imageChange: true,
      shouldRemoveUserImage: false,
    };
    setImage(newState);
    updateProject(projIndex, newState);
  }

  function removeImageInput() {
    httpClient("POST", "/api/delete-image", {
      id: image.imageInputId,
    });

    const newState = {
      imageInput: "",
      imageInputId: "",
      imageChange: false,
      shouldRemoveUserImage: false,
    };
    setImage(newState);
    updateProject(projIndex, newState);
  }

  function removeUserImage(shouldRemove) {
    let newState;

    if (shouldRemove) {
      newState = {
        ...image,
        shouldRemoveUserImage: true,
        imageChange: true,
      };
      setImage(newState);
      updateProject(projIndex, newState);
    } else {
      newState = {
        ...image,
        shouldRemoveUserImage: false,
        imageChange: false,
      };
      setImage(newState);
      updateProject(projIndex, newState);
    }
  }

  function setLinkInput(value) {
    setLink({
      ...link,
      link: value,
      linkChange: true,
    });
  }

  function validateLink(e) {
    let newState;
    const { value, dataset } = e.target;

    const isUserProject =
      user.projects.length > 0 && !dataset.inputid.includes("new");

    if (isUserProject && value === user.projects[projIndex].link) {
      newState = {
        link: value,
        linkChange: false,
        linkStatus: FORM_STATUS.idle,
      };
      setLink(newState);
      updateProject(projIndex, newState);
      return;
    }

    if (value.trim() === "") {
      newState = {
        ...link,
        link: "",
        linkStatus: FORM_STATUS.error,
      };
      setLink(newState);
      updateProject(projIndex, newState);
      return;
    }

    if (!link.linkChange) return;
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
      project_description: value,
      descriptionChange: true,
    });
  }

  function validateDescription(e) {
    let newState;
    const { value, dataset } = e.target;

    const isUserProject =
      user.projects.length > 0 && !dataset.inputid.includes("new");

    if (
      isUserProject &&
      value === user.projects[projIndex].project_description
    ) {
      newState = {
        project_description: value,
        descriptionChange: false,
        descriptionStatus: FORM_STATUS.idle,
      };
      setDescription(newState);
      updateProject(projIndex, newState);
      return;
    }

    if (value.trim() === "") {
      newState = {
        ...description,
        project_description: "",
        descriptionStatus: FORM_STATUS.error,
      };
      setDescription(newState);
      updateProject(projIndex, newState);
      return;
    }

    if (!description.descriptionChange) return;
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

  console.log("-- project form --", image);

  return (
    <fieldset>
      <legend>Project: {project.project_title || "New Project"}</legend>

      <button
        type="button"
        aria-label={`Remove ${project.project_title || "New"} Project`}
        onClick={() => removeProject(userId)}
      >
        X
      </button>

      <InputContainer>
        <label htmlFor={`project-${userId}`}>Project:</label>
        <input
          type="text"
          autoComplete="organization"
          id={`project-${userId}`}
          data-inputid={userId}
          name="project"
          className={`input ${
            project.projectStatus === FORM_STATUS.error ? "input-err" : ""
          }`}
          aria-describedby={`project-${userId}-error project-${userId}-success`}
          aria-invalid={
            project.project_title.trim() === "" ||
            project.projectStatus === FORM_STATUS.error
          }
          value={project.project_title}
          onChange={(e) => setProjectInput(e.target.value)}
          onBlur={(e) => validateProject(e)}
        />
        {project.projectStatus === FORM_STATUS.error ? (
          <span id={`project-${userId}-error`} className="err-mssg">
            Input is required. Project can only be alphabelical characters, no
            numbers
          </span>
        ) : null}
        {project.projectStatus === FORM_STATUS.success ? (
          <span id={`project-${userId}-success`} className="success-mssg">
            Project is Validated
          </span>
        ) : null}
      </InputContainer>

      <ImageUploadForm
        previewImage={image.imageInput}
        userImage={userProjectImage}
        setImageInput={setImageInput}
        removeImageInput={removeImageInput}
        removeUserImage={removeUserImage}
      />

      <InputContainer>
        <label htmlFor={`link-${userId}`}>Link:</label>
        <input
          type="text"
          autoComplete="url"
          id={`link-${userId}`}
          data-inputid={userId}
          name="link"
          className={`input ${
            link.linkStatus === FORM_STATUS.error ? "input-err" : ""
          }`}
          aria-describedby={`link-${userId}-error link-${userId}-success`}
          aria-invalid={
            link.link.trim() === "" || link.linkStatus === FORM_STATUS.error
          }
          value={link.link}
          onChange={(e) => setLinkInput(e.target.value)}
          onBlur={(e) => validateLink(e)}
        />
        {link.linkStatus === FORM_STATUS.error ? (
          <span id={`link-${userId}-error`} className="err-mssg">
            Input is required. Link can only be alphabelical characters, no
            numbers
          </span>
        ) : null}
        {link.linkStatus === FORM_STATUS.success ? (
          <span id={`link-${userId}-success`} className="success-mssg">
            Link is Validated
          </span>
        ) : null}
      </InputContainer>

      <InputContainer>
        <label htmlFor={`description-${userId}`}>Description:</label>
        <input
          type="text"
          id={`description-${userId}`}
          data-inputid={userId}
          name="description"
          className={`input ${
            description.descriptionStatus === FORM_STATUS.error
              ? "input-err"
              : ""
          }`}
          aria-describedby={`description-${userId}-error description-${userId}-success`}
          aria-invalid={
            description.project_description.trim() === "" ||
            description.descriptionStatus === FORM_STATUS.error
          }
          value={description.project_description}
          onChange={(e) => setDescriptionInput(e.target.value)}
          onBlur={(e) => validateDescription(e)}
        />
        {description.descriptionStatus === FORM_STATUS.error ? (
          <span id={`description-${userId}-error`} className="err-mssg">
            Input is required. description can only be alphabelical characters,
            no numbers
          </span>
        ) : null}
        {description.descriptionStatus === FORM_STATUS.success ? (
          <span id={`description-${userId}-success`} className="success-mssg">
            description is Validated
          </span>
        ) : null}
      </InputContainer>
    </fieldset>
  );
}

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

export default ProjectForm;
