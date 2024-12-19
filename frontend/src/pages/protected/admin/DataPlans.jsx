import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import DataPlans from "../../../features/admin/DataPlans";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Data Plans" }));
  }, []);

  return <DataPlans />;
}

export default InternalPage;
