import axios from "axios";
import queryString from "query-string";
import { localDataName } from "../constants/appInfo";

const bareUrl = `http://192.168.0.30:3001`;

const getAccessToken = () => {
  const res = localStorage.getItem(localDataName.authData);

  return res ? JSON.parse(res).token : "";
};

const axiosClient = axios.create({
  baseURL: bareUrl,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  // console.log("Check config>>>>", config);
  const accesstoken = getAccessToken();
  config.headers = {
    Authorization: `Bearer ${accesstoken}`,
    Accept: "application/json",
    ...config.headers,
  };
  config.data;

  return config;
});

axiosClient.interceptors.response.use(
  (res) => {
    if (res.data && res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      return Promise.reject(res.data);
    }
  },
  (error) => {
    const { response } = error;
    return Promise.reject(response.data);
  }
);

export default axiosClient;
