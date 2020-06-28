import React, { useContext, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import AutoComplete from "../../../components/forms/autocomplete";
import { httpClient } from "../../../global/helpers/http-requests";

function AboutYou() {
  const { loadingUser, user, addUserExtras } = useContext(ProfileContext);
  const [editInputs, setEditInputs] = useState(false);
  const [summaryInput, setSummaryInput] = useState("");
  const [summaryInputChange, setSummaryInputChange] = useState(false);
  const [interestedLocations, setInterestedLocations] = useState([]);
  const [locationsChange, setlocationsChange] = useState(false);
  const [topSkills, setTopSkills] = useState([]);
  const [topSkillsChange, setTopSkillsChange] = useState(false);
  const [additionalSkills, setAdditionalSkills] = useState([]);
  const [additionalSkillsChange, setAdditionalSkillsChange] = useState(false);

  function onEditInputs() {
    setEditInputs(true);
    setSummaryInput(user.summary || "");
    setSummaryInputChange(false);
    setInterestedLocations(user.locations);
    setlocationsChange(false);
    setTopSkills(user.topSkills);
    setTopSkillsChange(false);
    setAdditionalSkills(user.additionalSkills);
    setAdditionalSkillsChange(false);
  }

  function onSummaryInputChange(value) {
    if (!summaryInputChange) {
      setSummaryInputChange(true);
    }
    setSummaryInput(value);
  }

  async function onLocationInputChange(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return [];
    }

    let checkDups = {};
    for (let i = 0; i < interestedLocations.length; i++) {
      checkDups[interestedLocations[i].name] = true;
    }
    const results = res.data.filter(
      prediction => !(prediction.name in checkDups)
    );
    return results;
  }

  function onLocationsChange(locations) {
    if (!locationsChange) {
      setlocationsChange(true);
    }
    setInterestedLocations(locations);
  }

  function onLocationsSubmit() {
    let locationsToRemove = [];
    let locationsToAdd = [...interestedLocations];
    let requests = [];

    let checkLocations = {};
    for (let i = 0; i < locationsToAdd.length; i++) {
      checkLocations[locationsToAdd[i].name] = true;
    }

    for (let i = 0; i < user.locations.length; i++) {
      if (user.locations[i].name in checkLocations) {
        locationsToAdd = locationsToAdd.filter(
          location => location.name !== user.locations[i].name
        );
      } else {
        locationsToRemove.push(user.locations[i]);
      }
    }

    if (locationsToAdd.length > 0) {
      requests.push({
        method: "POST",
        url: `/locations/new`,
        data: { locations: locationsToAdd, user_id: user.id }
      });
    }

    if (locationsToRemove.length > 0) {
      locationsToRemove.forEach(location => {
        requests.push({
          method: "POST",
          url: `/locations/delete-user-location`,
          data: { location_id: location.id, user_id: user.id }
        });
      });
    }
    return requests;
  }

  async function onSkillInputChange(value) {
    const [res, err] = await httpClient("POST", "/skills/autocomplete", {
      value
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return [];
    }

    let checkDups = {};
    for (let i = 0; i < topSkills.length; i++) {
      checkDups[topSkills[i].name] = true;
    }
    for (let i = 0; i < additionalSkills.length; i++) {
      checkDups[additionalSkills[i].name] = true;
    }
    const results = res.data.filter(
      prediction => !(prediction.name in checkDups)
    );
    return results;
  }

  function onSkillsSubmit(type) {
    let userSkills = [];
    let skillsToAdd = [];
    let skillsToRemove = [];
    let requests = [];
    let checkSkills = {};

    if (type === "user_additional_skills") {
      userSkills = [...user.additionalSkills];
      skillsToAdd = [...additionalSkills];
    } else {
      userSkills = [...user.topSkills];
      skillsToAdd = [...topSkills];
    }

    for (let i = 0; i < skillsToAdd.length; i++) {
      checkSkills[skillsToAdd[i].name] = true;
    }

    for (let i = 0; i < userSkills.length; i++) {
      if (userSkills[i].name in checkSkills) {
        skillsToAdd = skillsToAdd.filter(
          skill => skill.name !== userSkills[i].name
        );
      } else {
        skillsToRemove.push(userSkills[i]);
      }
    }

    if (skillsToAdd.length > 0) {
      requests.push({
        method: "POST",
        url: `/skills/new-user-skill`,
        data: {
          skills: skillsToAdd,
          user_id: user.id,
          type
        }
      });
    }

    if (skillsToRemove.length > 0) {
      skillsToRemove.forEach(skill => {
        requests.push({
          method: "POST",
          url: `/skills/delete-user-skill`,
          data: {
            skill_id: skill.id,
            user_id: user.id,
            type
          }
        });
      });
    }
    return requests;
  }

  function onTopSkillsChange(skills) {
    if (!topSkillsChange) {
      setTopSkillsChange(true);
    }
    setTopSkills(skills);
  }

  function addTopSkillForReview(skill) {
    console.log(skill);
  }

  function onAdditionalSkillsChange(skills) {
    if (!additionalSkillsChange) {
      setAdditionalSkillsChange(true);
    }
    setAdditionalSkills(skills);
  }

  function addAdditionalSkillForReview(skill) {
    console.log(skill);
  }

  function submitEdit(e) {
    e.preventDefault();

    if (
      !summaryInputChange &&
      !locationsChange &&
      !topSkillsChange &&
      !additionalSkillsChange
    ) {
      return;
    }

    let additionalArr = [];

    if (summaryInputChange) {
      additionalArr.push({
        method: "PUT",
        url: `/users/${user.id}`,
        data: { summary: summaryInput }
      });
    }

    if (locationsChange) {
      let locationRequests = onLocationsSubmit();
      additionalArr = [...additionalArr, ...locationRequests];
    }

    if (topSkillsChange) {
      let locationRequests = onSkillsSubmit("user_top_skills");
      additionalArr = [...additionalArr, ...locationRequests];
    }

    if (additionalSkillsChange) {
      let locationRequests = onSkillsSubmit("user_additional_skills");
      additionalArr = [...additionalArr, ...locationRequests];
    }

    addUserExtras(additionalArr);
    setEditInputs(false);
  }

  console.log("===ABOUT YOU===", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }

  if (!editInputs) {
    return (
      <div>
        <h1>Edit Inputs</h1>
        <button onClick={onEditInputs}>Edit</button>
      </div>
    );
  }

  return (
    <Main>
      <h1>Hello About You</h1>

      <form onSubmit={e => submitEdit(e)}>
        <h3>Your Summary</h3>
        <input
          type="text"
          placeholder="Summary"
          value={summaryInput}
          onChange={e => onSummaryInputChange(e.target.value)}
        />

        <br />
        <br />

        <h3>Interested Locations</h3>
        <AutoComplete
          chosenInputs={interestedLocations}
          onInputChange={onLocationInputChange}
          onChosenInput={onLocationsChange}
          removeChosenInput={onLocationsChange}
          inputName={"interested-locations"}
        />

        <h3>Top Skills</h3>
        <AutoComplete
          chosenInputs={topSkills}
          onInputChange={onSkillInputChange}
          onChosenInput={onTopSkillsChange}
          removeChosenInput={onTopSkillsChange}
          inputName={"top-skills"}
          addNewSkill={addTopSkillForReview}
        />

        <h3>Additional Skills</h3>
        <AutoComplete
          chosenInputs={additionalSkills}
          onInputChange={onSkillInputChange}
          onChosenInput={onAdditionalSkillsChange}
          removeChosenInput={onAdditionalSkillsChange}
          inputName={"additional-skills"}
          addNewSkill={addAdditionalSkillForReview}
        />

        <button>Submit</button>
      </form>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default AboutYou;
