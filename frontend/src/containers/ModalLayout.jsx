import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";
import SessionExpiredModalBody from "../features/common/components/SessionExpiredModalBody";
import ViewUserModalBody from "../features/admin/Users/components/ViewUserModalBody";
import EditUserModalBody from "../features/admin/Users/components/EditUserModalBody";
import AddUserModalBody from "../features/admin/Users/components/AddNewUserModalBoody";

function ModalLayout() {
  const { isOpen, bodyType, size, extraObject, title } = useSelector(
    (state) => state.modal
  );
  const dispatch = useDispatch();

  const close = (e) => {
    dispatch(closeModal(e));
  };

  return (
    <>
      {/* The button to open modal */}

      {/* Put this part before </body> tag */}
      <div className={`modal ${isOpen ? "modal-open" : ""}`}>
        <div className={`modal-box  ${size === "xl" ? "max-w-7xl" : ""}`}>
          <button
            className="btn btn-lg btn-circle sticky btn-outline -right-2 float-right top-0"
            onClick={() => close()}
          >
            ✕
          </button>

          <h3 className="font-bolder text-xl pb-6 text-center">{title}</h3>

          {/* Loading modal body according to different modal type */}
          {
            {
              [MODAL_BODY_TYPES.ADD_NEW_USER]: (
                <AddUserModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.EDIT_USER]: (
                <EditUserModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.VIEW_USER]: (
                <ViewUserModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.SESSION_EXPIRED]: (
                <SessionExpiredModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.CONFIRMATION]: (
                <ConfirmationModalBody
                  extraObject={extraObject}
                  closeModal={close}
                />
              ),
              [MODAL_BODY_TYPES.DEFAULT]: <div></div>,
            }[bodyType]
          }
        </div>
      </div>
    </>
  );
}

export default ModalLayout;
