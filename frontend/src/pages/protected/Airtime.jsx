import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Airtime from "../../features/airtime";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Airtime" }));
  }, []);

  return <Airtime />;
}

export default InternalPage;
