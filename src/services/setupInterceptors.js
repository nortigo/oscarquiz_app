import router from '@/router';
import axiosInstance from "@/services/api";
import TokenService from "@/services/token";

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (originalConfig.url !== "/register/" && err.response) {
        if (err.response.status === 401) {
          store.dispatch('auth/signOut')
          router.push('/login')
        }
        // Access Token was expired
        if (err.response.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const rs = await axiosInstance.post("token/refresh/", {
              refresh: TokenService.getLocalRefreshToken(),
            });

            const { access } = rs.data;

            store.dispatch('auth/refreshToken', access);
            TokenService.updateLocalAccessToken(access);

            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }

      return Promise.reject(err);
    }
  );
};

export default setup;