
import moment from 'moment'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Spinner } from 'reactstrap'
import { Col, Row, Table } from 'reactstrap'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, BlobProvider, PDFViewer, usePDF, Image } from '@react-pdf/renderer';
import booking from '../../assets/images/OTA-Logo/booking.com.jpeg'
import toast from 'react-hot-toast';
import axios from 'axios'
import axiosInstance, { Image_base_uri } from '../../API/axios';
const Voucher1 = () => {

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, HotelName, PropertyID } = getUserData
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

  const bookingDetails = useSelector(state => state.voucherSlice.bookingDetails)
  console.log("bookingData", bookingDetails)
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
              {/* <View style={styles.tableCol2}>
                    <Text style={styles.tableCell2}>Price Details</Text>
                  </View> */}
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


  return (
    <>
      <div className="mainDiv p-2">
        <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Voucher</h2>
        <BlobProvider document={<PdfComp />} >
          {({ blob, url, loading, error }) => {
            return (
              <div className='m-1 text-end'>
                <Button.Ripple color='success' onClick={() => handleBlob(blob)} style={{ top: '-50px' }}>{load ? <Spinner color='#FFF' /> : `Send Via Email`}</Button.Ripple>
              </div>
            )
          }}
        </BlobProvider>
        <Row className=''>
          <Col className='col-6'>
            <div className='contactDetail'>
              <p className='fw-bold' style={{ color: 'black' }}>Guest ID: {bookingDetails.guestID}</p>
              <p>Name: {bookingDetails.guestName}</p>
              <p>Address: {bookingDetails.guestAddress}</p>
              <p>PinCode: {bookingDetails.pincode}</p>
              <p>City: {bookingDetails.cityName}</p>
              <p>State: {bookingDetails.stateName}</p>
              <p>Country: {bookingDetails.countryName}</p>
              <p>Email: {bookingDetails.guestEmail}</p>
              <p>Mobile Number: {bookingDetails.guestMobileNumber}</p>
            </div>
          </Col>
          <Col className='col-6'>
            {/* <Image
                      style={{ width: '125px', height: '70px' }}
                      // style={styles.image}
                      src={require(`../../assets/images/OTA-Logo/${a.Logo}`)}
                    /> */}
            {OTALogoList.filter(a => a.Code === bookingDetails.otA_).map((a) => {
              return (
                <img src={`../../assets/images/OTA-Logo/${a.Logo}`} alt="" width={100} />
              )
            })}

            <div>
              <p className='fw-bold mt-2' style={{ color: 'black', fontSize: '20px' }}>Hotel Name: {bookingDetails.hotelName}</p>
              <p>Address: {bookingDetails.addressLine}. {bookingDetails.postalCode}, {bookingDetails.countryName}</p>
              <p className='fw-bold' style={{ color: 'black' }}>Hotel ID: {bookingDetails.propertyID}</p>
              <p>GST IN: {bookingDetails.gstNumber}</p>
              <p>Email: {bookingDetails.email}</p>
              <p>Mobile Number: {bookingDetails.phoneNumber}</p>
              <p>Website: {bookingDetails.webSIte}</p>
            </div>

          </Col>

        </Row>
        <Row className=''>
          <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Booking Info</h2>
          <Col className='col-6'>
            <div className='contactDetail'>
              <p className='fw-bold' style={{ color: 'black' }}>Booking ID:{bookingDetails.bookingId} </p>
              <p >Check In: {moment(bookingDetails.checkInDate).format('LLL')}</p>
              <p>Check Out: {moment(bookingDetails.checkOutDate).format('LLL')}</p>
              <p>Total Stay ({bookingDetails.totalNights > 1 ? `(Nights)` : `(Night)`}): {bookingDetails.totalNights}</p>
              <p>Payment Mode: {bookingDetails.paymentMode}</p>
              <p>Payment Type: {bookingDetails.paymentType}</p>
            </div>
          </Col>
          <Col className='col-6'>
            <div>
              {/* <p>Invoice: {bookingDetails === undefined ? `#${bookingDetails?.Invoice}` : `#${bookingDetails.InvNo}`}</p> */}
              {/* <p>BookingId: {bookingDetails.BookingId}</p> */}
              <p>Date: {bookingDetails === undefined ? moment(new Date()).format('LL') : moment(bookingDetails.date).format('LL')}</p>
              <p>GST: {bookingDetails.gstNumber}</p>
              <p>Lisc No: {bookingDetails.propertyLicenseNumber}</p>
            </div>
          </Col>

        </Row>

        <h2 className='text-center fw-bold my-2' style={{ color: 'black' }}>Booking Details</h2>
        <Table >
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Room</th>
              <th>No Of Rooms</th>
              <th>Night</th>
              <th>Adult</th>
              <th>Child</th>
              <th>Rate Plan</th>
              {/* <th>Price Details</th> */}
            </tr>
          </thead>
          <tbody>
            {
              bookingDetails?.roomData.map((r, rid) => {
                return (
                  <tr>
                    <td>{rid + 1}</td>
                    <td>{r.roomDisplayName}</td>
                    <td>1</td>
                    <td>{bookingDetails?.totalNights}</td>
                    <td>{r.adult}</td>
                    <td>{r.children}</td>
                    <td>{r.ratePlan}</td>
                    <td>{r.roomRate}</td>

                  </tr>
                )
              })
            }
          </tbody>
        </Table>
        <div className='voucherDiv mt-2'>
          <p style={{ fontWeight: '600', color: '#000000', fontSize: '22px', paddingBottom: '10px', textAlign: 'right' }}>Price Details</p>
          {/* <p >Sub Total without GST: {bookingDetails?.SubTotal}</p>
          <p >Total Taxes: {(bookingDetails?.TotalTax).toFixed(2)}</p> */}
          <p >Advance Amount: {bookingDetails?.recievedAmount}</p>
          <p >Pending Amount: {bookingDetails?.pendingAmount}</p>
          <p >Total  Amount: {bookingDetails?.totalAmount}</p>
        </div>

        {/* {
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
                                                    <td>{r.ServiceName}</td>
                                                    <td>{r.ServiceDetails}</td>
                                                    <td>{r.ServiceCharge}/-</td>
                                                    <td>{r.TaxAmount}/-</td>
                                                    <td>{r.Discount}/-</td>
                                                    <td>{r.TotalAmount}/-</td>
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
                                            <p>Subtotal: {addOnSummaryData.ServiceCharge}/-</p>
                                            <p>TAX: {addOnSummaryData.TaxAmount}/-</p>
                                            <p>Net: {addOnSummaryData.TotalAmount}/-</p>
                                            <p>Bill Amount: {payableAmount.BillAmount}/-</p>
                                        </div></th>
                                    </tr>
                                </tfoot>
                            </Table>
                        </>
                    ) : null
                } */}
        <div>
          {/* <p className='fw-bold text-center' style={{ color: 'black' }}>Payment Due: 16 June, 2023</p> */}
          <p className='fw-bold mt-1' style={{ color: 'black' }}>Please transfer the total amount due to our bank account below by the Payment Due date. Be sure to include INVOICE  and ACCOMMODATION NUMBER 10134261 with your payment instructions.</p>
        </div>
        <div className='mt-4'>
          <p>{bookingDetails.bankName}</p>
          <p>{bookingDetails.branch}</p>
          <p>SWIFT Code: NA</p>
          <p>IFSC CODE: {bookingDetails.ifsc}</p>
          <p>ACCOUNT: {bookingDetails.accountNumber}</p>
          <p>ACCOUNT HOLDER: NA</p>
          <p>ACCOUNT CURRENCY: NA</p>
          <p>Booking.com BV PAN #: NA</p>
        </div>
        <p className=' mt-2' style={{ color: 'red' }}>
          Payment should only be made electronically using ONLINE BANKING (select NEFT or RTGS option in your online banking platform). Cash payments are not accepted.
        </p>
        <p className='mt-2'>For making payments via UPI, please pay to Account number and IFSC code or via Virtual Payment Address. Virtual Payment Address (VPA) for Booking.com is "BOOKING(AccountNumber)@SC". For example if the account number above is 9900409XXXXXXX then the VPA is "BOOKING9900409XXXXXXX@SC". Payments are also enabled via WhatsApp using UPI ID and the UPI ID for Booking.com is the same as VPA.</p>
      </div>
    </>
  )
}

export default Voucher1