import React, { useEffect, useRef, useState } from 'react'
import { Row, Spinner, Table } from 'reactstrap'
import Avatar from '@components/avatar'
import { useReactToPrint } from 'react-to-print';
import { Button } from 'reactstrap'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import moment from 'moment';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, BlobProvider, PDFViewer, usePDF, Image } from '@react-pdf/renderer';
import axiosInstance, { Image_base_uri } from '../../API/axios';
import axios from 'axios'
import { height } from '@mui/system';

const Voucher = () => {

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

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, HotelName, PropertyID } = getUserData

  const [load, setLoad] = useState(false)

  const handleBlob = async (newBlob) => {
    const myFile = new File([newBlob], `Voucher_${bookingDetails?.BookingId}.pdf`, {
      type: newBlob.type,
    });
    console.log('myFile', myFile);

    let newDocData = new FormData()
    newDocData.append('file', myFile)
    newDocData.append('ToEMail', bookingDetails?.GuestEmail)
    newDocData.append('Name', bookingDetails?.GuestName)
    newDocData.append('BookingID', bookingDetails?.BookingId)
    newDocData.append('HotelName', bookingDetails.hotelData[0]?.HotelName)
    newDocData.append('HotelLogo', bookingDetails.hotelData[0]?.LogoFile)
    newDocData.append('EmailAddress', bookingDetails.hotelData[0]?.Email)
    newDocData.append('PhoneNumber', bookingDetails.hotelData[0]?.PhoneNumber)
    newDocData.append('City', bookingDetails.hotelData[0]?.CityName)
    newDocData.append('Address', bookingDetails.hotelData[0]?.AddressLine)
    newDocData.append('Adults', bookingDetails?.roomData.reduce((acc, obj) => { return acc + obj.Adult }, 0))
    newDocData.append('Children', bookingDetails?.roomData.reduce((acc, obj) => { return acc + obj.Children }, 0))
    newDocData.append('CheckInDate', moment(bookingDetails?.CheckInDate).format('LLL'))
    newDocData.append('CheckOutDate', moment(bookingDetails?.CheckOutDate).format('LLL'))
    newDocData.append('Total', bookingDetails?.TotalAmount)
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
              <Text style={styles.tableCell4}>{`${bookingDetails?.BookingId} - ${bookingDetails?.CompanyDesc}`}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Reservation Id</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{bookingDetails?.BookingId}</Text>
              </View>
              <View style={{ padding: '10px' }}>
                {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
                {bookingDetails?.OTA_Code === null ? <Image
                  // style={styles.image}
                  style={{ width: '125px', height: '70px' }}
                  src={require(`../../assets/images/logo/hostynnist-logo.png`)}
                // src="/images/quijote1.jpg"
                /> : OTALogoList.filter(a => a.Code === bookingDetails.OTA_Code).map((a) => {
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
                <Text style={styles.tableCell}>{moment(bookingDetails?.CheckInDate).format('DD-MM-YY')}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>CheckOut</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{moment(bookingDetails?.CheckOutDate).format('DD-MM-YY')}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Booking Date</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{moment(bookingDetails?.BookingTime).format('DD-MM-YY')}</Text>
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

          <Text style={styles.text1}>Hotel Name: {bookingDetails.hotelData[0]?.HotelName}</Text>
          <Text style={styles.text1}>Hotel Address: {bookingDetails.hotelData[0]?.AddressLine}</Text>

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
                <Text style={styles.tableCell}>{bookingDetails?.GuestName}</Text>
              </View>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell1}>{bookingDetails?.GuestEmail}</Text>
              </View>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell1}>{bookingDetails?.GuestMobileNumber}</Text>
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
                      <Text style={styles.tableCell2}>{v.RoomDisplayName}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>1</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{bookingDetails?.TotalNights}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{v?.Adult}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{v?.Children}</Text>
                    </View>
                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{v?.RatePlan}</Text>
                    </View>

                    <View style={styles.tableCol2}>
                      <Text style={styles.tableCell2}>{`${v?.RoomRate}`}</Text>
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
              <Text style={{ marginTop: '30', fontSize: '14' }}>{bookingDetails?.SubTotal}</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>{(bookingDetails?.TotalTax).toFixed(2)}</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>{bookingDetails?.RecievedAmount}</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>{bookingDetails?.PendingAmount}</Text>
              <Text style={{ marginTop: '20', fontSize: '14' }}>{bookingDetails?.TotalAmount}</Text>
            </View>
          </View>
        </Page>
      </Document>
    )
  }

  return (
    <>
      <div>
        <BlobProvider document={<PdfComp />} >
          {({ blob, url, loading, error }) => {
            return (
              <div className='m-1 text-end'>
                <Button.Ripple color='success' onClick={() => handleBlob(blob)}>{load ? <Spinner color='#FFF' /> : `Send Via Email`}</Button.Ripple>
              </div>
            )
          }}
        </BlobProvider>
        <Row className='ps-1 text-center'>
          <PDFViewer
            className='vh-100 vw-100'
            showToolbar={true}
            children={<PdfComp />}
          />
        </Row>
      </div>
    </>
  )
}

export default Voucher