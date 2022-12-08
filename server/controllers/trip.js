const Trip = require("../model/Trip");
const User = require("../model/User");
const Hotel = require("../model/Hotel");
const Restaurant = require("../model/Restaurant");
const Attraction = require("../model/Attraction");
const validation = require("../validation/routesValidation");

const getTripById = async (id) => {
  let parsedId = validation.toObjectId(id, "TripId");
  const trip = await Trip.findById(parsedId);
  if (trip) {
    return trip;
  } else {
    throw {
      message: `Trip not found with ID: ${id}`,
      status: 404,
    };
  }
};

const getAllTrips = async () => {
  const tripsList = await Trip.find();
  if (tripsList.length > 0) {
    return tripsList;
  } else {
    throw {
      message: `No trips found`,
      status: 404,
    };
  }
};

const createTrip = async (userId, tripBody) => {
  let parsedId = validation.checkString(userId, "UserId");
  let startDate = new Date(tripBody.tripDate.startDate);
  let endDate = new Date(tripBody.tripDate.endDate);
  let loop = new Date(startDate);
  const newTripInfo = new Trip(tripBody);

  const savedTrip = await newTripInfo.save();
  if (!savedTrip) {
    throw {
      message: `Trip was not created`,
      status: 400,
    };
  }

  if (savedTrip) {
    let user = await User.findById(userId);
    if (user) {
      await User.findByIdAndUpdate(parsedId, {
        $push: { trips: savedTrip._id },
      });
    } else {
      throw {
        message: `User not found with ID: ${userId}`,
        status: 404,
      };
    }

    let trip = await Trip.findById(savedTrip._id);
    trip.users.push(user._id);
    while (loop <= endDate) {
      let date = loop.toISOString().split("T")[0].split("-");
      let day = date[2];
      let month = date[1];
      let year = date[0];
      date = `${month}/${day}/${year}`;
      const itineraryObject = {
        date: date,
      };
      trip.itinerary.push(itineraryObject);
      loop.setDate(loop.getDate() + 1);
    }
    await trip.save();
    return trip;
  } else {
    throw {
      message: `Trip was not created`,
      status: 400,
    };
  }
};

const updateTripById = async (id, updateTripBody) => {
  let parsedId = validation.toObjectId(id, "TripId");
  const trip = await Trip.findById(parsedId);

  if (!trip) {
    throw {
      message: `Trip not found with ID: ${id}`,
      status: 404,
    };
  } else {
    const newTripInfo = updateTripBody;
    let updatedTrip = { tripDate: {} };

    id = validation.checkId(id, "TripId");
    if (newTripInfo.tripName) {
      newTripInfo.tripName = validation.checkString(
        newTripInfo.tripName,
        "TripName",
      );
    }
    if (newTripInfo.cur_location) {
      newTripInfo.cur_location = validation.checkString(
        newTripInfo.cur_location,
        "CurrLocation",
      );
    }
    if (newTripInfo.destination) {
      newTripInfo.destination = validation.checkString(
        newTripInfo.destination,
        "Destination",
      );
    }
    if (newTripInfo.tripDate.startDate) {
      newTripInfo.tripDate.startDate = validation.checkDate(
        newTripInfo.tripDate.startDate,
        "StartDate",
      );
    }
    if (newTripInfo.tripDate.endDate) {
      newTripInfo.tripDate.endDate = validation.checkDate(
        newTripInfo.tripDate.endDate,
        "EndDate",
      );
    }
    if (newTripInfo.notes) {
      newTripInfo.notes = validation.checkString(newTripInfo.notes, "Notes");
    }

    const oldTripInfo = await Trip.findById(id);
    if (newTripInfo.tripName && newTripInfo.tripName !== oldTripInfo.tripName) {
      updatedTrip.tripName = newTripInfo.tripName;
    }
    if (
      newTripInfo.cur_location &&
      newTripInfo.cur_location !== oldTripInfo.cur_location
    ) {
      updatedTrip.cur_location = newTripInfo.cur_location;
    }
    if (newTripInfo.destination !== oldTripInfo.destination) {
      updatedTrip.destination = newTripInfo.destination;
    }
    if (newTripInfo.tripDate.startDate !== oldTripInfo.tripDate.startDate) {
      updatedTrip.tripDate.startDate = newTripInfo.tripDate.startDate;
    }
    if (newTripInfo.tripDate.endDate !== oldTripInfo.tripDate.endDate) {
      updatedTrip.tripDate.endDate = newTripInfo.tripDate.endDate;
    }
    if (newTripInfo.notes && newTripInfo.notes !== oldTripInfo.notes) {
      updatedTrip.notes = newTripInfo.notes;
    }

    if (Object.keys(updatedTrip).length !== 0) {
      let startDate = new Date(updateTripBody.tripDate.startDate);
      let endDate = new Date(updateTripBody.tripDate.endDate);
      let loop = new Date(startDate);
      const updateTrip = await Trip.findByIdAndUpdate(
        id,
        { $set: updateTripBody },
        { new: true },
      );

      if (updateTrip) {
        let trip = await Trip.findById(updateTrip._id);
        trip.itinerary = [];
        while (loop <= endDate) {
          let date = loop.toISOString().split("T")[0].split("-");
          let day = date[2];
          let month = date[1];
          let year = date[0];
          date = `${month}/${day}/${year}`;
          const itineraryObject = {
            date: date,
          };
          trip.itinerary.push(itineraryObject);
          loop.setDate(loop.getDate() + 1);
        }
        await trip.save();
        return trip;
      } else {
        throw {
          message: `Trip with ID: ${id} was not updated`,
          status: 400,
        };
      }
    } else {
      throw {
        message: `No changes were made to Trip with ID: ${id}`,
        status: 400,
      };
    }
  }
};

const deleteTripById = async (id) => {
  let parsedId = validation.toObjectId(id, "TripId");
  const trip = await Trip.findById(parsedId);

  if (trip) {
    const tripToDelete = await Trip.findByIdAndDelete(parsedId);
    if (tripToDelete) {
      return {
        message: `Trip with ID: ${id} was deleted`,
        deleted: true,
      };
    } else {
      throw {
        message: `Trip with ID: ${id} was not deleted`,
        status: 400,
      };
    }
  } else {
    throw {
      message: `Trip not found with ID: ${id}`,
      status: 404,
    };
  }
};

// user accepts invite to trip and is added to trip

const addAttractionToTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.tripid);
  if (!trip) {
    throw {
      message: `Trip not found`,
      status: 404,
    };
  } else {
    const attraction = await Attraction.findById(req.params.attractionid);
    if (!attraction) {
      throw {
        message: `Attraction not found`,
        status: 404,
      };
    }
    if (!trip.attractions.includes(attraction._id)) {
      trip.attractions.push(attraction._id);
      await trip.save();
      return trip;
    } else {
      throw {
        message: `Attraction already added to trip`,
        status: 400,
      };
    }
  }
};

const removeAttractionFromTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.tripid);
  if (!trip) {
    throw {
      message: `Trip not found`,
      status: 404,
    };
  } else {
    if (trip.attractions.includes(req.params.attractionid)) {
      trip.attractions.pull(req.params.attractionid);
      await trip.save();
      return trip;
    } else {
      throw {
        message: `Attraction not in trip`,
        status: 400,
      };
    }
  }
};

const addHotelToTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.tripid);
  if (!trip) {
    throw {
      message: `Trip not found`,
      status: 404,
    };
  } else {
    const hotel = await Hotel.findById(req.params.hotelid);
    if (!attraction) {
      throw {
        message: `Hotel not found`,
        status: 404,
      };
    }
    if (!trip.hotels.includes(hotel._id)) {
      trip.hotels.push(hotel._id);
      await trip.save();
      return trip;
    } else {
      throw {
        message: `Hotel already added to trip`,
        status: 400,
      };
    }
  }
};

const removeHotelFromTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.tripid);
  if (!trip) {
    throw {
      message: `Trip not found`,
      status: 404,
    };
  } else {
    if (trip.hotels.includes(req.params.hotelid)) {
      trip.hotels.pull(req.params.hotelid);
      await trip.save();
      return trip;
    } else {
      throw {
        message: `Hotel not in trip`,
        status: 400,
      };
    }
  }
};

const addRestaurantToTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.tripid);
  if (!trip) {
    throw {
      message: `Trip not found`,
      status: 404,
    };
  } else {
    const restaurant = await Restaurant.findById(req.params.restaurantid);
    if (!attraction) {
      throw {
        message: `Restaurant not found`,
        status: 404,
      };
    }
    if (!trip.restaurants.includes(restaurant._id)) {
      trip.restaurants.push(restaurant._id);
      await trip.save();
      return trip;
    } else {
      throw {
        message: `Restaurant already added to trip`,
        status: 400,
      };
    }
  }
};

const removeRestaurantFromTrip = async (req, res) => {
  const trip = await Trip.findById(req.params.tripid);
  if (!trip) {
    throw {
      message: `Trip not found`,
      status: 404,
    };
  } else {
    if (trip.restaurants.includes(req.params.restaurantid)) {
      trip.restaurants.pull(req.params.restaurantid);
      await trip.save();
      return trip;
    } else {
      throw {
        message: `Restaurant not in trip`,
        status: 404,
      };
    }
  }
};

const acceptInviteToTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    //checking if user is currently logged in or not
    const user = await User.getUserById(
      { params: { id: req.body.id } },
      res,
      next,
    );

    if (user) {
      if (trip.invites.includes(user.email)) {
        trip.invites.pull(user.email);
        trip.users.push(user._id);

        await Trip.updateTripById(
          { params: { id: req.params.id }, body: trip },
          res,
          next,
        );
        res.status(200).json(trip);
      } else {
        throw {
          message: `User not invited to trip`,
          status: 400,
        };
      }
    } else {
      throw {
        message: `User not logged in`,
        status: 400,
      };
    }
  } catch (err) {
    next(err);
  }
};

const inviteUserToTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip.invites.includes(req.body.email)) {
      trip.invites.push(req.body.email);
      await Trip.updateTripById(
        { params: { id: req.params.id }, body: trip },
        res,
        next,
      );
      res.status(200).json(trip);
    } else {
      throw {
        message: `User already invited to trip`,
        status: 400,
      };
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTripById,
  getAllTrips,
  createTrip,
  updateTripById,
  deleteTripById,
  addRestaurantToTrip,
  removeRestaurantFromTrip,
  addHotelToTrip,
  removeHotelFromTrip,
  addAttractionToTrip,
  removeAttractionFromTrip,
  inviteUserToTrip,
  acceptInviteToTrip,
};
