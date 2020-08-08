import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";
import { useState } from "react";
import DashboardBilling from "../billing/DashboardBilling";
import { httpClient } from "../../../global/helpers/http-requests";
import ImageUploadForm from "../../../components/forms/image-upload";
import AutoComplete from "../../../components/forms/autocomplete";

function NewUser() {
  const { user, setPreviewImg, editProfile } = useContext(
    ProfileContext
  );
  const [editInputs, setEditInputs] = useState(false);
  const [selectedTab, setSelectedTab] = useState("basic-info");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [firstNameInputChange, setFirstNameInputChange] = useState(false);
  const [imageInput, setImageInput] = useState({ image: "", id: "" });
  const [imageInputChange, setImageInputChange] = useState(false);
  const [areaOfWorkInput, setAreaOfWorkInput] = useState("");
  const [areaOfWorkInputChange, setAreaOfWorkInputChange] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [titleInputChange, setTitleInputChange] = useState(false);
  const [summaryInput, setSummaryInput] = useState("");
  const [summaryInputChange, setSummaryInputChange] = useState(false);
  const [locationInput, setLocationInput] = useState([]);
  const [locationInputChange, setLocationInputChange] = useState(false);

  // imageInput is the preview image so default should be ""
  // area of work select value default should also be ""
  function onEditInputs() {
    setEditInputs(true);
    setFirstNameInput(user.first_name || "");
    setFirstNameInputChange(false);
    setSummaryInput(user.summary || "");
    setSummaryInputChange(false);
    setImageInput({ image: "", id: "" });
    setImageInputChange(false);
    setAreaOfWorkInput("");
    setAreaOfWorkInputChange(false);
    setTitleInput(user.desired_title || "");
    setTitleInputChange(false);
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

  function onTabChange(tab) {
    setSelectedTab(tab);
  }

  function onFirstNameInputChange(value) {
    if (!firstNameInputChange) {
      setFirstNameInputChange(true);
    }
    setFirstNameInput(value);
  }

  function onSummaryInputChange(value) {
    if (!summaryInputChange) {
      setSummaryInputChange(true);
    }
    setSummaryInput(value);
  }

  function onImageInputChange(value) {
    if (!imageInputChange) {
      setImageInputChange(true);
    }
    setImageInput(value);
  }

  function removeImage() {
    console.log("removeeeee");
    // should not remove on the spot
    // should set the image to remove
    // UI that tells user this image will be removed,
    // preview image will replace UI if user chooses another image after removing current
  }

  function onAreaOfWorkInputChange(value) {
    // when user selects default value, indicates no change
    if (!value) {
      setAreaOfWorkInputChange(false);
      return;
    }
    if (!areaOfWorkInputChange) {
      setAreaOfWorkInputChange(true);
    }
    setAreaOfWorkInput(value);
  }

  function onTitleInputChange(value) {
    if (!titleInputChange) {
      setTitleInputChange(true);
    }
    setTitleInput(value);
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
      !firstNameInputChange &&
      !summaryInputChange &&
      !imageInputChange &&
      !areaOfWorkInputChange &&
      !titleInputChange &&
      !locationInputChange
    ) {
      return;
    }

    const inputs = {};

    if (firstNameInputChange) {
      inputs.first_name = firstNameInput;
    }

    if (summaryInputChange) {
      inputs.summary = summaryInput;
    }

    if (imageInputChange) {
      if (imageInput.id !== user.image_id) {
        if (user.image_id) {
          httpClient("POST", "/api/delete-image", {
            id: user.image_id
          });
        }

        inputs.image = imageInput.image;
        inputs.image_id = imageInput.id;
        localStorage.removeItem("image_id");
        setPreviewImg({ image: "", id: "" });
      }
    }

    if (areaOfWorkInputChange) {
      inputs.area_of_work = areaOfWorkInput;
    }

    if (titleInputChange) {
      inputs.desired_title = titleInput;
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

    console.log("IUHGAIUF", inputs);
    setEditInputs(false);
    editProfile(inputs);
  }

  console.log("NEW USER", user);

  if (!editInputs) {
    return (
      <Section>
        <h1>Hello New User</h1>
        <Link to="/profile-dashboard">Go Home</Link>
        <button onClick={onEditInputs}>Edit Inputs</button>
      </Section>
    );
  }
  return (
    <Section>
      <h1>Edit Infoo</h1>
      <div className="tabs">
        <div role="tablist" aria-label="quick start">
          <button
            id="basic-info"
            role="tab"
            tabIndex="-1"
            aria-controls="basic-info-panel"
            aria-selected={selectedTab === "basic-info"}
            onClick={() => onTabChange("basic-info")}
          >
            Basic Info
          </button>
          <button
            id="billing-info"
            role="tab"
            tabIndex="-1"
            aria-controls="billing-info-panel"
            aria-selected={selectedTab === "billing-info"}
            onClick={() => onTabChange("billing-info")}
          >
            Billing
          </button>
        </div>
        <div
          id="basic-info-panel"
          role="tabpanel"
          tabIndex="0"
          aria-labelledby="basic-info"
          style={{
            display: selectedTab === "basic-info" ? "block" : "none"
          }}
        >
          <div>
            <form onSubmit={e => submitEdit(e)}>
              <input
                type="text"
                placeholder="First Name"
                value={firstNameInput}
                onChange={e => onFirstNameInputChange(e.target.value)}
              />

              <br />
              <br />
              <br />
              <input
                type="text"
                placeholder="Summary"
                value={summaryInput}
                onChange={e => onSummaryInputChange(e.target.value)}
              />
              <br />
              <br />
              <br />

              {user.image || imageInput.image ? (
                <div style={{ height: "200px", width: "200px" }}>
                  {!imageInput.image ? (
                    <span
                      style={{
                        position: "absolute",
                        top: "5%",
                        right: "5%",
                        border: "solid",
                        zIndex: "1"
                      }}
                      onClick={removeImage}
                    >
                      X
                    </span>
                  ) : null}

                  <img
                    style={{ height: "200px", width: "200px" }}
                    src={imageInput.image || user.image}
                    alt="current profile pic"
                  />
                </div>
              ) : null}

              <ImageUploadForm
                setImageInput={onImageInputChange}
                imageInput={imageInput}
              />

              <br />
              <br />
              <br />

              <select
                id="area-of-work"
                onClick={e => onAreaOfWorkInputChange(e.target.value)}
                onBlur={e => onAreaOfWorkInputChange(e.target.value)}
              >
                <option value="">--Select--</option>
                <option value="Development">Development</option>
                <option value="iOS">iOS</option>
                <option value="Android">Android</option>
                <option value="Design">Design</option>
              </select>

              <br />
              <br />
              <br />

              <input
                type="text"
                placeholder="Title"
                value={titleInput}
                onChange={e => onTitleInputChange(e.target.value)}
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

              <button>Submit</button>
            </form>
          </div>
        </div>
        <div
          id="billing-info-panel"
          role="tabpanel"
          tabIndex="0"
          aria-labelledby="billing-info"
          style={{
            display: selectedTab === "billing-info" ? "block" : "none"
          }}
        >
          <DashboardBilling />
        </div>
      </div>
    </Section>
  );
}

const Section = styled.section`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default NewUser;
