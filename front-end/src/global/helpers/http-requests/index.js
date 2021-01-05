import axios from "axios";

function composer(options) {
  const { method, url, data, config, cancelToken } = options;
  const headers = config?.headers ?? null;
  const setOptions = {
    baseURL: process.env.REACT_APP_SERVER,
    timeout: 5000,
    method,
    url,
    data,
    headers,
    cancelToken,
  };

  return axios(setOptions);
}

function sendResponse(res, source) {
  const newRes = res.map((res) => {
    return {
      data: res.data,
      status: res?.status ?? 200,
    };
  });

  if (res.length > 1) {
    return [newRes, false, source];
  }

  return [newRes[0], false, source];
}

function sendError(err, method, url) {
  const errMethod = err?.response?.config?.method ?? method;
  const errUrl = err?.response?.config?.url ?? url;
  const errMssg =
    err?.response?.data?.message ??
    `Unknown error with ${errMethod} : ${errUrl}`;

  return [
    {
      err: errMssg,
      mssg: `Error with ${errMethod} : ${errUrl}`,
      status: err?.response?.status ?? 500,
    },
    true,
  ];
}

export async function httpClient(method, url, data, config = {}) {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const options = {
    method,
    url,
    data,
    config,
    cancelToken: source.token,
  };

  let optionsArr = [options, ...(config.additional ? config.additional : [])];

  try {
    const res = await Promise.all(
      optionsArr.map((options) => composer(options))
    );
    return sendResponse(res, source);
  } catch (err) {
    return sendError(err, method, url);
  }
}
