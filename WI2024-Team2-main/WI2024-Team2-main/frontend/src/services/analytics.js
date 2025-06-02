import apiClient from "./api";

const getAnalyticsData = async (token) => {
  return await apiClient.get(`/analytics/getAnalyticsData?token=${token}`);
};

export { getAnalyticsData };
