import apiClient from "./api";

const getSuggestedActivities = async (token, lesson) => {
    return await apiClient.post('/chat/getChat', {
        token,
        lesson
    });
};

const sendChatMessage = async (data) => {
    return await apiClient.post('/chat/sendMessage', {
        token: data.token,
        lesson: data.lesson,
        message: data.message,
        messageHistory: data.messageHistory
    });
};

export {
    getSuggestedActivities,
    sendChatMessage
};