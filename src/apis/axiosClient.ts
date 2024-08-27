import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import queryString from "query-string";

const bareUrl = `http://192.168.1.10:3001`;

const axiosClient = axios.create({
  baseURL: bareUrl,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
  console.log("Check config>>>>", config);
  config.headers = {
    Authorization: "",
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
    return Promise.reject(response);
  }
);

export default axiosClient;
