const DataPlan = require("../models/DataPlan");
const DataType = require("../models/DataType");

// Create a new data plan
const createDataPlan = async (req, res) => {
  try {
    const { networkId, dataType, name, amount, validity, plan_id } = req.body;

    if (!networkId || !dataType || !name || !amount || !validity || !plan_id)
      return res.status(400).json({ message: "All Fields Are Required" });

    // Validate if the selected dataType exists for the given networkId
    const dataTypeRecord = await DataType.findOne({ networkId });

    if (!dataTypeRecord || !dataTypeRecord.types.includes(dataType)) {
      return res.status(400).json({
        message: "Invalid dataType for the selected network",
      });
    }

    const newDataPlan = new DataPlan({
      networkId,
      dataType,
      name,
      amount,
      validity,
      plan_id,
    });
    await newDataPlan.save();

    res.status(201).json({
      message: "Data Plan created successfully",
      dataPlan: newDataPlan,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating Data Plan", error: error.message });
  }
};

// Get all data plans
const getAllDataPlans = async (req, res) => {
  try {
    const dataPlans = await DataPlan.find()
      .populate("networkId", "name") // Include only the network name
      .select("-__v"); // Exclude the `__v` field

    res.status(200).json({ dataPlans });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Data Plans", error: error.message });
  }
};

// Update a data plan
const updateDataPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { networkId, dataType, name, amount, validity, plan_id } = req.body;
    if (!networkId || !dataType || !name || !amount || !validity || !plan_id)
      return res.status(400).json({ message: "All Fields Are Required" });

    // Validate if the selected dataType exists for the given networkId
    const dataTypeRecord = await DataType.findOne({ networkId });

    if (!dataTypeRecord || !dataTypeRecord.types.includes(dataType)) {
      return res.status(400).json({
        message: "Invalid dataType for the selected network",
      });
    }

    const updatedDataPlan = await DataPlan.findByIdAndUpdate(
      id,
      { networkId, dataType, name, amount, validity, plan_id },
      { new: true, runValidators: true }
    );

    if (!updatedDataPlan) {
      return res.status(404).json({ message: "Data Plan not found" });
    }

    res.status(200).json({
      message: "Data Plan updated successfully",
      dataPlan: updatedDataPlan,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Data Plan", error: error.message });
  }
};

// Delete a data plan
const deleteDataPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDataPlan = await DataPlan.findByIdAndDelete(id);

    if (!deletedDataPlan) {
      return res.status(404).json({ message: "Data Plan not found" });
    }

    res.status(200).json({ message: "Data Plan deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Data Plan", error: error.message });
  }
};

module.exports = {
  createDataPlan,
  getAllDataPlans,
  updateDataPlan,
  deleteDataPlan,
};
