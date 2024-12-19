import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { fetchAllNetworks } from "../../Networks/networksSlice";
import { fetchAllDataTypes, updateDataType } from "../dataTypesSlice";

function EditDataTypeModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [dataType, setDataType] = useState({
    networkId: extraObject.networkId._id,
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

  const saveDataType = () => {
    if (!dataType.networkId) return setErrorMessage("Network is required!");
    if (dataType.types.length === 0)
      return setErrorMessage("At least one data type is required!");

    setLoading(true);
    dispatch(
      updateDataType({
        id: extraObject._id,
        dataType: {
          networkId: dataType.networkId,
          types: dataType.types.map((t) => t.value), // Extract array of strings
        },
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchAllDataTypes()); // refetch updated data types

        dispatch(
          showNotification({ message: "Data Type Updated!", status: 1 })
        );
        closeModal();
      })
      .catch(() => {
        setErrorMessage("Failed to update data type.");
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
      types: selectedOptions,
    }));
  };

  return (
    <>
      <label className="label mt-4">Select Network</label>
      <CreatableSelect
        options={networks.map((n) => ({ value: n._id, label: n.name }))}
        value={{
          value: dataType.networkId,
          label: networks.find((n) => n._id === dataType.networkId)?.name || "",
        }}
        onChange={handleNetworkChange}
        placeholder={
          networksLoading ? "Loading networks..." : "Select a Network"
        }
        isSearchable
        isDisabled={networksLoading}
      />

      <label className="label mt-4">Edit Data Types</label>
      <CreatableSelect
        isMulti
        value={dataType.types}
        onChange={handleTypesChange}
        options={dataType.types} // Existing types will populate as selectable options
        placeholder="Enter or select data types"
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
          onClick={saveDataType}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default EditDataTypeModalBody;
