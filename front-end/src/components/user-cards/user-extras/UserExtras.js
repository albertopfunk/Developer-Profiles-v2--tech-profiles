import React from "react";

import UserProjects from "./UserProjects";
import UserEducation from "./UserEducation";
import UserExperience from "./UserExperience";
import { useState } from "react";
import { httpClient } from "../../http-requests";

function UserExtras(props) {
  const [fullUser, setFullUser] = useState({});
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [noExtras, setNoExtras] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [hasRequestedExtras, setHasRequestedExtras] = useState(false);

  async function expandUserCard() {
    if (hasRequestedExtras) {
      setIsCardExpanded(true);
      props.setIsCardExpanded(true);
      return;
    }

    setLoadingExtras(true);
    const [res, err] = await httpClient(
      "GET",
      `/users/get-full/${props.userId}`
    );

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    if (
      res.data.locations.length === 0 &&
      res.data.top_skills.length === 0 &&
      res.data.additional_skills.length === 0 &&
      res.data.education.length === 0 &&
      res.data.experience.length === 0 &&
      res.data.projects.length === 0
    ) {
      setNoExtras(true);
      setHasRequestedExtras(true);
      props.setIsCardExpanded(true);
      setIsCardExpanded(true);
      setLoadingExtras(false);
      return;
    }

    setFullUser(res.data);
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
    top_skills,
    additional_skills,
    projects,
    education,
    experience,
    locations
  } = fullUser;

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

          {top_skills.length > 0 ? (
            <section className="top-skills">
              {top_skills.map(skill => (
                <p key={skill.name}>{skill.name}</p>
              ))}
            </section>
          ) : null}

          {additional_skills.length > 0 ? (
            <section className="additional-skills">
              {additional_skills.map(skill => (
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
