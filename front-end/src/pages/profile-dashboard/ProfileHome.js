import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

import { ProfileContext } from "../../global/context/user-profile/ProfileContext";

function ProfileHome() {
  const { user } = useContext(ProfileContext);
  console.dir(user);
  let { url } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Dashboard Home • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Home</h1>
      <ChecklistSection>
        <h2>Checklist</h2>
        <section>
          <h3>Personal Info</h3>
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
