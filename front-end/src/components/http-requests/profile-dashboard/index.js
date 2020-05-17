import axios from "axios";

/*
  return array with res and err.
  return [res, err]
  so any component using these can easily handle error
  ex. 
  const [res, err] = await deleteImage(stuff)
  if (err) {
    ..stuff
    return
  }

  do stuff with res
  ..more stuff
*/

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

// location gio & autocompletes

export async function getGio(id) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/gio`,
      {
        placeId: id
      }
    );

    return [
      {
        lat: response.data.lat,
        lng: response.data.lng
      },
      false
    ];
  } catch (err) {
    return [
      {
        err,
        mssg: `${err.response.data.message}`
      },
      true
    ];
  }
}

export async function locationPredictions(value, gio) {
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
