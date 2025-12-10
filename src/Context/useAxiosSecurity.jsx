import axios from "axios";
import useAuth from "../Context/useAuth"

const useAxiosSecurity = () => {
    const { user } = useAuth();
    const axiosInstance = axios.create({
        baseURL: "http://localhost:5000",
        headers: {
            "Content-Type": "application/json",
        },
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            const currentToken = user?.accessToken || token;

            console.log("Token in interceptor:", currentToken); // Debug log

            if (currentToken) {
                config.headers.Authorization = `Bearer ${currentToken}`;
                console.log("Authorization Header useAxiosSecurity:", config.headers.Authorization);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return axiosInstance;
};

export default useAxiosSecurity;
