import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import Networks from "../../../features/admin/Networks";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Networks" }));
  }, []);

  return <Networks />;
}

export default InternalPage;
