import React, { useContext, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import AutoComplete from "../../../components/autocomplete/AutoComplete";
import { httpClient } from "../../../components/http-requests";

function AboutYou() {
  const { loadingUser, user, addUserExtras } = useContext(ProfileContext);
  const [summaryInput, setSummaryInput] = useState("");
  const [topSkills, setTopSkills] = useState([]);
  const [additionalSkills, setAdditionalSkills] = useState([]);
  const [interestedLocations, setInterestedLocations] = useState([]);

  // pass shouldReset props to Autocomplete, autoComplete checks onchange to see if it should reset inputs
  let locationRef = React.createRef();
  let topSkillsRef = React.createRef();
  let additionalSkillsRef = React.createRef();

  async function onLocationInputChange(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return false;
    }

    return res.data;
  }

  async function onSkillInputChange(value) {
    const [res, err] = await httpClient("POST", "/skills/autocomplete", {
      value
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return false;
    }

    return res.data;
  }

  function addNewTopSkill(id) {
    console.log("ADD TOP SKILL", topSkills, additionalSkills, id, user.id);
  }

  function addNewAdditionalSkill(skill) {
    console.log("DELETE ADDITIONAL SKILL", skill);
  }

  function checkDups(name, type) {
    if (type === "interested-locations") {
      if (user.locations) {
        if (user.locations.some(chosenName => chosenName.name === name)) {
          return false;
        }
      }
    }

    if (type.includes("skills")) {
      let userBankSkills = [];
      if (user.topSkills) {
        userBankSkills.push(...user.topSkills);
      }
      if (user.additionalSkills) {
        userBankSkills.push(...user.additionalSkills);
      }

      if (type === "top-skills") {
        if (
          additionalSkills.some(chosenName => chosenName.name === name) ||
          userBankSkills.some(chosenName => chosenName.name === name)
        ) {
          return false;
        }
      }
      if (type === "additional-skills") {
        if (
          topSkills.some(chosenName => chosenName.name === name) ||
          userBankSkills.some(chosenName => chosenName.name === name)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  async function submitEdit(e) {
    e.preventDefault();

    // you will not need this either
    // all you need to check is if there was any change
    if (
      !summaryInput &&
      interestedLocations.length === 0 &&
      topSkills.length === 0 &&
      additionalSkills.length === 0
    ) {
      return;
    }

    let additionalArr = [];

    if (summaryInput) {
      additionalArr.push({
        method: "PUT",
        url: `/users/${user.id}`,
        data: { summary: summaryInput }
      });
      setSummaryInput("");
    }

    if (interestedLocations.length > 0) {
      additionalArr.push({
        method: "POST",
        url: `/locations/new`,
        data: { locations: interestedLocations, user_id: user.id }
      });
      locationRef.current.resetOnSubmit();
      setInterestedLocations([]);
    }

    if (topSkills.length > 0) {
      additionalArr.push({
        method: "POST",
        url: `/skills/new-user-skill`,
        data: { skills: topSkills, user_id: user.id, type: "user_top_skills" }
      });
      topSkillsRef.current.resetOnSubmit();
      setTopSkills([]);
    }

    if (additionalSkills.length > 0) {
      additionalArr.push({
        method: "POST",
        url: `/skills/new-user-skill`,
        data: {
          skills: additionalSkills,
          user_id: user.id,
          type: "user_additional_skills"
        }
      });
      additionalSkillsRef.current.resetOnSubmit();
      setAdditionalSkills([]);
    }

    addUserExtras(additionalArr);
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
          onInputChange={onLocationInputChange}
          onChosenInput={setInterestedLocations}
          resetInputFilter={setInterestedLocations}
          inputName={"interested-locations"}
          checkDups={checkDups}
        />

        <h3>Top Skills</h3>
        <AutoComplete
          ref={topSkillsRef}
          onInputChange={onSkillInputChange}
          onChosenInput={setTopSkills}
          resetInputFilter={setTopSkills}
          inputName={"top-skills"}
          checkDups={checkDups}
          addNewSkill={addNewTopSkill}
        />

        <h3>Additional Skills</h3>
        <AutoComplete
          ref={additionalSkillsRef}
          onInputChange={onSkillInputChange}
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
