import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { updateNetwork } from "../networksSlice";

function EditNetworkModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [network, setNetwork] = useState({
    name: extraObject.name || "",
    network_id: extraObject.network_id || "",
  });

  useEffect(() => {
    // Set initial values in InputText components by syncing with extraObject
    setNetwork({
      name: extraObject.name || "",
      network_id: extraObject.network_id || "",
    });
  }, [extraObject]);

  const saveNetwork = () => {
    if (network.name.trim() === "")
      return setErrorMessage("Network Name is required!");
    if (network.network_id.trim() === "")
      return setErrorMessage("Network ID is required!");

    setLoading(true);
    dispatch(updateNetwork({ id: extraObject._id, data: network })) // Ensure `data` contains only the fields to update
      .unwrap()
      .then(() => {
        dispatch(showNotification({ message: "Network Updated!", status: 1 }));
        closeModal();
      })
      .catch(() => {
        setErrorMessage("Failed to update network.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setNetwork({ ...network, [updateType]: value });
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={network.name} // Use defaultValue to set initial state in InputText
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Network Name"
        updateFormValue={updateFormValue}
      />
      <InputText
        type="text"
        defaultValue={network.network_id} // Use defaultValue to set initial state in InputText
        updateType="network_id"
        containerStyle="mt-4"
        labelTitle="Network ID"
        updateFormValue={updateFormValue}
      />
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

export default EditNetworkModalBody;
