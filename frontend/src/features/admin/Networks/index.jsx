import React, { useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllNetworks, deleteNetwork } from "./networksSlice";
import { openModal } from "../../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";
import { showNotification } from "../../common/headerSlice";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNetworkModal = () => {
    dispatch(
      openModal({
        title: "Add New Network",
        bodyType: MODAL_BODY_TYPES.ADD_NEW_NETWORK,
        size: "md",
      })
    );
  };

  return (
    <button onClick={openAddNetworkModal} className="btn btn-primary">
      Add Network
    </button>
  );
};

const Networks = () => {
  const dispatch = useDispatch();
  const { networks, status, error } = useSelector((state) => state.networks);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllNetworks());
    }
  }, [dispatch, status]);

  const handleDelete = (id) => {
    console.log(id);

    try {
      dispatch(deleteNetwork(id));
      dispatch(
        showNotification({ message: "Message Deleted Successfully", status: 1 })
      );
    } catch (error) {
      dispatch(
        showNotification({ message: "Failed, Message Not Deleted ", status: 0 })
      );
    }
  };
  return (
    <TitleCard title="Networks" TopSideButtons={<TopSideButtons />}>
      {status === "loading" && <p>Loading networks...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}
      {status === "succeeded" && networks.length === 0 && (
        <p>No networks available. Add a new network to get started.</p>
      )}
      {status === "succeeded" && networks.length > 0 && (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Network ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {networks.map((network) => (
              <tr key={network._id}>
                <td>{network.name}</td>
                <td>{network.network_id}</td>
                <td className="grid md:grid-cols-2">
                  <button
                    className="btn btn-sm btn-warning  w-full md:mx-2 sm:w-1/2"
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: "Edit Network",
                          bodyType: MODAL_BODY_TYPES.EDIT_NETWORK,
                          extraObject: network,
                        })
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error  w-full md:mx-2 sm:w-1/2"
                    onClick={() => handleDelete(network._id)}
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

export default Networks;
