import axios from "axios";
import { AuthContext } from "../firebase/Auth";
const DATA_URL = "http://localhost:3001/api";

const getAllTrips = () => {
  return axios.get(DATA_URL + "/trips").then((response) => {
    return response.data;
  });
};

const getTripById = (id) => {
  return axios.get(DATA_URL + `/trips/${id}`).then((response) => {
    return response.data;
  });
};

const createTrip = (body) => {
  console.log(body);
  return axios.post(DATA_URL + "/trips", { body: body }).then((response) => {
    return response.data;
  });
};

const deleteTripById = (id) => {
  return axios.delete(DATA_URL + `/trips/${id}`).then((response) => {
    return response.data;
  });
};

const updateTripById = (id, body) => {
  return axios
    .patch(DATA_URL + `/trips/${id}`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const addAttractionToTrip = (id, body) => {
  return axios
    .patch(DATA_URL + `/trips/${id}/attractions`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const removeAttractionFromTrip = (id, body) => {
  return axios
    .patch(DATA_URL + `/trips/${id}/attractions/remove`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const addHotelToTrip = (id, body) => {
  return axios
    .patch(DATA_URL + `/trips/${id}/hotels`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const removeHotelFromTrip = (id, body) => {
  return axios
    .patch(DATA_URL + `/trips/${id}/hotels/remove`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const addRestaurantToTrip = (id, body) => {
  return axios
    .patch(DATA_URL + `/trips/${id}/restaurants`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const removeRestaurantFromTrip = (id, body) => {
  return axios
    .patch(DATA_URL + `/trips/${id}/restaurants/remove`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const inviteUserToTrip = (id, body) => {
  id = new Object("60f9b1b1b0b5a8b0b0b0b0b0");
  console.log(body);
  return axios
    .post(DATA_URL + `/trips/${id}/invite`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const acceptTripInvite = (id, userId, body) => {
  // const currUser = useContext(AuthContext);
  // const userId = currUser.uid;
  // console.log(userId);
  return axios
    .post(DATA_URL + `/trips/${id}/accept/${userId}`, { body: body })
    .then((response) => {
      return response.data;
    });
};

const exports = {
  getAllTrips,
  getTripById,
  createTrip,
  deleteTripById,
  updateTripById,
  addAttractionToTrip,
  removeAttractionFromTrip,
  addHotelToTrip,
  removeHotelFromTrip,
  addRestaurantToTrip,
  removeRestaurantFromTrip,
  inviteUserToTrip,
  acceptTripInvite,
};

export default exports;
