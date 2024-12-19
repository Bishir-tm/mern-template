import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "./adminSlice";
import TitleCard from "../../components/Cards/TitleCard";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <TitleCard Title="Admin Dashboard">
      <div className="p-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="mt-4 bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">{users.length}</p>
        </div>
      </div>
    </TitleCard>
  );
};

export default AdminDashboard;
