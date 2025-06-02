import apiClient from "./api"

const getFellowProfile = async (token) => {
    return await apiClient.get(`/users/getFellowProfile?token=${token}`);
}

export {
    getFellowProfile
}