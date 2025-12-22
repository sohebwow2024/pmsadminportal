import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import axios, { Staah } from '../../../API/axios'
import Axios from 'axios'
import { useState } from "react"

const HotelOTA = ({ open, handleOTA, hotels, id }) => {
    console.log(id);
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const data = hotels?.filter(hotel => hotel.propertyId === id)
    const [loading, setLoading] = useState(false)
    const syncOTA = async () => {
        setLoading(true)
        try {
            // const res = await Axios.post(`${Staah}/Property/SyncProperty?hotelId=${id}`, {}, {
            //     headers: {
            //         LoginID,
            //         Token,
            //         Seckey: '123',
            //         'Access-Control-Allow-Origin': '*',
            //         'Content-Type': 'application/json',
            //     }
            // })
            const res = await Axios({
                method: "post",
                baseURL: `${Staah}`,
                url: `/Property/SyncProperty?hotelId=${id}`,
                headers: {
                    "Access-Control-Allow-Origin": '*',
                    "Content-Type": "application/json",
                    LoginID,
                    Token,
                    Seckey: '123'
                },
            })
            setLoading(false)
            console.log('res', res.data.data)
            if (res?.data?.code === 200) {
                toast.success(res?.data?.data)
                handleOTA(open)
            } else if (res?.data?.code === 500) {
                toast.error(res?.data?.data, { duration: 7000 })
            } else {
                toast.error('Something went wrong, Try again!')
            }
        } catch (error) {
            setLoading(false)
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={handleOTA}
                className='modal-dialog-centered'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent text-center' toggle={handleOTA}>
                    Are you sure You want to Sync {data[0]?.hotelName}?
                </ModalHeader>
                <ModalBody>
                    <Row className='text-center'>
                        <Col xs={12}>
                            <Button color='primary' className='m-1' onClick={syncOTA} disabled={loading === true}>
                                {loading === true ? 'Loading...' : 'Sync'}
                            </Button>
                            <Button className='m-1' color='secondary' outline onClick={handleOTA}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {
                open ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>
    )
}

export default HotelOTA