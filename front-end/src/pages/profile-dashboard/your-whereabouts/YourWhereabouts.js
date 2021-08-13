import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../../global/assets/dashboard-close.svg";
import { ReactComponent as EditIcon } from "../../../global/assets/dashboard-edit.svg";

import Combobox from "../../../components/forms/combobox";
import ControlButton from "../../../components/forms/buttons/ControlButton";
import IconButton from "../../../components/forms/buttons/IconButton";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { httpClient } from "../../../global/helpers/http-requests";
import { validateInput } from "../../../global/helpers/validation";
import { FORM_STATUS } from "../../../global/helpers/variables";
import useToggle from "../../../global/helpers/hooks/useToggle";
import Announcer from "../../../global/helpers/announcer";
import Spacer from "../../../global/helpers/spacer";

let formSuccessWait;
function YourWhereabouts() {
  const { user, editProfile } = useContext(ProfileContext);
  const [formStatus, setFormStatus] = useState(FORM_STATUS.idle);
  const [formFocusStatus, setFormFocusStatus] = useState("");
  const [formFocusToggle, setFormFocusToggle] = useToggle();
  const [hasSubmitError, setHasSubmitError] = useState(null);

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

  const [checkChangesToggle, setCheckChangesToggle] = useToggle();

  let isSubmittingRef = useRef(false);
  const errorSummaryRef = React.createRef();
  const editInfoBtnRef = React.createRef();
  const resetBtnRef = React.createRef();

  // unmount cleanup
  useEffect(() => {
    return () => {
      clearTimeout(formSuccessWait);
    };
  }, []);

  // form focus management
  useEffect(() => {
    if (formFocusStatus) {
      if (formFocusStatus === FORM_STATUS.idle) {
        editInfoBtnRef.current.focus();
        return;
      }

      if (formFocusStatus === FORM_STATUS.active) {
        resetBtnRef.current.focus();
      }
    }
  }, [formFocusToggle]);

  // form error focus management
  useEffect(() => {
    if (formStatus === FORM_STATUS.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [formStatus]);

  // resets form status if no changes
  useEffect(() => {
    if (formStatus !== FORM_STATUS.error) {
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
      setFormStatus(FORM_STATUS.active);
    }
  }, [checkChangesToggle]);

  function formFocusManagement(e, status) {
    // only run on enter or space
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }

    // preventing onClick from running
    e.preventDefault();

    if (status === FORM_STATUS.active) {
      setFormInputs();
      setFormFocusToggle();
      return;
    }

    if (status === FORM_STATUS.idle) {
      resetForm();
      setFormFocusToggle();
    }
  }

  function setFormInputs() {
    setFormStatus(FORM_STATUS.active);
    setFormFocusStatus(FORM_STATUS.active);
    setHasSubmitError(null);

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
  }

  function setGithubInput(value) {
    if (!user.github && value.trim() === "") {
      setGithub({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    if (value === user.github) {
      setGithub({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    setGithub({ ...github, inputChange: true, inputValue: value });
  }

  function validateGithubInput(value) {
    if (!github.inputChange) return;
    if (isSubmittingRef.current) return;
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
    if (!user.twitter && value.trim() === "") {
      setTwitter({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    if (value === user.twitter) {
      setTwitter({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    setTwitter({ ...twitter, inputChange: true, inputValue: value });
  }

  function validateTwitterInput(value) {
    if (!twitter.inputChange) return;
    if (isSubmittingRef.current) return;
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
    if (!user.linkedin && value.trim() === "") {
      setLinkedin({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    if (value === user.linkedin) {
      setLinkedin({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    setLinkedin({ ...linkedin, inputChange: true, inputValue: value });
  }

  function validateLinkedinInput(value) {
    if (!linkedin.inputChange) return;
    if (isSubmittingRef.current) return;
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
    if (!user.portfolio && value.trim() === "") {
      setPortfolio({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    if (value === user.portfolio) {
      setPortfolio({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    setPortfolio({ ...portfolio, inputChange: true, inputValue: value });
  }

  function validatePortfolioInput(value) {
    if (!portfolio.inputChange) return;
    if (isSubmittingRef.current) return;
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
    if (!user.public_email && value.trim() === "") {
      setEmail({
        inputChange: false,
        inputValue: "",
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    if (value === user.public_email) {
      setEmail({
        inputChange: false,
        inputValue: value,
        inputStatus: FORM_STATUS.idle,
      });
      setCheckChangesToggle();
      return;
    }

    setEmail({ ...email, inputChange: true, inputValue: value });
  }

  function validateEmailInput(value) {
    if (!email.inputChange) return;
    if (isSubmittingRef.current) return;
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
      if (res.err === "Zero results found") return [];
      return { error: "Error getting location results" };
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
    const [res, err] = await httpClient("POST", "/api/gio", {
      placeId: id,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return { error: "Error getting location information" };
    }

    let locationChange;
    if (user.current_location_name === name) {
      locationChange = false;
      setCheckChangesToggle();
    } else {
      locationChange = true;
    }

    setLocationChange(locationChange);
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
    let locationChange;
    if (!user.current_location_name) {
      locationChange = false;
      setCheckChangesToggle();
    } else {
      locationChange = true;
    }

    setLocationChange(locationChange);
    setLocation([]);
  }

  async function submitEdit(e) {
    e.preventDefault();

    // check for changes
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

    // set loading
    setFormStatus(FORM_STATUS.loading);
    isSubmittingRef.current = true;

    // validate and set up requests
    let areThereErrors = false;
    const inputs = {};

    if (github.inputChange) {
      if (github.inputValue.trim() === "") {
        inputs.github = "";
        setGithub({
          ...github,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
      } else if (validateInput("github", github.inputValue)) {
        const { intl, username } = validateInput("github", github.inputValue);
        const fullUrl = `https://${intl || ""}github.com/${username}`;
        setGithub({
          ...github,
          inputStatus: FORM_STATUS.success,
          inputValue: fullUrl,
        });
        inputs.github = fullUrl;
      } else {
        areThereErrors = true;
        setGithub({ ...github, inputStatus: FORM_STATUS.error });
      }
    }

    if (twitter.inputChange) {
      if (twitter.inputValue.trim() === "") {
        setTwitter({
          ...twitter,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
        inputs.twitter = "";
      } else if (validateInput("twitter", twitter.inputValue)) {
        const fullUrl = `https://twitter.com/${validateInput(
          "twitter",
          twitter.inputValue
        )}`;
        setTwitter({
          ...twitter,
          inputStatus: FORM_STATUS.success,
          inputValue: fullUrl,
        });
        inputs.twitter = fullUrl;
      } else {
        areThereErrors = true;
        setTwitter({ ...twitter, inputStatus: FORM_STATUS.error });
      }
    }

    if (linkedin.inputChange) {
      if (linkedin.inputValue.trim() === "") {
        setLinkedin({
          ...linkedin,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
        inputs.linkedin = "";
      } else if (validateInput("linkedin", linkedin.inputValue)) {
        const { intl, username } = validateInput(
          "linkedin",
          linkedin.inputValue
        );
        const fullUrl = `https://${intl || ""}linkedin.com/in/${username}`;
        setLinkedin({
          ...linkedin,
          inputStatus: FORM_STATUS.success,
          inputValue: fullUrl,
        });
        inputs.linkedin = fullUrl;
      } else {
        areThereErrors = true;
        setLinkedin({ ...linkedin, inputStatus: FORM_STATUS.error });
      }
    }

    if (portfolio.inputChange) {
      if (portfolio.inputValue.trim() === "") {
        setPortfolio({
          ...portfolio,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
        inputs.portfolio = "";
      } else if (validateInput("url", portfolio.inputValue)) {
        setPortfolio({ ...portfolio, inputStatus: FORM_STATUS.success });
        inputs.portfolio = portfolio.inputValue;
      } else {
        areThereErrors = true;
        setPortfolio({ ...portfolio, inputStatus: FORM_STATUS.error });
      }
    }

    if (email.inputChange) {
      if (email.inputValue.trim() === "") {
        setEmail({
          ...email,
          inputValue: "",
          inputStatus: FORM_STATUS.success,
        });
        inputs.public_email = "";
      } else if (validateInput("email", email.inputValue)) {
        setEmail({ ...email, inputStatus: FORM_STATUS.success });
        inputs.public_email = email.inputValue;
      } else {
        areThereErrors = true;
        setEmail({ ...email, inputStatus: FORM_STATUS.error });
      }
    }

    if (areThereErrors) {
      isSubmittingRef.current = false;
      setFormStatus(FORM_STATUS.error);
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus();
      }
      return;
    }

    // unfocus from input
    let element = document.activeElement;
    if (element.dataset.input) {
      element.blur();
    }

    // continue setting up requests
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

    // submit
    const results = await editProfile(inputs);

    if (results?.error) {
      setFormStatus(FORM_STATUS.error);
      setHasSubmitError(true);
      isSubmittingRef.current = false;
      return;
    }

    formSuccessWait = setTimeout(() => {
      setFormStatus(FORM_STATUS.idle);
      setFormFocusStatus(FORM_STATUS.idle);
      isSubmittingRef.current = false;
    }, 750);
    setFormStatus(FORM_STATUS.success);
  }

  function resetForm() {
    setFormStatus(FORM_STATUS.idle);
    setFormFocusStatus(FORM_STATUS.idle);
  }

  if (formStatus === FORM_STATUS.idle) {
    return (
      <InfoSection aria-labelledby="current-information-heading">
        <div className="info-heading">
          <h2 id="current-information-heading">Current Info</h2>
          <IconButton
            ref={editInfoBtnRef}
            type="button"
            size="lg"
            ariaLabel="edit information"
            icon={<EditIcon className="icon" />}
            attributes={{
              id: "edit-info-btn",
            }}
            onClick={setFormInputs}
            onKeyDown={(e) => formFocusManagement(e, FORM_STATUS.active)}
          />
        </div>
        <Spacer axis="vertical" size="30" />
        <dl className="info-group" aria-label="current information">
          <div className="flex-row">
            <div className="flex-col">
              <div>
                <dt>Github:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.github || "None Set"}</dd>
              </div>
              <div>
                <dt>Twitter:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.twitter || "None Set"}</dd>
              </div>
              <div>
                <dt>Linkedin:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.linkedin || "None Set"}</dd>
              </div>
            </div>
            <div className="flex-col">
              <div>
                <dt>Portfolio:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.portfolio || "None Set"}</dd>
              </div>
              <div>
                <dt>Current Location:</dt>
                <Spacer axis="vertical" size="5" />
                <dd>{user.current_location_name || "None Set"}</dd>
              </div>
            </div>
          </div>
        </dl>
      </InfoSection>
    );
  }

  return (
    <>
      {formStatus === FORM_STATUS.success ? (
        <Announcer
          announcement="information updated"
          ariaId="success-form-announcer"
        />
      ) : null}

      <FormSection aria-labelledby="edit-information-heading">
        <div className="edit-info-header">
          <h2 id="edit-information-heading">Edit Info</h2>
          <IconButton
            ref={resetBtnRef}
            type="reset"
            size="lg"
            disabled={
              formStatus === FORM_STATUS.loading ||
              formStatus === FORM_STATUS.success
            }
            ariaLabel="cancel"
            icon={<CloseIcon className="icon" />}
            attributes={{
              form: "submit-form",
            }}
            onClick={resetForm}
            onKeyDown={(e) => formFocusManagement(e, FORM_STATUS.idle)}
          />
        </div>

        {formStatus === FORM_STATUS.error ? (
          <>
            <Spacer axis="vertical" size="30" />
            <div ref={errorSummaryRef} tabIndex="-1" className="error-summary">
              <h3 id="error-heading">Errors in Submission</h3>
              <Spacer axis="vertical" size="10" />
              {hasSubmitError ||
              github.inputStatus === FORM_STATUS.error ||
              twitter.inputStatus === FORM_STATUS.error ||
              linkedin.inputStatus === FORM_STATUS.error ||
              portfolio.inputStatus === FORM_STATUS.error ||
              email.inputStatus === FORM_STATUS.error ? (
                <>
                  <strong>
                    Please address the following errors and re-submit the form:
                  </strong>
                  <Spacer axis="vertical" size="10" />
                  <ul aria-label="current errors" id="error-group">
                    {hasSubmitError ? (
                      <li>Error submitting form, please try again</li>
                    ) : null}
                    <Spacer axis="vertical" size="5" />
                    {github.inputStatus === FORM_STATUS.error ? (
                      <li>
                        <a href="#github">Github Error</a>
                      </li>
                    ) : null}
                    <Spacer axis="vertical" size="5" />
                    {twitter.inputStatus === FORM_STATUS.error ? (
                      <li>
                        <a href="#twitter"> Twitter Error</a>
                      </li>
                    ) : null}
                    <Spacer axis="vertical" size="5" />
                    {linkedin.inputStatus === FORM_STATUS.error ? (
                      <li>
                        <a href="#linkedin">Linkedin Error</a>
                      </li>
                    ) : null}
                    <Spacer axis="vertical" size="5" />
                    {portfolio.inputStatus === FORM_STATUS.error ? (
                      <li>
                        <a href="#portfolio">Portfolio Error</a>
                      </li>
                    ) : null}
                    <Spacer axis="vertical" size="5" />
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
          </>
        ) : null}
        <Spacer axis="vertical" size="30" />
        <form id="submit-form" onSubmit={(e) => submitEdit(e)} noValidate>
          <InputContainer>
            <label htmlFor="github">Github:</label>
            <Spacer axis="vertical" size="5" />
            <input
              type="text"
              autoComplete="username"
              inputMode="url"
              id="github"
              name="github"
              data-input
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
          <Spacer axis="vertical" size="20" />
          <InputContainer>
            <label htmlFor="twitter">Twitter:</label>
            <Spacer axis="vertical" size="5" />
            <input
              type="text"
              autoComplete="username"
              inputMode="url"
              id="twitter"
              name="twitter"
              data-input
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
          <Spacer axis="vertical" size="20" />
          <InputContainer>
            <label htmlFor="linkedin">Linkedin:</label>
            <Spacer axis="vertical" size="5" />
            <input
              type="text"
              autoComplete="username"
              inputMode="url"
              id="linkedin"
              name="linkedin"
              data-input
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
          <Spacer axis="vertical" size="20" />
          <InputContainer>
            <label htmlFor="portfolio">Portfolio:</label>
            <Spacer axis="vertical" size="5" />
            <input
              type="url"
              autoComplete="url"
              inputMode="url"
              id="portfolio"
              name="portfolio"
              data-input
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
          <Spacer axis="vertical" size="20" />
          <InputContainer>
            <label htmlFor="email">Public Email:</label>
            <Spacer axis="vertical" size="5" />
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              id="email"
              name="email"
              data-input
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
          <Spacer axis="vertical" size="20" />
          <Combobox
            chosenOptions={location}
            onInputChange={getLocationsByValue}
            onChosenOption={setLocationWithGio}
            onRemoveChosenOption={removeLocation}
            inputName={"current-location"}
            displayName={"Current Location"}
            single
          />
          <Spacer axis="vertical" size="20" />
          <div className="button-container">
            <ControlButton
              type="submit"
              disabled={
                formStatus === FORM_STATUS.loading ||
                formStatus === FORM_STATUS.success
              }
              buttonText={`${
                formStatus === FORM_STATUS.active ? "Submit" : ""
              }${formStatus === FORM_STATUS.loading ? "loading..." : ""}${
                formStatus === FORM_STATUS.success ? "Success!" : ""
              }${formStatus === FORM_STATUS.error ? "Re-Submit" : ""}`}
            />
          </div>
        </form>
      </FormSection>
    </>
  );
}

const InfoSection = styled.section`
  .info-heading {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 7px;
  }
`;

const FormSection = styled.section`
  .edit-info-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 7px;
  }

  .error-summary {
    padding: 15px;
    border: 3px dashed red;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;

    button {
      width: 100%;
      max-width: 350px;
    }
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

export default YourWhereabouts;
