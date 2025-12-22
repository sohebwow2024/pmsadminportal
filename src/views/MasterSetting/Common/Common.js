import { React, useState, useEffect } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardBody, CardHeader } from 'reactstrap'
import SourceType from './SourceType'
import PaymentMode from './PaymentMode'
import BookingSource from './BookingSource'
import PaymentType from './PaymentType'
import RoomStatus from './RoomStatus'
import MealPlan from './MealPlan'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'


const Common = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Common Master"
    return () => {
      document.title = prevTitle
    }
  }, [])
  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData
  // const userId = localStorage.getItem('user-id')
  // const token = localStorage.getItem('user-token')
  const [active, setActive] = useState('1')

  // Room Status  - Start
  const [roomsStatusList, setRoomsStatusList] = useState([])
  const [statusLoader, setStatusLoader] = useState(false)

  const refreshRoomStatusList = () => {
    setStatusLoader(true)
    const roomStatusListBody = {
      LoginID: LoginID,
      Token: Token,
      Seckey: "abc",
      Event: "select"
    }
    try {
      axios.post('/getdata/bookingdata/roomstatus', roomStatusListBody)
        .then(response => {
          setRoomsStatusList(response?.data[0])
          setStatusLoader(false)
        })
    } catch (error) {
      setStatusLoader(false)
      console.log("Room Status List Error", error.message)
    }
  }
  // Room Status - End

  // Booking Source - Start
  const [bookingSourceList, setBookingSourceList] = useState([])
  const [bookingSourceLoader, setBookingSourceLoader] = useState(false)

  const refreshBookingSourceList = () => {

    setBookingSourceLoader(true)
    try {
      const bookingSourceBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "select"
      }
      axios.post('/getdata/bookingdata/bookingsource', bookingSourceBody)
        .then(response => {
          setBookingSourceList(response?.data[0])
          setBookingSourceLoader(false)
        })
    } catch (error) {
      setBookingSourceLoader(false)
      console.log("State Error", error.message)
    }
    setBookingSourceLoader(false)

  }
  // Booking Source - End

  // Siurce Type - Start
  const [sourceTypeList, setSourceTypeList] = useState([])
  const [sourceTypeLoader, setSourceTypeLoader] = useState(false)

  const refreshSourceTypeList = () => {
    setSourceTypeLoader(true)
    try {
      const sourceTypeListBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "selectall",
        // Status: "Active"
      }
      axios.post('/getdata/bookingdata/sourcetype', sourceTypeListBody)
        .then(response => {
          setSourceTypeList(response?.data[0])
          setSourceTypeLoader(false)
        })
    } catch (error) {
      setSourceTypeLoader(false)
      console.log("State Error", error.message)
    }
    setSourceTypeLoader(false)
  }

  // Source Type - End

  // Payment Type - Start
  const [paymentTypeList, setPaymentTypeList] = useState([])
  const [paymentTypeLoader, setPaymentTypeLoader] = useState(false)

  const refreshPaymentTpeList = () => {
    setPaymentTypeLoader(true)
    try {
      const paymentTypeListBody = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "select"
      }
      axios.post(`/getdata/bookingdata/paymenttype`, paymentTypeListBody)
        .then(res => {
          setPaymentTypeList(res?.data[0])
          setPaymentTypeLoader(false)
        })
    } catch (error) {
      setPaymentTypeLoader(false)
      console.log("Payment Type List Error", error.message)
    }
    setPaymentTypeLoader(false)
  }

  // Payment Type - End

  // Payment Mode
  const [paymentModeList, setPaymentModeList] = useState([])
  const [paymentModeLoader, setPaymentModeLoader] = useState(false)

  const refreshPaymentModeList = () => {
    setPaymentModeLoader(true)
    const paymentModeBody = {
      LoginID: LoginID,
      Token: Token,
      Seckey: "abc",
      Event: "selectAll",
      Status: "Active"

    }
    try {
      axios.post(`/getdata/bookingdata/paymentmode`, paymentModeBody)
        .then(modeResponse => {
          setPaymentModeList(modeResponse?.data[0])
          setPaymentModeLoader(false)
        })
    } catch (error) {
      setPaymentModeLoader(false)
      console.log("Payment Mode Error", error.message)
    }
    setPaymentModeLoader(false)
  }

  useEffect(() => {
    refreshRoomStatusList() // Refresh Room Status
    refreshBookingSourceList() // Refresh Booking Status
    refreshSourceTypeList() //Refresh Source type
    refreshPaymentTpeList() //Refresh Payment type
    refreshPaymentModeList() //Refresh Payment Mode
  }, [])


  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Masters</CardTitle>
        </CardHeader>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                active={active === '1'}
                onClick={() => {
                  toggle('1')
                }}
              >
                ROOM STATUS
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '2'}
                onClick={() => {
                  toggle('2')
                }}
              >
                BOOKING SOURCE
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '3'}
                onClick={() => {
                  toggle('3')
                }}
              >
                SOURCE TYPE
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '4'}
                onClick={() => {
                  toggle('4')
                }}
              >
                PAYMENT TYPE
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '5'}
                onClick={() => {
                  toggle('5')
                }}
              >
                PAYMENT MODE
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '6'}
                onClick={() => {
                  toggle('6')
                }}
              >
                RATE PLAN
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className='py-50' activeTab={active}>
            <TabPane tabId='1'>
              <RoomStatus roomsStatusList={roomsStatusList} refreshList={refreshRoomStatusList} loader={statusLoader} />
            </TabPane>
            <TabPane tabId='2'>
              <BookingSource bookingSourceList={bookingSourceList} refreshList={refreshBookingSourceList} loader={bookingSourceLoader} />
            </TabPane>
            <TabPane tabId='3'>
              <SourceType sourceTypeList={sourceTypeList} bookingSourceList={bookingSourceList} refreshList={refreshSourceTypeList} loader={sourceTypeLoader} refreshBookingSourceList={refreshBookingSourceList} bookingSourceLoader={bookingSourceLoader} />
            </TabPane>
            <TabPane tabId='4'>
              <PaymentType paymentTypeList={paymentTypeList} loader={paymentTypeLoader} refreshPaymentTpeList={refreshPaymentTpeList} />
            </TabPane>
            <TabPane tabId='5'>
              <PaymentMode paymentModeList={paymentModeList} paymentTypeList={paymentTypeList} loader={paymentModeLoader} refreshPaymentModeList={refreshPaymentModeList} refreshPaymentTpeList={refreshPaymentTpeList} />
            </TabPane>
            <TabPane tabId='6'>
              <MealPlan />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </>
  )
}

export default Common