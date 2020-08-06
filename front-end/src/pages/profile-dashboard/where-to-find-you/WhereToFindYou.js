import React, { useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { useState } from "react";
import { httpClient } from "../../../global/helpers/http-requests";
import AutoComplete from "../../../components/forms/autocomplete";
import { validateInput } from "../../../global/helpers/validation";

function WhereToFindYou() {
  const { loadingUser, user, editProfile } = useContext(ProfileContext);

  const [editInputs, setEditInputs] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [github, setGithub] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });
  const [twitter, setTwitter] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });


  const [linkedinInput, setLinkedinInput] = useState("");
  const [linkedinInputChange, setLinkedinInputChange] = useState(false);
  const [linkedin, setLinkedin] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });


  const [portfolioInput, setPortfolioInput] = useState("");
  const [portfolioInputChange, setPortfolioInputChange] = useState(false);
  const [portfolio, setPortfolio] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });

  const [emailInput, setEmailInput] = useState("");
  const [emailInputChange, setEmailInputChange] = useState(false);
  const [email, setEmail] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });

  const [locationInput, setLocationInput] = useState([]);
  const [locationInputChange, setLocationInputChange] = useState(false);




  function onEditInputs() {


    setSubmitError(false);
    setEditInputs(true);
    setGithub({
      inputValue: user.github || "",
      inputChange: false,
      inputError: false
    });
    setTwitter({
      inputValue: user.twitter || "",
      inputChange: false,
      inputError: false
    });

    // setLinkedinInput(user.linkedin || "");
    // setLinkedinInputChange(false);
    setLinkedin({
      inputValue: user.linkedin || "",
      inputChange: false,
      inputError: false
    });

    // setPortfolioInput(user.portfolio || "");
    // setPortfolioInputChange(false);
    setPortfolio({
      inputValue: user.portfolio || "",
      inputChange: false,
      inputError: false
    });

    // setEmailInput(user.public_email || "");
    // setEmailInputChange(false);
    setEmail({
      inputValue: user.public_email || "",
      inputChange: false,
      inputError: false
    });


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
    // this will only match the full URL you use, not the username alone
    // if you send value, and user.github, it will return the username on
    // both cases, so you can compare like that
    if (value === user.github) {
      setGithub({
        inputChange: false,
        inputValue: value,
        inputError: false
      });
      return;
    }

    setGithub({ ...github, inputChange: true, inputValue: value });
  }

  function onGithubInputValidate(value) {
    if (!github.inputChange) return;
    if (value.trim() === "") {
      setGithub({ ...github, inputValue: "", inputError: false });
    } else if (validateInput("github", value)) {
      // if it is an international URL, you'll still be setting the regular URL
      // maybe return an object instead with a 'intl' prop
      // might have to make the intl part of regex a captured group to know what to use
      // so `https://${validateInput("github", value).intl || null}github.com/${validateInput("github", value).username}`
      const fullUrl = `https://github.com/${validateInput("github", value)}`
      setGithub({ ...github, inputError: false, inputValue: fullUrl });
    } else {
      setGithub({ ...github, inputError: true });
    }
  }
  
  function onTwitterInputChange(value) {
    // this will only match the full URL you use, not the username alone
    // if you send value, and user.github, it will return the username on
    // both cases, so you can compare like that
    if (value === user.twitter) {
      setTwitter({
        inputChange: false,
        inputValue: value,
        inputError: false
      });
      return;
    }

    setTwitter({ ...twitter, inputChange: true, inputValue: value });
  }

  function onTwitterInputValidate(value) {
    if (!twitter.inputChange) return;
    if (value.trim() === "") {
      setTwitter({ ...twitter, inputValue: "", inputError: false });
    } else if (validateInput("twitter", value)) {
      // if it is an international URL, you'll still be setting the regular URL
      // maybe return an object instead with a 'intl' prop
      // might have to make the intl part of regex a captured group to know what to use
      // so `https://${validateInput("twitter", value).intl || null}twitter.com/${validateInput("twitter", value).username}`
      const fullUrl = `https://twitter.com/${validateInput("twitter", value)}`
      setTwitter({ ...twitter, inputError: false, inputValue: fullUrl });
    } else {
      setTwitter({ ...twitter, inputError: true });
    }
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




  function submitEdit(e) {
    e.preventDefault();

    if (
      !github.inputChange &&
      !twitter.inputChange &&
      !linkedinInputChange &&
      !portfolioInputChange &&
      !emailInputChange &&
      !locationInputChange
    ) {
      return;
    }


    const inputs = {};


    if (github.inputChange) {
      inputs.github = github.inputValue;
    }

    if (twitter.inputChange) {
      inputs.twitter = twitter.inputValue;
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


        <InputContainer>
          <label id="github-label" htmlFor="github">
            Github:
          </label>
          <input
            type="text"
            autoComplete="username"
            inputMode="text"
            id="github"
            name="github"
            className={`input ${github.inputError ? "input-err" : ""}`}
            aria-labelledby="github-label"
            aria-describedby="github-error"
            aria-invalid={github.inputError}
            value={github.inputValue}
            onChange={e => onGithubInputChange(e.target.value)}
            onBlur={e => onGithubInputValidate(e.target.value)}
          />
          {github.inputError ? (
              <span
                id="github-error"
                className="err-mssg"
                aria-live="polite"
              >
                Github Username can only be alphabelical characters, no numbers
                If full URL was used, it should be valid; for example, url, url, url
              </span>
            ) : null}
        </InputContainer>

        <InputContainer>
          <label id="twitter-label" htmlFor="twitter">
            Twitter:
          </label>
          <input
            type="text"
            autoComplete="username"
            inputMode="text"
            id="twitter"
            name="twitter"
            className={`input ${twitter.inputError ? "input-err" : ""}`}
            aria-labelledby="twitter-label"
            aria-describedby="twitter-error"
            aria-invalid={twitter.inputError}
            value={twitter.inputValue}
            onChange={e => onTwitterInputChange(e.target.value)}
            onBlur={e => onTwitterInputValidate(e.target.value)}
          />
          {twitter.inputError ? (
              <span
                id="twitter-error"
                className="err-mssg"
                aria-live="polite"
              >
                Twitter Username can only be alphabelical characters, no numbers
                If full URL was used, it should be valid; for example, url, url, url
              </span>
            ) : null}
        </InputContainer>

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

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  .input-err {
    border: solid red;
  }
  .err-mssg {
    color: red;
    font-size: 0.7rem;
  }
`;

export default WhereToFindYou;
