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

  function onChosenLocation(chosenRelocateToArr) {
    setInterestedLocations(chosenRelocateToArr);
    console.log("CHOOSE RELOCATE/INTERESTED", chosenRelocateToArr);
    console.log(
      "CHOOSE RELOCATE/INTERESTED USER",
      user.interested_location_names
    );
  }

  function resetLocationFilter(chosenRelocateToArr) {
    setInterestedLocations(chosenRelocateToArr);
    console.log("DELETE RELOCATE/INTERESTED", chosenRelocateToArr);
  }

  function onChosenTopSkill(chosenTopSkills) {
    setTopSkills(chosenTopSkills);
    console.log("CHOOSE TOP SKILL", chosenTopSkills);
    console.log("CHOOSE TOP SKILL USER", user.top_skills);
  }

  function resetTopSkillsFilter(chosenTopSkills) {
    setTopSkills(chosenTopSkills);
    console.log("DELETE TOP SKILL", chosenTopSkills);
  }

  function addNewTopSkill(skill) {
    console.log("ADD TOP SKILL", skill);
  }

  function onChosenAdditionalSkill(chosenAdditionalSkills) {
    setAdditionalSkills(chosenAdditionalSkills);
    console.log("CHOOSE ADDITIONAL SKILL", chosenAdditionalSkills);
    console.log("CHOOSE ADDITIONAL SKILL USER", user.additional_skills);
  }

  function resetAdditionalSkillsFilter(chosenAdditionalSkills) {
    setAdditionalSkills(chosenAdditionalSkills);
    console.log("DELETE ADDITIONAL SKILL", chosenAdditionalSkills);
  }

  function addNewAdditionalSkill(skill) {
    console.log("DELETE ADDITIONAL SKILL", skill);
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
      let userInterestedLocations;
      let newInterestedLocations;

      if (user.interested_location_names) {
        userInterestedLocations = user.interested_location_names.split("|");
        newInterestedLocations = [
          ...new Set([...userInterestedLocations, ...interestedLocations])
        ];
      } else {
        newInterestedLocations = [...interestedLocations];
      }

      newInterestedLocations = newInterestedLocations.join("|");
      inputs.interested_location_names = newInterestedLocations;
      setInterestedLocations([]);
      locationRef.current.resetOnSubmit();
    }

    let topSkillsState = [...topSkills];
    let additionalSkillsState = [...additionalSkills];

    if (topSkillsState.length > 0 && additionalSkillsState.length > 0) {
      topSkillsState = topSkillsState.filter(
        item => !additionalSkillsState.includes(item)
      );
    }

    if (topSkillsState.length > 0) {
      let userTopSkills;
      let newTopSkills;

      if (user.top_skills) {
        userTopSkills = user.top_skills.split(",");
        newTopSkills = [...new Set([...userTopSkills, ...topSkillsState])];
      } else {
        newTopSkills = [...topSkillsState];
      }

      if (user.additional_skills) {
        let userAdditionalSkills = user.additional_skills.split(",");
        newTopSkills = newTopSkills.filter(
          item => !userAdditionalSkills.includes(item)
        );
      }

      newTopSkills = newTopSkills.join();
      inputs.top_skills = newTopSkills;
      setTopSkills([]);
      topSkillsRef.current.resetOnSubmit();
    }

    if (additionalSkillsState.length > 0) {
      let userAdditionalSkills;
      let newAdditionalSkills;

      if (user.additional_skills) {
        userAdditionalSkills = user.additional_skills.split(",");
        newAdditionalSkills = [
          ...new Set([...userAdditionalSkills, ...additionalSkillsState])
        ];
      } else {
        newAdditionalSkills = [...additionalSkillsState];
      }

      if (user.top_skills) {
        let userTopSkills = user.top_skills.split(",");
        newAdditionalSkills = newAdditionalSkills.filter(
          item => !userTopSkills.includes(item)
        );
      }

      newAdditionalSkills = newAdditionalSkills.join();
      inputs.additional_skills = newAdditionalSkills;
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
          onChosenInput={onChosenLocation}
          resetInputFilter={resetLocationFilter}
          inputName={"interested-locations"}
        />

        <h3>Top Skills</h3>
        <AutoComplete
          ref={topSkillsRef}
          onChosenInput={onChosenTopSkill}
          resetInputFilter={resetTopSkillsFilter}
          inputName={"top-skills"}
          addNewSkill={addNewTopSkill}
        />

        <h3>Additional Skills</h3>
        <AutoComplete
          ref={additionalSkillsRef}
          onChosenInput={onChosenAdditionalSkill}
          resetInputFilter={resetAdditionalSkillsFilter}
          inputName={"additional-skills"}
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
