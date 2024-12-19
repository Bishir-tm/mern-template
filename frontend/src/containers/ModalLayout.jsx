import { useEffect } from "react";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../features/common/modalSlice";
import AddLeadModalBody from "../features/leads/components/AddLeadModalBody";
import ConfirmationModalBody from "../features/common/components/ConfirmationModalBody";
import DataPurchaseConfirmation from "../features/data/components/DataPurchaseConfirmation";
import AirtimePurchaseConfirmation from "../features/airtime/components/AirtimePurchaseConfirmation";
import FundWallet from "../features/wallet/components/FundWallet";
import TransferFunds from "../features/wallet/components/TransferFunds";
import SessionExpiredModalBody from "../features/common/components/SessionExpiredModalBody";
import AddNetworkModalBody from "../features/admin/Networks/components/AddNetworkModalBody";
import EditNetworkModalBody from "../features/admin/Networks/components/EditNetworkModalBody";
import AddDataTypeModalBody from "../features/admin/DataTypes/components/AddDataTypeModalBody";
import EditDataTypeModalBody from "../features/admin/DataTypes/components/EditDataTypeModalBody";
import AddDataPlanModalBody from "../features/admin/DataPlans/components/AddDataPlanModalBody";
import EditDataPlanModalBody from "../features/admin/DataPlans/components/EditDataPlanModalBody";
import AddAirtimeTypeModalBody from "../features/admin/AirtimeTypes/components/AddAirtimeTypeModalBody";
import EditAirtimeTypeModalBody from "../features/admin/AirtimeTypes/components/EditAirtimeTypeModalBody";
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
              [MODAL_BODY_TYPES.ADD_NEW_LEAD]: (
                <AddLeadModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.FUND_WALLET]: (
                <FundWallet closeModal={close} extraObject={extraObject} />
              ),
              [MODAL_BODY_TYPES.TRANSFER_FUNDS]: (
                <TransferFunds closeModal={close} extraObject={extraObject} />
              ),
              [MODAL_BODY_TYPES.ADD_NEW_NETWORK]: (
                <AddNetworkModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.EDIT_NETWORK]: (
                <EditNetworkModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.ADD_NEW_DATA_TYPE]: (
                <AddDataTypeModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.EDIT_DATA_TYPE]: (
                <EditDataTypeModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.ADD_NEW_DATA_PLAN]: (
                <AddDataPlanModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.EDIT_DATA_PLAN]: (
                <EditDataPlanModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.ADD_NEW_AIRTIME_TYPE]: (
                <AddAirtimeTypeModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.EDIT_AIRTIME_TYPE]: (
                <EditAirtimeTypeModalBody
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.DATA_PURCHASE_CONFIRMATION]: (
                <DataPurchaseConfirmation
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
              [MODAL_BODY_TYPES.AIRTIME_PURCHASE_CONFIRMATION]: (
                <AirtimePurchaseConfirmation
                  closeModal={close}
                  extraObject={extraObject}
                />
              ),
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
