import axios from "axios";
const DATA_URL = "http://localhost:3001/api";

const getAllRestaurants = () => {
  return axios.get(DATA_URL + "/restaurants").then((response) => {
    return response.data;
  });
};
const getRestaurantById = (id) => {
  return axios.get(DATA_URL + `/restaurants/${id}`).then((response) => {
    return response.data;
  });
};
const createRestaurant = (body) => {
  return axios
    .post(DATA_URL + "/restaurants/create", { body: body })
    .then((response) => {
      return response.data;
    });
};
const deleteRestaurantById = (id) => {
  return axios
    .delete(DATA_URL + `/restaurants/delete/${id}`)
    .then((response) => {
      return response.data;
    });
};
const updateRestaurantById = (id, body) => {
  return axios
    .patch(DATA_URL + `/restaurants/update/${id}`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  deleteRestaurantById,
  updateRestaurantById,
};

export default exports;
