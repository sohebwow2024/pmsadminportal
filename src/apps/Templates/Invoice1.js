import moment from 'moment'
import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row, Table, Nav, NavItem, NavLink, TabContent, TabPane, Accordion, AccordionItem, AccordionHeader, AccordionBody, Input } from 'reactstrap'
import booking from '../../assets/images/OTA-Logo/booking.com.jpeg'
import { Image_base_uri } from '../../API/axios';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, BlobProvider, PDFViewer, usePDF, Image } from '@react-pdf/renderer';
import { Button, Spinner } from 'reactstrap'
import toast from 'react-hot-toast';
import axios from 'axios';
import {useReactToPrint} from 'react-to-print';

const Invoice1 = () => {

  const [load, setLoad] = useState(false)
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
  const [active, setActive] = useState(1);
  const [split_email, setSplit_email] = useState('')
  const toggle_tab = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  }

  const [open, setOpen] = useState(1)

  const handleBlobWithEmail = async (newBlob) => {
    const myFile = new File([newBlob], `Invoice_${paymentTypeData.bookingMapID}.pdf`, {
      type: newBlob.type,
    });
    setLoad(true)
    if (split_email !== '') {

      let newDocData = new FormData()
      newDocData.append('file', myFile)
      newDocData.append('ToEMail', split_email)
      newDocData.append('Name', guestData?.guestName)
      newDocData.append('BookingID', paymentTypeData.bookingMapID)
      newDocData.append('HotelName', hotelData.hotelName)
      newDocData.append('HotelLogo', hotelData.logoFile)
      newDocData.append('EmailAddress', hotelData.email)
      newDocData.append('PhoneNumber', hotelData.phoneNumber)
      newDocData.append('City', hotelData.cityName)
      newDocData.append('Address', hotelData.addressLine)
      newDocData.append('Adults', roomData.reduce((acc, obj) => { return acc + obj.adult }, 0))
      newDocData.append('Children', roomData.reduce((acc, obj) => { return acc + obj.children }, 0))
      newDocData.append('CheckInDate', moment(paymentTypeData?.checkInDate).format('LLL'))
      newDocData.append('CheckOutDate', moment(paymentTypeData.checkOutDate).format('LLL'))
      newDocData.append('Total', payableAmount.billAmount)

      try {
        const res = await axios({
          method: "post",
          baseURL: `${Image_base_uri}`,
          url: "/api/booking/send/invoice",
          data: newDocData,
          headers: {
            "Content-Type": "multipart/form-data",
            LoginID,
            Token
          },
        })
        console.log('Docres', res)
        if (res?.status === 200) {
          setLoad(false)
          toast.success(res?.data, { duration: 5000 })
          setSplit_email('')
        }
      } catch (error) {
        setLoad(false)
        console.log('uploadError', error)
        toast.error('Something went wrong, Try again!')
      }
    } else {
      toast.error('Fill all fields!')
      setTimeout(() => {
        setLoad(false)
      }, 3000)
    }

  }


  const [laundary_arr, setLaundary_arr] = useState([])
  const [pos_arr, setPos_arr] = useState([])

  const getUserData = useSelector((state) => state.userManageSlice.userData)
  const { LoginID, Token, HotelName } = getUserData;

  const bookingDetails = useSelector(state => state.voucherSlice.bookingDetails)
console.log('bookingDetails', bookingDetails)
  const data = useSelector(state => state.voucherSlice.invoiceDetails)
  console.log('data', data)

  // const [data, setData] = useState([])
  const [hotelData] = useState(data[0][0])
  console.log('hotelData', hotelData)
  const [invoiceData] = useState(data[1][0])
  const [guestData] = useState(data[2][0])
  const [companyData] = useState(data[3][0])
  const [paymentTypeData] = useState(data[4][0])
  const [roomData] = useState(data[5])
  console.log('roomData', roomData)
  const [roomSummaryData] = useState(data[6][0])
  const [addOnData] = useState(data[7])
  const [addOnSummaryData] = useState(data[8][0])
  const [payableAmount] = useState(data[9][0])
  const [SplitBillFlag] = useState(data[10][0].isSplitBill)
  const [splitArr] = useState(data[10][0].isSplitBill ? JSON.parse(data[10][0].JSON_SplitBill) : [])
  console.log('splitArr', splitArr)
  const [split_guestData] = useState(data[10][0].isSplitBill ? JSON.parse(data[10][0]?.JSON_SplitBill).filter(i => i.hasOwnProperty('guestData'))[0].guestData : [])
  const [split_roomData] = useState(data[10][0].isSplitBill ? JSON.parse(data[10][0]?.JSON_SplitBill).filter(i => i.hasOwnProperty('roomData'))[0].roomData : [])
  const [split_serviceData] = useState(data[10][0].isSplitBill ? JSON.parse(data[10][0]?.JSON_SplitBill).filter(i => i.hasOwnProperty('serviceData'))[0].serviceData : [])
  const img = `${Image_base_uri}${hotelData.LogoFile1}`

  console.log('guestData', guestData);

  const handleBlob = async (newBlob) => {
    const myFile = new File([newBlob], `Voucher_${bookingDetails?.bookingId}.pdf`, {
      type: newBlob.type,
    });
    console.log('myFile', myFile);

    let newDocData = new FormData()
    newDocData.append('file', myFile)
    newDocData.append('ToEMail', bookingDetails?.guestEmail)
    newDocData.append('Name', bookingDetails?.guestName)
    newDocData.append('BookingID', bookingDetails?.bookingId)
    newDocData.append('HotelName', bookingDetails.hotelData[0]?.hotelName)
    newDocData.append('HotelLogo', bookingDetails.hotelData[0]?.logoFile)
    newDocData.append('EmailAddress', bookingDetails.hotelData[0]?.email)
    newDocData.append('PhoneNumber', bookingDetails.hotelData[0]?.phoneNumber)
    newDocData.append('City', bookingDetails.hotelData[0]?.cityName)
    newDocData.append('Address', bookingDetails.hotelData[0]?.addressLine)
    newDocData.append('Adults', bookingDetails?.roomData.reduce((acc, obj) => { return acc + obj.adult }, 0))
    newDocData.append('Children', bookingDetails?.roomData.reduce((acc, obj) => { return acc + obj.children }, 0))
    newDocData.append('CheckInDate', moment(bookingDetails?.checkInDate).format('LLL'))
    newDocData.append('CheckOutDate', moment(bookingDetails?.checkOutDate).format('LLL'))
    newDocData.append('Total', bookingDetails?.totalAmount)
    try {
      setLoad(true)
      const res = await axios({
        method: "post",
        baseURL: `${Image_base_uri}`,
        url: "/api/booking/send/voucher",
        data: newDocData,
        headers: {
          "Content-Type": "multipart/form-data",
          LoginID,
          Token
        },
      })
      console.log('Docres', res)
      if (res?.status === 200) {
        setLoad(false)
        toast.success(res?.data)
      }
    } catch (error) {
      setLoad(false)
      console.log('uploadError', error)
      toast.error('Something went wrong, Try again!')
    }
  }


  const PdfComp = () => {
    const styles = StyleSheet.create({
      body: {
        paddingTop: 30,
        paddingBottom: 65,
        backgroundColor: "#f3f2f7",
        paddingRight: 30,
        paddingLeft: 30,
      },

      text1: {
        marginLeft: 30,
        fontSize: 15
      },

      table4: {
        display: "table",
        width: "auto",
        border: 1,
        padding: 10,
        marginBottom: 20,
      },

      tableCell4: {
        fontSize: 20
      },

      table: {
        display: "table",
        border: 1,
        borderBottomWidth: 0.5,
        marginBottom: 10
      },
      tableRow: {
        display: 'flex',
        flexDirection: "row",

      },

      tableCol8: {
        width: "35%",
        borderRightWidth: 1,

      },

      tableCol: {
        width: "35%",
        borderRightWidth: 1,
        borderBottomWidth: 0.5,

      },

      tableCell: {
        marginLeft: 8,
        marginTop: 5,
        fontSize: 14,
      },

      tableCell8: {
        margin: "auto",
        marginTop: 5,
        fontSize: 14,
        borderWidthRight: 1,
      },
      table1: {
        display: "table",
        marginBottom: 10,
        marginTop: 25,
        border: 1,
        borderBottomWidth: 0,
      },

      tableRow1: {
        margin: "auto",
        flexDirection: "row",
      },

      tableCol1: {
        width: "33.4%",
        border: "auto",
        borderRightWidth: 1,
        borderBottomWidth: 1,
      },
      tableCell1: {
        margin: "auto",
        marginTop: 5,
        fontSize: 14,

      },

      table2: {
        display: "table",
        border: 1,
        borderBottomWidth: 0,
        borderRightWidth: 0,
      },

      tableRow2: {
        width: 'auto',
        flexDirection: "row",
      },

      tableCol2: {
        borderWidth: "auto",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        width: 80,
        padding: 5,
      },

      tableCell2: {

        margin: 3,
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center',
        display: "flex",
        justifyContent: 'center',

      },

      image: {
        position: 'absolute',
        height: '104',
        width: '158',
      }
    })


    return (
      <Document>
        <Page size="A4" style={styles.body}>
          <View style={styles.table4}>
            <View style={styles.tableRow4}>
              <Text style={styles.tableCell4}>{`${bookingDetails?.bookingId} - ${bookingDetails?.companyDesc}`}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Reservation Id</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{bookingDetails?.bookingId}</Text>
              </View>
              <View style={{ padding: '10px' }}>
                {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
                {bookingDetails?.otA_Code === null ? <Image
                  // style={styles.image}
                  style={{ width: '125px', height: '70px' }}
                  src={require(`../../assets/images/logo/hostynnist-logo.png`)}
                // src="/images/quijote1.jpg"
                /> : OTALogoList.filter(a => a.Code === bookingDetails.otA_Code).map((a) => {
                  console.log('bookingDetails', a.Logo)
                  return (
                    <Image
                      style={{ width: '125px', height: '70px' }}
                      // style={styles.image}
                      src={require(`../../assets/images/OTA-Logo/${a.Logo}`)}
                    />
                  )
                })}
                {/* </div> */}
              </View>
            </View>
            {/* <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>CheckIn</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{moment(bookingDetails?.CheckInDate).format('DD-MM-YY')}</Text>
                  </View>
                </View> */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>CheckIn</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{moment(bookingDetails?.checkInDate).format('DD-MM-YY')}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>CheckOut</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{moment(bookingDetails?.checkOutDate).format('DD-MM-YY')}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Booking Date</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{moment(bookingDetails?.bookingTime).format('DD-MM-YY')}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Booking Through</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}></Text>
              </View>
            </View>
            {/* 
    
                
               
    
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{moment(bookingDetails?.BookingTime).format('DD-MM-YY')}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{moment(bookingDetails?.CheckOutDate).format('DD-MM-YY')}</Text>
                  </View>
                </View> */}
          </View>

          <Text style={styles.text1}>Hotel Name: {bookingDetails.hotelData[0]?.hotelName}</Text>
          <Text style={styles.text1}>Hotel Address: {bookingDetails.hotelData[0]?.addressLine}</Text>

          <View style={styles.table1}>
            <View style={styles.tableRow1}>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell1}>Guest Name</Text>
              </View>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell1}>Guest Email</Text>
              </View>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell1}>Guest Contact Number</Text>
              </View>
            </View>
            <View style={styles.tableRow1}>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell}>{bookingDetails?.guestName}</Text>
              </View>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell1}>{bookingDetails?.guestEmail}</Text>
              </View>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell1}>{bookingDetails?.guestMobileNumber}</Text>
              </View>
            </View>
          </View>
          <View style={styles.table2}>
            <View style={styles.tableRow2}>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>Sr.No</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>Room</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>No. of Rooms</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>Night</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>Adult</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>Child</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>Rate Plan</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell2}>Price Details</Text>
              </View>
            </View>
            {console.log(bookingDetails)}
            {
              bookingDetails?.roomData.map((v, i) => {
                return (
                  <View key={i} style={styles.tableRow2}>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{i + 1}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{v.roomDisplayName}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>1</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{bookingDetails?.totalNights}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{v?.adult}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{v?.children}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{v?.ratePlan}</Text>
                    </View>

                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{`${v?.roomRate}`}</Text>
                    </View>
                  </View>
                )
              })
            }
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', textAlign: 'right' }}>
            <View style={{ marginLeft: '310' }}>
              <Text style={{ marginTop: '30', fontSize: '14' }}>Sub Total without GST</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>Total Taxes</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>Advance Amount</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>Pending Amount</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>Total  Amount</Text>

            </View>
            <View style={{ marginLeft: '30' }}>
              <Text style={{ marginTop: '30', fontSize: '14' }}>{bookingDetails?.subTotal}</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>{(bookingDetails?.totalTax).toFixed(2)}</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>{bookingDetails?.recievedAmount}</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>{bookingDetails?.pendingAmount}</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>{bookingDetails?.totalAmount}</Text>
            </View>
          </View>
        </Page>
      </Document>
    )
  }
const fullInvoiceRef = useRef();
const fullInvoicePrint = useReactToPrint({
                          content: () => fullInvoiceRef.current,
                          documentTitle: "full-invoice",
                      });

  return (

    <>
      <Nav tabs>
        <NavItem key={1} className={SplitBillFlag ? "col-lg-6 fs-3 col-md-6 col-sm-6" : "col-lg-12 fs-3 col-md-12 col-sm-12"}>
          <NavLink
            active={active === 1}
            onClick={() => {
              toggle_tab(1)
            }}
          >
            Full Invoice
          </NavLink>
        </NavItem>
        {
          SplitBillFlag && (
            <NavItem sm="6" key={2} className="col-lg-6 fs-3 col-md-6 col-sm-6">
              <NavLink
                active={active === 2}
                onClick={() => {
                  toggle_tab(2)
                }}>
                Split Bill
              </NavLink>
            </NavItem>
          )
        }
      </Nav>
      <TabContent activeTab={active} >
        <TabPane tabId={1}>
          <div className="mainDiv p-2">
            <BlobProvider document={<PdfComp />} >
              {({ blob, url, loading, error }) => {
                return (
                  <div className='d-flex justify-content-between m-1'>
                    <Button.Ripple color='success' onClick={() => handleBlob(blob)}>{load ? <Spinner color='#FFF' /> : `Send Via Email`}</Button.Ripple>
                    <Button.Ripple color='warning' onClick={fullInvoicePrint}>{load ? <Spinner color='#FFF' /> : `Print Invoice`}</Button.Ripple>
                  </div>
                )
              }}
            </BlobProvider>
            <div className='mx-3' ref={fullInvoiceRef}>
            <h2 className='text-center fw-bold mb-3' style={{ color: 'black'}}>Invoice</h2>
            <Row className=''>
              <Col className='col-6'>
                <div className='contactDetail'>
                  <p className='fw-bold' style={{ color: 'black' }}>Guest ID: {guestData.guestID}</p>
                  <p>Name: {guestData.guestName}</p>
                  <p>Address: {guestData.guestAddress}</p>
                  <p>PinCode: {guestData.pincode}</p>
                  <p>City: {guestData.cityName}</p>
                  <p>State: {guestData.stateName}</p>
                  <p>Country: {guestData.countryName}</p>
                  <p>Email: {guestData.guestEmail}</p>
                  <p>Mobile Number: {guestData.guestMobileNumber}</p>
                </div>
              </Col>
              <Col className='col-6'>
                {console.log('hotelData', hotelData)}
                <img src={img} alt="" width={100} />

                <div>
                  <p className='fw-bold mt-2' style={{ color: 'black', fontSize: '20px' }}>Hotel Name: {hotelData.hotelName}</p>
                  <p>Address: {hotelData.addressLine}. {hotelData.postalCode}, {hotelData.countryName}</p>
                  <p className='fw-bold' style={{ color: 'black' }}>Hotel ID: {hotelData.propertyID}</p>
                  <p>GST IN: {hotelData.gstNumber}</p>
                  <p>Email: {hotelData.email}</p>
                  <p>Mobile Number: {hotelData.phoneNumber}</p>
                  <p>Website: {hotelData.webSIte}</p>
                </div>

              </Col>

            </Row>
            <Row className=''>
              <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Booking Info</h2>
              <Col className='col-6'>
                <div className='contactDetail'>
                  <p className='fw-bold' style={{ color: 'black' }}>Booking ID:{paymentTypeData.bookingMapID} </p>
                  <p >Check In: {moment(paymentTypeData.checkInDate).format('LLL')}</p>
                  <p>Check Out: {moment(paymentTypeData.checkOutDate).format('LLL')}</p>
                  <p>Total Stay ({paymentTypeData.totalNights > 1 ? `(Nights)` : `(Night)`}): {paymentTypeData.totalNights}</p>
                  <p>Payment Mode: {paymentTypeData.paymentMode}</p>
                  <p>Payment Type: {paymentTypeData.paymentType}</p>
                </div>
              </Col>
              <Col className='col-6'>
                <div>
                  <p>Invoice: {invoiceData === undefined ? `#${bookingDetails?.invoice}` : `#${invoiceData.invNo}`}</p>
                  <p>Date: {invoiceData === undefined ? moment(new Date()).format('LL') : moment(invoiceData.date).format('LL')}</p>
                  <p>GST: {hotelData.gstNumber}</p>
                  <p>Lisc No: {hotelData.propertyLicenseNumber}</p>
                </div>
              </Col>

            </Row>

            <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Booking Details</h2>
            <Table >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Room</th>
                  <th>Room No.</th>
                  <th>Guests</th>
                  <th>Meal/s</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {
                  roomData.map((r, rid) => {
                    return (
                      <tr>
                        <td>{moment(r.Date).format('LL')}</td>
                        <td>{r.roomDisplayName}</td>
                        <td>{r.roomNo ? r.roomNo : 'No room assigned'}</td>
                        <td><div>
                          <p> Adult: {r.adult}</p>
                          <p>Children: {r.children}</p>
                          <p>Infant: {r.infant}</p>
                        </div></td>
                        <td>{r.mealDetails}</td>
                        <td>{r.grossAmount}/-</td>
                      </tr>
                    )
                  })
                }
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th><div>
                    <p>Sub-total: {roomSummaryData.grossAmount}/-</p>
                    <p>Discount: {roomSummaryData.discount}/-</p>
                    <p>CGST: {roomSummaryData.cgsta}/-</p>
                    <p>SGST: {roomSummaryData.sgsta}/-</p>
                    {/* <p>Net: {roomSummaryData.NetAmount}/-</p> */}
                    <p>Payable Amount: {payableAmount.billAmount}/-</p>
                  </div></th>
                </tr>

              </tfoot>
            </Table>

            {
              addOnData.length > 0 ? (
                <>
                  <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Booking Details</h2>

                  <Table >
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Details</th>
                        <th>Charge</th>
                        <th>Tax</th>
                        <th>Discount</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        addOnData.map((r, rid) => {
                          return (
                            <tr>
                              <td>{r.serviceName}</td>
                              <td>{r.serviceDetails}</td>
                              <td>{r.sesrviceCharge}/-</td>
                              <td>{r.taxAmount}/-</td>
                              <td>{r.discount}/-</td>
                              <td>{r.totalAmount}/-</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                    <tfoot>
                      <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th><div>
                          <p>Subtotal: {addOnSummaryData.serviceCharge}/-</p>
                          <p>TAX: {addOnSummaryData.taxAmount}/-</p>
                          <p>Net: {addOnSummaryData.totalAmount}/-</p>
                          <p>Bill Amount: {payableAmount.billAmount}/-</p>
                        </div></th>
                      </tr>
                    </tfoot>
                  </Table>
                </>
              ) : null
            }

            {/* <p className='fw-bold text-center' style={{ color: 'black' }}>Payment Due: 16 June, 2023</p> */}
            <p className='fw-bold mt-1' style={{ color: 'black' }}>Please transfer the total amount due to our bank account below by the Payment Due date. Be sure to include INVOICE {invoiceData === undefined ? `#${bookingDetails?.invoice}` : `#${invoiceData.invNo}`} and ACCOMMODATION NUMBER 10134261 with your payment instructions.</p>
            <div className='mt-4'>
              <p>{hotelData.bankName}</p>
              <p>{hotelData.branch}</p>
              <p>SWIFT Code: NA</p>
              <p>IFSC CODE: {hotelData.ifsc}</p>
              <p>ACCOUNT: {hotelData.accountNumber}</p>
              <p>ACCOUNT HOLDER: NA</p>
              <p>ACCOUNT CURRENCY: NA</p>
              <p>Booking.com BV PAN #: NA</p>
            </div>
            <p className=' mt-2' style={{ color: 'red' }}>
              Payment should only be made electronically using ONLINE BANKING (select NEFT or RTGS option in your online banking platform). Cash payments are not accepted.
            </p>
            <p className='mt-2'>For making payments via UPI, please pay to Account number and IFSC code or via Virtual Payment Address. Virtual Payment Address (VPA) for Booking.com is "BOOKING(AccountNumber)@SC". For example if the account number above is 9900409XXXXXXX then the VPA is "BOOKING9900409XXXXXXX@SC". Payments are also enabled via WhatsApp using UPI ID and the UPI ID for Booking.com is the same as VPA.</p>
          </div>
          </div>
        </TabPane>
        {
          SplitBillFlag && (
            <TabPane tabId={2}>
              <Row className='d-flex flex-column justify-content-center align-items-center'>
                <Col className='m-1 text-center'>
                  <h1>Invoice <span className='fw-light fs-3'>(Split Bill)</span></h1>
                </Col>
                <Col className='w-75'>
                  {
                    splitArr.filter(b => b.hasOwnProperty('checkInGuestID')).map((b, bid) => {
                      console.log('splitArrbbb', b)
                      const result = (b.ROOM.AMT ?? 0) + (b.POS.AMT ?? 0) + (b.LAUNDARY.AMT ?? 0) + (b.EXTRA.AMT ?? 0);

                      // Format the result to have 2 digits after the decimal point
                      const formattedResult = result.toFixed(2);
                      console.log('bbb', b);
                      let roomData1 = split_roomData.filter(r => r.roomID === b.roomID)[0]
                      console.log('dataaaaa', b)
                        const componentRef = useRef();
                        const handlePrint = useReactToPrint({
                          content: () => componentRef.current,
                          documentTitle: "invoice",
                      });
                      return (
                        <>
                          <Accordion className='accordion-margin' open={open} toggle={toggle} key={bid}>
                            <AccordionItem>
                              <AccordionHeader targetId={bid + 1}>
                                {b.RoomNo} - {b.name}
                              </AccordionHeader>
                              <AccordionBody accordionId={bid + 1}>
                                <>
                                  <div className="mainDiv p-2">
                                    <BlobProvider document={<PdfComp />} >
                                      {({ blob, url, loading, error }) => {
                                        return (
                                          <Row className='m-1'>
                                            <Col>
                                              <Input
                                                type='email'
                                                id='split_user_email'
                                                placeholder='Enter email here'
                                                value={split_email}
                                                onChange={e => setSplit_email(e.target.value)}
                                                invalid={load && split_email === ''}
                                              />
                                            </Col>
                                            <Col>
                                              <Button.Ripple color='success' onClick={() => handleBlobWithEmail(blob)} disabled={split_email === ''}>Send Via Email</Button.Ripple>
                                            </Col>
                                            <Col style={{textAlign: 'end', width:'max-content'}}>
                                              <Button.Ripple color='warning' onClick={handlePrint}>{load ? <Spinner color='#FFF' /> : `Print Invoice`}</Button.Ripple>
                                            </Col>
                                          </Row>
                                        )
                                      }}
                                    </BlobProvider>
                                    {/* <div style={{ textAlign: 'end', marginTop: '-52px'}}>
                                      <button className='btn btn-warning' onClick={handlePrint}>
                                        print invoice
                                      </button>
                                    </div> */}
                                    


                                  <div className='m-5' ref={componentRef}>
                                  
                                    <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Invoice</h2>

                                    <Row className=''>
                                      <Col className='col-6'>
                                        <div className='contactDetail'>
                                          <p className='fw-bold' style={{ color: 'black' }}>Guest ID: {b.checkInGuestID}</p>
                                          <p>Name: {b?.name}</p>
                                          <p>Address: {guestData.guestAddress}</p>
                                          <p>PinCode: {guestData.pincode}</p>
                                          <p>City: {guestData.cityName}</p>
                                          <p>State: {guestData.stateName}</p>
                                          <p>Country: {guestData.countryName}</p>
                                          <p>Email: {guestData.guestEmail}</p>
                                          <p>Mobile Number: {guestData.guestMobileNumber}</p>
                                        </div>
                                      </Col>
                                      <Col className='col-6'>
                                        {console.log('hotelData', hotelData)}
                                        <img src={img} alt="" width={100} />

                                        <div>
                                          <p className='fw-bold mt-2' style={{ color: 'black', fontSize: '20px' }}>Hotel Name: {hotelData.hotelName}</p>
                                          <p>Address: {hotelData.AddressLine}. {hotelData.postalCode}, {hotelData.countryName}</p>
                                          <p className='fw-bold' style={{ color: 'black' }}>Hotel ID: {hotelData.propertyID}</p>
                                          <p>GST IN: {hotelData.gstNumber}</p>
                                          <p>Email: {hotelData.email}</p>
                                          <p>Mobile Number: {hotelData.phoneNumber}</p>
                                          <p>Website: {hotelData.webSIte}</p>
                                        </div>

                                      </Col>

                                    </Row>
                                    <Row className=''>
                                      <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Booking Info</h2>
                                      <Col className='col-6'>
                                        <div className='contactDetail'>
                                          <p className='fw-bold' style={{ color: 'black' }}>Booking ID:{paymentTypeData.bookingMapID} </p>
                                          <p >Check In: {moment(paymentTypeData.checkInDate).format('LLL')}</p>
                                          <p>Check Out: {moment(paymentTypeData.checkOutDate).format('LLL')}</p>
                                          <p>Total Stay ({paymentTypeData.totalNights > 1 ? `(Nights)` : `(Night)`}): {paymentTypeData.totalNights}</p>
                                          <p>Payment Mode: {paymentTypeData.paymentMode}</p>
                                          <p>Payment Type: {paymentTypeData.paymentType}</p>
                                        </div>
                                      </Col>
                                      <Col className='col-6'>
                                        <div>
                                          <p>Invoice: {invoiceData === undefined ? `#${bookingDetails?.invoice}` : `#${invoiceData.invNo}`}</p>
                                          <p>Date: {invoiceData === undefined ? moment(new Date()).format('LL') : moment(invoiceData.date).format('LL')}</p>
                                          <p>GST: {hotelData.gstNumber}</p>
                                          <p>Lisc No: {hotelData.propertyLicenseNumber}</p>
                                        </div>
                                      </Col>

                                    </Row>



                                    {
                                      b.ROOM.AMT && b.ROOM.AMT > 0 && (

                                        console.log('roomData', roomData1),
                                        <>
                                          <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Booking Details</h2>
                                          <Table >
                                            <thead>
                                              <tr>
                                                <th>Room</th>
                                                <th>Room No.</th>
                                                <th>Guests</th>
                                                <th>Meal/s</th>
                                                <th>Split Amt</th>
                                              </tr>
                                            </thead>
                                            <tbody>

                                              <tr>
                                                <td>{roomData1.roomType}</td>
                                                <td>{roomData1.roomNo}</td>
                                                {/* <td>{r.RoomNo ? r.RoomNo : 'No room assigned'}</td> */}
                                                <td><div>
                                                  <p> Adult: {roomData1.adult}</p>
                                                  <p>Children: {roomData1.children}</p>
                                                  <p>Infant: {roomData1.infant}</p>
                                                </div></td>
                                                <td>{roomData1.mealDetails}</td>
                                                <td>{b.ROOM.AMT}/-</td>
                                              </tr>
                                            </tbody>
                                            <tfoot>
                                              <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th><div>
                                                  <p>Room Split Amount: {b.ROOM.AMT.toFixed(2)}/-</p>
                                                  {/* <p>Discount: {roomSummaryData.Discount}/-</p>
                                                  <p>CGST: {roomSummaryData.CGSTA}/-</p>
                                                  <p>SGST: {roomSummaryData.SGSTA}/-</p>
                                                  <p>Net: {roomSummaryData.NetAmount}/-</p> */}
                                                  <p>Bill Amount:{formattedResult}/-</p>
                                                </div></th>
                                              </tr>

                                            </tfoot>
                                          </Table>


                                        </>
                                      )
                                    }

                                    {
                                      b.POS.AMT > 0 || b.LAUNDARY.AMT > 0 || b.EXTRA.AMT > 0 && (
                                        <>
                                          <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Add-On Services</h2>
                                          <Table >
                                            <thead>
                                              <tr>
                                                <th>Name</th>
                                                <th>Total</th>
                                                <th>Tax</th>
                                                <th>Split Amt</th>
                                              </tr>
                                            </thead>



                                            <tbody>
                                              {

                                                b.POS.AMT && b.POS.AMT > 0 && (

                                                  <tr>
                                                    <td>{b.POS.NAME}</td>
                                                    <td>{roomData1.psTotalAmount}</td>
                                                    <td>{roomData1.psTaxAmount}</td>
                                                    <td>{b.POS.AMT}/-</td>
                                                  </tr>
                                                )
                                              }

                                              {
                                                b.LAUNDARY.AMT && b.LAUNDARY.AMT > 0 && (
                                                  <tr>
                                                    <td>{b.LAUNDARY.NAME}</td>
                                                    <td>{roomData1.lsTotalAmount}</td>
                                                    <td>{roomData1.lsTaxAmount}</td>
                                                    <td>{b.LAUNDARY.AMT}/-</td>
                                                  </tr>
                                                )
                                              }

                                              {
                                                b.EXTRA.AMT && b.EXTRA.AMT > 0 && (
                                                  <tr>
                                                    <td>{b.EXTRA.NAME}</td>
                                                    <td>{roomData1.esTotalAmount}</td>
                                                    <td>{roomData1.edTaxAmount}</td>
                                                    <td>{b.EXTRA.AMT}/-</td>
                                                  </tr>
                                                )
                                              }

                                            </tbody>
                                            <tfoot>
                                              <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th><div>
                                                  <p>Service Split Amount: {(b.POS.AMT ?? 0) + (b.LAUNDARY.AMT ?? 0) + (b.EXTRA.AMT ?? 0)}/-</p>
                                                </div></th>
                                              </tr>

                                            </tfoot>
                                          </Table>
                                        </>
                                      )
                                    }

                                    {/* <Table >
                                      <thead>
                                        <tr>
                                          <th>Date</th>
                                          <th>Room</th>
                                          <th>Room No.</th>
                                          <th>Guests</th>
                                          <th>Meal/s</th>
                                          <th>Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {
                                          roomData.map((r, rid) => {
                                            return (
                                              <tr>
                                                <td>{moment(r.Date).format('LL')}</td>
                                                <td>{r.RoomDisplayName}</td>
                                                <td>{r.RoomNo ? r.RoomNo : 'No room assigned'}</td>
                                                <td><div>
                                                  <p> Adult: {r.Adult}</p>
                                                  <p>Children: {r.Children}</p>
                                                  <p>Infant: {r.Infant}</p>
                                                </div></td>
                                                <td>{r.MealDetails}</td>
                                                <td>{r.GrossAmount}/-</td>
                                              </tr>
                                            )
                                          })
                                        }
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <th></th>
                                          <th></th>
                                          <th></th>
                                          <th></th>
                                          <th></th>
                                          <th><div>
                                            <p>Sub-total: {roomSummaryData.GrossAmount}/-</p>
                                            <p>Discount: {roomSummaryData.Discount}/-</p>
                                            <p>CGST: {roomSummaryData.CGSTA}/-</p>
                                            <p>SGST: {roomSummaryData.SGSTA}/-</p>
                                            <p>Net: {roomSummaryData.NetAmount}/-</p>
                                            <p>Bill Amount: {payableAmount.BillAmount}/-</p>
                                          </div></th>
                                        </tr>

                                      </tfoot>
                                    </Table> */}

                                    {
                                      addOnData.length > 0 ? (
                                        <>
                                          <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Booking Details</h2>

                                          <Table >
                                            <thead>
                                              <tr>
                                                <th>Name</th>
                                                <th>Details</th>
                                                <th>Charge</th>
                                                <th>Tax</th>
                                                <th>Discount</th>
                                                <th>Total</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {
                                                addOnData.map((r, rid) => {
                                                  return (
                                                    <tr>
                                                      <td>{r.serviceName}</td>
                                                      <td>{r.serviceDetails}</td>
                                                      <td>{r.serviceCharge}/-</td>
                                                      <td>{r.taxAmount}/-</td>
                                                      <td>{r.discount}/-</td>
                                                      <td>{r.totalAmount}/-</td>
                                                    </tr>
                                                  )
                                                })
                                              }
                                            </tbody>
                                            <tfoot>
                                              <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th><div>
                                                  <p>Subtotal: {addOnSummaryData.serviceCharge}/-</p>
                                                  <p>TAX: {addOnSummaryData.taxAmount}/-</p>
                                                  <p>Net: {addOnSummaryData.totalAmount}/-</p>
                                                  <p>Bill Amount: {payableAmount.billAmount}/-</p>
                                                </div></th>
                                              </tr>
                                            </tfoot>
                                          </Table>
                                        </>
                                      ) : null
                                    }

                                    {/* <p className='fw-bold text-center' style={{ color: 'black' }}>Payment Due: 16 June, 2023</p> */}
                                    <p className='fw-bold mt-1' style={{ color: 'black' }}>Please transfer the total amount due to our bank account below by the Payment Due date. Be sure to include INVOICE {invoiceData === undefined ? `#${bookingDetails?.Invoice}` : `#${invoiceData.InvNo}`} and ACCOMMODATION NUMBER 10134261 with your payment instructions.</p>
                                    <div className='mt-4'>
                                      <p>{hotelData.bankName}</p>
                                      <p>{hotelData.branch}</p>
                                      <p>SWIFT Code: NA</p>
                                      <p>IFSC CODE: {hotelData.ifsc}</p>
                                      <p>ACCOUNT: {hotelData.accountNumber}</p>
                                      <p>ACCOUNT HOLDER: NA</p>
                                      <p>ACCOUNT CURRENCY: NA</p>
                                      <p>Booking.com BV PAN #: NA</p>
                                    </div>
                                    <p className=' mt-2' style={{ color: 'red' }}>
                                      Payment should only be made electronically using ONLINE BANKING (select NEFT or RTGS option in your online banking platform). Cash payments are not accepted.
                                    </p>
                                    <p className='mt-2'>For making payments via UPI, please pay to Account number and IFSC code or via Virtual Payment Address. Virtual Payment Address (VPA) for Booking.com is "BOOKING(AccountNumber)@SC". For example if the account number above is 9900409XXXXXXX then the VPA is "BOOKING9900409XXXXXXX@SC". Payments are also enabled via WhatsApp using UPI ID and the UPI ID for Booking.com is the same as VPA.</p>
                                  </div>
                                  </div>
                                </>
                              </AccordionBody>
                            </AccordionItem>
                          </Accordion>
                        </>
                      )
                    })
                  }
                </Col>
                {console.log('billArr', splitArr)}
              </Row>
            </TabPane>
          )
        }
      </TabContent>




    </>
  )
}

export default Invoice1;