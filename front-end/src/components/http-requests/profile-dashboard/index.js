import axios from "axios";
import auth0Client from "../../../auth/Auth";

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

export async function httpClient(method, url, data, config = {}) {
  const options = {
    baseURL: `${process.env.REACT_APP_SERVER}`,
    method,
    url,
    data,
    headers: config.headers ? { ...config.headers } : null
  };

  try {
    const res = await axios(options);
    console.log(res);
    return [
      {
        data: res.data,
        status: 200
      },
      false
    ];
  } catch (err) {
    return [
      {
        err,
        mssg: `Error with ${method} : ${url}`,
        status: 500
      },
      true
    ];
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

export async function getUser() {
  const userProfile = auth0Client.getProfile();
  const { email } = userProfile;

  if (!email) {
    auth0Client.signOut("authorize");
    return onError({
      err: {},
      mssg: `Unable to Get User Profile from Auth0`,
      status: 500
    });
  }

  try {
    const user = await axios.post(
      `${process.env.REACT_APP_SERVER}/users/get-single`,
      { email }
    );

    return onSuccess({
      data: user.data,
      status: 200
    });
  } catch (err) {
    auth0Client.signOut("authorize");
    return onError({
      err,
      mssg: `Error Getting User By Email`,
      status: 500
    });
  }
}

export async function editUser(data, id) {
  try {
    const newUser = await axios.put(
      `${process.env.REACT_APP_SERVER}/users/${id}`,
      data
    );

    return onSuccess({
      data: newUser.data,
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `Unable to edit user`,
      status: 500
    });
  }
}

export async function addUserExtra(data, extra) {
  try {
    await axios.post(
      `${process.env.REACT_APP_SERVER}/extras/new/${extra}`,
      data
    );

    return onSuccess({
      data: {},
      status: 200
    });
  } catch (err) {
    return onError({
      err,
      mssg: `Unable to add ${extra}`,
      status: 500
    });
  }
}
