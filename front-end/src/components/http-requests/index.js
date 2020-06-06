import axios from "axios";

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
    return [
      {
        data: res.data,
        status: res.status ? res.status : 200
      },
      false
    ];
  } catch (err) {
    return [
      {
        err: err.response
          ? err.response.data.message
          : `Unknown error with ${method} : ${url}`,
        mssg: `Error with ${method} : ${url}`,
        status: 500
      },
      true
    ];
  }
}
