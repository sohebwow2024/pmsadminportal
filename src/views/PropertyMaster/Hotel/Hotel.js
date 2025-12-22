import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Edit, RefreshCcw, Trash } from 'react-feather'
import { AiOutlineCloudSync } from 'react-icons/ai'
import { Button, Card, CardBody, CardText, Input, CardTitle, Col, Label, Modal, ModalBody, ModalHeader, Row, Form, FormFeedback, CardHeader } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'
import axios, { Image_base_uri } from '../../../API/axios'
// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useSelector } from 'react-redux'
import NewHotelModal from './NewHotelModal'
import EditHotelModal from './EditHotelModal'
import DeleteHotelModal from './DeleteHotelModal'
import HotelOTA from './HotelOTA'
import Avatar from '@components/avatar'
const Hotel = () => {


  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Hotel"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, CompanyID, UserRole } = getUserData

  const [hotels, setHotels] = useState([])
  const getAllHotelList = () => {
    axios.get(`/property/hotel/all?CompanyID=${CompanyID}&LoginID=${LoginID}&Token=${Token}`).then((res) => {
      console.log('response:__', res.data[0])
      setHotels(res.data[0])
    }).catch(e => {
      console.log(e)
    })
  }

  const [show, setShow] = useState(false)
  const handleShowModal = () => setShow(!show)

  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)

  const [selected_hotel, setSelected_hotel] = useState()

  const [del, setDel] = useState(false)
  const handleDelModal = () => setDel(!del)


  const [OTA, SetOTA] = useState(false)
  const handleOTA = () => SetOTA(!OTA)

  const [otaData, setOtaData] = useState([])
  const getOTAphoto = async () => {
    try {
      const res = await axios.get(`/booking/getotalogo/244`, {
        headers: {
          LoginID,
          Token
        }
      })
      console.log('otaData', res?.data[0])
      setOtaData(res?.data[0][0])
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getAllHotelList()
    getOTAphoto()
  }, [show, showEdit, del])

  // const getAllState = () => {
  //   axios.post("/getdata/regiondata/statedetails", {
  //     LoginID,
  //     Token,
  //     Seckey: "abc",
  //     Event: "selectall"
  //   }).then(res => {
  //     console.log("testing:_", res)
  //     if (res.data !== null) {
  //       res.data[0].map(i => states.push({ label: i.StateName, value: i.StateID }))

  //     }
  //   }).catch(e => {
  //     toast.error(e.response.data.Message, { position: 'top-right' })
  //   })
  // }
  // useEffect(() => {
  //   getAllHotelList()
  //   // getAllState()
  // }, [])

  const hotelTable = [
    // {
    //   name: '#',
    //   width: '60px',
    //   sortable: true,
    //   selector: row => row.PropertyID
    // },
    {
      name: '',
      // minWidth: 'fit-content',
      selector: row => {
        console.log(row)
        return (
          <>
            {
              row.logoFile ? (
                <Avatar className='my-1' size="lg" img={`${Image_base_uri}${row?.logoURL}`} alt='logo' />
              ) : (
                <Avatar img={`${Image_base_uri}/uploads/dummy.jpg`} alt='logo' />
              )
            }
          </>
        )
      }
    },
    {
      name: 'Hotel Name',
      sortable: true,
      selector: row => row.hotelName
    },
    {
      name: "Address",
      selector: row => row.addressLine
    },
    {
      name: "No Of Floor",
      selector: row => row.floorCount
    },
    {
      name: "Country",
      selector: row => row.countryName
    },
    {
      name: 'Action',
      sortable: true,
      width: '15rem',
      center: true,
      selector: row => (
        <>
          <Col>
            <Edit className='me-50 pe-auto' onClick={() => {
              handleEditModal()
              setSelected_hotel(row.propertyID)
            }} size={15} />
            {/* <Trash className='me-50' size={15} onClick={() => {
              setDel(true)
              setSelected_hotel(row.PropertyID)
            }} /> */}
            <span className='me-50'>
              <Button size='sm' color='primary' outline onClick={() => {
                handleOTA()
                setSelected_hotel(row.propertyID)
              }}>
                <RefreshCcw size={15} /> OTA
              </Button>
            </span>
          </Col>
        </>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Hotel
          </CardTitle>
          {UserRole === 'SuperAdmin' ? <Button color='primary' onClick={() => setShow(true)}>Add Hotel</Button> : null}

        </CardHeader>
        <CardBody>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                data={hotels.filter(i => i.status == "Active")}
                columns={hotelTable}
                className='react-dataTable'
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      {show && <NewHotelModal show={show} handleShowModal={handleShowModal} getAllHotelList={getAllHotelList} />}
      {showEdit && <EditHotelModal showEdit={showEdit} handleEditModal={handleEditModal} hotels={hotels} id={selected_hotel} />}
      {del && <DeleteHotelModal del={del} handleDelModal={handleDelModal} hotels={hotels} id={selected_hotel} />}
      {OTA && <HotelOTA open={OTA} handleOTA={handleOTA} hotels={hotels} id={selected_hotel} />}
    </>
  )
}

export default Hotel
