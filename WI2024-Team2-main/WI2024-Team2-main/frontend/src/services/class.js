import apiClient from "./api";

const createClass = async (standard, students, token) => {
    return await apiClient.post('/classes/newClass', {
        standard,
        students,
        token
    });
}

const getClassesByFellow = async (token) => {
    return await apiClient.get(`/classes/getClassesByFellow?token=${token}`);
}

export {
    createClass,
    getClassesByFellow
}