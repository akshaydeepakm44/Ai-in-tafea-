import apiClient from "./api";

const getSkills = async () => {
    return await apiClient.get('/lessons/getSkills');
};

const createLesson = async (token, lessonName, classId, skills) => {
    return await apiClient.post('/lessons/newLesson', {
        token,
        lesson_name: lessonName,
        classId,
        skills
    });
};

const getLessonPlans = async (token) => {
    // Fixed template literal syntax
    return await apiClient.get(`/lessons/getLessonPlans?token=${token}`);
};

const updateSuggestedActivities = async (lessonId, activities) => {
    return await apiClient.post('/lessons/addSuggestedActivities', {
        lessonId,
        activities
    });
};

const updateSelectedActivity = async (lessonId, activityId) => {
    return await apiClient.post('/lessons/updateSelectedActivity', {
        lessonId,
        activityId
    });
};

const updateLessonProgress = async (lessonId, progress) => {
    return await apiClient.post('/lessons/updateLessonProgress', {
        lessonId,
        progress
    });
};

const getClassesByFellow = async (fellowId) => {
    // Fixed template literal syntax
    return await apiClient.get(`/lessons/getClassesByFellow/${fellowId}`);
};

export {
    getSkills,
    createLesson,
    getLessonPlans,
    updateSuggestedActivities,
    updateSelectedActivity,
    updateLessonProgress,
    getClassesByFellow
};