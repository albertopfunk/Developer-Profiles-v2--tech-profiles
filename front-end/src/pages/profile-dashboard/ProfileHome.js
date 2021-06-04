import React, { useContext, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { ReactComponent as Expand } from "../../global/assets/dashboard-add.svg";
import { ReactComponent as Collapse } from "../../global/assets/dashboard-subtract.svg";
import { ReactComponent as Checkmark } from "../../global/assets/dashboard-checkmark.svg";

import { ProfileContext } from "../../global/context/user-profile/ProfileContext";
import useProfileProgress from "../../global/helpers/hooks/useProfileProgress";

/*
  - profile progress percent(all user)
  - section progress percent
  - is section expanded
  - individual progress, link vs complete


  progress = Math.ceil(completed / target * 100);

  USER 19/19

  personal info 5/5
  - first name
  - last name
  - profile image
  - area of work
  - title

  about you 4/4
  - summary
  - interested locations ul
  - top skills ul
  - additional skills ul

  where to find you 6/6
  - github
  - twitter
  - linkedin
  - portfolio
  - !public email
  - current location

  projects 1/1
  - ul list or none

  education 1/1
  - ul list or none

  experience 1/1
  - ul list or none

  billing 1/1
  - quick info or none



  profileProgress = useState(() => {
    const total = 19
    const progress = 0

    user.first_name ? progress++ : null
    user.last_name ? progress++ : null
    user.profile_image || user.avatar_image ?
      progress++
      :
      null
    user.area_of_work ? progress++ : null
    user.title ? progress++ : null

    user.summary ? progress++ : null
    user.interested_locations?.length > 0 ? progress++ : null
    user.top_skills?.length > 0 ? progress++ : null
    user.additional_skills?.length > 0 ? progress++ : null

    user.github ? progress++ : null
    user.twitter ? progress++ : null
    user.linkedin ? progress++ : null
    user.portfolio ? progress++ : null
    user.public_email ? progress++ : null
    user.current_location_name ? progress++ : null

    user.projects?.length > 0 ? progress++ : null
    user.education?.length > 0 ? progress++ : null
    user.experience?.length > 0 ? progress++ : null

    user.stripe_subscription_name ? progress++ : null

  })

  personalInfo = useState(() => {


    return {
      progress
    }
  })

*/

function ProfileHome() {
  let { url } = useRouteMatch();
  const { user } = useContext(ProfileContext);

  const {
    totalProgress,
    personalInfo,
    aboutYou,
    whereToFindYou,
    projects,
    education,
    experience,
    billing,
  } = useProfileProgress();

  const [isExpanded, setIsExpanded] = useState({
    personalInfo: false,
    aboutYou: false,
    whereToFindYou: false,
    projects: false,
    education: false,
    experience: false,
    billing: false,
  });

  console.log(projects, education, experience, billing);

  return (
    <>
      <Helmet>
        <title>Dashboard Home • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Home</h1>

      <ChecklistSection aria-labelledby="profile-checklist">
        <h2 id="profile-checklist">Profile Checklist</h2>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <span className="bar" style={{ width: `${totalProgress}%` }}></span>
          </div>
          <div className="progress-info">
            <p>{`${totalProgress}%`}</p>
          </div>
        </div>

        <div className="main-container">
          <section aria-labelledby="personal-info-checklist">
            <h3 id="personal-info-checklist">
              <button
                type="button"
                className="section-button"
                aria-expanded={isExpanded.personalInfo}
                onClick={() =>
                  setIsExpanded({
                    ...isExpanded,
                    personalInfo: !isExpanded.personalInfo,
                  })
                }
              >
                <div className="title-container">
                  <span className="title">Personal Info</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <span
                        className="bar"
                        style={{ width: `${personalInfo.progress}%` }}
                      ></span>
                    </div>
                    <div className="progress-info">
                      <p>{`${personalInfo.progress}%`}</p>
                    </div>
                  </div>
                </div>
                <div className="icon-container">
                  {isExpanded.personalInfo ? (
                    <Collapse className="icon" />
                  ) : (
                    <Expand className="icon" />
                  )}
                </div>
              </button>
            </h3>

            <div
              className={`section-info ${
                isExpanded.personalInfo ? "" : "hidden"
              }`}
            >
              <div className="flex-row">
                <div className="flex-col">
                  <div className="info-container">
                    <h4 className="title">First Name:</h4>
                    {user.first_name ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {user.first_name}
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/personal-info`} className="info">
                        add your first name
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Last Name:</h4>
                    {user.last_name ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">{user.last_name}</span>
                      </p>
                    ) : (
                      <Link to={`${url}/personal-info`} className="info">
                        add your last name
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Profile Image:</h4>
                    {user.profile_image || user.avatar_image ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          profile image set
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/personal-info`} className="info">
                        add an image
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex-col">
                  <div className="info-container">
                    <h4 className="title">Area of Work:</h4>
                    {user.area_of_work ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {user.area_of_work}
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/personal-info`} className="info">
                        add your area of work
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Title:</h4>
                    {user.desired_title ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {user.desired_title}
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/personal-info`} className="info">
                        add a title
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="about-you-checklist">
            <h3 id="about-you-checklist">
              <button
                type="button"
                className="section-button"
                aria-expanded={isExpanded.aboutYou}
                onClick={() =>
                  setIsExpanded({
                    ...isExpanded,
                    aboutYou: !isExpanded.aboutYou,
                  })
                }
              >
                <div className="title-container">
                  <span className="title">About You</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <span
                        className="bar"
                        style={{ width: `${aboutYou.progress}%` }}
                      ></span>
                    </div>
                    <div className="progress-info">
                      <p>{`${aboutYou.progress}%`}</p>
                    </div>
                  </div>
                </div>
                <div className="icon-container">
                  {isExpanded.aboutYou ? (
                    <Collapse className="icon" />
                  ) : (
                    <Expand className="icon" />
                  )}
                </div>
              </button>
            </h3>

            <div
              className={`section-info ${isExpanded.aboutYou ? "" : "hidden"}`}
            >
              <div className="flex-row">
                <div className="flex-col">
                  <div className="info-container">
                    <h4 className="title">Summary:</h4>
                    {user.summary ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">summary set</span>
                      </p>
                    ) : (
                      <Link to={`${url}/about-you`} className="info">
                        add a summary
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Interested Locations:</h4>
                    {user.locations?.length > 0 ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {user.locations.length}{" "}
                          {user.locations.length === 1
                            ? "location"
                            : "locations"}{" "}
                          set
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/about-you`} className="info">
                        add your interested locations
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex-col">
                  <div className="info-container">
                    <h4 className="title">Top Skills:</h4>
                    {user.topSkills?.length > 0 ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {user.topSkills.length}{" "}
                          {user.topSkills.length === 1
                            ? "top skill"
                            : "top skills"}{" "}
                          set
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/about-you`} className="info">
                        add some top skills
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Additional Skills:</h4>
                    {user.additionalSkills?.length > 0 ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {user.additionalSkills.length}{" "}
                          {user.additionalSkills.length === 1
                            ? "additional skill"
                            : "additional skills"}{" "}
                          set
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/about-you`} className="info">
                        add some additional skills
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="where-to-find-you-checklist">
            <h3 id="where-to-find-you-checklist">
              <button
                type="button"
                className="section-button"
                aria-expanded={isExpanded.whereToFindYou}
                onClick={() =>
                  setIsExpanded({
                    ...isExpanded,
                    whereToFindYou: !isExpanded.whereToFindYou,
                  })
                }
              >
                <div className="title-container">
                  <span className="title">Where to Find You</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <span
                        className="bar"
                        style={{ width: `${whereToFindYou.progress}%` }}
                      ></span>
                    </div>
                    <div className="progress-info">
                      <p>{`${whereToFindYou.progress}%`}</p>
                    </div>
                  </div>
                </div>
                <div className="icon-container">
                  {isExpanded.whereToFindYou ? (
                    <Collapse className="icon" />
                  ) : (
                    <Expand className="icon" />
                  )}
                </div>
              </button>
            </h3>

            <div
              className={`section-info ${
                isExpanded.whereToFindYou ? "" : "hidden"
              }`}
            >
              <div className="flex-row">
                <div className="flex-col">
                  <div className="info-container">
                    <h4 className="title">Github:</h4>
                    {user.github ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">github link set</span>
                      </p>
                    ) : (
                      <Link to={`${url}/where-to-find-you`} className="info">
                        add your github link
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Twitter:</h4>
                    {user.twitter ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">twitter link set</span>
                      </p>
                    ) : (
                      <Link to={`${url}/where-to-find-you`} className="info">
                        add your twitter link
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Linkedin:</h4>
                    {user.linkedin ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          linkedin link set
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/where-to-find-you`} className="info">
                        add your linkedin link
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex-col">
                  <div className="info-container">
                    <h4 className="title">Portfolio:</h4>
                    {user.portfolio ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          portfolio link set
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/where-to-find-you`} className="info">
                        add your portfolio link
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Public Email:</h4>
                    {user.public_email ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {user.public_email}
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/where-to-find-you`} className="info">
                        add your public email
                      </Link>
                    )}
                  </div>

                  <div className="info-container">
                    <h4 className="title">Current Location:</h4>
                    {user.current_location_name ? (
                      <p className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {user.current_location_name}
                        </span>
                      </p>
                    ) : (
                      <Link to={`${url}/where-to-find-you`} className="info">
                        add your current location
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="projects-checklist">
            <h3 id="projects-checklist">
              <button
                type="button"
                className="section-button"
                aria-expanded={isExpanded.projects}
                onClick={() =>
                  setIsExpanded({
                    ...isExpanded,
                    projects: !isExpanded.projects,
                  })
                }
              >
                <div className="title-container">
                  <span className="title">Projects</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <span
                        className="bar"
                        style={{ width: `${projects.progress}%` }}
                      ></span>
                    </div>
                    <div className="progress-info">
                      <p>{`${projects.progress}%`}</p>
                    </div>
                  </div>
                </div>
                <div className="icon-container">
                  {isExpanded.projects ? (
                    <Collapse className="icon" />
                  ) : (
                    <Expand className="icon" />
                  )}
                </div>
              </button>
            </h3>

            <div
              className={`section-info ${isExpanded.projects ? "" : "hidden"}`}
            >
              <div className="info-container">
                <h4 className="title">Project list:</h4>
                {user.projects?.length > 0 ? (
                  <ul className="info-group" aria-label="saved projects">
                    {user.projects.map((project) => (
                      <li key={project.id} className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {project.project_title}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link to={`${url}/projects`} className="info">
                    add a project
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="education-checklist">
            <h3 id="education-checklist">
              <button
                type="button"
                className="section-button"
                aria-expanded={isExpanded.education}
                onClick={() =>
                  setIsExpanded({
                    ...isExpanded,
                    education: !isExpanded.education,
                  })
                }
              >
                <div className="title-container">
                  <span className="title">Education</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <span
                        className="bar"
                        style={{ width: `${education.progress}%` }}
                      ></span>
                    </div>
                    <div className="progress-info">
                      <p>{`${education.progress}%`}</p>
                    </div>
                  </div>
                </div>
                <div className="icon-container">
                  {isExpanded.education ? (
                    <Collapse className="icon" />
                  ) : (
                    <Expand className="icon" />
                  )}
                </div>
              </button>
            </h3>

            <div
              className={`section-info ${isExpanded.education ? "" : "hidden"}`}
            >
              <div className="info-container">
                <h4 className="title">Education list:</h4>
                {user.education?.length > 0 ? (
                  <ul className="info-group" aria-label="saved education">
                    {user.education.map((education) => (
                      <li key={education.id} className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {education.school}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link to={`${url}/education`} className="info">
                    add education
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="experience-checklist">
            <h3 id="experience-checklist">
              <button
                type="button"
                className="section-button"
                aria-expanded={isExpanded.experience}
                onClick={() =>
                  setIsExpanded({
                    ...isExpanded,
                    experience: !isExpanded.experience,
                  })
                }
              >
                <div className="title-container">
                  <span className="title">Experience</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <span
                        className="bar"
                        style={{ width: `${experience.progress}%` }}
                      ></span>
                    </div>
                    <div className="progress-info">
                      <p>{`${experience.progress}%`}</p>
                    </div>
                  </div>
                </div>
                <div className="icon-container">
                  {isExpanded.experience ? (
                    <Collapse className="icon" />
                  ) : (
                    <Expand className="icon" />
                  )}
                </div>
              </button>
            </h3>

            <div
              className={`section-info ${
                isExpanded.experience ? "" : "hidden"
              }`}
            >
              <div className="info-container">
                <h4 className="title">experience list:</h4>
                {user.experience?.length > 0 ? (
                  <ul className="info-group" aria-label="saved experience">
                    {user.experience.map((experience) => (
                      <li key={experience.id} className="info">
                        <span className="icon-container">
                          <Checkmark className="icon" />
                        </span>
                        <span className="text-container">
                          {experience.company_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link to={`${url}/experience`} className="info">
                    add experience
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section aria-labelledby="billing-checklist">
            <h3 id="billing-checklist">
              <button
                type="button"
                className="section-button"
                aria-expanded={isExpanded.billing}
                onClick={() =>
                  setIsExpanded({
                    ...isExpanded,
                    billing: !isExpanded.billing,
                  })
                }
              >
                <div className="title-container">
                  <span className="title">Billing</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <span
                        className="bar"
                        style={{ width: `${billing.progress}%` }}
                      ></span>
                    </div>
                    <div className="progress-info">
                      <p>{`${billing.progress}%`}</p>
                    </div>
                  </div>
                  </div>
                <div className="icon-container">
                  {isExpanded.billing ? (
                    <Collapse className="icon" />
                  ) : (
                    <Expand className="icon" />
                  )}
                </div>
              </button>
            </h3>

            <div
              className={`section-info ${isExpanded.billing ? "" : "hidden"}`}
            >
              <div className="info-container">
                <h4 className="title">Billing:</h4>
                {user.stripe_subscription_name ? (
                  <p className="info">
                    <span className="icon-container">
                      <Checkmark className="icon" />
                    </span>
                    <span className="text-container">subscribed</span>
                  </p>
                ) : (
                  <Link to={`${url}/billing`} className="info">
                    subscribe to go live
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </ChecklistSection>
    </>
  );
}

const ChecklistSection = styled.section`
  width: 100%;
  background-color: ghostwhite;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);

  .progress-bar-container {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    .progress-bar {
      flex-basis: 80%;
      width: 100%;
      height: 10px;
      padding: 3px;
      background-color: #555;
      border-radius: 25px;
      box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);

      .bar {
        display: block;
        height: 100%;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        background-color: rgb(43, 194, 83);
        box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3),
          inset 0 -2px 6px rgba(0, 0, 0, 0.4);
      }
    }

    .progress-info {
      flex-basis: 20%;
      text-align: start;
      font-size: 0.6rem;
      line-height: 1;
    }
  }

  .main-container {
    padding-top: 5px;
    section {
      border-top: solid;
      &:last-child {
        border-bottom: solid;
      }
    }
  }

  .section-button {
    border: none;
    background-color: white;
    padding: 5px;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-container {
      flex-basis: 90%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .icon-container {
      flex-basis: 10%;
      height: 100%;

      .icon {
        height: 100%;
        width: 100%;
        max-width: 25px;
      }
    }
  }

  .section-info {
    border-top: solid;
    padding: 5px;
  }

  .section-info.hidden {
    display: none;
  }

  .flex-row {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 280px) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
    }

    .flex-col {
      flex-basis: 0;
      flex-shrink: 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;
    }
  }

  .info-container {
    .info-group {
      list-style: none;
    }

    .info {
      font-size: 1rem;
      display: flex;
      gap: 5px;
      align-items: baseline;
      justify-content: flex-start;

      .text-container {
        display: inline-block;
      }

      .icon-container {
        display: inline-block;

        .icon {
          height: 0.8rem;
        }
      }
    }
  }
`;

export default ProfileHome;
