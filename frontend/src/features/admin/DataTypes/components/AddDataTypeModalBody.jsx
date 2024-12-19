import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated"; // Optional for animations
import CreatableSelect from "react-select/creatable";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { createDataType, fetchAllDataTypes } from "../dataTypesSlice";
import { fetchAllNetworks } from "../../Networks/networksSlice"; // Import fetchAllNetworks

function AddDataTypeModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataType, setDataType] = useState({
    networkId: "",
    types: [],
  });

  const { networks, loading: networksLoading } = useSelector(
    (state) => state.networks
  );

  // Fetch networks when the modal loads
  useEffect(() => {
    if (networks.length === 0) {
      dispatch(fetchAllNetworks());
    }
  }, [dispatch, networks.length]);

  const saveDataType = () => {
    if (!dataType.networkId) return setErrorMessage("Network is required!");
    if (dataType.types.length === 0)
      return setErrorMessage("At least one data type is required!");

    setLoading(true);
    dispatch(
      createDataType({
        ...dataType,
        types: dataType.types.map((t) => t.value), // Extract array of strings
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchAllDataTypes()); // refetch updated data types
        dispatch(
          showNotification({ message: "Data Type Created!", status: 1 })
        );
        closeModal();
      })
      .catch(() => {
        setErrorMessage("Failed to create data type.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNetworkChange = (selectedOption) => {
    setErrorMessage("");
    setDataType((prev) => ({
      ...prev,
      networkId: selectedOption.value,
    }));
  };

  const handleTypesChange = (selectedOptions) => {
    setErrorMessage("");
    setDataType((prev) => ({
      ...prev,
      types: selectedOptions || [], // Handle null values when clearing options
    }));
  };

  return (
    <>
      <label className="label mt-4">Select Network</label>
      {networksLoading === "loading" ? (
        <p>Loading networks...</p>
      ) : (
        <Select
          options={networks.map((n) => ({ value: n._id, label: n.name }))}
          onChange={handleNetworkChange}
          placeholder="Select a Network"
          isSearchable
        />
      )}

      <label className="label mt-4">Add Data Types</label>
      <CreatableSelect
        isMulti
        components={makeAnimated()}
        value={dataType.types}
        onChange={handleTypesChange}
        placeholder="Enter data types"
        isClearable
        isSearchable
        noOptionsMessage={() => "Type to add new options"}
        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
      />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-error" onClick={closeModal}>
          Cancel
        </button>
        <button
          className={`btn btn-primary px-6 ${loading ? "loading" : ""}`}
          onClick={saveDataType}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default AddDataTypeModalBody;
