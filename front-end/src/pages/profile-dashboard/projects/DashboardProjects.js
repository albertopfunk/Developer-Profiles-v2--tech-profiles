import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {ReactComponent as EditIcon} from "../../../global/assets/dashboard-edit.svg";
import {ReactComponent as AddIcon} from "../../../global/assets/dashboard-add.svg";

import ProjectForm from "../../../components/forms/user-extras/ProjectForm";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { FORM_STATUS } from "../../../global/helpers/variables";
import { httpClient } from "../../../global/helpers/http-requests";
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function DashboardProjects() {
  const { user, addUserExtras } = useContext(ProfileContext);

  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [hasSubmitError, setHasSubmitError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectsChange, setProjectsChange] = useState(false);
  const [removedProjIndex, setRemovedProjIndex] = useState(null);
  const [removedProjUpdate, setRemovedProjUpdate] = useState(true);
  const [idTracker, setIdTracker] = useState(1);

  const errorSummaryRef = React.createRef();
  const editInfoBtnRef = React.createRef();
  const addNewBtnRef = React.createRef();
  const removeBtnRefs = useRef([]);

  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formStatus]);

  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  useEffect(() => {
    if (removedProjIndex === null) {
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

    if (removeBtnRefs.current[removedProjIndex]) {
      removeBtnRefs.current[removedProjIndex].current.focus();
    } else {
      removeBtnRefs.current[removedProjIndex - 1].current.focus();
    }
  }, [removedProjUpdate]);

  useEffect(() => {
    if (formFocusStatus) {
      if (formFocusStatus === FORM_STATUS.idle) {
        editInfoBtnRef.current.focus();
        return;
      }

      if (formFocusStatus === FORM_STATUS.active) {
        addNewBtnRef.current.focus();
      }
    }
  }, [formFocusStatus]);

  function formFocusAction(e, status) {
    // enter/space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    if (status === FORM_STATUS.active) {
      setFormInputs();
      setFormFocusStatus(FORM_STATUS.active);
      return;
    }

    if (status === FORM_STATUS.idle) {
      resetForm();
      setFormFocusStatus(FORM_STATUS.idle);
    }
  }

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);

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

    removeBtnRefs.current = updatedUserProjects.map(() => React.createRef());
    setProjects(updatedUserProjects);
  }

  function updateProject(index, state) {
    const newProjArr = [...projects];
    const newProjObj = { ...newProjArr[index], ...state };
    newProjArr.splice(index, 1, newProjObj);
    setProjects(newProjArr);
  }

  function addProject(e) {
    e.preventDefault();

    const currentProjects = [
      ...projects,

      {
        id: `new-${idTracker}`,

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
    setIdTracker(idTracker + 1);
    setProjectsChange(true);
  }

  function removeProject(projIndex) {
    const newProjects = [...projects];
    newProjects.splice(projIndex, 1);
    removeBtnRefs.current = newProjects.map(() => React.createRef());
    setProjects(newProjects);
    setRemovedProjIndex(projIndex);
    setRemovedProjUpdate(!removedProjUpdate);
    setProjectsChange(true);
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

    return requests;
  }

  async function submitEdit(e) {
    e.preventDefault();

    const formErrors = checkFormErrors();
    if (formErrors.length > 0 || hasSubmitError) {
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    // check for changes first
    setFormStatus(FORM_STATUS.loading);
    
    let requests = [];

    if (projectsChange) {
      const newProjRequests = await addNewProjects();

      if (newProjRequests?.error) {
        setFormStatus(FORM_STATUS.error);
        setHasSubmitError(true);
        return;
      }

      const removeProjRequests = removeUserProjects();
      requests = [...newProjRequests, ...removeProjRequests];
    }

    const userProjChange = projects.filter(
      (proj) =>
        Number.isInteger(proj.id) &&
        (proj.projectChange ||
          proj.imageChange ||
          proj.linkChange ||
          proj.descriptionChange)
    );

    if (userProjChange.length > 0) {
      const updatedProjRequests = await updateUserProjects();

      if (updatedProjRequests?.error) {
        setFormStatus(FORM_STATUS.error);
        setHasSubmitError(true);
        return;
      }

      requests = [...requests, ...updatedProjRequests];
    }

    if (requests.length === 0) {
      return;
    }

    const results = await addUserExtras(requests);

    if (results?.error) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      return;
    }

    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
      setHasSubmitError(null);
    }, 750);

    setFormStatus(FORM_STATUS.success);
  }

  function resetForm() {
    setFormStatus(FORM_STATUS.idle);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <InfoSection aria-labelledby="current-information-heading">
        <div className="info-heading">
          <h2 id="current-information-heading">Current Info</h2>
          <button
            ref={editInfoBtnRef}
            id="edit-info-btn"
            className="button edit-button"
            data-main-content="true"
            onClick={setFormInputs}
            onKeyDown={(e) => formFocusAction(e, FORM_STATUS.active)}
          >
            <span className="sr-only">Edit Information</span>
            <span className="button-icon">
              <EditIcon className="icon" />
            </span>
          </button>
        </div>
        {user.projects.length > 0 ? (
          user.projects.map((proj) => (
            <div key={proj.id}>
              <h3>{`Current "${proj.project_title}" Project`}</h3>
              <dl aria-label={`${proj.project_title} Project`}>
                <dt>Project Name:</dt>
                <dd>{proj.project_title}</dd>
                <dt>Project Pic:</dt>
                <dd>
                  {proj.project_img ? (
                    <img src={proj.project_img} alt="project pic" />
                  ) : (
                    "None Set"
                  )}
                </dd>
                <dt>Project Link:</dt>
                <dd>{proj.link}</dd>
                <dt>Description:</dt>
                <dd>{proj.project_description}</dd>
              </dl>
            </div>
          ))
        ) : (
          <p>No Projects</p>
        )}
      </InfoSection>
    );
  }

  let formErrors;
  if (formStatus === FORM_STATUS.error) {
    formErrors = checkFormErrors();
  }

  return (
    <FormSection aria-labelledby="edit-information-heading">
      <h2 id="edit-information-heading">Edit Info</h2>

      {formStatus === FORM_STATUS.error ? (
        <div ref={errorSummaryRef} tabIndex="-1">
          <h3 id="error-heading">Errors in Submission</h3>
          <>
            <strong>
              Please address the following errors and re-submit the form:
            </strong>
            {hasSubmitError ? (
              <div>
                <h4>Submit Error</h4>
                <p>Error submitting form, please try again</p>
              </div>
            ) : null}
            {formErrors.length > 0 ? (
              formErrors.map((proj) => (
                <div key={proj.id}>
                  <h4>{`Current "${
                    proj.projectNameInput || "New Project"
                  }" Errors`}</h4>

                  <ul
                    aria-label={`current ${
                      proj.projectNameInput || "new project"
                    } errors`}
                  >
                    {proj.projectNameInput.trim() === "" ||
                    proj.projectStatus === FORM_STATUS.error ? (
                      <li>
                        <a href={`#project-${proj.id}`}>project Name Error</a>
                      </li>
                    ) : null}

                    {proj.linkInput.trim() === "" ||
                    proj.linkStatus === FORM_STATUS.error ? (
                      <li>
                        <a href={`#link-${proj.id}`}>Link Error</a>
                      </li>
                    ) : null}

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
      ) : null}

      <div className="form-container">
        <button
          ref={addNewBtnRef}
          id="add-new-btn"
          className="button button-control add-button"
          data-main-content="true"
          form="projects-form"
          type="button"
          aria-label="add new project"
          onClick={(e) => addProject(e)}
        >
          <div className="button-text">
            <span className="text">
              New Project
            </span>
            <span className="icon-container">
              <AddIcon className="icon" />
            </span>
          </div>
        </button>

        <form id="projects-form" onSubmit={(e) => submitEdit(e)}>
          {projects.map((proj, index) => {
            return (
              <div key={proj.id}>
                <ProjectForm
                  ref={removeBtnRefs.current[index]}
                  projIndex={index}
                  userId={user.id}
                  projectId={proj.id}
                  userProjectName={proj.project_title || ""}
                  userProjectImage={proj.project_img || ""}
                  shouldRemoveImage={proj.shouldRemoveUserImage}
                  userProjectLink={proj.link || ""}
                  userProjectDescription={proj.project_description || ""}
                  updateProject={updateProject}
                  removeProject={removeProject}
                />
              </div>
            );
          })}

          <div className="button-container">
            <button
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              type="submit"
              className="button button-control"
            >
              <span className="button-text">
                {formStatus === FORM_STATUS.active ? "Submit" : null}
                {formStatus === FORM_STATUS.loading ? "loading..." : null}
                {formStatus === FORM_STATUS.success ? "Success!" : null}
                {formStatus === FORM_STATUS.error ? "Re-Submit" : null}
              </span>
            </button>
            <button
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              type="reset"
              className="button button-control"
              onClick={resetForm}
              onKeyDown={(e) => formFocusAction(e, FORM_STATUS.idle)}
            >
              <span className="button-text">
                Cancel
              </span>
            </button>
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

    .edit-button {
      width: 100%;
      max-width: 40px;
      border-radius: 10px;
      height: 40px;
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

const FormSection = styled.section`
  .form-container {
    .add-button {
      width: 100%;
      max-width: 350px;
      margin-bottom: 30px;
      font-size: .9rem;
      
      .button-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;

        .icon {
          height: 1rem;
        }
      }
    }
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;

    button {
      width: 100%;
      max-width: 350px;
    
      .button-text {
        padding: 7px 0;
      }
    }
  }
`;

export default DashboardProjects;
