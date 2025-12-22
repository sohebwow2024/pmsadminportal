import React, { useEffect, useState } from 'react'
import {
  Card, CardTitle, CardText, CardBody, CardSubtitle, CardHeader, Row, Col, Label, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Modal, ModalHeader, ModalBody,
  Button, Form, Table, Badge
} from 'reactstrap'
import { MoreVertical, Edit, Trash, ChevronDown, ChevronLeft, RefreshCcw, Check, User } from 'react-feather'
// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { Staah } from '../../API/axios'
import Axios from 'axios'
import { openLinkInNewTab } from '../../common/commonMethods'
import moment from 'moment'
import toast from 'react-hot-toast'
import Avatar from '@components/avatar'
import OnHoldQuickBookingModal from '../FrontDesk/OnHoldQuickBookingModal'
import QuickBookingModal from '../FrontDesk/QuickBookingModal'
import OTABookingModal from './OTABookingModal'
import { getBookingData, setOTABookingID } from '../../redux/voucherSlice'
import { store } from "@store/store";
import avtar from '../../assets/images/OTA-Logo/airbnb.png'
const ContactlessRequest = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Online Booking"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData
  const navigate = useNavigate()
  const { name, id } = useParams()
  const dispatch = useDispatch();
  const [tdata, setTdata] = useState([])
  const [confirmation, setConfirmation] = useState('')
  const [resID, setResID] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmloading, setConfirmLoading] = useState(false)
  const [selId, setSelID] = useState('')
  const [roomData, setRoomData] = useState('')
  console.log('roomData', roomData);
  const [otaModalOpen, setOtaModalOpen] = useState(false)
  const handleModalOpen = () => setOtaModalOpen(!otaModalOpen)

  const getReservation = async () => {
    try {
      const res = await axios.get('/booking/GetReservationFromSTAAH', {
        headers: {
          LoginID,
          Token,
        }
      })
      console.log('response', res?.data[0]);
      setTdata(res?.data[0])
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getReservation()
  }, [])

  const OTALogoList = [
    { Code: '189', Logo: '189 AgodaYCS.jpg' },
    { Code: '319', Logo: '319 AltoVita.jpg' },
    { Code: '293', Logo: '293 Bakuun.png' },
    { Code: '226', Logo: '226 booknpayxml.webp' },
    { Code: '181', Logo: '181 despegar.png' },
    { Code: '90', Logo: '90 Dnata Formerly Travel Republic.png' },
    { Code: '183', Logo: '183 Dorms.png' },
    { Code: '9', Logo: '9 Expedia.png' },
    { Code: '207', Logo: '207 Explore.com-Tikitour.png' },
    { Code: '251', Logo: '251 Eztravel.png' },
    { Code: '153', Logo: '153 Fastbooking.png' },
    { Code: '179', Logo: '179 Flight Centre.png' },
    { Code: '321', Logo: '321 5pm.png' },
    { Code: '213', Logo: '213 Getroom.png' },
    { Code: '5002', Logo: '5002 Google.png' },
    { Code: '104', Logo: '104 GTA Travel.png' },
    { Code: '284', Logo: '284 Happyeasygo.jpg' },
    { Code: '61', Logo: '61 Hostelsclub.png' },
    { Code: '76', Logo: '76 HostelWorld.png' },
    { Code: '282', Logo: '282 Irctc.png' },
    { Code: '1', Logo: '1 Staah.png' },
    { Code: '97', Logo: '97 Travelguru.png' },
    { Code: '59', Logo: '59 Travelocity.png' },
    { Code: '5001', Logo: 'TripAdvisor_Logo.png' },
    { Code: '217', Logo: 'easemytripcomlogo.png' },
    { Code: '244', Logo: 'airbnb.png' },
    { Code: '19', Logo: 'booking.com.jpeg' },
    { Code: '105', Logo: 'goibibo.png' }
    // 28
  ]

  const tableColumns = [
    {
      center: true,
      width: '80px',
      sortable: row => row.id,
      cell: (row, i) => {
        let otaCode = JSON.parse(row.affiliation)
        console.log('row', otaCode.otA_Code)
        return (
          // console.log(row.status === 'cancelled'),
          <div className='d-flex align-items-center cursor-pointer' onClick={() => {
            setSelID(row.reservationId)
            if (row.isTransfer === false) {
              handleModalOpen()
            }
          }}>
            {/* <Avatar
              title="Click to Manage Booking"
              icon={<User color='#FFFFFF' size={25} />}
              color={
                row.status === 'cancelled' ? (
                  'danger'
                ) : row.status === 'new' ? (
                  'info'
                ) : 'warning'
              }
            /> */}
            {otaCode.otA_Code === null ? <Avatar
              title="Click to Manage Booking"
              icon={<User color='#FFFFFF' size={25} />}
              color={
                row.status === 'cancelled' ? (
                  'danger'
                ) : row.status === 'new' ? (
                  'info'
                ) : 'warning'
              }
            /> : OTALogoList.filter(a => a.Code === otaCode.otA_Code).map((a) => {
              console.log('channelData', a.Logo)
              return (<>

                {/* <Avatar className='my-1' size="lg" img={(a.Logo)} alt='logo' /> */}
                {/* <Avatar className='my-1' size="lg" img={avtar} alt='logo' /> */}
                {/* <img src={`../../assets/images/OTA-Logo/${a.Logo}`} /> */}
                <img src={require(`../../assets/images/OTA-Logo/${a.Logo}`)} width={50} height={50} />
              </>
              )
            })}
          </div>
        )
      }
    },
    {
      name: 'Id',
      sortable: true,
      minWidth: '250px',
      selector: row => {
        return (
          <a color='primary' style={{ color: '#7367f0' }} onClick={() => {
            openLinkInNewTab(`/bookingView/${row.reservationId}`)
          }}>{row.id}</a>
        )
      }
    },

    {
      name: 'BookedAt',
      sortable: true,
      minWidth: '120px',
      selector: row => (row.bookedAt)
    },
    {
      name: 'Booking Id',
      sortable: true,
      minWidth: '200px',
      selector: row => (row.bookingId)
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => row.status
    },
    {
      name: 'Modified At',
      sortable: true,
      minWidth: '150px',
      selector: row => moment(row.modified_at).format("DD-MM-YYYY")
    },
    {
      name: 'Voucher',
      selector: row => {
        return (
          <>
            <Button
              size='sm'
              color='primary'
              onClick={() => {
                dispatch(getBookingData({ LoginID, Token, OTABookingId: row.reservationId }))
                openLinkInNewTab(`/otaVoucher/${row.reservationId}`)
                store.dispatch(setOTABookingID(row.reservationId))
                console.log(row.reservationId);
              }}
            >View</Button>
          </>
        )
      }
    },
    // {
    //   name: 'Status',
    //   sortable: true,
    //   selector: row => (
    //     <>
    //       <Col>
    //         {row.ConfiremedFromStaah === true ? <Label className='text-success'>Confirmed</Label> : resID === row.ReservationId && confirmation === true ? <Label className='text-success'>Confirmed</Label> : <Label className='text-danger'
    //         // onClick={() => {handleReservationNoti(row.reservation_notif_id, row.ReservationId)}} 
    //         >{resID === row.ReservationId && confirmloading === true ? 'Loading' : 'Confirm'} </Label>}
    //       </Col>
    //     </>
    //   )
    // },
    {
      name: 'Transfered To PMS',
      sortable: true,
      width: '180px',
      selector: row => (
        <>
          <Col>
            {row.isTransfer === true ? 'Yes' : 'No'}
          </Col>
        </>
      )
    },
  ]

  const handleSync = async () => {
    setLoading(true)
    const obj = {
      hotelid: PropertyID
    }
    try {
      const res = await Axios.post(`${Staah}/Reservations/AddReservation`, obj, {
        headers: {
          LoginID,
          Token,
          Seckey: '123'
        }
      })
      setLoading(false)
      console.log('res', res);
      if (res?.status === 200) {
        toast.success('Online Booking Synced Successfully')
        getReservation()
      }

    } catch (error) {
      setLoading(false)
      console.log('error', error)
      toast.error('Something went wrong!')
    }
  }
  const handleReservationNoti = async (id, reservationId) => {
    setConfirmLoading(true)
    console.log('reservationId', reservationId);
    const obj = {
      hotelid: PropertyID,
      reservation_notif: {
        reservation_notif_id: [
          id
        ]
      }

    }
    try {
      const res = await Axios.post(`${Staah}/Reservations/Reservation_notif`, obj, {
        headers: {
          LoginID,
          Token,
          Seckey: '123'
        }
      })
      console.log(res);
      if (res?.status === 200) {
        const confirmres = await axios.post(`/booking/Confirm_ReservationFromSTAAH?reservation_id=${reservationId}`, {}, {
          headers: {
            LoginID,
            Token,
          }
        })
        setConfirmLoading(false)
        console.log('confirmres', confirmres);
        if (confirmres.status === 200) {
          setConfirmation(true)
          setResID(reservationId)
        }
        toast.success('Success')
      }
    } catch (error) {
      setConfirmLoading(false)
      console.log('error', error)
      toast.error('Something went wrong!')
    }
  }
  return (
    <>
      <div className='d-flex justify-content-between'>
        {/* <Button className='mb-1 ' size='sm' color='primary' onClick={() => navigate(-1)}><ChevronLeft size={25} color='#FFF' /></Button> */}
        <span className='fs-3 '>{name}Online Booking</span>
        <Button className='mb-1 float-end' color='primary' outline onClick={() => handleSync()} > <RefreshCcw size={15} className='me-1' disabled={loading === true} />{loading === true ? 'Loading' : 'SYNC ALL'} </Button>
      </div>
      <Card>
        <CardHeader>
          {/* <CardTitle>POS Table added for {name}</CardTitle> */}
        </CardHeader>
        <CardBody>
          <Row>
            <Col className='react-dataTable'>
              <DataTable
                noHeader
                pagination
                data={tdata}
                columns={tableColumns}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      {otaModalOpen && <OTABookingModal open={otaModalOpen} handleOpen={handleModalOpen} id={selId} getReservation={getReservation} />}
      {/* {quickModalOpen && <QuickBookingModal open={quickModalOpen} handleOpen={handleModalOpen} handleModalOpen={handleModalOpen} />} */}
    </>
  )
}

export default ContactlessRequest


