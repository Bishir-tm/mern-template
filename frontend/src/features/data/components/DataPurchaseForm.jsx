import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNetworks, fetchDataTypes, fetchDataPlans } from "../dataSlice";
import { showNotification } from "../../common/headerSlice";
import { openModal } from "../../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";
import SuspenseContent from "../../../containers/SuspenseContent";

const DataPurchaseForm = () => {
  const dispatch = useDispatch();
  const { networks, dataTypes, dataPlans, loading, error } = useSelector(
    (state) => state.data
  );

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    dispatch(fetchNetworks());
  }, [dispatch]);

  const handleNetworkChange = (e) => {
    const networkId = e.target.value;
    setSelectedNetwork(networkId);
    dispatch(fetchDataTypes(networkId));
    setSelectedPlan(""); // Reset selections
    setSelectedType(""); // Reset selections
  };

  const handleTypeChange = (e) => {
    const dataType = e.target.value;
    setSelectedType(dataType);

    if (selectedNetwork) {
      dispatch(fetchDataPlans({ networkId: selectedNetwork, dataType }));
    }

    setSelectedPlan(""); // Reset plan when type changes
  };

  const handlePlanChange = (e) => {
    const planId = e.target.value;
    setSelectedPlan(planId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || !selectedPlan) {
      dispatch(
        showNotification({
          message: "Please fill in all required fields.",
          status: 0,
        })
      );
      return;
    }
    dispatch(
      openModal({
        title: "Confirm Data Purchase",
        bodyType: MODAL_BODY_TYPES.DATA_PURCHASE_CONFIRMATION,
        extraObject: {
          network: networks.find((net) => net._id === selectedNetwork),
          type: selectedType,
          plan: dataPlans.find((plan) => plan._id === selectedPlan),
          phoneNumber,
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {loading.networks && <SuspenseContent />}
      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error.message}</span>
        </div>
      )}

      <label className="block mb-2">Network</label>
      <select
        className="select select-bordered w-full mb-4"
        onChange={handleNetworkChange}
        value={selectedNetwork}
      >
        <option value="">Select Network</option>
        {networks.map((network) => (
          <option key={network._id} value={network._id}>
            {network.name}
          </option>
        ))}
      </select>

      <label className="block mb-2">Phone Number</label>
      <input
        type="phone"
        className="input input-bordered w-full mb-4"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
      />

      <label className="block mb-2">Type</label>
      <select
        className="select select-bordered w-full mb-4"
        onChange={handleTypeChange}
        value={selectedType}
        disabled={!selectedNetwork}
      >
        <option value="">Select Type</option>
        {dataTypes.types &&
          dataTypes.types.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
      </select>

      <label className="block mb-2">Plan</label>
      <select
        className="select select-bordered w-full mb-4"
        onChange={handlePlanChange}
        value={selectedPlan}
        disabled={!selectedType}
      >
        <option value="">Select Plan</option>
        {dataPlans &&
          dataPlans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.name} - ₦{plan.amount} ({plan.validity})
            </option>
          ))}
      </select>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded"
        disabled={!selectedPlan}
      >
        Continue
      </button>
    </form>
  );
};

export default DataPurchaseForm;
