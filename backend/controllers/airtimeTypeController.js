// controllers/airtimeTypeController.js
const AirtimeType = require("../models/AirtimeType");
const Network = require("../models/Network");

// Get all airtime types
const getAllAirtimeTypes = async (req, res) => {
  try {
    const airtimeTypes = await AirtimeType.find().populate("network", "name");
    res.status(200).json(airtimeTypes);
  } catch (error) {
    res.status(500).json({
      successful: false,
      message: "Failed to fetch airtime types",
      error,
    });
  }
};

// Create a new airtime type
const createAirtimeType = async (req, res) => {
  const { network, types } = req.body;

  if (!network || !types || !Array.isArray(types)) {
    return res
      .status(400)
      .json({ successful: false, message: "Invalid input airtime" });
  }

  try {
    const networkExists = await Network.findById(network);
    if (!networkExists) {
      return res
        .status(404)
        .json({ successful: false, message: "Network not found" });
    }

    const airtimeType = new AirtimeType({ network, types });

    await airtimeType.save();
    res.status(201).json(airtimeType);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      successful: false,
      message: "Failed to create airtime type",
      error,
    });
  }
};

// Update a airtime type
const updateAirtimeType = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const { network, types } = req.body;
  if (!network || !types || !Array.isArray(types)) {
    return res
      .status(400)
      .json({ successful: false, message: "Invalid input airtime" });
  }

  try {
    const airtimeType = await AirtimeType.findById(id);
    if (!airtimeType) {
      return res
        .status(404)
        .json({ successful: false, message: "Airtime type not found" });
    }

    const networkExists = await Network.findById(network);
    if (!networkExists) {
      return res
        .status(404)
        .json({ successful: false, message: "Network not found" });
    }

    airtimeType.network = network;
    airtimeType.types = types;
    await airtimeType.save();

    res.status(200).json(airtimeType);
  } catch (error) {
    res.status(500).json({
      successful: false,
      message: "Failed to update airtime type",
      error,
    });
  }
};

// Delete a airtime type
const deleteAirtimeType = async (req, res) => {
  const { id } = req.params;

  try {
    const airtimeType = await AirtimeType.findById(id);

    if (!airtimeType) {
      return res
        .status(404)
        .json({ successful: false, message: "Airtime type not found" });
    }

    await airtimeType.remove();
    res.status(200).json({
      successful: true,
      message: "Airtime type deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      successful: true,
      message: "Failed to delete airtime type",
      error,
    });
  }
};

module.exports = {
  getAllAirtimeTypes,
  createAirtimeType,
  updateAirtimeType,
  deleteAirtimeType,
};
