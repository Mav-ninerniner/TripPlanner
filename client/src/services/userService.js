import axios from "axios";
const DATA_URL = "http://localhost:3001/api";

const getAllUsers = () => {
  return axios.get(DATA_URL + "/users").then((response) => {
    return response.data;
  });
};
const getUserById = (id) => {
  return axios.get(DATA_URL + `/users/${id}`).then((response) => {
    return response.data;
  });
};

const createUser = (body) => {
  return axios.post(DATA_URL + "/users", { body: body }).then((response) => {
    return response.data;
  });
};

const deleteUserById = (id) => {
  return axios.delete(DATA_URL + `/users/${id}`).then((response) => {
    return response.data;
  });
};

const updateUserById = (id, body) => {
  return axios
    .patch(DATA_URL + `/users/${id}`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
};

export default exports;
