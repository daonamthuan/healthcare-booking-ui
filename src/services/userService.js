import axios from "../axios"; // axios o day da duoc custom chu khong phai thu vien

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post("/api/login", {
        email: userEmail,
        password: userPassword,
    });
};

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
    return axios.post(`/api/create-new-user`, data);
};

export { handleLoginApi, getAllUsers, createNewUserService };
