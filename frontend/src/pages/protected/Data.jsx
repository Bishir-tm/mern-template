import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Data from "../../features/data";
import { getCurrentUser } from "../../app/authSlice";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Mobile Data" }));
    dispatch(getCurrentUser);
  }, []);

  return <Data />;
}

export default InternalPage;
