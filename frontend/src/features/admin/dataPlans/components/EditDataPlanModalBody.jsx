import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { fetchAllDataPlans, updateDataPlan } from "../dataPlansSlice";
import { fetchAllNetworks } from "../../Networks/networksSlice";
import { fetchAllDataTypes } from "../../DataTypes/dataTypesSlice";

function EditDataPlanModalBody({ closeModal, extraObject }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataPlan, setDataPlan] = useState({
    id: extraObject?._id,
    name: extraObject?.name || "",
    amount: extraObject?.amount || "",
    validity: extraObject?.validity || "",
    plan_id: extraObject?.plan_id || "",
    networkId: extraObject?.networkId || "",
    dataType: extraObject?.dataType || "",
  });

  const { networks, loading: networksLoading } = useSelector(
    (state) => state.networks
  );
  const { dataTypes, loading: dataTypesLoading } = useSelector(
    (state) => state.dataTypes
  );

  useEffect(() => {
    if (networks.length === 0) {
      dispatch(fetchAllNetworks());
    }
    if (dataTypes.length === 0) {
      dispatch(fetchAllDataTypes());
    }
  }, [dispatch, networks.length, dataTypes.length]);

  const filteredDataTypes = dataTypes.filter(
    (dataType) => dataType.networkId._id === dataPlan.networkId
  );

  const saveDataPlan = () => {
    setErrorMessage(""); // Clear previous errors

    if (!dataPlan.networkId) return setErrorMessage("Network is required!");
    if (!dataPlan.dataType) return setErrorMessage("Data Type is required!");
    if (!dataPlan.name) return setErrorMessage("Plan name is required!");
    if (!dataPlan.amount) return setErrorMessage("Amount is required!");
    if (!dataPlan.validity) return setErrorMessage("Validity is required!");
    if (!dataPlan.plan_id) return setErrorMessage("Plan ID is required!");

    console.log(dataPlan);
    setLoading(true);
    dispatch(updateDataPlan(dataPlan))
      .unwrap()
      .then(() => {
        dispatch(fetchAllDataPlans()); // refetch updated data plans

        dispatch(
          showNotification({
            message: "Data Plan Updated Successfully!",
            status: 1,
          })
        );
        closeModal();
      })
      .catch(() => {
        setErrorMessage("Failed to update data plan. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <label className="label mt-4">Select Network</label>
      {networksLoading === "loading" ? (
        <p>Loading networks...</p>
      ) : (
        <select
          className="select select-bordered w-full"
          value={dataPlan.networkId}
          onChange={(e) =>
            setDataPlan((prev) => ({
              ...prev,
              networkId: e.target.value,
              dataType: "", // Reset data type when network changes
            }))
          }
          disabled={loading}
        >
          <option value="">Click to Select a Network</option>
          {networks.map((network) => (
            <option key={network._id} value={network._id}>
              {network.name}
            </option>
          ))}
        </select>
      )}

      <label className="label mt-4">Select Data Type</label>
      {dataTypesLoading === "loading" ? (
        <p>Loading data types...</p>
      ) : (
        <select
          className="select select-bordered w-full"
          value={dataPlan.dataType}
          onChange={(e) =>
            setDataPlan((prev) => ({
              ...prev,
              dataType: e.target.value,
            }))
          }
          disabled={loading || !dataPlan.networkId} // Disable if no network is selected
        >
          <option value="">Click to Select a Data Type</option>
          {filteredDataTypes.map((dataType) =>
            dataType.types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))
          )}
        </select>
      )}

      <label className="label mt-4">Plan Name</label>
      <input
        type="text"
        className="input input-bordered w-full"
        value={dataPlan.name}
        onChange={(e) =>
          setDataPlan((prev) => ({ ...prev, name: e.target.value }))
        }
        disabled={loading}
      />

      <label className="label mt-4">Amount</label>
      <input
        type="number"
        className="input input-bordered w-full"
        value={dataPlan.amount}
        onChange={(e) =>
          setDataPlan((prev) => ({ ...prev, amount: e.target.value }))
        }
        disabled={loading}
      />

      <label className="label mt-4">Validity</label>
      <input
        type="text"
        className="input input-bordered w-full"
        value={dataPlan.validity}
        onChange={(e) =>
          setDataPlan((prev) => ({ ...prev, validity: e.target.value }))
        }
        disabled={loading}
      />

      <label className="label mt-4">Plan ID</label>
      <input
        type="number"
        className="input input-bordered w-full"
        value={dataPlan.plan_id}
        onChange={(e) =>
          setDataPlan((prev) => ({ ...prev, plan_id: e.target.value }))
        }
        disabled={loading}
      />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button
          className="btn btn-error"
          onClick={closeModal}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className={`btn btn-primary px-6 ${loading ? "loading" : ""}`}
          onClick={saveDataPlan}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default EditDataPlanModalBody;
