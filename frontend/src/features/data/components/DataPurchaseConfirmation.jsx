import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { purchaseData } from "../dataSlice";
import { closeModal } from "../../common/modalSlice";
import SuspenseContent from "../../../containers/SuspenseContent";
import { showNotification } from "../../common/headerSlice";
import { useNavigate } from "react-router-dom";

const DataPurchaseConfirmation = (props) => {
  const { network, type, plan, phoneNumber } = props.extraObject;
  const { loading } = useSelector((state) => state.data.loading.purchase);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pin, setPin] = useState("");

  const handleConfirm = async () => {
    if (!pin) {
      dispatch(
        showNotification({
          message: "Please enter your PIN.",
          status: 0,
        })
      );
      return;
    }

    try {
      const response = await dispatch(
        purchaseData({
          phone: phoneNumber,
          networkId: network.network_id,
          planId: plan._id,
          amount: plan.amount,
        })
      ).unwrap();
      console.log(response);
      dispatch(
        showNotification({
          message: response.message || "Data purchase successful!",
          status: 1,
        })
      );
      dispatch(closeModal());
      // navigate("/reciept?"); // Redirect to transactions or another relevant page
    } catch (error) {
      dispatch(
        showNotification({
          message: error.message || "Data purchase failed.",
          status: 0,
        })
      );
    }
  };

  if (loading) return <SuspenseContent />;

  return (
    <div>
      <table className="table w-full table-bordered">
        <tbody>
          <tr>
            <th>Network:</th>
            <td>{network.name}</td>
          </tr>
          <tr>
            <th>Data Type:</th>
            <th>{type}</th>
          </tr>
          <tr>
            <th>Data Plan:</th>
            <th>{plan.name}</th>
          </tr>
          <tr>
            <th>Validity:</th>
            <th>{plan.validity}</th>
          </tr>
          <tr>
            <th>Amount:</th>
            <th>{plan.amount}</th>
          </tr>
        </tbody>
      </table>
      <div className="w-full mb-8">
        <label className="label my-4">
          <span className="label-text ">Enter PIN:</span>
        </label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
      </div>
      <div className="w-full flex justify-end">
        <button
          className="w-1/2 btn btn-error mr-2"
          onClick={() => dispatch(closeModal())}
        >
          Cancel
        </button>
        <button className="w-1/2 btn btn-primary" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DataPurchaseConfirmation;
