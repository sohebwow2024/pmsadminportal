import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import axios from '../../../API/axios'

const DeleteHotelModal = ({ del, handleDelModal, hotels, id }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const data = hotels?.filter(hotel => hotel.propertyId === id)

    const handleDeleteHotel = () => {

        axios.post(`/property/hotel/delete/${id}?LoginID=${LoginID}&Token=${Token}`).then(res => {
            if (res.data[0][0].status === "Success") {
                toast.success(res.data[0][0].message, { position: 'top-right' })
                handleDelModal()
            }
        }
        ).catch(e => {
            toast.error(e.response.data.message, { position: 'top-right' })
        })
    }

    return (
        <>
            <Modal
                isOpen={del}
                toggle={handleDelModal}
                className='modal-dialog-centered'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent text-center' toggle={handleDelModal}>
                    Are you sure to delete this permanently {data[0]?.hotelName}?
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button color='danger' className='m-1' onClick={handleDeleteHotel}>
                                Delete
                            </Button>
                            <Button className='m-1' color='secondary' outline onClick={handleDelModal}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {
                del ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default DeleteHotelModal