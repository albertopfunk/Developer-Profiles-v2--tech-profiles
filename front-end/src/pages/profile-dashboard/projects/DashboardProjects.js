import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import ProjectForm from "../../../components/forms/user-extras/ProjectForm";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { FORM_STATUS } from "../../../global/helpers/variables";
import { httpClient } from "../../../global/helpers/http-requests";
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function DashboardProjects() {
  const { user, addUserExtras } = useContext(ProfileContext);

  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [projects, setProjects] = useState([]);
  const [projectsChange, setProjectsChange] = useState(false);
  const [idTracker, setIdTracker] = useState(1);

  let errorSummaryRef = React.createRef();

  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
    // eslint-disable-next-line
  }, [formStatus]);

  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);

    const updatedUserProjects = user.projects.map((proj) => {
      return {
        ...proj,
        projectStatus: FORM_STATUS.idle,
        projectChange: false,

        imageInput: "",
        imageInputId: "",
        imageChange: false,
        shouldRemoveUserImage: false,

        linkStatus: FORM_STATUS.idle,
        linkChange: false,

        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,
      };
    });

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

    setProjects([
      ...projects,

      {
        id: `new-${idTracker}`,

        project_title: "",
        projectStatus: FORM_STATUS.idle,
        projectChange: false,

        imageInput: "",
        imageInputId: "",
        imageChange: false,
        shouldRemoveUserImage: false,

        link: "",
        linkStatus: FORM_STATUS.idle,
        linkChange: false,

        project_description: "",
        descriptionStatus: FORM_STATUS.idle,
        descriptionChange: false,
      },
    ]);

    setIdTracker(idTracker + 1);
    setProjectsChange(true);
  }

  function removeProject(id) {
    const filteredProjects = projects.filter((proj) => proj.id !== id);
    setProjects(filteredProjects);
    setProjectsChange(true);
  }

  function checkFormErrors() {
    return projects.filter((proj) => {
      let isErrors = false;
      if (
        proj.project_title.trim() === "" ||
        proj.projectStatus === FORM_STATUS.error ||
        proj.link.trim() === "" ||
        proj.linkStatus === FORM_STATUS.error ||
        proj.project_description.trim() === "" ||
        proj.descriptionStatus === FORM_STATUS.error
      ) {
        isErrors = true;
      }

      return isErrors;
    });
  }

  function addNewProjects() {
    const requests = [];

    projects.forEach((proj) => {
      if (!Number.isInteger(proj.id)) {
        requests.push({
          method: "POST",
          url: `/extras/new/projects`,
          data: {
            project_title: proj.project_title,
            project_img: proj.imageInput,
            image_id: proj.imageInputId,
            link: proj.link,
            project_description: proj.project_description,
            user_id: user.id,
          },
        });
      }
    });

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

  function updateUserProjects() {
    const requests = [];

    projects.forEach((proj) => {
      if (Number.isInteger(proj.id)) {
        const data = {};

        if (proj.projectChange) {
          data.project_title = proj.project_title;
        }

        if (proj.imageChange) {
          httpClient("POST", "/api/delete-image", {
            id: proj.id,
          });

          if (proj.shouldRemoveUserImage) {
            data.project_img = "";
            data.image_id = "";
          } else {
            data.project_img = proj.imageInput;
            data.image_id = proj.imageInputId;
          }
        }

        if (proj.linkChange) {
          data.link = proj.link;
        }

        if (proj.descriptionChange) {
          data.project_description = proj.project_description;
        }

        requests.push({
          method: "PUT",
          url: `/extras/projects/${proj.id}`,
          data,
        });
      }
    });

    return requests;
  }

  async function submitEdit(e) {
    e.preventDefault();
    let requests = [];

    const formErrors = checkFormErrors();
    if (formErrors.length > 0) {
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    if (projectsChange) {
      const newProjRequests = addNewProjects();
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
      const updatedProjRequests = updateUserProjects();
      requests = [...requests, ...updatedProjRequests];
    }

    if (requests.length === 0) {
      return;
    }

    setFormStatus(FORM_STATUS.loading);
    await addUserExtras(requests);
    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
    }, 1000);
    setFormStatus(FORM_STATUS.success);
  }

  console.log("-- dash projects", projects);

  if (formStatus === FORM_STATUS.idle) {
    return (
      <main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
        <Helmet>
          <title>Profile Dashboard Projects • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Projects</h1>

        <section aria-labelledby="current-information-heading">
          <h2 id="current-information-heading">Current Information</h2>

          <button onClick={setFormInputs}>Edit</button>

          {user.projects.length > 0 ? (
            user.projects.map((proj) => (
              <div key={proj.id}>
                <h3>{`Current "${proj.project_title}" Project`}</h3>
                <ul aria-label={`${proj.project_title} Project`}>
                  <li>Project Name: {proj.project_title}</li>
                  <li>
                    {proj.project_img ? (
                      <>
                        <p>Project Pic:</p>
                        <img src={proj.project_img} alt="project pic" />
                      </>
                    ) : (
                      "Project Pic: None Set"
                    )}
                  </li>
                  <li>Project Link: {proj.link}</li>
                  <li>Description: {proj.project_description}</li>
                </ul>
              </div>
            ))
          ) : (
            <p>No Projects</p>
          )}
        </section>
      </main>
    );
  }

  let formErrors;
  if (formStatus === FORM_STATUS.error) {
    formErrors = checkFormErrors();
  }

  console.log("-- Dash Projects --", user);

  return (
    <Main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
      <Helmet>
        <title>Profile Dashboard Projects • Tech Profiles</title>
      </Helmet>

      <h1 id="main-heading">Projects</h1>

      <section aria-labelledby="edit-information-heading">
        <h2 id="edit-information-heading">Edit Information</h2>

        {formStatus === FORM_STATUS.error ? (
          <div ref={errorSummaryRef} tabIndex="-1">
            <h3 id="error-heading">Errors in Submission</h3>
            <>
              <strong>
                Please address the following errors and re-submit the form:
              </strong>

              {formErrors.length > 0 ? (
                formErrors.map((proj) => (
                  <div key={proj.id}>
                    <h4>{`Current "${
                      proj.project_title || "New Project"
                    }" Errors`}</h4>

                    <ul
                      aria-label={`current ${
                        proj.project_title || "new project"
                      } errors`}
                    >
                      {proj.project_title.trim() === "" ||
                      proj.projectStatus === FORM_STATUS.error ? (
                        <li>
                          <a href={`#project-${proj.id}`}>project Name Error</a>
                        </li>
                      ) : null}

                      {proj.link.trim() === "" ||
                      proj.linkStatus === FORM_STATUS.error ? (
                        <li>
                          <a href={`#link-${proj.id}`}>Link Error</a>
                        </li>
                      ) : null}

                      {proj.project_description.trim() === "" ||
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

        <div>
          <button
            form="projects-form"
            type="button"
            aria-label="add new project"
            onClick={(e) => addProject(e)}
          >
            + New Project
          </button>

          <form id="projects-form" onSubmit={(e) => submitEdit(e)}>
            {projects.map((proj, index) => {
              return (
                <div key={proj.id}>
                  <ProjectForm
                    projIndex={index}
                    userId={proj.id}
                    userProjectName={proj.project_title}
                    userProjectImage={proj.project_img}
                    userProjectImageId={proj.image_id}
                    userProjectLink={proj.link}
                    userDescription={proj.project_description}
                    updateProject={updateProject}
                    removeProject={removeProject}
                  />
                </div>
              );
            })}

            <button
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              type="submit"
            >
              {formStatus === FORM_STATUS.active ? "Submit" : null}
              {formStatus === FORM_STATUS.loading ? "loading..." : null}
              {formStatus === FORM_STATUS.success ? "Success!" : null}
              {formStatus === FORM_STATUS.error ? "Re-Submit" : null}
            </button>
            <button
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              type="reset"
              onClick={() => setFormStatus(FORM_STATUS.idle)}
            >
              Cancel
            </button>
          </form>
        </div>
      </section>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default DashboardProjects;
