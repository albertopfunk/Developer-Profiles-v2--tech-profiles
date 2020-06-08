import axios from "axios";

async function composer(options) {
  options.baseURL = process.env.REACT_APP_SERVER;
  if (options.config && options.config.headers) {
    options.headers = options.config.headers;
  }

  return axios(options);
}

export async function httpClient(method, url, data, config = {}) {
  const options = {
    baseURL: `${process.env.REACT_APP_SERVER}`,
    method,
    url,
    data,
    headers: config.headers ? { ...config.headers } : null
  };

  let optionsArr = [options, ...(config.additional ? config.additional : [])];

  try {
    const res = await Promise.all(optionsArr.map(options => composer(options)));

    if (res.length > 1) {
      return [res, false];
    }

    return [
      {
        data: res[0].data,
        status: res[0].status ? res[0].status : 200
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
