import React, { useContext, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import AutoComplete from "../../../components/autocomplete/AutoComplete";

function AboutYou() {
  const { loadingUser, user } = useContext(ProfileContext);

  const [summaryInput, setSummaryInput] = useState("");

  const [topSkillsInput, setTopSkillsInput] = useState("");
  const [topSkillsDisplay, setTopSkillsDisplay] = useState([]);

  const [additionalSkillsInput, setAdditionalSkillsInput] = useState("");
  const [additionalSkillsDisplay, setAdditionalSkillsDisplay] = useState([]);



  const [interestedLocationsInput, setInterestedLocationsInput] = useState("");
  const [interestedLocationsPredictions, setInterestedLocationsPredictions] = useState([]);
  const [interestedLocationsDisplay, setInterestedLocationsDisplay] = useState([]);


  function onChosenLocation(chosenRelocateToArr) {
    // you can filter these to not show locations that user already has
    console.log("CHOOSE RELOCATE/INTERESTED",chosenRelocateToArr)
    console.log("CHOOSE RELOCATE/INTERESTED USER",user.interested_location_names)
  }

  function resetLocationFilter(chosenRelocateToArr) {
    console.log("DELETE RELOCATE/INTERESTED", chosenRelocateToArr)
  }


  function onChosenSkill(chosenRelocateToArr) {
    // you can filter these to not show skills that user already has
    console.log("CHOOSE SKILL",chosenRelocateToArr)
    console.log("CHOOSE SKILL USER",user.top_skills)
    console.log("CHOOSE SKILL USER",user.additional_skills)
  }

  function resetSkillsFilter(chosenRelocateToArr) {
    console.log("DELETE SKILL", chosenRelocateToArr)
  }



  console.log("About You", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <Main>
      <h1>Hello About You</h1>
      <AutoComplete
          onChosenInput={onChosenLocation}
          resetInputFilter={resetLocationFilter}
          locations
          multiple
        />

      <AutoComplete
          onChosenInput={onChosenSkill}
          resetInputFilter={resetSkillsFilter}
          skills
          multiple
        />
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
