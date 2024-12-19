import { configureStore } from "@reduxjs/toolkit";
import headerReducer from "../features/common/headerSlice";
import modalReducer from "../features/common/modalSlice";
import rightDrawerReducer from "../features/common/rightDrawerSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import authReducer from "./authSlice";
import adminReducer from "../features/admin/adminSlice";
import usersReducer from "../features/admin/Users/usersSlice";

const combinedReducer = {
  header: headerReducer,
  rightDrawer: rightDrawerReducer,
  modal: modalReducer,
  dashboard: dashboardReducer,
  auth: authReducer,
  admin: adminReducer,
  users: usersReducer,
};

export default configureStore({
  reducer: combinedReducer,
});
