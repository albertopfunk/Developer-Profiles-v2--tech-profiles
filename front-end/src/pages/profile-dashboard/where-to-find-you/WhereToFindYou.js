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
  const [linkedin, setLinkedin] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });
  const [portfolio, setPortfolio] = useState({
    inputValue: "",
    inputChange: false,
    inputError: false
  });
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
    setLinkedin({
      inputValue: user.linkedin || "",
      inputChange: false,
      inputError: false
    });
    setPortfolio({
      inputValue: user.portfolio || "",
      inputChange: false,
      inputError: false
    });
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
      const fullUrl = `https://github.com/${validateInput("github", value)}`;
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
      const fullUrl = `https://twitter.com/${validateInput("twitter", value)}`;
      setTwitter({ ...twitter, inputError: false, inputValue: fullUrl });
    } else {
      setTwitter({ ...twitter, inputError: true });
    }
  }

  function onLinkedinInputChange(value) {
    // this will only match the full URL you use, not the username alone
    // if you send value, and user.github, it will return the username on
    // both cases, so you can compare like that
    if (value === user.linkedin) {
      setLinkedin({
        inputChange: false,
        inputValue: value,
        inputError: false
      });
      return;
    }

    setLinkedin({ ...linkedin, inputChange: true, inputValue: value });
  }

  function onLinkedinInputValidate(value) {
    if (!linkedin.inputChange) return;
    if (value.trim() === "") {
      setLinkedin({ ...linkedin, inputValue: "", inputError: false });
    } else if (validateInput("linkedin", value)) {
      // if it is an international URL, you'll still be setting the regular URL
      // maybe return an object instead with a 'intl' prop
      // might have to make the intl part of regex a captured group to know what to use
      // so `https://${validateInput("linkedin", value).intl || null}linkedin.com/${validateInput("linkedin", value).username}`
      const fullUrl = `https://www.linkedin.com/in/${validateInput(
        "linkedin",
        value
      )}`;
      setLinkedin({ ...linkedin, inputError: false, inputValue: fullUrl });
    } else {
      setLinkedin({ ...linkedin, inputError: true });
    }
  }

  function onPortfolioInputChange(value) {
    if (value === user.portfolio) {
      setPortfolio({
        inputChange: false,
        inputValue: value,
        inputError: false
      });
    }

    setPortfolio({ ...portfolio, inputChange: true, inputValue: value });
  }

  function onPortfolioInputValidate(value) {
    if (!portfolio.inputChange) return;
    if (value.trim() === "") {
      setPortfolio({ ...portfolio, inputValue: "", inputError: false });
    } else if (validateInput("url", value)) {
      setPortfolio({ ...portfolio, inputError: false });
    } else {
      setPortfolio({ ...portfolio, inputError: true });
    }
  }

  function onEmailInputChange(value) {
    if (value === user.public_email) {
      setEmail({
        inputChange: false,
        inputValue: value,
        inputError: false
      });
    }

    setEmail({ ...email, inputChange: true, inputValue: value });
  }

  function onEmailInputValidate(value) {
    if (!email.inputChange) return;
    if (value.trim() === "") {
      setEmail({ ...email, inputValue: "", inputError: false });
    } else if (validateInput("email", value)) {
      setEmail({ ...email, inputError: false });
    } else {
      setEmail({ ...email, inputError: true });
    }
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
      !linkedin.inputChange &&
      !portfolio.inputChange &&
      !email.inputChange &&
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

    if (linkedin.inputChange) {
      inputs.linkedin = linkedin.inputValue;
    }

    if (portfolio.inputChange) {
      inputs.portfolio = portfolio.inputValue;
    }

    if (email.inputChange) {
      inputs.public_email = email.inputValue;
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

  function resetInputs() {
    setEditInputs(false);
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

      <form onSubmit={e => submitEdit(e)} noValidate>
        <InputContainer>
          <label id="github-label" htmlFor="github">
            Github:
          </label>
          <input
            type="url"
            autoComplete="username"
            inputMode="url"
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
            <span id="github-error" className="err-mssg" aria-live="polite">
              Github Username can only be alphabelical characters, no numbers If
              full URL was used, it should be valid; for example, url, url, url
            </span>
          ) : null}
        </InputContainer>

        <InputContainer>
          <label id="twitter-label" htmlFor="twitter">
            Twitter:
          </label>
          <input
            type="url"
            autoComplete="username"
            inputMode="url"
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
            <span id="twitter-error" className="err-mssg" aria-live="polite">
              Twitter Username can only be alphabelical characters, no numbers
              If full URL was used, it should be valid; for example, url, url,
              url
            </span>
          ) : null}
        </InputContainer>

        <InputContainer>
          <label id="linkedin-label" htmlFor="linkedin">
            Linkedin:
          </label>
          <input
            type="url"
            autoComplete="username"
            inputMode="url"
            id="linkedin"
            name="linkedin"
            className={`input ${linkedin.inputError ? "input-err" : ""}`}
            aria-labelledby="linkedin-label"
            aria-describedby="linkedin-error"
            aria-invalid={linkedin.inputError}
            value={linkedin.inputValue}
            onChange={e => onLinkedinInputChange(e.target.value)}
            onBlur={e => onLinkedinInputValidate(e.target.value)}
          />
          {linkedin.inputError ? (
            <span id="linkedin-error" className="err-mssg" aria-live="polite">
              Linkedin Username can only be alphabelical characters, no numbers
              If full URL was used, it should be valid; for example, url, url,
              url
            </span>
          ) : null}
        </InputContainer>

        <InputContainer>
          <label id="portfolio-label" htmlFor="portfolio">
            Portfolio:
          </label>
          <input
            type="url"
            autoComplete="url"
            inputMode="url"
            id="portfolio"
            name="portfolio"
            className={`input ${portfolio.inputError ? "input-err" : ""}`}
            aria-labelledby="portfolio-label"
            aria-describedby="portfolio-error"
            aria-invalid={portfolio.inputError}
            value={portfolio.inputValue}
            onChange={e => onPortfolioInputChange(e.target.value)}
            onBlur={e => onPortfolioInputValidate(e.target.value)}
          />
          {portfolio.inputError ? (
            <span id="portfolio-error" className="err-mssg" aria-live="polite">
              URL should be valid; for example, url, url, url
            </span>
          ) : null}
        </InputContainer>

        <InputContainer>
          <label id="email-label" htmlFor="email">
            Public Email:
          </label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            id="email"
            name="email"
            className={`input ${email.inputError ? "input-err" : ""}`}
            aria-labelledby="email-label"
            aria-describedby="email-error"
            aria-invalid={email.inputError}
            value={email.inputValue}
            onChange={e => onEmailInputChange(e.target.value)}
            onBlur={e => onEmailInputValidate(e.target.value)}
          />
          {email.inputError ? (
            <span id="email-error" className="err-mssg" aria-live="polite">
              email should be valid; for example, email, email, email
            </span>
          ) : null}
        </InputContainer>

        <AutoComplete
          chosenInputs={locationInput}
          onInputChange={onLocationInputChange}
          onChosenInput={onChosenLocation}
          removeChosenInput={removeLocation}
          inputName={"current-location"}
          single
        />

        <button type="reset" onClick={resetInputs}></button>
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
