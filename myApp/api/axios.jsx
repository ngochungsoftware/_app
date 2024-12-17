import axios from "axios";
import { url } from "../service/url";
import store from "../service/store";
import { setLoading } from "../service/slices/loadingSilce";

const axiosApi = axios.create({
  baseURL: url + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});



axiosApi.interceptors.request.use(
  (config) => {
    store.dispatch(setLoading(true));
    return config;
  },
  () => {}
);

axiosApi.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      store.dispatch(setLoading(false));
    }, 400);
    return response;
  },
  (error) => {}
);

export default axiosApi;

export const axiosApiRealtime = axios.create({
  baseURL: url + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
