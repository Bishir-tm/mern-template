import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import AdminDashboard from "../../../features/admin/index";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Admin Dashboard" }));
  }, []);

  return <AdminDashboard />;
}

export default InternalPage;
