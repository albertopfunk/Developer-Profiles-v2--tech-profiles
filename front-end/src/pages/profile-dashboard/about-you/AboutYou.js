import React, { useContext, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import AutoComplete from "../../../components/autocomplete/AutoComplete";

function AboutYou() {
  const { loadingUser, user, editProfile } = useContext(ProfileContext);
  const [summaryInput, setSummaryInput] = useState("");
  const [topSkills, setTopSkills] = useState([]);
  const [additionalSkills, setAdditionalSkills] = useState([]);
  const [interestedLocations, setInterestedLocations] = useState([]);

  let locationRef = React.createRef();
  let topSkillsRef = React.createRef();
  let additionalSkillsRef = React.createRef();

  function addNewTopSkill(skill) {
    console.log("ADD TOP SKILL", skill);
  }

  function addNewAdditionalSkill(skill) {
    console.log("DELETE ADDITIONAL SKILL", skill);
  }

  function checkDups(name, type) {
    if (type === "interested-locations") {
      if (user.interested_location_names) {
        if (user.interested_location_names.split("|").includes(name)) {
          return false;
        }
      }
    }

    if (type.includes("skills")) {
      let userBankSkills = [];
      if (user.top_skills) {
        userBankSkills.push(...user.top_skills.split(","));
      }

      if (user.additional_skills) {
        userBankSkills.push(...user.additional_skills.split(","));
      }

      if (type === "top-skills") {
        if (additionalSkills.includes(name) || userBankSkills.includes(name)) {
          return false;
        }
      }

      if (type === "additional-skills") {
        if (topSkills.includes(name) || userBankSkills.includes(name)) {
          return false;
        }
      }
    }

    return true;
  }

  async function submitEdit(e) {
    e.preventDefault();

    if (
      !summaryInput &&
      interestedLocations.length === 0 &&
      topSkills.length === 0 &&
      additionalSkills.length === 0
    ) {
      return;
    }

    const inputs = {};

    if (summaryInput) {
      inputs.summary = summaryInput;
      setSummaryInput("");
    }

    if (interestedLocations.length > 0) {
      if (user.interested_location_names) {
        let interestedLocationsArr = [
          ...user.interested_location_names.split("|"),
          ...interestedLocations
        ];
        inputs.interested_location_names = interestedLocationsArr.join("|");
      } else {
        inputs.interested_location_names = interestedLocations.join("|");
      }
      locationRef.current.resetOnSubmit();
      setInterestedLocations([]);
    }

    if (topSkills.length > 0) {
      if (user.top_skills) {
        let topSkillsArr = [...user.top_skills.split(","), ...topSkills];
        inputs.top_skills = topSkillsArr.join(",");
      } else {
        inputs.top_skills = topSkills.join(",");
      }
      setTopSkills([]);
      topSkillsRef.current.resetOnSubmit();
    }

    if (additionalSkills.length > 0) {
      if (user.additional_skills) {
        let additionalSkillsArr = [
          ...user.additional_skills.split(","),
          ...additionalSkills
        ];
        inputs.additional_skills = additionalSkillsArr.join(",");
      } else {
        inputs.additional_skills = additionalSkills.join(",");
      }
      setAdditionalSkills([]);
      additionalSkillsRef.current.resetOnSubmit();
    }

    console.log(inputs);
    editProfile(inputs);
  }

  console.log("===ABOUT YOU===", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
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
          onChange={e => setSummaryInput(e.target.value)}
        />

        <br />
        <br />

        <h3>Interested Locations</h3>
        <AutoComplete
          ref={locationRef}
          onChosenInput={setInterestedLocations}
          resetInputFilter={setInterestedLocations}
          inputName={"interested-locations"}
          checkDups={checkDups}
        />

        <h3>Top Skills</h3>
        <AutoComplete
          ref={topSkillsRef}
          onChosenInput={setTopSkills}
          resetInputFilter={setTopSkills}
          inputName={"top-skills"}
          checkDups={checkDups}
          addNewSkill={addNewTopSkill}
        />

        <h3>Additional Skills</h3>
        <AutoComplete
          ref={additionalSkillsRef}
          onChosenInput={setAdditionalSkills}
          resetInputFilter={setAdditionalSkills}
          inputName={"additional-skills"}
          checkDups={checkDups}
          addNewSkill={addNewAdditionalSkill}
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
