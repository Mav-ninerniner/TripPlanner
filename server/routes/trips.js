const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/trip");

router.get("/", async (req, res) => {
  try {
    const tripsList = await getAllTrips();
    res.status(200).json(tripsList);
  } catch (e) {
    res.status(e.status ? e.status : 500).json(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);
    res.status(200).json(trip);
  } catch (e) {
    res.status(e.status ? e.status : 500).json(e);
  }
});

router.post("/create/:userid", async (req, res) => {
  try {
    const newTrip = await createTrip(req.params.userid, req.body);
    res.status(200).json(newTrip);
  } catch (e) {
    res.status(e.status ? e.status : 500).json(e);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedTrip = await deleteTripById(req.params.id);
    res.status(200).json(deletedTrip);
  } catch (e) {
    res.status(e.status ? e.status : 500).json(e);
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const updatedTrip = await updateTripById(req.params.id, req.body);
    res.status(200).json(updatedTrip);
  } catch (e) {
    res.status(e.status ? e.status : 500).json(e);
  }
});

router.patch("/:id/attractions", function (req, res, next) {
  addAttractionToTrip(req, res, next);
});

router.patch("/:id/attractions/remove", function (req, res, next) {
  removeAttractionFromTrip(req, res, next);
});

router.patch("/:id/hotels", function (req, res, next) {
  addHotelToTrip(req, res, next);
});

router.patch("/:id/hotels/remove", function (req, res, next) {
  removeHotelFromTrip(req, res, next);
});

router.patch("/:id/restaurants", function (req, res, next) {
  addRestaurantToTrip(req, res, next);
});

router.patch("/:id/restaurants/remove", function (req, res, next) {
  removeRestaurantFromTrip(req, res, next);
});

router.patch("/:id/invite", function (req, res, next) {
  inviteUserToTrip(req, res, next);
});

router.patch("/:id/accept", function (req, res, next) {
  acceptTripInvite(req, res, next);
});

module.exports = router;
