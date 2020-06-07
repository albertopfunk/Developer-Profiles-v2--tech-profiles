import React, { useEffect } from "react";

import UserProjects from "./UserProjects";
import UserEducation from "./UserEducation";
import UserExperience from "./UserExperience";
import { useState } from "react";
import { httpClient } from "../../http-requests";

function UserExtras(props) {
  const [userExtras, setUserExtras] = useState({});
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [noExtras, setNoExtras] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [hasRequestedExtras, setHasRequestedExtras] = useState(false);

  useEffect(() => {
    // pass extras props from dashboard

    if (props.dashboard) {
      setHasRequestedExtras(true);
      setUserExtras(props.extras);

      // check if there are any extras
      if (
        props.extras.locations.length === 0 &&
        props.extras.topSkills.length === 0 &&
        props.extras.additionalSkills.length === 0 &&
        props.extras.education.length === 0 &&
        props.extras.experience.length === 0 &&
        props.extras.projects.length === 0
      ) {
        setNoExtras(true);
      }

      // closes card when extras props is updated
      setIsCardExpanded(false);
      props.setIsCardExpanded(false);
    }
  }, [props.extras]);

  async function expandUserCard() {
    if (hasRequestedExtras) {
      setIsCardExpanded(true);
      props.setIsCardExpanded(true);
      return;
    }

    setLoadingExtras(true);
    const [res, err] = await httpClient(
      "GET",
      `/users/get-extras/${props.userId}`
    );

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
      props.setIsCardExpanded(true);
      setIsCardExpanded(true);
      setLoadingExtras(false);
      return;
    }

    setUserExtras(res.data);
    setHasRequestedExtras(true);
    props.setIsCardExpanded(true);
    setIsCardExpanded(true);
    setLoadingExtras(false);
  }

  function closeUserCard() {
    setIsCardExpanded(false);
    props.setIsCardExpanded(false);
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
