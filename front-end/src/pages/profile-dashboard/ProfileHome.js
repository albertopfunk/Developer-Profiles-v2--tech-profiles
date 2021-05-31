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

  console.log(
    totalProgress,
    personalInfo,
    aboutYou,
    whereToFindYou,
    projects,
    education,
    experience,
    billing,
    isExpanded,
    typeof setIsExpanded
  );

  return (
    <>
      <Helmet>
        <title>Dashboard Home • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Home</h1>

      <ChecklistSection aria-labelledby="profile-checklist">
        <h2 id="profile-checklist">Profile Checklist</h2>
        <div>{totalProgress}%</div>

        <div className="main-container">
          <section aria-labelledby="personal-info-checklist">
            <h3 id="personal-info-checklist">
              <button
                type="button"
                className="section-button"
                aria-expanded={isExpanded.personalInfo}
                onClick={() => setIsExpanded({...isExpanded, personalInfo: !isExpanded.personalInfo})}
              >
                <div className="title-container">
                  <span className="title">Personal Info</span>
                  <span className="progress-bar">
                    progress bar && {personalInfo.progress}%
                  </span>
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
              <div className="info-container">
                <h4 className="title">First Name:</h4>

                {user.first_name ? (
                  <p className="info">
                    {user.first_name}
                    <span className="icon">
                      <Checkmark />
                    </span>
                  </p>
                ) : (
                  <Link to={`${url}/personal-info`} className="info">
                    edit first name
                  </Link>
                )}
              </div>

              <div className="info-container">
                <h4 className="title">Last Name:</h4>
                {user.last_name ? (
                  <p className="info">
                    {user.last_name}
                    <span className="icon">
                      <Checkmark />
                    </span>
                  </p>
                ) : (
                  <Link to={`${url}/personal-info`} className="info">
                    edit last name
                  </Link>
                )}
              </div>

              <div className="info-container">
                <h4 className="title">Profile Image:</h4>
                {user.profile_image || user.avatar_image ? (
                  <p className="info">
                    profile image set
                    <span className="icon">
                      <Checkmark />
                    </span>
                  </p>
                ) : (
                  <Link to={`${url}/personal-info`} className="info">
                    edit image
                  </Link>
                )}
              </div>

              <div className="info-container">
                <h4 className="title">Area of Work:</h4>
                {user.area_of_work ? (
                  <p className="info">
                    {user.area_of_work}
                    <span className="icon">
                      <Checkmark />
                    </span>
                  </p>
                ) : (
                  <Link to={`${url}/personal-info`} className="info">
                    edit area of work
                  </Link>
                )}
              </div>

              <div className="info-container">
                <h4 className="title">Title:</h4>
                {user.desired_title ? (
                  <p className="info">
                    {user.desired_title}
                    <span className="icon">
                      <Checkmark />
                    </span>
                  </p>
                ) : (
                  <Link to={`${url}/personal-info`} className="info">
                    edit title
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3>About You</h3>
            summary interested locations top skills additional skills
          </section>
          <section>
            <h3>Where to Find You</h3>
            github twitter linkedin portfolio current location
          </section>
          <section>
            <h3>Projects</h3>
            either no projects or list out project names
          </section>
          <section>
            <h3>Education</h3>
            either no education or list out education names
          </section>
          <section>
            <h3>Experience</h3>
            either no experience or list out experience names
          </section>
          <section>
            <h3>Billing</h3>
            no billing or current status
          </section>
        </div>
      </ChecklistSection>
    </>
  );
}

const ChecklistSection = styled.section`
  width: 100%;
  background-color: blue;

  .main-container {
    padding-top: 30px;
    background-color: white;

    section {
      border-top: solid;
    }
  }

  .section-button {
    border: none;
    background-color: white;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;

    .title-container {
      flex-basis: 90%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .icon-container {
      flex-basis: 10%;
      height: 100%;
      max-width: 25px;
      
      .icon {
        height: 100%;
        width: 100%;
        
      }
    }
  }

  .section-info {

  }
  
  .section-info.hidden {
    display: none;
  }

`;

export default ProfileHome;
