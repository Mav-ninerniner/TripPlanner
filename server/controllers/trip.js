const Trip = require("../model/Trip");
const validation = require("../validation/routesValidation");

const getTripById = async (req, res, next) => {
  try {
    validation.checkId(req.params.id);
    const trip = await Trip.findById(req.params.id);
    if (trip) {
      res.status(200).json(trip);
    } else {
      throw {
        message: `Trip not found with ID: ${trip}`,
        status: 404,
      };
    }
    res.status(200).json(restaurant);
  } catch (err) {
    next(err);
  }
};

const getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find();
    if (trips.length > 0) {
      res.status(200).json(trips);
    } else {
      throw {
        message: `No trips found`,
        status: 404,
      };
    }
  } catch (err) {
    next(err);
  }
};

const createTrip = async (req, res, next) => {
  const newTrip = new Trip(req.body);

  try {
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    next;
  }
};

const updateTripById = async (req, res, next) => {
  try {
    const updateTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json(updateTrip);
  } catch (err) {
    next(err);
  }
};

const deleteTripById = async (req, res, next) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json(`Trip on ID (${req.params.id}) has been deleted...`);
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
};
