import apiClient from "./api";

const getUserProfile = async (token) => {
  return await apiClient.get(`/users/getFellowProfile?token=${token}`);
};

const updateUserProfile = async (token, profile) => {
  return await apiClient.put(`/users/updateProfile`, profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getUserProfile, updateUserProfile };
