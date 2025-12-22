import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

function PaymentModal({handleOpen, open}) {
  return (
    <>
      <Modal
        isOpen={open}
        toggle={handleOpen}
        className="modal-dialog-centered modal-md"
        backdrop={false}
      >
        <ModalHeader toggle={handleOpen}>
            hello
        </ModalHeader>
        <ModalBody className="pt-2">
        
        </ModalBody>
      </Modal>
    </>
  );
}

export default PaymentModal;
