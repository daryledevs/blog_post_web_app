import axios from "axios";

class ErrorHandler {
  static handle(error:any){
    const errorData = {
      message: error.data?.message,
      status: error?.status
    }
    console.log(errorData);
    return Promise.reject(error);
  };
}

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(null, (error) => {
  const isError = error.response &&  error.response.status >= 400 && error.response.status < 500; 
  if(isError) ErrorHandler.handle(error);
  return Promise.reject(error);
});

export { ErrorHandler };
export default api;