import React, { useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { useState } from "react";
import { httpClient } from "../../../components/http-requests";
import AutoComplete from "../../../components/forms/autocomplete";

function WhereToFindYou() {
  const { loadingUser, user, editProfile } = useContext(ProfileContext);
  const [editInputs, setEditInputs] = useState(false);
  const [githubInput, setGithubInput] = useState("");
  const [githubInputChange, setGithubInputChange] = useState(false);
  const [twitterInput, setTwitterInput] = useState("");
  const [twitterInputChange, setTwitterInputChange] = useState(false);
  const [linkedinInput, setLinkedinInput] = useState("");
  const [linkedinInputChange, setLinkedinInputChange] = useState(false);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [portfolioInputChange, setPortfolioInputChange] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailInputChange, setEmailInputChange] = useState(false);
  const [locationInput, setLocationInput] = useState([]);
  const [locationInputChange, setLocationInputChange] = useState(false);

  function onEditInputs() {
    setEditInputs(true);
    setGithubInput(user.github || "");
    setGithubInputChange(false);
    setTwitterInput(user.twitter || "");
    setTwitterInputChange(false);
    setLinkedinInput(user.linkedin || "");
    setLinkedinInputChange(false);
    setPortfolioInput(user.portfolio || "");
    setPortfolioInputChange(false);
    setEmailInput(user.public_email || "");
    setEmailInputChange(false);
    if (user.current_location_name) {
      setLocationInput([
        {
          name: user.current_location_name,
          id: 1, // autocomplete requires id for key
          lat: user.current_location_lat,
          lon: user.current_location_lon
        }
      ]);
    } else {
      setLocationInput([]);
    }
    setLocationInputChange(false);
  }

  function onGithubInputChange(value) {
    if (!githubInputChange) {
      setGithubInputChange(true);
    }
    setGithubInput(value);
  }

  function onTwitterInputChange(value) {
    if (!twitterInputChange) {
      setTwitterInputChange(true);
    }
    setTwitterInput(value);
  }

  function onLinkedinInputChange(value) {
    if (!linkedinInputChange) {
      setLinkedinInputChange(true);
    }
    setLinkedinInput(value);
  }

  function onPortfolioInputChange(value) {
    if (!portfolioInputChange) {
      setPortfolioInputChange(true);
    }
    setPortfolioInput(value);
  }

  function onEmailInputChange(value) {
    if (!emailInputChange) {
      setEmailInputChange(true);
    }
    setEmailInput(value);
  }

  async function onLocationInputChange(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return [];
    }

    return res.data;
  }

  async function onChosenLocation(name, id) {
    console.log("WTFFFFF", name, id)
    if (!locationInputChange) {
      setLocationInputChange(true);
    }

    const [res, err] = await httpClient("POST", "/api/gio", {
      placeId: id
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    setLocationInput([
      {
        name,
        id,
        lat: res.data.lat,
        lon: res.data.lng
      }
    ]);
  }

  function removeLocation() {
    if (!locationInputChange) {
      setLocationInputChange(true);
    }
    setLocationInput([]);
  }

  async function submitEdit(e) {
    e.preventDefault();
    console.log("SUBBBBBB", locationInput);
    if (
      !githubInputChange &&
      !twitterInputChange &&
      !linkedinInputChange &&
      !portfolioInputChange &&
      !emailInputChange &&
      !locationInputChange
    ) {
      return;
    }

    const inputs = {};

    if (githubInputChange) {
      inputs.github = githubInput;
    }

    if (twitterInputChange) {
      inputs.twitter = twitterInput;
    }

    if (linkedinInputChange) {
      inputs.linkedin = linkedinInput;
    }

    if (portfolioInputChange) {
      inputs.portfolio = linkedinInput;
    }

    if (emailInputChange) {
      inputs.public_email = emailInput;
    }

    if (locationInputChange) {
      if (locationInput.length > 0) {
        const { name, lat, lon } = locationInput[0];
        inputs.current_location_name = name;
        inputs.current_location_lat = lat;
        inputs.current_location_lon = lon;
      } else {
        inputs.current_location_name = null;
        inputs.current_location_lat = null;
        inputs.current_location_lon = null;
      }
    }

    setEditInputs(false);
    editProfile(inputs);
  }

  console.log("===Where to Find You===");

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
      <h1>Hello Where to Find You</h1>
      <form onSubmit={e => submitEdit(e)}>
        <input
          type="text"
          placeholder="Github"
          value={githubInput}
          onChange={e => onGithubInputChange(e.target.value)}
        />

        <br />
        <br />
        <br />

        <input
          type="text"
          placeholder="Twitter"
          value={twitterInput}
          onChange={e => onTwitterInputChange(e.target.value)}
        />

        <br />
        <br />
        <br />

        <input
          type="text"
          placeholder="Linkedin"
          value={linkedinInput}
          onChange={e => onLinkedinInputChange(e.target.value)}
        />

        <br />
        <br />
        <br />

        <input
          type="text"
          placeholder="Portfolio"
          value={portfolioInput}
          onChange={e => onPortfolioInputChange(e.target.value)}
        />

        <br />
        <br />
        <br />

        <input
          type="text"
          placeholder="Public Email"
          value={emailInput}
          onChange={e => onEmailInputChange(e.target.value)}
        />

        <br />
        <br />
        <br />

        <AutoComplete
          chosenInputs={locationInput}
          onInputChange={onLocationInputChange}
          onChosenInput={onChosenLocation}
          removeChosenInput={removeLocation}
          inputName={"current-location"}
          single
        />

        <br />
        <br />

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

export default WhereToFindYou;
