import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import Combobox from "../../../components/forms/combobox";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import {
  COMBOBOX_STATUS,
  FORM_STATUS,
} from "../../../global/helpers/variables";
import Announcer from "../../../global/helpers/announcer";

let formSuccessWait;
function WhereToFindYou() {
  const { user, editProfile } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [announceFormStatus, setAnnounceFormStatus] = useState(false);

  const [github, setGithub] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [twitter, setTwitter] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [linkedin, setLinkedin] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [portfolio, setPortfolio] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });
  const [email, setEmail] = useState({
    inputValue: "",
    inputChange: false,
    inputStatus: FORM_STATUS.idle,
  });

  // keeping seperate since I am using one as a dep for useEffect
  const [location, setLocation] = useState([]);
  const [locationChange, setLocationChange] = useState(false);
  const [announceLocationChange, setAnnounceLocationChange] = useState(false);
  const [locationStatus, setLocationStatus] = useState(COMBOBOX_STATUS.idle);

  let errorSummaryRef = React.createRef();

  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
    // eslint-disable-next-line
  }, [formStatus]);

  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  useEffect(() => {
    const locationAnnouncementWait = setTimeout(() => {
      setAnnounceLocationChange(true);
    }, 500);

    setAnnounceLocationChange(false);

    return () => {
      clearTimeout(locationAnnouncementWait);
    };
  }, [locationStatus]);

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);
    setAnnounceFormStatus(true);

    setGithub({
      inputValue: user.github || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setTwitter({
      inputValue: user.twitter || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setLinkedin({
      inputValue: user.linkedin || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setPortfolio({
      inputValue: user.portfolio || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });
    setEmail({
      inputValue: user.public_email || "",
      inputChange: false,
      inputStatus: FORM_STATUS.idle,
    });

    if (user.current_location_name) {
      setLocation([
        {
          name: user.current_location_name,
          id: 1, // combobox requires id for key
          lat: user.current_location_lat,
          lon: user.current_location_lon,
        },
      ]);
    } else {
      setLocation([]);
    }
    setLocationChange(false);
    setAnnounceLocationChange(false);
    setLocationStatus(COMBOBOX_STATUS.idle);
  }

  function setGithubInput(value) {
    if (user.github === null && value.trim() === "") {
      setGithub({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.github) {
      setGithub({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setGithub({ ...github, inputChange: true, inputValue: value });
  }

  function validateGithubInput(value) {
    if (!github.inputChange) return;
    if (value.trim() === "") {
      setGithub({
        ...github,
        inputValue: "",
        inputStatus: FORM_STATUS.success,
      });
    } else if (validateInput("github", value)) {
      const { intl, username } = validateInput("github", value);
      const fullUrl = `https://${intl || ""}github.com/${username}`;
      setGithub({
        ...github,
        inputStatus: FORM_STATUS.success,
        inputValue: fullUrl,
      });
    } else {
      setGithub({ ...github, inputStatus: FORM_STATUS.error });
    }
  }

  function setTwitterInput(value) {
    if (user.twitter === null && value.trim() === "") {
      setTwitter({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.twitter) {
      setTwitter({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setTwitter({ ...twitter, inputChange: true, inputValue: value });
  }

  function validateTwitterInput(value) {
    if (!twitter.inputChange) return;
    if (value.trim() === "") {
      setTwitter({
        ...twitter,
        inputValue: "",
        inputStatus: FORM_STATUS.success,
      });
    } else if (validateInput("twitter", value)) {
      const fullUrl = `https://twitter.com/${validateInput("twitter", value)}`;
      setTwitter({
        ...twitter,
        inputStatus: FORM_STATUS.success,
        inputValue: fullUrl,
      });
    } else {
      setTwitter({ ...twitter, inputStatus: FORM_STATUS.error });
    }
  }

  function setLinkedinInput(value) {
    if (user.linkedin === null && value.trim() === "") {
      setLinkedin({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.linkedin) {
      setLinkedin({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setLinkedin({ ...linkedin, inputChange: true, inputValue: value });
  }

  function validateLinkedinInput(value) {
    if (!linkedin.inputChange) return;
    if (value.trim() === "") {
      setLinkedin({
        ...linkedin,
        inputValue: "",
        inputStatus: FORM_STATUS.success,
      });
    } else if (validateInput("linkedin", value)) {
      const { intl, username } = validateInput("linkedin", value);
      const fullUrl = `https://${intl || ""}linkedin.com/in/${username}`;
      setLinkedin({
        ...linkedin,
        inputStatus: FORM_STATUS.success,
        inputValue: fullUrl,
      });
    } else {
      setLinkedin({ ...linkedin, inputStatus: FORM_STATUS.error });
    }
  }

  function setPortfolioInput(value) {
    if (user.portfolio === null && value.trim() === "") {
      setPortfolio({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.portfolio) {
      setPortfolio({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setPortfolio({ ...portfolio, inputChange: true, inputValue: value });
  }

  function validatePortfolioInput(value) {
    if (!portfolio.inputChange) return;
    if (value.trim() === "") {
      setPortfolio({
        ...portfolio,
        inputValue: "",
        inputStatus: FORM_STATUS.success,
      });
    } else if (validateInput("url", value)) {
      setPortfolio({ ...portfolio, inputStatus: FORM_STATUS.success });
    } else {
      setPortfolio({ ...portfolio, inputStatus: FORM_STATUS.error });
    }
  }

  function setEmailInput(value) {
    if (user.public_email === null && value.trim() === "") {
      setEmail({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    if (value === user.public_email) {
      setEmail({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      return;
    }

    setEmail({ ...email, inputChange: true, inputValue: value });
  }

  function validateEmailInput(value) {
    if (!email.inputChange) return;
    if (value.trim() === "") {
      setEmail({ ...email, inputValue: "", inputStatus: FORM_STATUS.success });
    } else if (validateInput("email", value)) {
      setEmail({ ...email, inputStatus: FORM_STATUS.success });
    } else {
      setEmail({ ...email, inputStatus: FORM_STATUS.error });
    }
  }

  async function getLocationsByValue(value) {
    const [res, err] = await httpClient("POST", "/api/autocomplete", {
      value,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return [];
    }

    if (location.length > 0) {
      const results = res.data.filter(
        (prediction) => prediction.name !== location[0].name
      );
      return results;
    }

    return res.data;
  }

  async function setLocationWithGio(name, id) {
    setLocationStatus(COMBOBOX_STATUS.added);
    setLocationChange(true);

    const [res, err] = await httpClient("POST", "/api/gio", {
      placeId: id,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    setLocation([
      {
        name,
        id,
        lat: res.data.lat,
        lon: res.data.lng,
      },
    ]);
  }

  function removeLocation() {
    setLocationStatus(COMBOBOX_STATUS.removed);
    setLocationChange(true);
    setLocation([]);
  }

  async function submitEdit(e) {
    e.preventDefault();

    if (
      github.inputStatus === FORM_STATUS.error ||
      twitter.inputStatus === FORM_STATUS.error ||
      linkedin.inputStatus === FORM_STATUS.error ||
      portfolio.inputStatus === FORM_STATUS.error ||
      email.inputStatus === FORM_STATUS.error
    ) {
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    if (
      !github.inputChange &&
      !twitter.inputChange &&
      !linkedin.inputChange &&
      !portfolio.inputChange &&
      !email.inputChange &&
      !locationChange
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

    if (locationChange) {
      if (location.length > 0) {
        const { name, lat, lon } = location[0];
        inputs.current_location_name = name;
        inputs.current_location_lat = lat;
        inputs.current_location_lon = lon;
      } else {
        inputs.current_location_name = null;
        inputs.current_location_lat = null;
        inputs.current_location_lon = null;
      }
    }

    setFormStatus(FORM_STATUS.loading);
    await editProfile(inputs);
    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
    }, 1000);
    setFormStatus(FORM_STATUS.success);
  }

  console.log("===Where to Find You===");

  if (formStatus === FORM_STATUS.idle) {
    return (
      <main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
        <Helmet>
          <title>Profile Dashboard Where to Find You • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Where to Find You</h1>
        {announceFormStatus ? (
          <Announcer
            announcement="Form is idle, press edit information button to open"
            ariaId="form-idle-announcement"
          />
        ) : null}
        <section aria-labelledby="current-information-heading">
          <h2 id="current-information-heading">Current Information</h2>
          <button onClick={setFormInputs}>Edit Information</button>
          <ul aria-label="current information">
            <li>Github: {user.github || "None Set"}</li>
            <li>Twitter: {user.twitter || "None Set"}</li>
            <li>Linkedin: {user.linkedin || "None Set"}</li>
            <li>Portfolio: {user.portfolio || "None Set"}</li>
            <li>
              Current Location: {user.current_location_name || "None Set"}
            </li>
          </ul>
        </section>
      </main>
    );
  }

  return (
    <Main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
      <Helmet>
        <title>Dashboard Where to Find You • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Where to Find You</h1>

      {announceFormStatus && formStatus === FORM_STATUS.active ? (
        <Announcer
          announcement="Form is active, inputs are validated but not required"
          ariaId="active-form-announcer"
        />
      ) : null}

      {announceFormStatus && formStatus === FORM_STATUS.success ? (
        <Announcer
          announcement="information updated"
          ariaId="success-form-announcer"
        />
      ) : null}

      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions"
      >
        {announceLocationChange && locationStatus === COMBOBOX_STATUS.added
          ? "added location"
          : null}
        {announceLocationChange && locationStatus === COMBOBOX_STATUS.removed
          ? "removed location"
          : null}
      </div>

      <FormSection aria-labelledby="edit-information-heading">
        <h2 id="edit-information-heading">Edit Information</h2>

        {formStatus === FORM_STATUS.error ? (
          <div ref={errorSummaryRef} tabIndex="-1">
            <h3 id="error-heading">Errors in Submission</h3>
            {github.inputStatus === FORM_STATUS.error ||
            twitter.inputStatus === FORM_STATUS.error ||
            linkedin.inputStatus === FORM_STATUS.error ||
            portfolio.inputStatus === FORM_STATUS.error ||
            email.inputStatus === FORM_STATUS.error ? (
              <>
                <strong>
                  Please address the following errors and re-submit the form:
                </strong>
                <ul aria-label="current errors" id="error-group">
                  {github.inputStatus === FORM_STATUS.error ? (
                    <li>
                      <a href="#github">Github Error</a>
                    </li>
                  ) : null}
                  {twitter.inputStatus === FORM_STATUS.error ? (
                    <li>
                      <a href="#twitter"> Twitter Error</a>
                    </li>
                  ) : null}
                  {linkedin.inputStatus === FORM_STATUS.error ? (
                    <li>
                      <a href="#linkedin">Linkedin Error</a>
                    </li>
                  ) : null}
                  {portfolio.inputStatus === FORM_STATUS.error ? (
                    <li>
                      <a href="#portfolio">Portfolio Error</a>
                    </li>
                  ) : null}
                  {email.inputStatus === FORM_STATUS.error ? (
                    <li>
                      <a href="#email">Email Error</a>
                    </li>
                  ) : null}
                </ul>
              </>
            ) : (
              <>
                <p>No Errors, ready to submit</p>
                <Announcer
                  announcement="No Errors, ready to submit"
                  ariaId="no-errors-announcer"
                  ariaLive="polite"
                />
              </>
            )}
          </div>
        ) : null}

        <form onSubmit={(e) => submitEdit(e)} noValidate>
          <InputContainer>
            <label htmlFor="github">Github:</label>
            <input
              type="text"
              autoComplete="username"
              inputMode="url"
              id="github"
              name="github"
              className={`input ${
                github.inputStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby="github-error github-success"
              aria-invalid={github.inputStatus === FORM_STATUS.error}
              value={github.inputValue}
              onChange={(e) => setGithubInput(e.target.value)}
              onBlur={(e) => validateGithubInput(e.target.value)}
            />
            {github.inputStatus === FORM_STATUS.error ? (
              <span id="github-error" className="err-mssg">
                Github Username can only be alphabelical characters, no numbers
                If full URL was used, it should be valid; for example, url, url,
                url
              </span>
            ) : null}
            {github.inputStatus === FORM_STATUS.success ? (
              <span id="github-success" className="success-mssg">
                Github is Validated and Updated with Full URL
              </span>
            ) : null}
          </InputContainer>

          <InputContainer>
            <label htmlFor="twitter">Twitter:</label>
            <input
              type="text"
              autoComplete="username"
              inputMode="url"
              id="twitter"
              name="twitter"
              className={`input ${
                twitter.inputStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby="twitter-error twitter-success"
              aria-invalid={twitter.inputStatus === FORM_STATUS.error}
              value={twitter.inputValue}
              onChange={(e) => setTwitterInput(e.target.value)}
              onBlur={(e) => validateTwitterInput(e.target.value)}
            />
            {twitter.inputStatus === FORM_STATUS.error ? (
              <span id="twitter-error" className="err-mssg">
                Twitter Username can only be alphabelical characters, no numbers
                If full URL was used, it should be valid; for example, url, url,
                url
              </span>
            ) : null}
            {twitter.inputStatus === FORM_STATUS.success ? (
              <span id="twitter-success" className="success-mssg">
                Twitter is Validated and Updated with Full URL
              </span>
            ) : null}
          </InputContainer>

          <InputContainer>
            <label htmlFor="linkedin">Linkedin:</label>
            <input
              type="text"
              autoComplete="username"
              inputMode="url"
              id="linkedin"
              name="linkedin"
              className={`input ${
                linkedin.inputStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby="linkedin-error linkedin-success"
              aria-invalid={linkedin.inputStatus === FORM_STATUS.error}
              value={linkedin.inputValue}
              onChange={(e) => setLinkedinInput(e.target.value)}
              onBlur={(e) => validateLinkedinInput(e.target.value)}
            />
            {linkedin.inputStatus === FORM_STATUS.error ? (
              <span id="linkedin-error" className="err-mssg">
                Linkedin Username can only be alphabelical characters, no
                numbers If full URL was used, it should be valid; for example,
                url, url, url
              </span>
            ) : null}
            {linkedin.inputStatus === FORM_STATUS.success ? (
              <span id="linkedin-success" className="success-mssg">
                Linkedin is Validated and Updated with Full URL
              </span>
            ) : null}
          </InputContainer>

          <InputContainer>
            <label htmlFor="portfolio">Portfolio:</label>
            <input
              type="url"
              autoComplete="url"
              inputMode="url"
              id="portfolio"
              name="portfolio"
              className={`input ${
                portfolio.inputStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby="portfolio-error portfolio-success"
              aria-invalid={portfolio.inputStatus === FORM_STATUS.error}
              value={portfolio.inputValue}
              onChange={(e) => setPortfolioInput(e.target.value)}
              onBlur={(e) => validatePortfolioInput(e.target.value)}
            />
            {portfolio.inputStatus === FORM_STATUS.error ? (
              <span id="portfolio-error" className="err-mssg">
                URL should be valid; for example, url, url, url
              </span>
            ) : null}
            {portfolio.inputStatus === FORM_STATUS.success ? (
              <span id="portfolio-success" className="success-mssg">
                Portfolio is Validated
              </span>
            ) : null}
          </InputContainer>

          <InputContainer>
            <label htmlFor="email">Public Email:</label>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              id="email"
              name="email"
              className={`input ${
                email.inputStatus === FORM_STATUS.error ? "input-err" : ""
              }`}
              aria-describedby="email-error email-success"
              aria-invalid={email.inputStatus === FORM_STATUS.error}
              value={email.inputValue}
              onChange={(e) => setEmailInput(e.target.value)}
              onBlur={(e) => validateEmailInput(e.target.value)}
            />
            {email.inputStatus === FORM_STATUS.error ? (
              <span id="email-error" className="err-mssg">
                email should be valid; for example, email, email, email
              </span>
            ) : null}
            {email.inputStatus === FORM_STATUS.success ? (
              <span id="email-success" className="success-mssg">
                Email is Validated
              </span>
            ) : null}
          </InputContainer>

          <Combobox
            chosenOptions={location}
            onInputChange={getLocationsByValue}
            onChosenOption={setLocationWithGio}
            onRemoveChosenOption={removeLocation}
            inputName={"current-location"}
            displayName={"Current Location"}
            single
          />

          <button
            disabled={
              formStatus === FORM_STATUS.loading ||
              formStatus === FORM_STATUS.success
            }
            type="submit"
          >
            {formStatus === FORM_STATUS.active ? "Submit" : null}
            {formStatus === FORM_STATUS.loading ? "loading..." : null}
            {formStatus === FORM_STATUS.success ? "Success!" : null}
            {formStatus === FORM_STATUS.error ? "Re-Submit" : null}
          </button>
          <button
            disabled={
              formStatus === FORM_STATUS.loading ||
              formStatus === FORM_STATUS.success
            }
            type="reset"
            onClick={() => setFormStatus(FORM_STATUS.idle)}
          >
            Cancel
          </button>
        </form>
      </FormSection>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;

  .sr-only {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
  }
`;

const FormSection = styled.section`
  .hidden {
    display: none;
  }
  .error-summary {
  }
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
  .success-mssg {
    color: green;
    font-size: 0.7rem;
  }
`;

export default WhereToFindYou;
