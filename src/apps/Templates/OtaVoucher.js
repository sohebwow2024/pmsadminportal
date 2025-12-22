import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import axios, { Image_base_uri } from '../../API/axios'
import Avatar from '@components/avatar'
import { Button, Row, Spinner } from 'reactstrap';
import moment from 'moment';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, BlobProvider, PDFViewer, usePDF, Image } from '@react-pdf/renderer';
import toast from 'react-hot-toast';
import { height } from '@mui/system';
// import Agoda from '../../assets/images/OTA-Logo/Goibibo_logo.png'

const OtaVoucher = () => {

    const getUserData = useSelector((state) => state.userManageSlice.userData)
    const { LoginID, Token, HotelName, PropertyID, CompanyID } = getUserData;

    const getOtaBookingData = useSelector((state) => state.voucherSlice.bookingData)
    const bookingData = JSON.parse(getOtaBookingData[0][0]?.booking_json)
    const roomData = JSON.parse(getOtaBookingData[0][0].rooms)
    console.log('getOtaBookingData', getOtaBookingData[3][0]);
    const channelData = getOtaBookingData[3][0]
    const { id } = useParams()
    // console.log('otabookingID', otabookingID);
    const [hotelData, setHotelData] = useState([])
    const [otaData, setOtaData] = useState([])
    const [roomNames, setRoomNames] = useState('')
    const [data, setData] = useState([])
    const [cust_data, setCust_data] = useState([])
    // const [roomData, setRoomData] = useState([])
    // const [bookingData, setBookingData] = useState([])
    const [extraData, setExtraData] = useState([])
    // const [channelData, setChannelData] = useState([])
    console.log('channelData', channelData.otA_Code);
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

    const getBookingData = async () => {
        try {
            const res = await axios.get(`booking/GetReservationFromSTAAH/${id}`, {
                headers: {
                    LoginID,
                    Token,
                }
            })
            console.log('res', res.data[3][0])
            setData(res?.data)
            setCust_data(JSON.parse(res?.data[0][0].customer))
            // setRoomData(JSON.parse(res?.data[0][0].Rooms))
            // setBookingData(JSON.parse(res?.data[0][0]?.booking_json))
            setExtraData(res?.data[0][0])
            // setChannelData(res?.data[3][0])
        } catch (error) {
            console.log("Error", error);
        }
    }
    // const getImage = async () => {
    //     try {
    //         const res = await axios.get(`booking/GetOTALogo/${channelData?.OTA_Code}`, {
    //             headers: {
    //                 LoginID,
    //                 Token,
    //             }
    //         })
    //         console.log('res', res.data)
    //     } catch (error) {
    //         console.log("Error", error);
    //     }
    // }

    const getRoomName = async () => {
        try {
            let obj = {
                LoginID,
                Token,
                Seckey: "abc",
                Event: "select"
            }
            const res = await axios.post(`/getdata/bookingdata/roomdetails`, obj)
            // console.log('RoomNameres', res)
            let result = res?.data[0].map(r => {
                return { RoomID: r.roomID, Name: r.roomDisplayName }
            })
            setRoomNames(result)
        } catch (error) {
            console.log('error', error)
        }
    }

    const getHotelInfo = async () => {
        try {
            const res = await axios.get(`/property/hotel?id=${PropertyID}&LoginID=${LoginID}&Token=${Token}`)
            setHotelData(res?.data[0][0])
            console.log('hotelRes', res)
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getBookingData()
        getRoomName()
        getHotelInfo()
        // getImage()
    }, [])

    const getOTAphoto = async () => {
        try {
            const res = await axios.get(`/booking/getotalogo/244`, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('otaData', res.data[0][0])
            setOtaData(res?.data[0][0])
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getOTAphoto()
    }, [channelData])

    const NameByRoomID = (rid) => {
        let roomObj = roomNames && roomNames.filter(n => n?.roomID === rid)
        return roomObj[0]?.Name
    }

    const handleBlob = async (newBlob) => {
        const myFile = new File([newBlob], `Voucher_${bookingData?.reservations[0]?.id}.pdf`, {
            type: newBlob.type,
        });
        console.log('myFile', myFile);

        let newDocData = new FormData()
        newDocData.append('file', myFile)
        newDocData.append('ToMail', cust_data?.email)
        newDocData.append('Name', cust_data?.first_name)
        newDocData.append('BookingID', bookingData?.reservations[0]?.id)
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
                margin: "auto",
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
                {console.log('dataaaa', bookingData)}
                <Page size="A4" style={styles.body}>
                    <View style={styles.table4}>
                        <View style={styles.tableRow4}>
                            <Text style={styles.tableCell4}>{`${bookingData && bookingData?.reservations[0]?.id} - ${HotelName}`}</Text>
                        </View>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Reservation Id</Text>
                            </View>
                            <View style={styles.tableCol8}>
                                <Text style={styles.tableCell8}>Check in</Text>
                            </View>
                            <View style={{ padding: '10px' }}>
                                {/* <Image
                                    style={styles.image}
                                    src={require(`../../assets/images/logo/hostynnist-logo.png`)}
                                /> */}
                                {console.log(`${Image_base_uri}${otaData.Logo}`)}
                                {/* <Image
                                    style={styles.image}
                                    src={require(`../../assets/images/OTA-Logo/Goibibo_logo.png`)}
                                /> */}
                                {channelData.OTA_Code === null ? <Image
                                    // style={styles.image}
                                    style={{ width: '125px', height: '70px' }}
                                    src={require(`../../assets/images/logo/hostynnist-logo.png`)}
                                /> : OTALogoList.filter(a => a.Code === channelData.otA_Code).map((a) => {
                                    console.log('channelData', a.Logo)
                                    return (
                                        <Image
                                            // style={styles.image}
                                            style={{ width: '125px', height: '70px' }}
                                            src={require(`../../assets/images/OTA-Logo/${a.Logo}`)}
                                        />
                                    )
                                })}

                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{bookingData?.reservations[0]?.id}</Text>
                            </View>
                            <View style={styles.tableCol8}></View>
                            <View style={styles.tableRow}></View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{bookingData?.reservations[0]?.paymenttype}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{moment(roomData[0]?.arrival_date).format('DD-MM-YY')}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Booking Date</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Check-Out</Text>
                            </View>
                        </View>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{moment(bookingData?.reservations[0]?.booked_at).format('DD-MM-YY')}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{moment(roomData[0]?.departure_date).format('DD-MM-YY')}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.text1}>Hotel Name: {hotelData?.HotelName}</Text>
                    <Text style={styles.text1}>Hotel Address: {hotelData?.addressLine}</Text>

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
                                <Text style={styles.tableCell}>{`${cust_data?.first_name} ${cust_data?.last_name}`}</Text>
                            </View>
                            <View style={styles.tableCol1}>
                                <Text style={styles.tableCell1}>{cust_data?.email}</Text>
                            </View>
                            <View style={styles.tableCol1}>
                                <Text style={styles.tableCell1}>{cust_data?.telephone}</Text>
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
                        {
                            roomData.length > 0 && roomData?.map((i, idx) => {
                                let a = moment(i.arrival_date)
                                let b = moment(i.departure_date)
                                let nights = b.diff(a, 'days')
                                return (
                                    <View key={idx} style={styles.tableRow2}>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell2}>{idx + 1}</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell2}>{NameByRoomID(i?.id)}</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell2}>1</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell2}>{nights}</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell2}>{i?.numberofadults}</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell2}>{i?.numberofchildren}</Text>
                                        </View>
                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell2}>{i?.price[0]?.rate_id}</Text>
                                        </View>

                                        <View style={styles.tableCol2}>
                                            <Text style={styles.tableCell2}>{`${i?.price[0]?.priceaftertax}/-`}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    {
                        roomData[0].addons && roomData[0]?.addons !== (null || undefined) && (
                            <View style={styles.table2}>
                                <View style={styles.tableRow2}>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}>Sr.No</Text>
                                    </View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}>Service/addons</Text>
                                    </View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}>Nights</Text>
                                    </View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}>Price Per Unit</Text>
                                    </View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}></Text>
                                    </View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}></Text>
                                    </View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}></Text>
                                    </View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}></Text>
                                    </View>
                                    <View style={styles.tableCol2}>
                                        <Text style={styles.tableCell2}>Price</Text>
                                    </View>
                                </View>
                                {
                                    roomData && roomData[0]?.addons.map((a, idx) => {
                                        return (
                                            <View key={idx} style={styles.tableRow2}>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}>{idx + 1}</Text>
                                                </View>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}>{a?.name}</Text>
                                                </View>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}>{a?.nights}</Text>
                                                </View>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}>{a?.priceperunit}</Text>
                                                </View>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}></Text>
                                                </View>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}></Text>
                                                </View>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}></Text>
                                                </View>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}></Text>
                                                </View>
                                                <View style={styles.tableCol2}>
                                                    <Text style={styles.tableCell2}>{`${a?.price}/-`}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        )
                    }

                    <View style={{ display: 'flex', flexDirection: 'row', textAlign: 'right' }}>
                        <View style={{ marginLeft: '310' }}>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>Sub Total without GST</Text>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>Total Taxes</Text>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>Advance Amount</Text>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>Pending Amount</Text>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>Total  Amount</Text>

                        </View>
                        <View style={{ marginLeft: '30' }}>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>{Number(extraData?.totalprice) - Number(extraData?.totaltax)}</Text>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>{extraData?.totaltax}</Text>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>{0}</Text>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>{extraData?.totalprice}</Text>
                            <Text style={{ marginTop: '15', fontSize: '14' }}>{extraData?.totalprice}</Text>
                        </View>
                    </View>
                </Page>
            </Document >
        )
    }

    return (
        <>
            <div>
                {/* <BlobProvider document={<PdfComp />} >
                    {({ blob, url, loading, error }) => {
                        return (
                            <div className='m-1 text-end'>
                                <Button.Ripple color='success' onClick={() => handleBlob(blob)}>{load ? <Spinner color='#FFF' /> : `Send Via Email`}</Button.Ripple>
                            </div>
                        )
                    }}
                </BlobProvider> */}
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

    // return (
    //     <>
    //         {console.log('data', data)}
    //         {console.log('cust_data', cust_data)}
    //         {console.log('roomData', roomData)}
    //         {console.log('bookingData', bookingData)}
    //         {console.log('extraData', extraData)}
    //         {console.log('channelData', channelData)}
    //         {console.log('roomNames', roomNames)}
    //         {
    //             roomData.length > 0 && (
    //                 <div className='mx-5' >
    //                     <h3 className='mt-5 p-1 border border-top-2 border-dark border-bottom-2  border-left-0'>{`${bookingData?.reservations[0]?.id} - ${HotelName}`}</h3>
    //                     {/* <h3 className='mt-5 p-1 border border-top-2 border-dark border-bottom-2  border-left-0'>{`${bookingDetails?.GuestID} - ${bookingDetails?.CompanyDesc}`}</h3> */}
    //                     <table className="table table-bordered" >

    //                         <tbody >
    //                             <tr>
    //                                 <th scope="col" style={{ width: '10%' }} rowSpan={5}></th>
    //                                 <td className='fs-5 py-1' style={{ width: '20%' }}>Reservation ID</td>
    //                                 <td className='fs-5 py-1' style={{ width: '20%' }} rowSpan={2}>Check-In</td>
    //                                 <td className='fs-5 py-1' style={{ width: '50%' }} rowSpan={5}>
    //                                     {
    //                                         otaData && otaData.LogoFile ? (
    //                                             <img
    //                                                 src={otaData.LogoFile}
    //                                                 alt='OTA LOGO'
    //                                                 width="100%"
    //                                                 height="100%"
    //                                             />
    //                                         ) : (
    //                                             <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`)} />
    //                                         )
    //                                     }
    //                                 </td>
    //                             </tr>
    //                             <tr>

    //                                 <td className='fs-5 py-1'>{bookingData?.reservations[0]?.id}</td>
    //                                 {/* <td className='fs-5 py-1'>{bookingDetails?.GuestID} </td> */}

    //                             </tr>
    //                             <tr>

    //                                 <td className='fs-5 py-1'>{bookingData?.reservations[0]?.paymenttype}</td>
    //                                 {/* <td className='fs-5 py-1'>{bookingDetails?.PaymentType}</td> */}
    //                                 <td className='fs-5 py-1'>{moment(roomData[0]?.arrival_date).format('DD-MM-YY')}</td>
    //                                 {/* <td className='fs-5 py-1'>{moment(bookingDetails?.CheckInDate).format('DD-MM-YY')}</td> */}

    //                             </tr>
    //                             <tr>

    //                                 <td className='fs-5 py-1' >Booking Date</td>
    //                                 <td className='fs-5 py-1'>Check-Out</td>
    //                             </tr>
    //                             <tr>

    //                                 <td className='fs-5 py-1' >{moment(bookingData?.reservations[0]?.booked_at).format('DD-MM-YY')}</td>
    //                                 {/* <td className='fs-5 py-1' >{moment(bookingDetails?.BookingTime).format('DD-MM-YY')}</td> */}
    //                                 <td className='fs-5 py-1'>{moment(roomData[0]?.departure_date).format('DD-MM-YY')}</td>
    //                                 {/* <td className='fs-5 py-1'>{moment(bookingDetails?.CheckOutDate).format('DD-MM-YY')}</td> */}
    //                             </tr>
    //                         </tbody>
    //                     </table>
    //                     <div className='d-flex flex-row justify-content-between'>
    //                         <div>
    //                             <h5>Hotel Name</h5>
    //                             <h5>Hotel Address</h5>
    //                         </div>
    //                         <div>
    //                             <p>{hotelData?.HotelName}</p>
    //                             <p>{hotelData?.AddressLine}</p>
    //                         </div>
    //                         <div>
    //                         </div>
    //                     </div>
    //                     <table className="table table-sm align-middle table-bordered">
    //                         <thead className=''>
    //                             <tr>
    //                                 <th>Guest Name</th>
    //                                 <th>Guest Email</th>
    //                                 <th>Guest Contact Number</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             <tr>
    //                                 <td className='fs-5'>{`${cust_data?.first_name} ${cust_data?.last_name}`}</td>
    //                                 <td className='fs-5'>{cust_data?.email}</td>
    //                                 <td className='fs-5'>{cust_data?.telephone}</td>
    //                                 {/* <td className='fs-5'>{bookingDetails?.GuestName}</td>
    //                         <td className='fs-5'>{bookingDetails?.GuestEmail}</td>
    //                         <td className='fs-5'>{bookingDetails?.GuestMobileNumber}</td> */}
    //                             </tr>
    //                         </tbody>
    //                     </table>
    //                     <table className="table  table-bordered" >
    //                         <tbody>
    //                             <tr>
    //                                 <th style={{ width: '10%' }} >Sr.No</th>
    //                                 <td className='fs-5 py-1' >Room</td>
    //                                 <td className='fs-5 py-1'  >No. of Rooms</td>
    //                                 <td className='fs-5 py-1'  >night</td>
    //                                 <td className='fs-5 py-1'  >Adult</td>
    //                                 <td className='fs-5 py-1'  >Child</td>
    //                                 <td className='fs-5 py-1'  >Rate Plan</td>
    //                                 <td className='fs-5 py-1'  >Check-in/out details</td>
    //                                 <td className='fs-5 py-1'  >Price Details</td>
    //                             </tr>
    //                             {
    //                                 roomData.length > 0 && roomData?.map((i, idx) => {
    //                                     let a = moment(i.arrival_date)
    //                                     let b = moment(i.departure_date)
    //                                     let nights = b.diff(a, 'days')
    //                                     return (
    //                                         <tr>
    //                                             <td className='fs-5 py-1'>{idx + 1}</td>
    //                                             <td className='fs-5 py-1'>{NameByRoomID(i?.id)}</td>
    //                                             {/* <td className='fs-5 py-1' >{v?.NoOfRooms || "1"}</td> */}
    //                                             <td className='fs-5 py-1' >{"1"}</td>
    //                                             <td className='fs-5 py-1' >{nights}</td>
    //                                             <td className='fs-5 py-1' >{i?.numberofadults}</td>
    //                                             <td className='fs-5 py-1' >{i?.numberofchildren}</td>
    //                                             <td className='fs-5 py-1' >{i?.price[0]?.rate_id}</td>
    //                                             <td className='fs-5 py-1' >{`${moment(i.arrival_date).format('LL')} - ${moment(i.departure_date).format('LL')}`}</td>
    //                                             <td className='fs-5 py-1' >{`${i?.price[0]?.priceaftertax}/-`}</td>
    //                                         </tr>
    //                                     )
    //                                 })
    //                             }
    //                             <tr>
    //                                 <th style={{ width: '10%' }} >Sr.No</th>
    //                                 <td className='fs-5 py-1' >Service/addons</td>
    //                                 <td className='fs-5 py-1' >Nights</td>
    //                                 <td className='fs-5 py-1' >Price Per Unit</td>
    //                                 <td className='fs-5 py-1' ></td>
    //                                 <td className='fs-5 py-1' ></td>
    //                                 <td className='fs-5 py-1' ></td>
    //                                 <td className='fs-5 py-1' ></td>
    //                                 <td className='fs-5 py-1' >Price</td>
    //                             </tr>

    //                             {
    //                                 roomData && roomData[0]?.addons.map((a, idx) => {
    //                                     return (
    //                                         <tr>
    //                                             <td className='fs-5 py-1'>{idx + 1}</td>
    //                                             <td className='fs-5 py-1'>{a?.name}</td>
    //                                             <td className='fs-5 py-1' >{a?.nights}</td>
    //                                             <td className='fs-5 py-1' >{a?.priceperunit}</td>
    //                                             <td className='fs-5 py-1' ></td>
    //                                             <td className='fs-5 py-1' ></td>
    //                                             <td className='fs-5 py-1' ></td>
    //                                             <td className='fs-5 py-1' ></td>
    //                                             <td className='fs-5 py-1' >{`${a?.price}/-`}</td>
    //                                         </tr>
    //                                     )
    //                                 })
    //                             }

    //                             <tr>
    //                                 <td colSpan={7}></td>
    //                                 <td className='fs-5 py-1' >Sub Total without GST</td>
    //                                 <td className='fs-5 py-1'>{Number(extraData?.totalprice) - Number(extraData?.totaltax)}</td>
    //                                 {/* <td className='fs-5 py-1'>{bookingDetails?.SubTotal}</td> */}
    //                             </tr>
    //                             <tr>
    //                                 <td colSpan={7}></td>
    //                                 <td className='fs-5 py-1'>Total Taxes</td>
    //                                 <td className='fs-5 py-1'>{extraData?.totaltax}</td>
    //                                 {/* <td className='fs-5 py-1'>{bookingDetails?.TotalTax}</td> */}
    //                             </tr>
    //                             <tr>
    //                                 <td colSpan={7}></td>
    //                                 <td className='fs-5 py-1'>Advance Amount</td>
    //                                 <td className='fs-5 py-1'>{0}</td>
    //                                 {/* <td className='fs-5 py-1'>{bookingDetails?.RecievedAmount}</td> */}
    //                             </tr>
    //                             <tr>
    //                                 <td colSpan={7}></td>
    //                                 <td className='fs-5 py-1'>Pending Amount</td>
    //                                 <td className='fs-5 py-1'>{extraData?.totalprice}</td>
    //                                 {/* <td className='fs-5 py-1'>{bookingDetails?.PendingAmount}</td> */}
    //                             </tr>
    //                             <tr>
    //                                 <td colSpan={7}></td>
    //                                 <td className='fs-5 py-1'>Total Booking Amount</td>
    //                                 <td className='fs-5 py-1'>{extraData?.totalprice}</td>
    //                                 {/* <td className='fs-5 py-1'>{bookingDetails?.TotalAmount}</td> */}
    //                             </tr>


    //                         </tbody>
    //                     </table>
    //                     <div className='d-flex justify-content-end py-1'>
    //                         <Button onClick={() => toast.error('Sorry! not implemented yet')} className='m-1 ' color='success'>
    //                             Send Via Email
    //                         </Button>
    //                         <Button className='m-1' color='primary' >
    //                             Download Voucher
    //                         </Button>
    //                     </div>

    //                 </div>
    //             )
    //         }

    //     </>
    // )
}

export default OtaVoucher