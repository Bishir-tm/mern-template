import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../../utils/globalConstantUtil";
import { openModal } from "../../../common/modalSlice";

const ViewUserModalBody = ({ extraObject, closeModal }) => {
  const dispatch = useDispatch();

  // Get the selected user's data from the modal's extraObject
  const selectedUser = extraObject;

  // Handle optional fields gracefully
  const {
    fullname = "N/A",
    email = "N/A",
    pin = "N/A",
    bvn = "N/A",
    wallet = {},
    role = "N/A",
  } = selectedUser || {};
  const walletBalance =
    wallet?.balance?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }) || "$0.00";

  // Dispatch edit modal
  const handleEdit = () => {
    dispatch(
      openModal({
        title: "Edit User",
        bodyType: MODAL_BODY_TYPES.EDIT_USER,
        extraObject: selectedUser, // Pass the selected user for editing
      })
    );
  };

  // Dispatch delete confirmation modal
  const handleDelete = () => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          type: CONFIRMATION_MODAL_CLOSE_TYPES.DELETE_USER,
          id: selectedUser._id,
          message: "Are you sure you want to delete this user ?",
        }, // Pass user info for deletion
      })
    );
    dispatch(
      openModal({
        extraObject: {
          message: `Are you sure you want to delete this lead?`,
          index,
        },
      })
    );
  };

  return (
    <div className="p-4 my-4">
      <div className="space-y-4">
        {/* User Fullname */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-gray-500">Full Name:</span>
          <span className="font-medium">{fullname}</span>
        </div>

        {/* Email */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-gray-500">Email:</span>
          <span className="font-medium">{email}</span>
        </div>

        {/* Role */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-gray-500">Role:</span>
          <span className="font-medium capitalize">{role}</span>
        </div>

        {/* Wallet Balance */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-gray-500">Wallet Balance:</span>
          <span className="font-medium">{walletBalance}</span>
        </div>

        {/* PIN */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-gray-500">PIN:</span>
          <span className="font-medium">{pin}</span>
        </div>

        {/* BVN */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-gray-500">BVN:</span>
          <span className="font-medium">{bvn}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-between space-x-2">
        {/* Edit Button */}
        <button
          onClick={handleEdit}
          className="btn btn-sm bg-blue-600 hover:bg-blue-500 text-white w-1/2"
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="btn btn-sm bg-red-600 hover:bg-red-500 text-white w-1/2"
        >
          Delete
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() => dispatch(closeModal())}
          className="btn btn-primary w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewUserModalBody;
