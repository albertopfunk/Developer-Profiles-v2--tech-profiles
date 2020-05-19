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

function onSuccess(data) {
  return [data, false];
}

function onError(data) {
  return [data, true];
}

// images

export async function uploadImage(data) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/upload-image`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const { url, id } = res.data;

    return onSuccess({
      data: { url, id },
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `Error uploading to cloudinary`,
      status: 500
    });
  }
}

export async function deleteImage(imageData) {
  let imageToDelete = imageData;
  imageToDelete = imageToDelete.split(",");

  try {
    await axios.post(`${process.env.REACT_APP_SERVER}/api/delete-image`, {
      id: imageToDelete[1]
    });
    return onSuccess({
      data: {},
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `Error Deleting Image`,
      status: 500
    });
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

    const { lat, lng } = response.data;

    return onSuccess({
      data: { lat, lng },
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `${err.response.data.message}`,
      status: 500
    });
  }
}

export async function locationPredictions(value) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/autocomplete`,
      { locationInput: value }
    );

    const predictions = res.data.predictions.map(location => {
      return {
        name: location.description,
        id: location.place_id
      };
    });

    return onSuccess({
      data: { predictions },
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `${err.response.data.message}`,
      status: 500
    });
  }
}

export async function skillPredictions(value) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/skills/autocomplete`,
      { skillsInput: value }
    );

    const predictions = res.data.map(skill => {
      return {
        name: skill.skill,
        id: skill.id
      };
    });

    return onSuccess({
      data: { predictions },
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `${err.response.data.message}`,
      status: 500
    });
  }
}

// billing

export async function userSubInfo(sub) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/get-subscription`,
      { sub }
    );

    if (res.data.status !== "active") {
      return onSuccess({
        data: {},
        status: "inactiveSubscriber"
      });
    }

    for (let data in res.data) {
      if (data === "created" || data === "startDate" || data === "dueDate") {
        let date = res.data[data] * 1000;
        let normDate = new Date(date);
        normDate = normDate.toString();
        let normDateArr = normDate.split(" ");
        res.data[
          data
        ] = `${normDateArr[1]} ${normDateArr[2]} ${normDateArr[3]}`;
      }
    }

    return onSuccess({
      data: res.data,
      status: "active"
    });
  } catch (err) {
    return onError({
      err,
      mssg: `Unable to check status`,
      status: 500
    });
  }
}

export async function subscribeUser(subInfo) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/subscribe`,
      subInfo
    );

    const { stripe_customer_id, stripe_subscription_name } = res.data;

    return onSuccess({
      data: { stripe_customer_id, stripe_subscription_name },
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `Unable to subscribe user`,
      status: 500
    });
  }
}

export async function reSubscribeUser(subInfo) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_SERVER}/api/subscribe-existing`,
      subInfo
    );

    const { stripe_subscription_name } = res.data;

    return onSuccess({
      data: { stripe_subscription_name },
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `Unable to re-subscribe user`,
      status: 500
    });
  }
}

export async function cancelUserSub(sub) {
  try {
    await axios.post(
      `${process.env.REACT_APP_SERVER}/api/cancel-subscription`,
      { sub }
    );

    return onSuccess({
      data: {},
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `Unable to cancel subscription`,
      status: 500
    });
  }
}
