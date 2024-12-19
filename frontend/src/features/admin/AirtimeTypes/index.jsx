import React, { useEffect } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAirtimeTypes, deleteAirtimeType } from "./airtimeTypesSlice";
import { openModal } from "../../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddAirtimeTypeModal = () => {
    dispatch(
      openModal({
        title: "Add New Airtime Type",
        bodyType: MODAL_BODY_TYPES.ADD_NEW_AIRTIME_TYPE,
        size: "md",
      })
    );
  };

  return (
    <button onClick={openAddAirtimeTypeModal} className="btn btn-primary">
      Add Airtime Type
    </button>
  );
};

const AirtimeTypes = () => {
  const dispatch = useDispatch();
  const { airtimeTypes, loading, error } = useSelector(
    (state) => state.airtimeTypes
  );

  useEffect(() => {
    if (loading === "idle") {
      dispatch(fetchAllAirtimeTypes());
    }
  }, [dispatch, loading]);

  const handleDelete = (id) => {
    dispatch(deleteAirtimeType(id));
  };

  return (
    <TitleCard title="Airtime Types" TopSideButtons={<TopSideButtons />}>
      {loading === "loading" && <p>Loading airtime types...</p>}

      {loading === "failed" && (
        <div className="text-red-500">
          <p>Error loading airtime types. Please try again later.</p>
          <p>{error?.message || "An unexpected error occurred."}</p>
        </div>
      )}

      {loading === "succeeded" && airtimeTypes.length === 0 && (
        <p>
          No airtime types available. Add a new airtime type to get started.
        </p>
      )}

      {loading === "succeeded" && airtimeTypes.length > 0 && (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Network Name</th>
              <th>Types</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {airtimeTypes.map((airtimeType) => (
              <tr key={airtimeType._id}>
                {console.log(airtimeType)}
                <td>
                  {airtimeType.network
                    ? airtimeType.network.name
                    : "Unknown Network"}
                </td>
                <td className="break-words whitespace-normal">
                  {airtimeType.types.join(" | ")}
                </td>
                <td className="grid md:grid-cols-2 ">
                  <button
                    className="btn btn-sm btn-warning w-full my-2 md:my-0 md:mx-2 sm:w-1/2"
                    onClick={() =>
                      dispatch(
                        openModal({
                          title: "Edit Airtime Type",
                          bodyType: MODAL_BODY_TYPES.EDIT_AIRTIME_TYPE,
                          extraObject: airtimeType,
                        })
                      )
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error w-full md:mx-2 sm:w-1/2"
                    onClick={() => handleDelete(airtimeType._id)}
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

export default AirtimeTypes;
