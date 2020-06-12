import React, { useEffect } from "react";

import UserProjects from "./UserProjects";
import UserEducation from "./UserEducation";
import UserExperience from "./UserExperience";
import { useState } from "react";
import { httpClient } from "../../http-requests";

function UserExtras({ dashboard, extras, setAriaExpanded, userId }) {
  const [userExtras, setUserExtras] = useState({});
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [noExtras, setNoExtras] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [hasRequestedExtras, setHasRequestedExtras] = useState(false);

  useEffect(() => {
    // pass extras props from dashboard

    if (dashboard) {
      setHasRequestedExtras(true);
      setUserExtras(extras);

      if (
        extras.locations.length === 0 &&
        extras.topSkills.length === 0 &&
        extras.additionalSkills.length === 0 &&
        extras.education.length === 0 &&
        extras.experience.length === 0 &&
        extras.projects.length === 0
      ) {
        setNoExtras(true);
      } else {
        setNoExtras(false);
      }

      if (isCardExpanded) {
        setIsCardExpanded(false);
        setAriaExpanded(false);
      }
    }
    // still trying to figure out why certain dependencies are needed
    // dashboard - static, never changes
    // isCardExpanded - only two states(true/false), only one is checked,
    // it does not matter if that state was set 20 updates ago, it is static,
    // until user updates extras,
    // when I add it as a dep, and a user opens the card, this will run,
    // and close the card, so it creates a bug
    // setAriaExpanded - this is a useState fn
    // this useEffect only depends on extras
    // eslint-disable-next-line
  }, [extras]);

  async function expandUserCard() {
    if (hasRequestedExtras) {
      setIsCardExpanded(true);
      setAriaExpanded(true);
      return;
    }

    setLoadingExtras(true);
    const [res, err] = await httpClient("GET", `/users/get-extras/${userId}`);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    if (
      res.data.locations.length === 0 &&
      res.data.topSkills.length === 0 &&
      res.data.additionalSkills.length === 0 &&
      res.data.education.length === 0 &&
      res.data.experience.length === 0 &&
      res.data.projects.length === 0
    ) {
      setUserExtras(res.data);
      setNoExtras(true);
      setHasRequestedExtras(true);
      setAriaExpanded(true);
      setIsCardExpanded(true);
      setLoadingExtras(false);
      return;
    }

    setUserExtras(res.data);
    setHasRequestedExtras(true);
    setAriaExpanded(true);
    setIsCardExpanded(true);
    setLoadingExtras(false);
  }

  function closeUserCard() {
    setIsCardExpanded(false);
    setAriaExpanded(false);
  }

  const {
    topSkills,
    additionalSkills,
    projects,
    education,
    experience,
    locations
  } = userExtras;

  console.log("==========EXTRASSSS==========");

  return (
    <section>
      <section>
        {!isCardExpanded ? (
          <button disabled={loadingExtras} onClick={expandUserCard}>
            Expand
          </button>
        ) : (
          <button onClick={closeUserCard}>Close</button>
        )}
      </section>

      {!isCardExpanded ? null : (
        <div>
          {noExtras ? <p>Nothing to Show...</p> : null}

          {topSkills.length > 0 ? (
            <section className="top-skills">
              {topSkills.map(skill => (
                <p key={skill.name}>{skill.name}</p>
              ))}
            </section>
          ) : null}

          {additionalSkills.length > 0 ? (
            <section className="additional-skills">
              {additionalSkills.map(skill => (
                <p key={skill.name}>{skill.name}</p>
              ))}
            </section>
          ) : null}

          {projects.length > 0 ? <UserProjects projects={projects} /> : null}

          {education.length > 0 ? (
            <UserEducation education={education} />
          ) : null}

          {experience.length > 0 ? (
            <UserExperience experience={experience} />
          ) : null}

          {locations.length > 0 ? (
            <section className="interested-locations">
              {locations.map(location => (
                <p key={location.name}>{location.name}</p>
              ))}
            </section>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default UserExtras;
