import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import DataTypes from "../../../features/admin/DataTypes";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Data Types" }));
  }, []);

  return <DataTypes />;
}

export default InternalPage;
