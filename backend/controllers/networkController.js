const Network = require("../models/Network");
const DataType = require("../models/DataType");
const DataPlan = require("../models/DataPlan");
const AirtimeType = require("../models/AirtimeType");

// Get all networks
exports.getAllNetworks = async (req, res) => {
  try {
    const networks = await Network.find();
    res.status(200).json(networks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Create a new network
exports.createNetwork = async (req, res) => {
  const { name, network_id } = req.body;

  if (!name || !network_id) {
    return res
      .status(400)
      .json({ message: "Name and network ID are required" });
  }

  try {
    const newNetwork = await Network.create({ name, network_id });
    res.status(201).json(newNetwork);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update a network
exports.updateNetwork = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(401)
        .json({ success: false, message: "Network id missing" });

    const { name, network_id } = req.body;

    if (!name || !network_id) {
      return res
        .status(401)
        .json({ success: false, message: "All Fields are required !" });
    }

    const updatedNetwork = await Network.findByIdAndUpdate(
      id,
      { name, network_id },
      { new: true }
    );
    if (!updatedNetwork)
      return res
        .status(404)
        .json({ success: false, message: "Network not found" });
    res.json(updatedNetwork);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a network

exports.deleteNetwork = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete all DataTypes associated with this network
    await DataType.deleteMany({ networkId: id });

    // Delete all DataPlans associated with this network
    await DataPlan.deleteMany({ networkId: id });

    // Delete all Airtime Types associated with this network
    await AirtimeType.deleteMany({ networkId: id });

    // Now delete the network itself
    const deletedNetwork = await Network.findByIdAndDelete(id);

    if (!deletedNetwork) {
      return res
        .status(404)
        .json({ success: false, message: "Network not found" });
    }

    res.status(204).send(); // No content, successful deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
