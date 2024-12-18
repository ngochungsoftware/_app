import axiosApi, { axiosApiRealtime } from "./axios";
import {API_BASE_URL} from "../constants/API"
const clientApi = {
    getAllProduct: () => {
        const url = `${API_BASE_URL}/productDetails/abc?colorCodes=&sizeCodes=&minPrice=0&maxPrice=5000000&page=0&size=10`;
        return axiosApi.get(url);
    },
}

export default clientApi;