import apiClient from "./api";

const getUserDetails = async (token) => {
  return await apiClient.get(`/user/details?token=${token}`);
};

export { getUserDetails };
