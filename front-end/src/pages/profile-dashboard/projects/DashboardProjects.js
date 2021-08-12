import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../../global/assets/dashboard-close.svg";
import { ReactComponent as EditIcon } from "../../../global/assets/dashboard-edit.svg";
import { ReactComponent as AddIcon } from "../../../global/assets/dashboard-add.svg";

import ProjectForm from "../../../components/forms/user-extras/ProjectForm";
import ControlButton from "../../../components/forms/buttons/ControlButton";
import IconButton from "../../../components/forms/buttons/IconButton";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { FORM_STATUS } from "../../../global/helpers/variables";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import useToggle from "../../../global/helpers/hooks/useToggle";
import Announcer from "../../../global/helpers/announcer";
import Spacer from "../../../global/helpers/spacer";

let formSuccessWait;
function DashboardProjects() {
  const { user, addUserExtras } = useContext(ProfileContext);

  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [formFocusToggle, setFormFocusToggle] = useToggle();
  const [hasSubmitError, setHasSubmitError] = useState(null);

  const [projects, setProjects] = useState([]);
  const [projectsChange, setProjectsChange] = useState(false);
  const [newProjectId, setNewProjectId] = useState(1);
  const [removedProjectIndex, setRemovedProjectIndex] = useState(null);
  const [removeProjectFocusToggle, setRemoveProjectFocusToggle] = useToggle();

  let isSubmittingRef = useRef(false);
  const errorSummaryRef = React.createRef();
  const editInfoBtnRef = React.createRef();
  const resetBtnRef = React.createRef();
  const addNewBtnRef = React.createRef();
  const removeBtnRefs = useRef([]);

  // unmount cleanup
  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  // form focus management
  useEffect(() => {
    if (formFocusStatus) {
      if (formFocusStatus === FORM_STATUS.idle) {
        editInfoBtnRef.current.focus();
        return;
      }

      if (formFocusStatus === FORM_STATUS.active) {
        resetBtnRef.current.focus();
      }
    }
  }, [formFocusToggle]);

  // form error focus management
  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formStatus]);

  // remove project focus management
  useEffect(() => {
    if (removedProjectIndex === null) {
      return;
    }

    if (removeBtnRefs.current.length === 0) {
      addNewBtnRef.current.focus();
      return;
    }

    if (removeBtnRefs.current.length === 1) {
      removeBtnRefs.current[0].current.focus();
      return;
    }

    if (removeBtnRefs.current[removedProjectIndex]) {
      removeBtnRefs.current[removedProjectIndex].current.focus();
    } else {
      removeBtnRefs.current[removedProjectIndex - 1].current.focus();
    }
  }, [removeProjectFocusToggle]);

  function formFocusManagement(e, status) {
    // only run on enter or space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    // preventing onClick from running
    e.preventDefault();

    if (status === FORM_STATUS.active) {
      setFormInputs();
      setFormFocusToggle();
      return;
    }

    if (status === FORM_STATUS.idle) {
      resetForm();
      setFormFocusToggle();
    }
  }

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);
    setFormFocusStatus(FORM_STATUS.active);
    setHasSubmitError(null);

    const updatedUserProjects = user.projects.map((proj) => {
      return {
        ...proj,
        projectNameInput: proj.project_title,
        projectStatus: FORM_STATUS.idle,
        projectChange: false,

        imageInput: "",
        imageChange: false,
        shouldRemoveUserImage: false,

        linkInput: proj.link,
        linkStatus: FORM_STATUS.idle,
        linkChange: false,

        descriptionInput: proj.project_description,
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,
      };
    });

    setProjects(updatedUserProjects);
    setProjectsChange(false);
    setNewProjectId(1);
    setRemovedProjectIndex(null);
    removeBtnRefs.current = updatedUserProjects.map(() => React.createRef());
  }

  function updateProject(index, state, checkChanges = false) {
    const newProjArr = [...projects];
    const newProjObj = { ...newProjArr[index], ...state };
    newProjArr.splice(index, 1, newProjObj);
    setProjects(newProjArr);

    if (checkChanges) {
      const userProjChange = newProjArr.filter(
        (proj) =>
          Number.isInteger(proj.id) &&
          (proj.projectChange ||
            proj.imageChange ||
            proj.linkChange ||
            proj.descriptionChange)
      );

      // set form back to active if no changes
      if (userProjChange.length === 0 && !projectsChange) {
        setFormStatus(FORM_STATUS.active);
      }
    }
  }

  function addProject(e) {
    e.preventDefault();

    const currentProjects = [
      ...projects,

      {
        id: `new-${newProjectId}`,

        projectNameInput: "",
        projectStatus: FORM_STATUS.idle,
        projectChange: false,

        imageInput: "",
        imageChange: false,
        shouldRemoveUserImage: false,

        linkInput: "",
        linkStatus: FORM_STATUS.idle,
        linkChange: false,

        descriptionInput: "",
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,
      },
    ];

    removeBtnRefs.current = currentProjects.map(() => React.createRef());
    setProjects(currentProjects);
    setNewProjectId(newProjectId + 1);
    setProjectsChange(true);
  }

  function removeProjectFocusManagement(e, projIndex) {
    // only run on enter or space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    // preventing onClick from running
    e.preventDefault();

    removeProject(projIndex);
    setRemoveProjectFocusToggle();
  }

  function removeProject(projIndex) {
    const newProjects = [...projects];
    newProjects.splice(projIndex, 1);
    removeBtnRefs.current = newProjects.map(() => React.createRef());
    setProjects(newProjects);
    setRemovedProjectIndex(projIndex);
    setProjectChanges(newProjects);
  }

  function setProjectChanges(projects) {
    let savedProjects = [];
    let newProjects = [];

    projects.forEach((proj) => {
      if (Number.isInteger(proj.id)) {
        savedProjects.push(proj);
      } else {
        newProjects.push(proj);
      }
    });

    if (
      newProjects.length > 0 ||
      savedProjects.length !== user.projects.length
    ) {
      setProjectsChange(true);
      return;
    }

    // checking input changes if no project change
    const savedProjectChange = savedProjects.filter(
      (proj) =>
        proj.projectChange ||
        proj.imageChange ||
        proj.linkChange ||
        proj.descriptionChange
    );

    // set form back to active if no changes
    if (savedProjectChange.length === 0) {
      setFormStatus(FORM_STATUS.active);
    }

    setProjectsChange(false);
  }

  function checkFormErrors() {
    return projects.filter((proj) => {
      let isErrors = false;
      if (
        proj.projectNameInput.trim() === "" ||
        proj.projectStatus === FORM_STATUS.error ||
        proj.linkInput.trim() === "" ||
        proj.linkStatus === FORM_STATUS.error ||
        proj.descriptionInput.trim() === "" ||
        proj.descriptionStatus === FORM_STATUS.error
      ) {
        isErrors = true;
      }

      return isErrors;
    });
  }

  async function addNewProjects() {
    const requests = [];

    for (let i = 0; i < projects.length; i++) {
      if (!Number.isInteger(projects[i].id)) {
        if (projects[i].imageInput) {
          const [projectRes, projectErr] = await httpClient(
            "POST",
            "/extras/new/projects",
            {
              project_title: projects[i].projectNameInput,
              project_img: projects[i].imageInput,
              link: projects[i].linkInput,
              project_description: projects[i].descriptionInput,
              user_id: user.id,
            }
          );

          if (projectErr) {
            console.error(`${projectRes.mssg} => ${projectRes.projectErr}`);
            return { error: "error saving new project" };
          }

          const [imageRes, imageErr] = await httpClient(
            "POST",
            `/api/upload-main-image`,
            {
              imageUrl: projects[i].imageInput,
              id: user.id,
              imageId: projectRes.data.id,
            }
          );

          if (imageErr) {
            console.error(`${imageRes.mssg} => ${imageRes.err}`);
            return { error: "error saving image" };
          }

          requests.push({
            method: "PUT",
            url: `/extras/projects/${projectRes.data.id}`,
            data: {
              project_img: imageRes.data.image,
            },
          });
        } else {
          requests.push({
            method: "POST",
            url: `/extras/new/projects`,
            data: {
              project_title: projects[i].projectNameInput,
              project_img: projects[i].imageInput,
              link: projects[i].linkInput,
              project_description: projects[i].descriptionInput,
              user_id: user.id,
            },
          });
        }
      }
    }

    return requests;
  }

  function removeUserProjects() {
    const requests = [];
    const projectsObj = {};

    projects.forEach((proj) => {
      if (Number.isInteger(proj.id)) {
        projectsObj[proj.id] = true;
      }
    });

    user.projects.forEach((proj) => {
      if (!(proj.id in projectsObj)) {
        requests.push({
          method: "DELETE",
          url: `/extras/projects/${proj.id}`,
        });
      }
    });

    return requests;
  }

  async function updateUserProjects() {
    const requests = [];

    for (let i = 0; i < projects.length; i++) {
      if (Number.isInteger(projects[i].id)) {
        if (
          projects[i].projectChange ||
          projects[i].linkChange ||
          projects[i].descriptionChange ||
          projects[i].imageChange
        ) {
          const data = {};

          if (projects[i].projectChange) {
            data.project_title = projects[i].projectNameInput;
          }

          if (projects[i].linkChange) {
            data.link = projects[i].linkInput;
          }

          if (projects[i].descriptionChange) {
            data.project_description = projects[i].descriptionInput;
          }

          if (projects[i].imageChange) {
            if (projects[i].shouldRemoveUserImage) {
              data.project_img = "";
            } else {
              const [res, err] = await httpClient(
                "POST",
                `/api/upload-main-image`,
                {
                  imageUrl: projects[i].imageInput,
                  id: user.id,
                  imageId: projects[i].id,
                }
              );

              if (err) {
                console.error(`${res.mssg} => ${res.err}`);
                return { error: "error saving image" };
              }

              data.project_img = res.data.image;
            }
          }
          requests.push({
            method: "PUT",
            url: `/extras/projects/${projects[i].id}`,
            data,
          });
        }
      }
    }

    return requests;
  }

  async function submitEdit(e) {
    e.preventDefault();

    // check for changes
    const userProjChange = projects.filter(
      (proj) =>
        Number.isInteger(proj.id) &&
        (proj.projectChange ||
          proj.imageChange ||
          proj.linkChange ||
          proj.descriptionChange)
    );

    if (userProjChange.length === 0 && !projectsChange) {
      return;
    }

    // set loading
    setFormStatus(FORM_STATUS.loading);
    isSubmittingRef.current = true;

    // validate projects
    const currentProjects = [...projects];
    let areThereErrors = false;

    projects.forEach((proj, projIndex) => {
      const newState = {};

      if (proj.projectChange || proj.projectNameInput.trim() === "") {
        if (proj.projectNameInput.trim() === "") {
          areThereErrors = true;
          newState.projectNameInput = "";
          newState.projectStatus = FORM_STATUS.error;
        } else if (validateInput("name", proj.projectNameInput)) {
          newState.projectStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.projectStatus = FORM_STATUS.error;
        }
      }

      if (proj.linkChange || proj.linkInput.trim() === "") {
        if (proj.linkInput.trim() === "") {
          areThereErrors = true;
          newState.linkInput = "";
          newState.linkStatus = FORM_STATUS.error;
        } else if (validateInput("url", proj.linkInput)) {
          newState.linkStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.linkStatus = FORM_STATUS.error;
        }
      }

      if (proj.descriptionChange || proj.descriptionInput.trim() === "") {
        if (proj.descriptionInput.trim() === "") {
          areThereErrors = true;
          newState.descriptionInput = "";
          newState.descriptionStatus = FORM_STATUS.error;
        } else if (validateInput("summary", proj.descriptionInput)) {
          newState.descriptionStatus = FORM_STATUS.success;
        } else {
          areThereErrors = true;
          newState.descriptionStatus = FORM_STATUS.error;
        }
      }

      currentProjects.splice(projIndex, 1, {
        ...currentProjects[projIndex],
        ...newState,
      });
    });

    setProjects(currentProjects);

    if (areThereErrors) {
      isSubmittingRef.current = false;
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    // unfocus from input
    let element = document.activeElement;
    if (element.dataset.input) {
      element.blur();
    }

    // create requests
    let requests = [];

    if (projectsChange) {
      const newProjRequests = await addNewProjects();

      if (newProjRequests?.error) {
        setFormStatus(FORM_STATUS.error);
        setHasSubmitError(true);
        isSubmittingRef.current = false;
        return;
      }

      const removeProjRequests = removeUserProjects();
      requests = [...newProjRequests, ...removeProjRequests];
    }

    if (userProjChange.length > 0) {
      const updatedProjRequests = await updateUserProjects();

      if (updatedProjRequests?.error) {
        setFormStatus(FORM_STATUS.error);
        setHasSubmitError(true);
        isSubmittingRef.current = false;
        return;
      }

      requests = [...requests, ...updatedProjRequests];
    }

    if (requests.length === 0) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      isSubmittingRef.current = false;
      return;
    }

    // submit
    const results = await addUserExtras(requests);

    if (results?.error) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      isSubmittingRef.current = false;
      return;
    }

    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
      setFormFocusStatus(FORM_STATUS.idle);
      isSubmittingRef.current = false;
    }, 750);
    setFormStatus(FORM_STATUS.success);
  }

  function resetForm() {
    setFormStatus(FORM_STATUS.idle);
    setFormFocusStatus(FORM_STATUS.idle);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <InfoSection aria-labelledby="current-information-heading">
        <div className="info-heading">
          <h2 id="current-information-heading">Current Info</h2>
          <IconButton
            ref={editInfoBtnRef}
            type="button"
            ariaLabel="edit information"
            icon={<EditIcon className="icon" />}
            attributes={{
              id: "edit-info-btn",
            }}
            onClick={setFormInputs}
            onKeyDown={(e) => formFocusManagement(e, FORM_STATUS.active)}
          />
        </div>
        <Spacer axis="vertical" size="30" />
        <div className="grid-container">
          {user.projects.length > 0 ? (
            user.projects.map((proj) => (
              <div key={proj.id}>
                <h3>{proj.project_title}</h3>
                <Spacer axis="vertical" size="10" />
                <dl
                  className="info-group"
                  aria-label={`${proj.project_title} Project`}
                >
                  <div className="flex-row">
                    <div className="flex-col">
                      <div>
                        <dt>Project Name:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{proj.project_title}</dd>
                      </div>
                      <div className="image-container">
                        <dt>Project Pic:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>
                          {proj.project_img ? (
                            <img src={proj.project_img} alt="project pic" />
                          ) : (
                            "None Set"
                          )}
                        </dd>
                      </div>
                    </div>

                    <div className="flex-col">
                      <div>
                        <dt>Project Link:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{proj.link}</dd>
                      </div>
                      <div>
                        <dt>Description:</dt>
                        <Spacer axis="vertical" size="5" />
                        <dd>{proj.project_description}</dd>
                      </div>
                    </div>
                  </div>
                </dl>
              </div>
            ))
          ) : (
            <p>No Projects</p>
          )}
        </div>
      </InfoSection>
    );
  }

  let formErrors;
  if (formStatus === FORM_STATUS.error) {
    formErrors = checkFormErrors();
  }

  return (
    <FormSection aria-labelledby="edit-information-heading">
      <div className="edit-info-header">
        <h2 id="edit-information-heading">Edit Info</h2>
        <IconButton
          ref={resetBtnRef}
          type="reset"
          disabled={
            formStatus === FORM_STATUS.loading ||
            formStatus === FORM_STATUS.success
          }
          ariaLabel="cancel"
          icon={<CloseIcon className="icon" />}
          attributes={{
            form: "projects-form",
          }}
          onClick={resetForm}
          onKeyDown={(e) => formFocusManagement(e, FORM_STATUS.idle)}
        />
      </div>

      {formStatus === FORM_STATUS.error ? (
        <>
          <Spacer axis="vertical" size="30" />
          <div ref={errorSummaryRef} tabIndex="-1" className="error-summary">
            <h3 id="error-heading">Errors in Submission</h3>
            <Spacer axis="vertical" size="10" />
            <>
              <strong>
                Please address the following errors and re-submit the form:
              </strong>
              <Spacer axis="vertical" size="10" />
              {hasSubmitError ? (
                <>
                  <div>
                    <h4>Submit Error</h4>
                    <p>Error submitting form, please try again</p>
                  </div>
                  <Spacer axis="vertical" size="10" />
                </>
              ) : null}
              {formErrors.length > 0 ? (
                formErrors.map((proj, index) => (
                  <div key={proj.id}>
                    {index !== 0 ? <Spacer axis="vertical" size="15" /> : null}
                    <div>
                      <h4>{`Current "${
                        proj.projectNameInput || "New Project"
                      }" Errors`}</h4>
                      <Spacer axis="vertical" size="5" />
                      <ul
                        aria-label={`current ${
                          proj.projectNameInput || "new project"
                        } errors`}
                      >
                        {proj.projectNameInput.trim() === "" ||
                        proj.projectStatus === FORM_STATUS.error ? (
                          <li>
                            <a href={`#project-${proj.id}`}>
                              project Name Error
                            </a>
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="5" />
                        {proj.linkInput.trim() === "" ||
                        proj.linkStatus === FORM_STATUS.error ? (
                          <li>
                            <a href={`#link-${proj.id}`}>Link Error</a>
                          </li>
                        ) : null}
                        <Spacer axis="vertical" size="5" />
                        {proj.descriptionInput.trim() === "" ||
                        proj.descriptionStatus === FORM_STATUS.error ? (
                          <li>
                            <a href={`#description-${proj.id}`}>
                              Description Error
                            </a>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p>No Errors, ready to submit</p>
                  <Announcer
                    announcement="No Errors, ready to submit"
                    ariaId="no-errors-announcer"
                    ariaLive="polite"
                  />
                </>
              )}
            </>
          </div>
        </>
      ) : null}
      <Spacer axis="vertical" size="30" />
      <div className="form-container">
        <ControlButton
          ref={addNewBtnRef}
          type="button"
          onClick={(e) => addProject(e)}
          classNames="add-button"
          buttonText="new project"
          ariaLabel="add"
          attributes={{
            id: "add-new-btn",
            form: "projects-form",
          }}
        >
          <span className="icon-container">
            <AddIcon className="icon" />
          </span>
        </ControlButton>
        <Spacer axis="vertical" size="20" />
        <form id="projects-form" onSubmit={(e) => submitEdit(e)}>
          <div className="flex-container">
            {projects.map((proj, index) => {
              return (
                <div key={proj.id}>
                  <ProjectForm
                    ref={removeBtnRefs.current[index]}
                    projIndex={index}
                    userId={user.id}
                    projectId={proj.id}
                    userProjectName={proj.project_title || ""}
                    projectName={{
                      projectNameInput: proj.projectNameInput,
                      projectStatus: proj.projectStatus,
                      projectChange: proj.projectChange,
                    }}
                    userProjectImage={proj.project_img || ""}
                    projectImage={{
                      imageInput: proj.imageInput,
                      imageChange: proj.imageChange,
                      shouldRemoveUserImage: proj.shouldRemoveUserImage,
                    }}
                    userProjectLink={proj.link || ""}
                    projectLink={{
                      linkInput: proj.linkInput,
                      linkStatus: proj.linkStatus,
                      linkChange: proj.linkChange,
                    }}
                    userProjectDescription={proj.project_description || ""}
                    projectDescription={{
                      descriptionInput: proj.descriptionInput,
                      descriptionStatus: proj.descriptionStatus,
                      descriptionChange: proj.descriptionChange,
                    }}
                    updateProject={updateProject}
                    removeProject={removeProject}
                    removeProjectFocusManagement={removeProjectFocusManagement}
                    isSubmitting={isSubmittingRef}
                  />
                </div>
              );
            })}
          </div>
          <Spacer axis="vertical" size="25" />
          <div className="button-container">
            <ControlButton
              type="submit"
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              buttonText={`${
                formStatus === FORM_STATUS.active ? "Submit" : ""
              }${formStatus === FORM_STATUS.loading ? "loading..." : ""}${
                formStatus === FORM_STATUS.success ? "Success!" : ""
              }${formStatus === FORM_STATUS.error ? "Re-Submit" : ""}`}
            />
          </div>
        </form>
      </div>
    </FormSection>
  );
}

const InfoSection = styled.section`
  .info-heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 7px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));
    justify-items: stretch;
    align-items: start;
    grid-gap: 35px;
  }

  .info-group {
    .image-container {
      img {
        width: 125px;
        height: 125px;

        @media (min-width: 500px) {
          width: 150px;
          height: 150px;
        }
      }
    }
  }
`;

const FormSection = styled.section`
  .edit-info-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 7px;
  }

  .error-summary {
    padding: 15px;
    border: 3px dashed red;
  }

  .form-container {
    .flex-container {
      display: flex;
      flex-direction: column;
      gap: 50px;
    }

    .add-button {
      width: 100%;
      max-width: 350px;
      .icon {
        height: 1rem;
      }
    }
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;

    button {
      width: 100%;
      max-width: 350px;
    }
  }
`;

export default DashboardProjects;
