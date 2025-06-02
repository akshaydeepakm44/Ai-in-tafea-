import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5002/api', // Ensure this URL matches your backend server URL
    timeout: 30000, // Increase timeout to 30 seconds
});

const requestOTP = async (email) => {
    return await apiClient.post('/users/requestOTP', { email });
};

const verifyOTP = async (email, otp) => {
    return await apiClient.post('/users/verifyOTP', { mail: email, otp });
};

const addFellow = async (name, email, mobile) => {
    return await apiClient.post('/users/addFellow', {
        name,
        email,
        mobile
    });
};

export {
    requestOTP,
    verifyOTP,
    addFellow
};