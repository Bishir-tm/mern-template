import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { fetchAllNetworks } from "../../Networks/networksSlice";
import { fetchAllAirtimeTypes, updateAirtimeType } from "../airtimeTypesSlice";

function EditAirtimeTypeModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [airtimeType, setAirtimeType] = useState({
    network: extraObject.network._id,
    types: extraObject.types.map((t) => ({ value: t, label: t })),
  });

  const { networks, loading: networksLoading } = useSelector(
    (state) => state.networks
  );

  useEffect(() => {
    if (!networks.length) {
      dispatch(fetchAllNetworks());
    }
  }, [dispatch, networks.length]);

  const saveAirtimeType = () => {
    if (!airtimeType.network) return setErrorMessage("Network is required!");
    if (airtimeType.types.length === 0)
      return setErrorMessage("At least one airtime type is required!");

    setLoading(true);
    dispatch(
      updateAirtimeType({
        id: extraObject._id,
        airtimeType: {
          network: airtimeType.network,
          types: airtimeType.types.map((t) => t.value), // Extract array of strings
        },
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchAllAirtimeTypes());
        dispatch(
          showNotification({ message: "Airtime Type Updated!", status: 1 })
        );
        closeModal();
      })
      .catch(() => {
        setErrorMessage("Failed to update airtime type.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNetworkChange = (selectedOption) => {
    setErrorMessage("");
    setAirtimeType((prev) => ({
      ...prev,
      network: selectedOption.value,
    }));
  };

  const handleTypesChange = (selectedOptions) => {
    setErrorMessage("");
    setAirtimeType((prev) => ({
      ...prev,
      types: selectedOptions,
    }));
  };

  return (
    <>
      <label className="label mt-4">Select Network</label>
      <CreatableSelect
        options={networks.map((n) => ({ value: n._id, label: n.name }))}
        value={{
          value: airtimeType.network,
          label:
            networks.find((n) => n._id === airtimeType.network)?.name || "",
        }}
        onChange={handleNetworkChange}
        placeholder={
          networksLoading ? "Loading networks..." : "Select a Network"
        }
        isSearchable
        isDisabled={networksLoading}
      />

      <label className="label mt-4">Edit Airtime Types</label>
      <CreatableSelect
        isMulti
        value={airtimeType.types}
        onChange={handleTypesChange}
        options={airtimeType.types} // Existing types will populate as selectable options
        placeholder="Enter or select airtime types"
        isClearable
        isSearchable
        createOptionPosition="first"
        noOptionsMessage={() => "Type to add new options"}
      />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-error" onClick={closeModal}>
          Cancel
        </button>
        <button
          className={`btn btn-primary px-6 ${loading ? "loading" : ""}`}
          onClick={saveAirtimeType}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default EditAirtimeTypeModalBody;
