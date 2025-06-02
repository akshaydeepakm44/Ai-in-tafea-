import apiClient from "./api";

const submitActivityRating = async (data) => {
  return await apiClient.post('/feedback/rateActivity', data);
};

const submitPerformanceRating = async (data) => {
  return await apiClient.post('/feedback/rateStudent', data);
};

const getActivityRatings = async (token) => {
  return await apiClient.get(`/feedback/activityRating?token=${token}`);
};

const getPerformanceRatings = async (token) => {
  return await apiClient.get(`/feedback/studentRating?token=${token}`);
};

export { submitActivityRating, submitPerformanceRating, getActivityRatings, getPerformanceRatings };
