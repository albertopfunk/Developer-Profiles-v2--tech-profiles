import axios from "axios";

// images

export async function deleteImage(imageData) {
  let imageToDelete = imageData;
  imageToDelete = imageToDelete.split(",");

  try {
    await axios.post(`${process.env.REACT_APP_SERVER}/api/delete-image`, {
      id: imageToDelete[1]
    });
  } catch (err) {
    console.error(`Error Deleting Image =>`, err);
  }
}

// autocompletes

export async function locationPredictions(value) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/autocomplete`,
      { locationInput: value }
    );

    const predictions = response.data.predictions.map(location => {
      return {
        name: location.description,
        id: location.place_id
      };
    });

    return predictions;
  } catch (err) {
    console.error(`${err.response.data.message} =>`, err);
    return [];
  }
}

export async function skillPredictions(value) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER}/skills/autocomplete`,
      { skillsInput: value }
    );

    const predictions = response.data.map(skill => {
      return {
        name: skill.skill,
        id: skill.id
      };
    });

    return predictions;
  } catch (err) {
    console.error(`${err.response.data.message} =>`, err);
    return [];
  }
}
