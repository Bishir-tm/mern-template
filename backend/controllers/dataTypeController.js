// controllers/dataTypeController.js
const DataType = require("../models/DataType");
const Network = require("../models/Network");

// Get all data types
const getAllDataTypes = async (req, res) => {
  try {
    const dataTypes = await DataType.find().populate("networkId", "name");
    res.status(200).json(dataTypes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data types", error });
  }
};

// Create a new data type
const createDataType = async (req, res) => {
  const { networkId, types } = req.body;
  if (!networkId || !types || !Array.isArray(types)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const networkExists = await Network.findById(networkId);
    if (!networkExists) {
      return res.status(404).json({ message: "Network not found" });
    }

    const dataType = new DataType({ networkId, types });
    await dataType.save();
    res.status(201).json(dataType);
  } catch (error) {
    res.status(500).json({ message: "Failed to create data type", error });
  }
};

// Update a data type
const updateDataType = async (req, res) => {
  const { id } = req.params;
  const { networkId, types } = req.body;
  if (!networkId || !types || !Array.isArray(types)) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const dataType = await DataType.findById(id);
    if (!dataType) {
      return res.status(404).json({ message: "Data type not found" });
    }

    const networkExists = await Network.findById(networkId);
    if (!networkExists) {
      return res.status(404).json({ message: "Network not found" });
    }

    dataType.networkId = networkId;
    dataType.types = types;
    await dataType.save();

    res.status(200).json(dataType);
  } catch (error) {
    res.status(500).json({ message: "Failed to update data type", error });
  }
};

// Delete a data type
const deleteDataType = async (req, res) => {
  const { id } = req.params;

  try {
    const dataType = await DataType.findById(id);
    console.log("dataType found:  ", dataType);

    if (!dataType) {
      return res.status(404).json({ message: "Data type not found" });
    }

    await dataType.remove();
    res.status(200).json({ message: "Data type deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete data type", error });
  }
};

module.exports = {
  getAllDataTypes,
  createDataType,
  updateDataType,
  deleteDataType,
};
