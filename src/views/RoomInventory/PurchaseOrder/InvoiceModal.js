import React from 'react'
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const InvoiceModal = ({ openInvoice, handleInvoice, POID, handleShowEdit }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    console.log("OpenInvoice",POID)
    const handleInvoicePo = async () => {
        try {
            const res = await axios.post(`/inventory/invoice_po/${POID}?LoginID=${LoginID}&Token=${Token}`)
            console.log('res', res)
            if (res?.data[0][0].status === "Success") {
                toast.success(res?.data[0][0].Message)
                handleInvoice()
                handleShowEdit()
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    return (
        <>
            <Modal
                isOpen={openInvoice}
                toggle={handleInvoice}
                className='modal-dialog-centered modal-md'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={handleInvoice}>
                    Invoice PO
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <h3>Are you sure you want to Invoice this PO?</h3>
                        <h6>After invoicing you won't be able to edit the said PO. </h6>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Col className='text-center'>
                        <Button className='mx-1' color='success' onClick={() => handleInvoicePo()}>INVOICE</Button>
                        <Button className='mx-1' color='primary' onClick={() => handleInvoice()} outline>Cancel</Button>
                    </Col>
                </ModalFooter>
            </Modal>
            {
                openInvoice ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default InvoiceModal