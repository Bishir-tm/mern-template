import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "./dashboardSlice";
import { Link } from "react-router-dom";
import { getToken, isTokenExpired } from "../../utils/helpers";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { openModal } from "../common/modalSlice";
const Dashboard = () => {
  return <div className="container mx-auto p-6 space-y-6">Dashboard</div>;
};

export default Dashboard;
