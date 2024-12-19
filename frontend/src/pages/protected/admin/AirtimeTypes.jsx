import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import AirtimeTypes from "../../../features/admin/AirtimeTypes";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Airtime Types" }));
  }, []);

  return <AirtimeTypes />;
}

export default InternalPage;
