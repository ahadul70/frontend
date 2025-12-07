import axios from "axios";

const useAxiosSecurity = () => {
    const axiosInstance = axios.create({
        baseURL: "http://localhost:5000",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return axiosInstance;
};

export default useAxiosSecurity;