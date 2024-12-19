import { useState } from "react";
import { useDispatch } from "react-redux";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { createNetwork } from "../networksSlice";

function AddNetworkModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [network, setNetwork] = useState({
    name: "",
    network_id: "",
  });

  const saveNetwork = () => {
    if (network.name.trim() === "")
      return setErrorMessage("Network Name is required!");
    if (network.network_id.trim() === "")
      return setErrorMessage("Network ID is required!");

    setLoading(true);
    dispatch(createNetwork(network))
      .unwrap()
      .then(() => {
        dispatch(showNotification({ message: "Network Created!", status: 1 }));
        closeModal();
      })
      .catch(() => {
        setErrorMessage("Failed to create network.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setErrorMessage("");
    setNetwork({ ...network, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="mt-4">
        <label htmlFor="name" className="block text-sm font-medium">
          Network Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={network.name}
          onChange={handleInputChange}
          className="input input-bordered w-full mt-2"
          placeholder="Enter Network Name"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="network_id" className="block text-sm font-medium">
          Network ID
        </label>
        <input
          type="number"
          id="network_id"
          name="network_id"
          value={network.network_id}
          onChange={handleInputChange}
          className="input input-bordered w-full mt-2"
          placeholder="Enter Network ID"
        />
      </div>
      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-error" onClick={closeModal}>
          Cancel
        </button>
        <button
          className={`btn btn-primary px-6 ${loading ? "loading" : ""}`}
          onClick={saveNetwork}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default AddNetworkModalBody;
