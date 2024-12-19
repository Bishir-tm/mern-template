import React, { useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDataTypes, deleteDataType } from "./dataTypesSlice";
import { openModal } from "../../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddDataTypeModal = () => {
    dispatch(
      openModal({
        title: "Add New Data Type",
        bodyType: MODAL_BODY_TYPES.ADD_NEW_DATA_TYPE,
        size: "md",
      })
    );
  };

  return (
    <button onClick={openAddDataTypeModal} className="btn btn-primary">
      Add Data Type
    </button>
  );
};

const DataTypes = () => {
  const dispatch = useDispatch();
  const { dataTypes, loading, error } = useSelector((state) => state.dataTypes);

  useEffect(() => {
    if (loading === "idle") {
      dispatch(fetchAllDataTypes());
    }
  }, [dispatch, loading]);

  const handleDelete = (id) => {
    dispatch(deleteDataType(id));
  };

  return (
    <TitleCard title="Data Types" TopSideButtons={<TopSideButtons />}>
      {loading === "loading" && <p>Loading data types...</p>}

      {loading === "failed" && (
        <div className="text-red-500">
          <p>Error loading data types. Please try again later.</p>
          <p>{error?.message || "An unexpected error occurred."}</p>
        </div>
      )}

      {loading === "succeeded" && dataTypes.length === 0 && (
        <p>No data types available. Add a new data type to get started.</p>
      )}

      {loading === "succeeded" && dataTypes.length > 0 && (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Network Name</th>
              <th>Types</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataTypes.map((dataType) => (
              <tr key={dataType._id}>
                <td>
                  {dataType.networkId
                    ? dataType.networkId.name
                    : "Unknown Network"}
                </td>
                <td className="break-words whitespace-normal">
                  {dataType.types.join(" | ")}
                </td>
                <td className="grid md:grid-cols-2 ">
                  <button
                    className="btn btn-sm btn-warning w-full my-2 md:my-0 md:mx-2 sm:w-1/2"
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: "Edit Data Type",
                          bodyType: MODAL_BODY_TYPES.EDIT_DATA_TYPE,
                          extraObject: dataType,
                        })
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error w-full md:mx-2 sm:w-1/2"
                    onClick={() => handleDelete(dataType._id)}
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

export default DataTypes;
