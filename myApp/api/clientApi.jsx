import axiosApi, { axiosApiRealtime } from "./axios";

const clientApi = {
    getAllProduct: () => {
        const url = `http://localhost:8080/api/v1/productDetails/abc?colorCodes=&sizeCodes=&minPrice=0&maxPrice=5000000&page=0&size=10`;
        return axiosApi.get(url);
    },
}

export default clientApi;