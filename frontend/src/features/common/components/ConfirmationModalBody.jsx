import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil";
import { deleteLead } from "../../leads/leadSlice";
import { showNotification } from "../headerSlice";
import { deleteUser } from "../../admin/Users/usersSlice";

function ConfirmationModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();

  const { message, type, id, index } = extraObject;

  const proceedWithYes = async () => {
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.DELETE_LEAD) {
      // positive response, call api or dispatch redux function
      dispatch(deleteLead(index));
      dispatch(showNotification({ message: "Lead Deleted!", status: 1 }));
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.DELETE_USER) {
      // positive response, call api or dispatch redux function
      dispatch(deleteUser(id));
      dispatch(showNotification({ message: "User Deleted!", status: 1 }));
    }
    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button
          className="btn btn-outline btn-error"
          onClick={() => closeModal()}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithYes()}
        >
          Yes
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;
