import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWalletBalance } from "../wallet/walletSlice"; // Import the thunk
import { fetchDashboardData } from "./dashboardSlice";
import { Link } from "react-router-dom";
import WifiIcon from "@heroicons/react/24/outline/WifiIcon";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import TvIcon from "@heroicons/react/24/outline/TvIcon";
import WalletOverview from "../wallet/components/WalletOverview";
import RecentTransactions from "../wallet/components/RecentTransactions";
import { isTokenExpired } from "../../utils/helpers";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { openModal } from "../common/modalSlice";
const Dashboard = () => {
  const dispatch = useDispatch();

  // Fetch wallet balance from Redux store
  const { balance, isLoading } = useSelector((state) => state.wallet);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if the token is expired before making the API call
    if (token && !isTokenExpired(token)) {
      dispatch(getWalletBalance());
    } else {
      // Show the session expired modal if the token is expired or not available
      dispatch(
        openModal({
          title: "",
          bodyType: MODAL_BODY_TYPES.SESSION_EXPIRED,
        })
      );
    }
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <WalletOverview balance={balance} loading={isLoading} />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        <Link
          to="/app/airtime"
          className="border border-dark flex flex-col items-center justify-center bg-base-100 p-6 rounded-lg shadow-md hover:bg-primary hover:text-white transition-all"
        >
          <PhoneIcon className="h-16 w-auto object-contain mb-4" />
          <h3 className="font-bold text-lg">Buy Airtime</h3>
        </Link>

        <Link
          to="/app/data"
          className="border border-dark flex flex-col items-center justify-center bg-base-100 p-6 rounded-lg shadow-md hover:bg-primary hover:text-white transition-all"
        >
          <WifiIcon className="h-16 w-auto object-contain mb-4" />
          <h3 className="font-bold text-lg">Buy Data</h3>
        </Link>

        <Link className="border border-dark flex flex-col items-center justify-center bg-base-100 p-6 rounded-lg shadow-md hover:bg-primary hover:text-white transition-all">
          <span className="align-center badge badge-lg border border-black">
            Coming Soon
          </span>
          <TvIcon className="h-16 w-auto object-contain mb-4" />
          <h3 className="font-bold text-lg">Cable TV Subscription</h3>
        </Link>

        <Link className="border border-dark flex flex-col items-center justify-center bg-base-100 p-6 rounded-lg shadow-md hover:bg-primary hover:text-white transition-all">
          <span className="align-right badge badge-lg border border-black">
            Coming Soon
          </span>
          <BoltIcon className="h-16 w-auto object-contain mb-4" />
          <h3 className="font-bold text-lg">Utility Payment</h3>
        </Link>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={[]} />
    </div>
  );
};

export default Dashboard;
