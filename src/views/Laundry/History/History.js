import { React, useState, useEffect } from 'react'
import { Row, Col, Button, Card, CardHeader, CardTitle, CardBody, Label, Input, Modal, ModalBody, ModalHeader, Form, FormFeedback, Badge, InputGroupText, InputGroup } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash, Trash2 } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import { MdDateRange } from "react-icons/md"
import moment from "moment"
// ** Styles
import '@styles/react/libs/editor/editor.scss'
import axios from '../../../API/axios'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '@store/store'
import { setInvoiceID, } from '../../../redux/voucherSlice'
import { openLinkInNewTab } from '../../../common/commonMethods'
// const roomOption = [
//   { value: '', label: 'Select Room' },
//   { value: '101', label: '101' },
//   { value: '102', label: '102' },
//   { value: '103', label: '103' },
//   { value: '104', label: '104' },
//   { value: '105', label: '105' }
// ]
// const invoiceNo = [
//   { value: '', label: 'Select Invoice' },
//   { value: '201', label: '201' },
//   { value: '202', label: '202' },
//   { value: '203', label: '203' },
//   { value: '204', label: '204' },
//   { value: '205', label: '205' }
// ]
const History = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Laundry History"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData

  // const data = [
  //   {
  //     LaundryTransactionID: 1,
  //     Gender: 'male',
  //     GuestName: 'alam',
  //     ClothName: 'jacket',
  //     Services: 'Washing',
  //     Amount: '5200'
  //   },
  //   {
  //     LaundryTransactionID: 2,
  //     Gender: 'female',
  //     GuestName: 'taha',
  //     ClothName: 'shirt',
  //     Services: 'Washing',
  //     Amount: '3600'
  //   }
  // ]
  const [searchRoom, setSearchRoom] = useState('')
  const [searchInvoice, setSearchInvoice] = useState('')
  const [loading, setLoading] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [data, setData] = useState([])
  const [invoiceNo, setInvoiceNo] = useState([])
  const [roomOption, setRoomOption] = useState([])
  const [searchStartDate, setSearchStartDate] = useState(new Date())
  const [searchEndDate, setSearchEndDate] = useState(new Date())

  console.log('start date', moment(searchStartDate).format("d/m/y"))
  console.log('end date', moment(searchEndDate).format("dd/mm/yyyy"))

  // const userId = localStorage.getItem('user-id')
  // const userToken = localStorage.getItem('user-token')
  const getLaundryHistory = async () => {
    setLoading(true)
    const postData = {
      LoginID: LoginID,
      Token: Token,
      Seckey: "abc",
      Event: "select",
      RoomNo: null,
      InvoiceNo: null,
      StartDate: null,
      EndDate: null
    }
    try {
      await axios.post("/laundry/transactionhistory", postData).then((res) => {
        console.log("history: ", res)
        setRoomOption(res.data[0].map((room) => {
          return { value: room.roomNo, label: room.roomNo }
        }))
        setInvoiceNo(res.data[1].map((room) => {
          return { value: room.invoiceNo, label: room.invoiceNo }
        }))
        setData(res.data[2])
        setLoading(false)
        console.log(res.data[2])
      })
    } catch (error) {
      console.log("file: History.js:90  getLaundryHistory  error", error)
      setLoading(false)
    }
  }
  const dataToRender = () => {
    if (
      searchRoom || searchInvoice
    ) {
      return [...filteredData]
    } else {
      return data
    }
  }

  const clearAll = () => {
    setSearchInvoice("")
    setSearchRoom("")
    setSearchEndDate(new Date())
    setSearchStartDate(new Date())
  }
  // ** Function to handle name filter
  const handleRoomFilter = e => {
    const value = e?.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchRoom.length) {
        return [...filteredData]
      } else {
        return data
      }
    }
    setSearchRoom(value)
    console.log(value)
    if (value) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.roomNo.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.roomNo.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchRoom(value)

    }
  }
  const handleInvoiceFilter = e => {
    const value = e?.value
    let updatedData = []
    const dataToFilter = () => {
      if (searchRoom || searchInvoice) {
        return [...filteredData]
      } else {
        return data
      }
    }

    setSearchInvoice(value)
    console.log(value)
    if (value) {
      updatedData = dataToFilter().filter(item => {
        const startsWith = item.invoiceNo.toLowerCase().startsWith(value.toLowerCase())
        const includes = item.invoiceNo.toLowerCase().includes(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchInvoice(value)

    }
  }

  const handleDateFilter = date => {
    setSearchStartDate(date);
    let updatedData = [];

    const dataToFilter = () => {
      if (searchRoom || searchInvoice) {
        return [...filteredData];
      } else {
        return data;
      }
    };

    if (date) {
      updatedData = dataToFilter().filter(item => {
        const dateMatch = new Date(item.createdDate).toDateString() === date.toDateString();
        return dateMatch;
      });
      setFilteredData(updatedData);
    }
  };

  const dispatch = useDispatch()
  const UsersColumns = [
    {
      name: 'Invoice No',
      sortable: true,
      minWidth: '250px',
      selector: row => (
        <>{row.invoiceNo || "Not Available"}
        </>
      )
    },

    {
      name: 'Floor:Room',
      sortable: true,
      selector: row => row.floorNo + " : " + row.roomNo || "Not Available"
    },
    {
      name: 'Booking',
      sortable: true,
      minWidth: '250px',
      selector: row => row.bookingID || "Not Available"
    },
    {
      name: 'Total',
      sortable: true,
      selector: row => row.total || "Not Available"
    },
    {
      name: 'Total Due',
      sortable: true,
      selector: row => row.totalDue || "Not Available"
    },
    {
      name: 'Invoice',
      minWidth: '180px',
      selector: row => {
        console.log(row)
        return (
          <Button.Ripple color='primary' onClick={() => {
            openLinkInNewTab('/laundryInvoice')
            store.dispatch(setInvoiceID(row.laundryTransactionID))
          }}>View Invoice</Button.Ripple>
        )
      }
    }
  ]

  useEffect(() => {
    getLaundryHistory()
  }, [])
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Laundry History</CardTitle>
        </CardHeader>
        <CardBody>
          <Row className='mt-1 mb-50'>
            <Col lg='3' md='4' sm='12' className='mb-1'>
              <Label className='form-label' for='nameVertical'>
                Room Number
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                options={roomOption}
                isClearable={false}
                value={roomOption.filter(v => v?.value === searchRoom)}
                onChange={handleRoomFilter}
              />
            </Col>
            <Col lg='3' md='4' sm='12' className='mb-1'>
              <Label className='form-label' for='nameVertical'>
                Invoice Number
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select w-100'
                classNamePrefix='select'
                options={invoiceNo}
                isClearable={false}
                value={invoiceNo.filter(v => v?.value === searchInvoice)}
                onChange={handleInvoiceFilter}
              />
            </Col>
            <Col md='4' className='mb-1 d-none d-lg-none d-md-block'>

            </Col>
            <Col lg='3' md='4' className='mb-1'>
              <Label className='form-label' for='searchStartDate'>
                Start Date
              </Label>
              <div className='datePicker'>
                <InputGroup className='input-group-merge'>
                  {/* <Flatpickr className='form-control' selected={searchStartDate} value={searchStartDate} onChange={date => setSearchStartDate(date)} id='searchStartDate' /> */}
                  <Flatpickr
                    className='form-control'
                    selected={searchStartDate}
                    value={searchStartDate}
                    onChange={date => handleDateFilter(date)}
                    id='searchStartDate'
                  />
                  <InputGroupText>
                    <MdDateRange size={15} />
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col className='mb-1' lg='3' md='4' sm='12'>
              <Label className='form-label' for='searchEndDate'>
                End Date :
              </Label>
              <div className='datePicker'>
                <InputGroup className='input-group-merge'>
                  <Flatpickr className='form-control' selected={searchEndDate} value={searchEndDate} onChange={date => setSearchEndDate(date)} id='endtDate' />
                  <InputGroupText>
                    <MdDateRange size={15} />
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col className='mb-1 justify-content-center text-center'>
              {/* <div className='text-center'>
                <Button.Ripple color='primary'>SEARCH</Button.Ripple>
              </div> */}
              <div className='text-center mx-1'>
                <Button.Ripple color='danger' onClick={clearAll}>CLEAR</Button.Ripple>
              </div>
            </Col>
            {/*<Col className='mb-1 justify-content-center align-item-center align-self-end' xl='3' md='4' sm='12'>
              <div className='w-100'>
              <div className='d-flex'>
                <span>Room Number : </span>
                <span className='ms-1'>{searchRoom}</span>
              </div>
              <div className='d-flex '>
                <span>Invoice Number : </span>
                <span className='ms-1'>{searchInvoice}</span>
              </div>
              </div>
          </Col>*/}

          </Row>
          <Row>
            <Col>
              {loading ? <div style={{ textAlign: 'center', marginTop: "3rem" }}> <h2 style={{ text: 'center' }}>Loading...</h2></div> : (
                <DataTable
                  noHeader
                  pagination
                  data={dataToRender()}
                  columns={UsersColumns}
                  className='react-dataTable'
                  sortIcon={<ChevronDown size={5} />}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                />
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}

export default History
