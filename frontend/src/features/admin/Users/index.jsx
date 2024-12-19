import React, { useEffect, useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import { openModal } from "../../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "./usersSlice"; // Adjusted import
import SuspenseContent from "../../../containers/SuspenseContent";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewUser = () => {
    dispatch(
      openModal({
        title: "Add New User",
        bodyType: MODAL_BODY_TYPES.ADD_NEW_USER,
        size: "xl",
      })
    );
  };

  return (
    <button onClick={openAddNewUser} className="btn btn-primary">
      Add New User
    </button>
  );
};

const Users = () => {
  const [checkedUsers, setCheckedUsers] = useState({});

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users || []); // Adjusted state path
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllUsers()); // Adjusted thunk name
    }
  }, [dispatch, status]);

  const handleCheck = (userId) => {
    setCheckedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId], // Toggle the specific user's checked status
    }));
  };

  if (status === "loading") return <SuspenseContent />;
  if (status === "failed") {
    return (
      <div className="flex">
        <p className="text-rose-500 mx-2 text-center text-2xl w-100">
          Failed to load users!
        </p>
        <TopSideButtons />
      </div>
    );
  }

  const UsersRows = users.map((user) => (
    <tr className="border-spacing-x-3" key={user._id}>
      <td>{user.fullname}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        {user.wallet?.balance?.toLocaleString("en-US", {
          style: "currency",
          currency: "NGN",
        }) || "NGN 0.00"}
      </td>
      <th>
        <Link
          to={`/app/admin/transactions/${user._id}`}
          className="btn btn-sm text-sm lg:text-base text-white bg-blue-800 hover:bg-blue-500 flex items-center  min-w-[140px]"
        >
          <span>Transactions</span>
          <ArrowTopRightOnSquareIcon className="w-5 h-5 m-0 p-0" />
        </Link>
      </th>
      <th>
        <button
          className="btn btn-sm text-white bg-blue-800 hover:bg-blue-500 min-w-[70px]"
          onClick={() =>
            dispatch(
              openModal({
                title: "User Details",
                bodyType: MODAL_BODY_TYPES.VIEW_USER,
                extraObject: user,
              })
            )
          }
        >
          ⋮ More
        </button>
      </th>
    </tr>
  ));

  return (
    <TitleCard
      title="All Users"
      TopSideButtons={<TopSideButtons />}
      topMargin="mt-2"
    >
      <div className="overflow-x-auto w-full">
        <table className="table w-full table-pin-rows">
          <thead className="border-b-4 border-blue-900 text-black text-md">
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Wallet Balance</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              UsersRows
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
};

export default Users;
