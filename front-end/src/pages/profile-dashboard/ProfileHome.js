import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

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
        <h2 id="profile-checklist">Checklist{totalProgress}</h2>

        <section aria-labelledby="personal-info-checklist">
          <h3>
            <button type="button" aria-expanded="false">
              <span>Personal Info</span>
              <span>progress bar && progress text</span>
              <span>SVG</span>
            </button>{" "}
          </h3>

          <div className="flex-container">
            <div>
              <h4>First Name</h4>
              {user.first_name ? (
                user.first_name
              ) : (
                <Link to={`${url}/personal-info`}>edit first name</Link>
              )}
            </div>

            <div>
              <h4>Last Name</h4>
              {user.last_name ? (
                user.last_name
              ) : (
                <Link to={`${url}/personal-info`}>edit last name</Link>
              )}
            </div>

            <div>
              <h4>Profile Image</h4>
              {user.profile_image || user.avatar_image ? (
                "profile image set"
              ) : (
                <Link to={`${url}/personal-info`}>edit image</Link>
              )}
            </div>

            <div>
              <h4>Area of Work</h4>
              {user.area_of_work ? (
                user.area_of_work
              ) : (
                <Link to={`${url}/personal-info`}>edit area of work</Link>
              )}
            </div>

            <div>
              <h4>Title</h4>
              {user.desired_title ? (
                user.desired_title
              ) : (
                <Link to={`${url}/personal-info`}>edit title</Link>
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
      </ChecklistSection>
    </>
  );
}

const ChecklistSection = styled.section`
  width: 100%;
  border: solid;
`;

export default ProfileHome;
