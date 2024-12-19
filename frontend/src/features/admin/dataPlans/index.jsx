import React, { useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { fetchAllDataPlans, deleteDataPlan } from "./dataPlansSlice";
import { fetchAllNetworks } from "../networks/networksSlice"; // Import fetchAllNetworks
import { openModal } from "../../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddDataPlanModal = () => {
    dispatch(
      openModal({
        title: "Add New Data Plan",
        bodyType: MODAL_BODY_TYPES.ADD_NEW_DATA_PLAN,
        size: "md",
      })
    );
  };

  return (
    <button onClick={openAddDataPlanModal} className="btn btn-primary">
      Add Data Plan
    </button>
  );
};

const DataPlans = () => {
  const dispatch = useDispatch();
  const { dataPlans, status, error } = useSelector((state) => state.dataPlans);
  const { networks } = useSelector((state) => state.networks); // Access networks from state

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllDataPlans());
      dispatch(fetchAllNetworks());
    }
  }, [dispatch, status]);

  const handleDelete = (id) => {
    try {
      dispatch(deleteDataPlan(id));
      dispatch(
        showNotification({ message: "Plan Deleted Successfully", status: 1 })
      );
    } catch (error) {
      dispatch(
        showNotification({ message: "failed, Plan Not Deleted !", status: 0 })
      );
    }
  };

  // Helper function to get network name by networkId
  const getNetworkName = (networkId) => {
    if (!networks || networks.length === 0) {
      return "Loading...";
    }
    const network = networks.find((net) => net._id === networkId._id);
    return network ? network.name : "Unknown Network";
  };

  return (
    <TitleCard title="Data Plans" TopSideButtons={<TopSideButtons />}>
      {status === "loading" && <p>Loading data plans...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}
      {status === "succeeded" && dataPlans.length === 0 && (
        <p>No data plans available. Add a new data plan to get started.</p>
      )}
      {status === "succeeded" && dataPlans.length > 0 && (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Validity</th>
              <th>Plan ID</th>
              <th>Network</th> {/* Add Network column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataPlans.map((dataPlan) => (
              <tr key={dataPlan._id}>
                <td>{dataPlan.name}</td>
                <td>{dataPlan.amount}</td>
                <td>{dataPlan.validity}</td>
                <td>{dataPlan.plan_id}</td>
                <td>{getNetworkName(dataPlan.networkId)}</td>{" "}
                {/* Display network name */}
                <td className="flex flex-wrap gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: "Edit Data Plan",
                          bodyType: MODAL_BODY_TYPES.EDIT_DATA_PLAN,
                          extraObject: dataPlan,
                        })
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(dataPlan._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TitleCard>
  );
};

export default DataPlans;
