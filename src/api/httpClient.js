import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    config.headers = {
        Authorization: "Bearer " + token
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    debugger
    if(res?.config?.url === '/login' || res?.config?.url === '/register'){
      let token = res?.headers?.authorization
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res?.data?.data));
    }
    return res;
  },
  (error) => {
    // if (error?.response?.status === 401 ) {
    //     if (error?.response?.data?.message) {
    //         warningHandler('Authentication failed');
    //       }
    // }else if (error?.message === 'Network Error' || error?.code === 'ERR_BAD_REQUEST') {
    //     NetworkErrorHandler();
    //   }
    return Promise.reject(error);
  }
);

export default axiosInstance;