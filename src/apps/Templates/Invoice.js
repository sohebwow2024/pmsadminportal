import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardBody, CardText, Row, Col, Table, ListGroup, ListGroupItem, Button, Spinner, Accordion, AccordionItem, AccordionHeader, AccordionBody, Input, Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import Avatar from "@components/avatar"
import axios from '../../API/axios';
import { Image_base_uri } from '../../API/axios';
import { useSelector } from "react-redux"
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, BlobProvider, PDFViewer, usePDF, Image } from '@react-pdf/renderer';
import moment from 'moment'
import toast from 'react-hot-toast'
import { store } from '@store/store'
import { openLinkInNewTab } from '../../common/commonMethods'
import { setInvoiceID, setPosInvoiceID } from '../../redux/voucherSlice';
import Agoda from '../../assets/images/OTA-Logo/1 Staah.png'

const Invoice = () => {
    const componentRef = useRef();

    const [show, setShow] = useState(true)

    const getUserData = useSelector((state) => state.userManageSlice.userData)
    const { LoginID, Token, HotelName } = getUserData;

    const bookingDetails = useSelector(state => state.voucherSlice.bookingDetails)

    const data = useSelector(state => state.voucherSlice.invoiceDetails)
    console.log('data', data)

    // const [data, setData] = useState([])
    const [hotelData] = useState(data[0][0])
    const [invoiceData] = useState(data[1][0])
    const [guestData] = useState(data[2][0])
    const [companyData] = useState(data[3][0])
    const [paymentTypeData] = useState(data[4][0])
    const [roomData] = useState(data[5])
    const [roomSummaryData] = useState(data[6][0])
    const [addOnData] = useState(data[7])
    const [addOnSummaryData] = useState(data[8][0])
    const [payableAmount] = useState(data[9][0])
    const [SplitBillFlag] = useState(data[10][0].isSplitBill)
    const [splitArr] = useState(data[10][0].isSplitBill ? JSON.parse(data[10][0].JSON_SplitBill) : [])
    const [split_guestData] = useState(data[10][0].isSplitBill ? JSON.parse(data[10][0]?.JSON_SplitBill).filter(i => i.hasOwnProperty('guestData'))[0].guestData : [])
    const [split_roomData] = useState(data[10][0].isSplitBill ? JSON.parse(data[10][0]?.JSON_SplitBill).filter(i => i.hasOwnProperty('roomData'))[0].roomData : [])
    const [split_serviceData] = useState(data[10][0].isSplitBill ? JSON.parse(data[10][0]?.JSON_SplitBill).filter(i => i.hasOwnProperty('serviceData'))[0].serviceData : [])
    const [split_email, setSplit_email] = useState('')
    const [laundary_arr, setLaundary_arr] = useState([])
    const [pos_arr, setPos_arr] = useState([])
    const [load, setLoad] = useState(false)

    console.log('split_guestData', split_guestData)
    console.log('split_roomData', split_roomData)
    console.log('split_serviceData', split_serviceData)
    console.log('roomdata', roomData);
    const [active, setActive] = useState(1);

    const toggle_tab = (tab) => {
        if (active !== tab) {
            setActive(tab);
        }
    };

    const getExtraServiceIDS = async id => {
        try {
            const res = await axios.get('/booking/extraservice/GetByBookingId', {
                params: {
                    LoginID,
                    Token,
                    BookingID: id
                }
            })
            console.log('existingService', res)
            let result = res?.data[0]
            let laundary = result.filter(serv => serv.ServiceName === "LaundaryService")
            let pos = result.filter(serv => serv.ServiceName === "POSService")
            setPos_arr(pos)
            setLaundary_arr(laundary)
        } catch (error) {
            console.log('Extra service err', error)
        }
    }

    useEffect(() => {
        if (paymentTypeData.BookingMapID) {
            getExtraServiceIDS(paymentTypeData.BookingMapID)
        }
    }, [paymentTypeData])

    console.log('laundary_arr', laundary_arr)
    console.log('pos_arr', pos_arr)

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => { setTimeout(() => window.close(), 1000) }
    })

    useEffect(() => {
        setShow(false)
        handlePrint()
    }, [data])

    const handleBlob = async (newBlob) => {
        const myFile = new File([newBlob], `Invoice_${paymentTypeData.BookingMapID}.pdf`, {
            type: newBlob.type,
        });
        console.log('myFile', myFile);

        let newDocData = new FormData()
        newDocData.append('file', myFile)
        newDocData.append('ToEMail', guestData?.GuestEmail)
        newDocData.append('Name', guestData?.GuestName)
        newDocData.append('BookingID', paymentTypeData.BookingMapID)
        newDocData.append('HotelName', hotelData.HotelName)
        newDocData.append('HotelLogo', hotelData.LogoFile)
        newDocData.append('EmailAddress', hotelData.Email)
        newDocData.append('PhoneNumber', hotelData.PhoneNumber)
        newDocData.append('City', hotelData.CityName)
        newDocData.append('Address', hotelData.AddressLine)
        newDocData.append('Adults', roomData.reduce((acc, obj) => { return acc + obj.Adult }, 0))
        newDocData.append('Children', roomData.reduce((acc, obj) => { return acc + obj.Children }, 0))
        newDocData.append('CheckInDate', moment(paymentTypeData?.CheckInDate).format('LLL'))
        newDocData.append('CheckOutDate', moment(paymentTypeData.CheckOutDate).format('LLL'))
        newDocData.append('Total', payableAmount.BillAmount)
        try {
            setLoad(true)
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
                toast.success(res?.data)
            }
        } catch (error) {
            setLoad(false)
            console.log('uploadError', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    const handleBlobWithEmail = async (newBlob) => {
        const myFile = new File([newBlob], `Invoice_${paymentTypeData.BookingMapID}.pdf`, {
            type: newBlob.type,
        });
        setLoad(true)
        if (split_email !== '') {

            let newDocData = new FormData()
            newDocData.append('file', myFile)
            newDocData.append('ToEMail', split_email)
            newDocData.append('Name', guestData?.GuestName)
            newDocData.append('BookingID', paymentTypeData.BookingMapID)
            newDocData.append('HotelName', hotelData.HotelName)
            newDocData.append('HotelLogo', hotelData.LogoFile)
            newDocData.append('EmailAddress', hotelData.Email)
            newDocData.append('PhoneNumber', hotelData.PhoneNumber)
            newDocData.append('City', hotelData.CityName)
            newDocData.append('Address', hotelData.AddressLine)
            newDocData.append('Adults', roomData.reduce((acc, obj) => { return acc + obj.Adult }, 0))
            newDocData.append('Children', roomData.reduce((acc, obj) => { return acc + obj.Children }, 0))
            newDocData.append('CheckInDate', moment(paymentTypeData?.CheckInDate).format('LLL'))
            newDocData.append('CheckOutDate', moment(paymentTypeData.CheckOutDate).format('LLL'))
            newDocData.append('Total', payableAmount.BillAmount)

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

    const PdfComp = () => {

        const styles = StyleSheet.create({
            body: {
                paddingTop: 35,
                paddingBottom: 65,
                paddingHorizontal: 35,
            },

            adjus: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            },
            adjus1: {
                display: "flex",
                flexDirection: "row",
                // justifyContent: "space-between",
            },

            bott: {
                marginBottom: 5,
                fontSize: 10,
            },

            bott2: {
                marginBottom: 5,
                fontSize: 10,
                width: 150,
                textTransform: 'capitalize'
            },
            bott3: {
                marginBottom: 5,
                fontSize: 10,
                width: 200,
                textTransform: 'capitalize'
            },

            bott1: {
                marginBottom: 5,
                fontSize: 15,
            },
            mainHeading: {
                marginBottom: 5,
                fontSize: 15,
                textAlign: "center",
            },
            center: {
                textAlign: "center",
            },

            maihead: {
                fontSize: 15,
                fontWeight: "lighter",
            },

            maihead1: {
                fontSize: 15,
                fontWeight: "lighter",
                marginBottom: 10,
            },

            border: {
                border: 0.3,
                marginTop: 20,
            },

            image: {
                height: 30,
                width: 30,
                marginBottom: 10,
                borderRadius: 50,
            },
            header: {
                fontSize: 12,
                marginBottom: 20,
                textAlign: "center",
                color: "grey",
            },
            pageNumber: {
                position: "absolute",
                fontSize: 12,
                bottom: 30,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "grey",
            },
            margin: {
                marginLeft: 55
            },
            index: {
                zIndex: 999
            }
        });
        const img = `${Image_base_uri}${hotelData.LogoFile1}`
        console.log('img', img);
        return (
            <Document>
                <Page size="A4" style={styles.body}>
                    <View>
                        <Text style={styles.mainHeading}>{invoiceData === undefined ? 'Proforma Invoice' : 'Invoice'}</Text>
                    </View>
                    <View style={styles.adjus1}>
                        <View>
                            <Text style={styles.bott}>Invoice: {invoiceData === undefined ? `#${bookingDetails?.Invoice}` : `#${invoiceData.InvNo}`}</Text>
                            <Text style={styles.bott}>Date: {invoiceData === undefined ? moment(new Date()).format('LL') : moment(invoiceData.Date).format('LL')}</Text>
                            <Text style={styles.bott}>GST: {hotelData.GSTNumber}</Text>
                            <Text style={styles.bott}>Lisc No: {hotelData.PropertyLicenseNumber}</Text>
                        </View>
                        <View style={styles.margin}>
                            <Text style={styles.bott1}>{hotelData.HotelName}</Text>
                            <Text wrap={true} style={styles.bott3}>{hotelData.AddressLine}. {hotelData.PostalCode}, {hotelData.CountryName}</Text>
                            {/* <Text style={styles.bott}>{hotelData.PostalCode}, {hotelData.CountryName}</Text> */}
                            {/* <Text style={styles.bott}>{hotelData.WebSIte}</Text> */}
                            <Text style={styles.bott}>{hotelData.PhoneNumber}</Text>
                        </View>
                        <View>
                            {console.log('logocheck', `${Image_base_uri}${hotelData.LogoFile1}`, 'http://commondatastorage.googleapis.com/codeskulptor-assets/lathrop/asteroid_blend.png')}

                            <Image src="${Image_base_uri}${hotelData.LogoFile1}" />
                        </View>

                    </View>
                    <View style={styles.center}><Text style={styles.maihead}>{companyData.isCompany ? 'Company Details' : 'Guest Details'}</Text></View>
                    <View style={styles.adjus}>
                        <View>
                            {
                                companyData.isCompany ? (
                                    <>
                                        <Text style={styles.bott}>{paymentTypeData.BookingMapID}</Text>
                                        <Text style={styles.bott}>{companyData?.GuestCompanyName}</Text>
                                        <Text style={styles.bott}>{companyData?.GuestCompanyAddress}</Text>
                                        <Text style={styles.bott}>{companyData?.GuestCompanyGST}</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.bott}>{paymentTypeData.BookingMapID}</Text>
                                        <Text style={styles.bott}>{guestData?.GuestName}</Text>
                                        <Text style={styles.bott}>{guestData?.GuestAddress} - {guestData.Pincode}</Text>
                                        <Text style={styles.bott}>{guestData?.GuestEmail}</Text>
                                        <Text style={styles.bott}>{guestData?.GuestMobileNumber}</Text>
                                    </>
                                )
                            }
                        </View>
                        <View>
                            <Text style={styles.bott}>Check In: {moment(paymentTypeData.CheckInDate).format('LLL')}</Text>
                            <Text style={styles.bott}>Check Out: {moment(paymentTypeData.CheckOutDate).format('LLL')}</Text>
                            <Text style={styles.bott}>Total Stay ({paymentTypeData.TotalNights > 1 ? `(Nights)` : `(Night)`}): {paymentTypeData.TotalNights}</Text>
                            <Text style={styles.bott}>Payment Mode: {paymentTypeData.PaymentMode}</Text>
                            <Text style={styles.bott}>Payment Type: {paymentTypeData.PaymentType}</Text>
                        </View>
                    </View>
                    <View style={styles.center}><Text style={styles.maihead1}>Booking Details</Text></View>
                    <View>
                        <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '10', }}>
                            <Text style={{ flex: 1, fontSize: '11' }}>Date</Text>
                            <Text style={{ flex: 1, fontSize: '11' }}>Room </Text>
                            <Text style={{ flex: 1, fontSize: '11' }}>Room No.</Text>
                            <Text style={{ flex: 1, fontSize: '11' }}>Guests</Text>
                            <Text style={{ flex: 1, fontSize: '11' }}>Meal/s</Text>
                            <Text style={{ flex: 0.4, fontSize: '11' }}>Amount</Text>
                        </View>
                        {
                            roomData.map((r, rid) => {
                                return (
                                    <>
                                        <View key={rid + 1} style={{ display: 'flex', flexDirection: 'row', marginBottom: '15', }}>
                                            <Text style={{ flex: 0.9, fontSize: '9' }}>{moment(r.Date).format('LL')}</Text>
                                            <Text style={{ flex: 1, fontSize: '9', }}>{r.RoomDisplayName}</Text>
                                            <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{r.RoomNo ? r.RoomNo : 'No room assigned'}</Text>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ flex: 1, fontSize: '9', marginBottom: '10' }}> Adult: {r.Adult}</Text>
                                                <Text style={{ flex: 1, fontSize: '9', marginBottom: '10' }}> Children: {r.Children}</Text>
                                                <Text style={{ flex: 1, fontSize: '9', }}> Infant: {r.Infant}</Text>
                                            </View>
                                            <Text style={{ flex: 1, fontSize: '9' }}>{r.MealDetails}</Text>
                                            <Text style={{ flex: 0.4, fontSize: '9' }}>{r.GrossAmount}/-</Text>
                                        </View>
                                    </>
                                )
                            })
                        }
                        <View style={{ textAlign: 'right' }}>
                            <Text style={{ fontSize: '10', marginBottom: '8' }}>Sub-total: {roomSummaryData.GrossAmount}/-</Text>
                            <Text style={{ fontSize: '10', marginBottom: '8' }}>Discount: {roomSummaryData.Discount}/-</Text>
                            <Text style={{ fontSize: '10', marginBottom: '8' }}>CGST: {roomSummaryData.CGSTA}/-</Text>
                            <Text style={{ fontSize: '10', marginBottom: '8' }}>SGST: {roomSummaryData.SGSTA}/-</Text>
                            <Text style={{ fontSize: '10', marginBottom: '8' }}>Net: {roomSummaryData.NetAmount}/-</Text>
                        </View>
                        {
                            addOnData.length > 0 ? (
                                <>
                                    <View style={styles.center}><Text style={styles.maihead1}>Add-On Services</Text></View>
                                    <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '20', }}>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Name</Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Details</Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Charge</Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Tax</Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Discount</Text>
                                        <Text style={{ flex: 0.3, fontSize: '11' }}>Total</Text>
                                    </View>
                                    {
                                        addOnData.map((r, rid) => {
                                            console.log('gfsghdfghds', r);
                                            return (
                                                <View key={rid} style={{ display: 'flex', flexDirection: 'row', marginBottom: '60' }}>
                                                    <Text style={{ flex: 0.9, fontSize: '9' }}>{r.ServiceName}</Text>
                                                    <Text style={{ flex: 1.2, fontSize: '9', }}>{r.ServiceDetails}</Text>
                                                    <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{r.ServiceCharge}/-</Text>
                                                    <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{r.TaxAmount}/-</Text>
                                                    <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{r.Discount}/-</Text>
                                                    <Text style={{ flex: 0.4, fontSize: '9' }}>{r.TotalAmount}/-</Text>
                                                </View>
                                            )
                                        })
                                    }

                                    <View style={{ textAlign: 'right' }}>
                                        <Text style={{ fontSize: '10', marginBottom: '10' }}>Subtotal: {addOnSummaryData.ServiceCharge}/-</Text>
                                        <Text style={{ fontSize: '10', marginBottom: '10' }}>TAX: {addOnSummaryData.TaxAmount}/-</Text>
                                        <Text style={{ fontSize: '10', marginBottom: '10' }}>Net: {addOnSummaryData.TotalAmount}/-</Text>
                                    </View>
                                </>
                            ) : null
                        }
                        <View style={{ textAlign: 'right' }}>
                            <Text style={{ fontSize: '12', marginTop: '10' }}>Bill Amount: {payableAmount.BillAmount}/-</Text>
                        </View>
                        <View style={styles.border}></View>
                        <View style={styles.center}><Text style={{ fontSize: '8', marginTop: '10', fontStyle: 'italic', fontWeight: 'lighter', }}>It was a pleasure serving you, hoping to see you soon. Thank You!</Text></View>

                    </View>

                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />

                </Page>
            </Document>
        )
    }

    const PdfCompSplit = ({ data }) => {

        const styles = StyleSheet.create({
            body: {
                paddingTop: 35,
                paddingBottom: 65,
                paddingHorizontal: 35,
            },

            adjus: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            },

            bott: {
                marginBottom: 5,
                fontSize: 10,
            },

            bott2: {
                marginBottom: 5,
                fontSize: 10,
                width: 150,
                textTransform: 'capitalize'
            },

            bott1: {
                marginBottom: 5,
                fontSize: 15,
            },

            center: {
                textAlign: "center",
            },

            maihead: {
                fontSize: 15,
                fontWeight: "lighter",
            },

            maihead1: {
                fontSize: 15,
                fontWeight: "lighter",
                marginBottom: 10,
            },

            border: {
                border: 0.3,
                marginTop: 20,
            },

            image: {
                height: 30,
                width: 30,
                marginBottom: 10,
                borderRadius: 50,
            },
            header: {
                fontSize: 12,
                marginBottom: 20,
                textAlign: "center",
                color: "grey",
            },
            pageNumber: {
                position: "absolute",
                fontSize: 12,
                bottom: 30,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "grey",
            },
        });

        let roomData = split_roomData.filter(r => r.RoomID === data.RoomID)[0]
        console.log('dataaaaa', roomData)
        const img = `${Image_base_uri}${hotelData.LogoFile1}`
        console.log('img1', img);
        return (
            <Document>
                <Page size="A4" style={styles.body}>
                    <View>
                        <Text style={styles.mainHeading}>{invoiceData === undefined ? 'Proforma Invoice' : 'Invoice'}</Text>
                    </View>
                    <View style={styles.adjus}>
                        <View>
                            <Text style={styles.bott1}>{hotelData.HotelName}</Text>
                            <Text wrap={true} style={styles.bott2}>{hotelData.AddressLine}</Text>
                            <Text style={styles.bott}>{hotelData.PostalCode}, {hotelData.CountryName}</Text>
                            <Text style={styles.bott}>{hotelData.WebSIte}</Text>
                            <Text style={styles.bott}>{hotelData.PhoneNumber}</Text>
                        </View>
                        <View>
                            {/* <Image
                                style={styles.image}
                                // src="https://picsum.photos/id/1/200/300"
                                src={img}
                            /> */}

                            {/* <img src={img} alt="" />
                            <Avatar className='my-1' size="lg" img={`${Image_base_uri}${hotelData.LogoFile1}`} alt='logo' /> */}
                        </View>
                        <View>
                            <Text style={styles.bott}>Invoice: {invoiceData === undefined ? `#${bookingDetails?.Invoice}` : `#${invoiceData.InvNo}`}</Text>
                            <Text style={styles.bott}>Date: {invoiceData === undefined ? moment(new Date()).format('LL') : moment(invoiceData.Date).format('LL')}</Text>
                            <Text style={styles.bott}>GST: {hotelData.GSTNumber}</Text>
                            <Text style={styles.bott}>Lisc No: {hotelData.PropertyLicenseNumber}</Text>
                        </View>
                    </View>
                    <View style={styles.center}><Text style={styles.maihead}>{companyData.isCompany ? 'Company Details' : 'Guest Details'}</Text></View>
                    <View style={styles.adjus}>
                        <View>
                            {
                                companyData.isCompany ? (
                                    <>
                                        <Text style={styles.bott}>{paymentTypeData.BookingMapID}</Text>
                                        <Text style={styles.bott}>{companyData?.GuestCompanyName}</Text>
                                        <Text style={styles.bott}>{companyData?.GuestCompanyAddress}</Text>
                                        <Text style={styles.bott}>{companyData?.GuestCompanyGST}</Text>
                                    </>
                                ) : (
                                    <>
                                        < Text style={styles.bott}>{paymentTypeData.BookingMapID}</Text>
                                        <Text style={styles.bott}>{data?.Name}</Text>
                                        {/* <Text style={styles.bott}>{guestData?.GuestAddress} - {guestData.Pincode}</Text> */}
                                        {/* <Text style={styles.bott}>{guestData?.GuestEmail}</Text> */}
                                        {/* <Text style={styles.bott}>{guestData?.GuestMobileNumber}</Text> */}
                                    </>
                                )
                            }
                        </View>
                        <View>
                            <Text style={styles.bott}>Check In: {moment(paymentTypeData.CheckInDate).format('LLL')}</Text>
                            <Text style={styles.bott}>Check Out: {moment(paymentTypeData.CheckOutDate).format('LLL')}</Text>
                            <Text style={styles.bott}>Total Stay ({paymentTypeData.TotalNights > 1 ? `(Nights)` : `(Night)`}): {paymentTypeData.TotalNights}</Text>
                            <Text style={styles.bott}>Payment Mode: {paymentTypeData.PaymentMode}</Text>
                            <Text style={styles.bott}>Payment Type: {paymentTypeData.PaymentType}</Text>
                        </View>
                    </View>

                    <View>
                        {
                            data.ROOM.AMT && data.ROOM.AMT > 0 && (
                                <>
                                    <View style={styles.center}><Text style={styles.maihead1}>Booking Details</Text></View>
                                    <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '10', }}>
                                        {/* <Text style={{ flex: 1, fontSize: '11' }}>Date</Text> */}
                                        <Text style={{ flex: 1, fontSize: '11' }}>Room </Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Room No.</Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Guests</Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Meal/s</Text>
                                        <Text style={{ flex: 0.4, fontSize: '11' }}>Split Amt</Text>
                                    </View>

                                    <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '15', }}>
                                        {/* <Text style={{ flex: 0.9, fontSize: '9' }}>{moment(r.Date).format('LL')}</Text> */}
                                        <Text style={{ flex: 1, fontSize: '9', }}>{roomData.RoomType}</Text>
                                        <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{roomData.RoomNo}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ flex: 1, fontSize: '9', marginBottom: '10' }}> Adult: {roomData.Adult}</Text>
                                            <Text style={{ flex: 1, fontSize: '9', marginBottom: '10' }}> Children: {roomData.Children}</Text>
                                            <Text style={{ flex: 1, fontSize: '9', }}> Infant: {roomData.Infant}</Text>
                                        </View>
                                        <Text style={{ flex: 1, fontSize: '9' }}>{roomData.MealDetails}</Text>
                                        <Text style={{ flex: 0.4, fontSize: '9' }}>{data.ROOM.AMT}/-</Text>
                                    </View>

                                    <View style={{ textAlign: 'right' }}>
                                        {/* <Text style={{ fontSize: '10', marginBottom: '8' }}>Sub-total: {Math.round(data.ROOM.AMT - ((data.ROOM.IGST_P / 100) * data.ROOM.AMT))}/-</Text> */}
                                        {/* <Text style={{ fontSize: '10', marginBottom: '8' }}>Discount: {roomSummaryData.Discount}/-</Text> */}
                                        {/* <Text style={{ fontSize: '10', marginBottom: '8' }}>CGST: {(data.ROOM.CGST_P / 100) * data.ROOM.AMT}/-</Text> */}
                                        {/* <Text style={{ fontSize: '10', marginBottom: '8' }}>SGST: {(data.ROOM.SGST_P / 100) * data.ROOM.AMT}/-</Text> */}
                                        {/* <Text style={{ fontSize: '10', marginBottom: '8' }}>Net: {data.ROOM.AMT}/-</Text> */}
                                        <Text style={{ fontSize: '10', marginBottom: '8' }}>Room Split Amount: {data.ROOM.AMT}/-</Text>
                                    </View>
                                </>
                            )
                        }

                        {
                            data.POS.AMT > 0 || data.LAUNDARY.AMT > 0 || data.EXTRA.AMT > 0 && (
                                <>
                                    <View style={styles.center}><Text style={styles.maihead1}>Add-On Services</Text></View>
                                    <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '20', }}>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Name</Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Total</Text>
                                        <Text style={{ flex: 1, fontSize: '11' }}>Tax</Text>
                                        {/* <Text style={{ flex: 1, fontSize: '11' }}>Charge</Text> */}
                                        <Text style={{ flex: 0.3, fontSize: '11' }}>Split Amt.</Text>
                                    </View>

                                    {
                                        data.POS.AMT && data.POS.AMT > 0 && (
                                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '15', }}>
                                                <Text style={{ flex: 0.9, fontSize: '9' }}>{data.POS.NAME}</Text>
                                                <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{roomData.PSTotalAmount}/-</Text>
                                                <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{roomData.PSTaxAmount}/-</Text>
                                                <Text style={{ flex: 0.3, fontSize: '9' }}>{data.POS.AMT}/-</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        data.LAUNDARY.AMT && data.LAUNDARY.AMT > 0 && (
                                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '15', }}>
                                                <Text style={{ flex: 0.9, fontSize: '9' }}>{data.LAUNDARY.NAME}</Text>
                                                <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{roomData.LSTotalAmount}/-</Text>
                                                <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{roomData.LSTaxAmount}/-</Text>
                                                <Text style={{ flex: 0.3, fontSize: '9' }}>{data.LAUNDARY.AMT}/-</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        data.EXTRA.AMT && data.EXTRA.AMT > 0 && (
                                            <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '15', }}>
                                                <Text style={{ flex: 0.9, fontSize: '9' }}>{data.EXTRA.NAME}</Text>
                                                {/* <Text style={{ flex: 1.2, fontSize: '9', }}>{r.ServiceDetails}</Text> */}
                                                <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{roomData.ESTotalAmount}/-</Text>
                                                <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>{roomData.ESTaxAmount}/-</Text>
                                                <Text style={{ flex: 0.3, fontSize: '9' }}>{data.EXTRA.AMT}/-</Text>
                                            </View>
                                        )
                                    }

                                    <View style={{ textAlign: 'right' }}>
                                        {/* <Text style={{ fontSize: '10', marginBottom: '10' }}>Subtotal: {((data.POS.AMT ?? 0) - (data.POS.TAX ?? 0)) + ((data.LAUNDARY.AMT ?? 0) - (data.LAUNDARY.TAX ?? 0)) + ((data.EXTRA.AMT ?? 0) - (data.EXTRA.TAX ?? 0))}/-</Text> */}
                                        {/* <Text style={{ fontSize: '10', marginBottom: '10' }}>TAX: {(data.POS.TAX ?? 0) + (data.LAUNDARY.TAX ?? 0) + (data.EXTRA.TAX ?? 0)}/-</Text> */}
                                        <Text style={{ fontSize: '10', marginBottom: '10' }}>Service Split Amount: {(data.POS.AMT ?? 0) + (data.LAUNDARY.AMT ?? 0) + (data.EXTRA.AMT ?? 0)}/-</Text>
                                    </View>
                                </>
                            )
                        }

                        <View style={{ textAlign: 'right' }}>
                            <Text style={{ fontSize: '12', marginTop: '10' }}>Bill Amount: {(data.ROOM.AMT ?? 0) + (data.POS.AMT ?? 0) + (data.LAUNDARY.AMT ?? 0) + (data.EXTRA.AMT ?? 0)}/-</Text>
                        </View>
                        <View style={styles.border}></View>
                        <View style={styles.center}><Text style={{ fontSize: '8', marginTop: '10', fontStyle: 'italic', fontWeight: 'lighter', }}>It was a pleasure serving you, hoping to see you soon. Thank You!</Text></View>

                    </View>

                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />

                </Page>
            </Document >
        )
    }

    const [open, setOpen] = useState(1)
    const toggle = (id) => {
        if (open === id) {
            setOpen();
        } else {
            setOpen(id);
        }
    }

    const [laun_model, setLaun_model] = useState(false)
    const [pos_model, setPos_model] = useState(false)
    const handleLaun_model = () => setLaun_model(!laun_model)
    const handlePos_model = () => setPos_model(!pos_model)

    const handleLaundaryInv = (id) => {
        openLinkInNewTab('/laundryInvoice')
        store.dispatch(setInvoiceID(id))
    }

    const handlePosInv = (id) => {
        openLinkInNewTab("/posInvoice")
        store.dispatch(setPosInvoiceID(id))
    }

    const Laundary_invoice = () => {
        return (
            <>
                <Modal
                    isOpen={laun_model}
                    toggle={handleLaun_model}
                    className='modal-dialog-centered modal-md'
                    backdrop={true}
                >
                    <ModalHeader toggle={() => handleLaun_model()}>Laundary Invoices</ModalHeader>
                    <ModalBody>
                        {
                            laundary_arr.map((l, i) => {
                                return (
                                    <Row>
                                        <Col>{l.ServiceId}</Col>
                                        <Col><Button size='sm' className='m-1' color='success' onClick={() => handleLaundaryInv(l.ServiceId)}>Print Invoice</Button></Col>
                                    </Row>
                                )
                            })
                        }
                    </ModalBody>
                </Modal>
            </>
        )
    }

    const Pos_invoice = () => {
        return (
            <>
                <Modal
                    isOpen={pos_model}
                    toggle={handlePos_model}
                    className='modal-dialog-centered modal-md'
                    backdrop={true}
                >
                    <ModalHeader toggle={() => handlePos_model()}>Laundary Invoices</ModalHeader>
                    <ModalBody>
                        {
                            pos_arr.map((l, i) => {
                                return (
                                    <Row className='d-flex flex-row jsutify-content-center align-items-center'>
                                        <Col>{l.InvoiceID}</Col>
                                        <Col>
                                            <Button size='sm' className='m-1' color='success' onClick={() => handlePosInv(l.InvoiceID)}>Print Invoice</Button>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                    </ModalBody>
                </Modal>
            </>
        )
    }

    return (
        <>
            <Row>
                <Col className='m-1'>
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
                            <Row>
                                <Col>
                                    <BlobProvider document={<PdfComp />} >
                                        {({ blob, url, loading, error }) => {
                                            return (
                                                <Row className='m-1'>
                                                    <Col className='d-flex flex-row justify-content-evenly'>
                                                        {laundary_arr.length > 0 && laundary_arr.length === 1 ? (
                                                            <Button.Ripple className='m-1' color='success' onClick={() => handleLaundaryInv(laundary_arr[0].ServiceId)}>Print Laundary Invoice</Button.Ripple>
                                                        ) : laundary_arr.length > 1 ? (
                                                            <Button className='m-1' color='primary' onClick={() => handleLaun_model()}>Laundary Invoices</Button>
                                                        ) : null}
                                                        {pos_arr.length > 0 && pos_arr.length === 1 ? (
                                                            <Button.Ripple className='m-1' color='success' onClick={() => handlePosInv(pos_arr[0].InvoiceID)}>Print POS Invoice</Button.Ripple>
                                                        ) : pos_arr.length > 1 ? (
                                                            <Button className='m-1' color='primary' onClick={() => handlePos_model()}>POS Invoices</Button>
                                                        ) : null}
                                                        <Button.Ripple className='m-1' color='success' onClick={() => handleBlob(blob)}>{load ? <Spinner color='#FFF' /> : `Send Via Email`}</Button.Ripple>
                                                    </Col>
                                                </Row>
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
                                </Col>
                            </Row>
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
                                                splitArr.filter(b => b.hasOwnProperty('CheckInGuestID')).map((b, bid) => {
                                                    return (
                                                        <>
                                                            <Accordion className='accordion-margin' open={open} toggle={toggle} key={bid}>
                                                                <AccordionItem>
                                                                    <AccordionHeader targetId={bid + 1}>
                                                                        {b.RoomNo} - {b.Name}
                                                                    </AccordionHeader>
                                                                    <AccordionBody accordionId={bid + 1}>
                                                                        <>
                                                                            <BlobProvider document={<PdfCompSplit data={b} />} >
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
                                                                                        </Row>
                                                                                    )
                                                                                }}
                                                                            </BlobProvider>
                                                                            <Row className='ps-1 text-center'>
                                                                                <PDFViewer
                                                                                    className='vh-100 vw-100'
                                                                                    showToolbar={true}
                                                                                    children={<PdfCompSplit data={b} />}
                                                                                />
                                                                            </Row>
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
                </Col>
            </Row>
            {/* <Row>
                {
                    SplitBillFlag ? (
                        <Row className='d-flex flex-column justify-content-center align-items-center'>
                            <Col className='m-1 text-center'>
                                <h1>Invoice <span className='fw-light fs-3'>(Split Bill)</span></h1>
                            </Col>
                            <Col className='w-75'>
                                {
                                    splitArr.filter(b => b.hasOwnProperty('CheckInGuestID')).map((b, bid) => {
                                        return (
                                            <>
                                                <Accordion className='accordion-margin' open={open} toggle={toggle} key={bid}>
                                                    <AccordionItem>
                                                        <AccordionHeader targetId={bid + 1}>
                                                            {b.RoomNo} - {b.Name}
                                                        </AccordionHeader>
                                                        <AccordionBody accordionId={bid + 1}>
                                                            <>
                                                                <BlobProvider document={<PdfCompSplit data={b} />} >
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
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                </BlobProvider>
                                                                <Row className='ps-1 text-center'>
                                                                    <PDFViewer
                                                                        className='vh-100 vw-100'
                                                                        showToolbar={true}
                                                                        children={<PdfCompSplit data={b} />}
                                                                    />
                                                                </Row>
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
                    ) : (
                        <Col>
                            <BlobProvider document={<PdfComp />} >
                                {({ blob, url, loading, error }) => {
                                    return (
                                        <Row className='m-1'>
                                            <Col className='d-flex flex-row justify-content-evenly'>
                                                {laundary_arr.length > 0 && laundary_arr.length === 1 ? (
                                                    <Button.Ripple className='m-1' color='success' onClick={() => handleLaundaryInv(laundary_arr[0].ServiceId)}>Print Laundary Invoice</Button.Ripple>
                                                ) : laundary_arr.length > 1 ? (
                                                    <Button className='m-1' color='primary' onClick={() => handleLaun_model()}>Laundary Invoices</Button>
                                                ) : null}
                                                {pos_arr.length > 0 && pos_arr.length === 1 ? (
                                                    <Button.Ripple className='m-1' color='success' onClick={() => handlePosInv(pos_arr[0].InvoiceID)}>Print POS Invoice</Button.Ripple>
                                                ) : pos_arr.length > 1 ? (
                                                    <Button className='m-1' color='primary' onClick={() => handlePos_model()}>POS Invoices</Button>
                                                ) : null}
                                                <Button.Ripple className='m-1' color='success' onClick={() => handleBlob(blob)}>{load ? <Spinner color='#FFF' /> : `Send Via Email`}</Button.Ripple>
                                            </Col>
                                        </Row>
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
                        </Col>
                    )
                }
            </Row> */}
            {laun_model && <Laundary_invoice />}
            {pos_model && <Pos_invoice />}
        </>
    )

    //     <div ref={componentRef}>
    //         <Card className='invoice-preview-card'>
    //             <CardBody className='invoice-padding pb-0'>
    //                 {/* Header */}
    //                 <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
    //                     <div>
    //                         <Avatar size='lg' img={`${Image_base_uri}/uploads/property/hotel-logo.jpg`} />
    //                         <h3 className='text-primary invoice-logo'>{hotelData.HotelName}</h3>

    //                         <CardText className='mb-25'>{hotelData.AddressLine}</CardText>
    //                         <CardText className='mb-25'>{hotelData.PostalCode}, {hotelData.CountryName}</CardText>
    //                         {/* <CardText className='mb-25'>Lisc No:{hotelData.PropertyLicenseNumber}</CardText> */}
    //                         <CardText className='mb-0'>{hotelData.WebSIte}</CardText>
    //                         <CardText className='mb-0'>{hotelData.PhoneNumber}</CardText>
    //                     </div>
    //                     <div className='mt-md-0 mt-2'>
    //                         <h4 className='invoice-title'>
    //                             Invoice <span className='invoice-number'>
    //                                 {invoiceData === undefined ? `#${bookingDetails?.Invoice}` : `#${invoiceData.InvNo}`}
    //                             </span>
    //                         </h4>
    //                         <div className='invoice-date-wrapper text-end'>
    //                             <p className='invoice-date-title'>Date: {invoiceData === undefined ? moment(new Date()).format('LL') : moment(invoiceData.Date).format('LL')}</p>
    //                             <p className='invoice-date-title'>GST: {hotelData.GSTNumber}</p>
    //                             <CardText className='mb-25'>Lisc No:{hotelData.PropertyLicenseNumber}</CardText>
    //                         </div>
    //                         {/* <div className='invoice-date-wrapper'>
    //                             <p className='invoice-date-title'>Date Issued:</p>
    //                             <p className='invoice-date'>{bookingDetails?.DateIssue || moment(new Date()).format('DD/MM/yyyy')} </p>
    //                         </div>
    //                         <div className='invoice-date-wrapper'>
    //                             <p className='invoice-date-title'>Due Date:</p>
    //                             <p className='invoice-date'>{bookingDetails?.DueDate || moment(new Date()).format('DD/MM/yyyy')}</p>
    //                         </div> */}
    //                     </div>
    //                 </div>
    //                 {/* /Header */}
    //             </CardBody>

    //             {/* Address and Contact */}
    //             <CardBody className='invoice-padding mt-1 pt-0'>
    //                 <h2 className='text-center mb-2 fw-light'>{companyData.isCompany ? 'Company Details' : 'Guest Details'}</h2>
    //                 <Row className='invoice-spacing'>
    //                     <Col className=' d-flex flex-column flex-wrap justify-content-center align-items-start'>
    //                         <h6 className='mb-2'><span className='fw-light'>Booking Id:</span> {paymentTypeData.BookingMapID}</h6>
    //                         {
    //                             companyData.isCompany ? (
    //                                 <>
    //                                     <h6 className='mb-2'><span className='fw-light'>Name:</span> {companyData?.GuestCompanyName}</h6>
    //                                     <h6 className='mb-2'><span className='fw-light'>Address:</span> {companyData?.GuestCompanyAddress}</h6>
    //                                     <h6 className='mb-2'><span className='fw-light'>GST:</span> {companyData?.GuestCompanyGST}</h6>
    //                                 </>
    //                             ) : (
    //                                 <>
    //                                     <h6 className='mb-2'><span className='fw-light'>Name:</span> {guestData?.GuestName}</h6>
    //                                     <h6 className='mb-2'><span className='fw-light'>Address:</span> {guestData?.GuestAddress} - {guestData.Pincode}</h6>
    //                                     <h6 className='mb-2'><span className='fw-light'>Email:</span> {guestData?.GuestEmail}</h6>
    //                                     <h6 className='mb-2'><span className='fw-light'>Mobile:</span> {guestData?.GuestMobileNumber}</h6>
    //                                 </>
    //                             )
    //                         }
    //                     </Col>
    //                     <Col className='text-end'>
    //                         <h6 className='mb-2'><span className='fw-light'>Check In:</span> {moment(paymentTypeData.CheckInDate).format('LLL')}</h6>
    //                         <h6 className='mb-2'><span className='fw-light'>Check Out:</span> {moment(paymentTypeData.CheckOutDate).format('LLL')}</h6>
    //                         <h6 className='mb-2'><span className='fw-light'>Total Stay {paymentTypeData.TotalNights > 1 ? `(Nights)` : `(Night)`}:</span> {paymentTypeData.TotalNights}</h6>
    //                         <h6 className='mb-2'><span className='fw-light'>Payment Mode:</span> {paymentTypeData.PaymentMode}</h6>
    //                         <h6 className='mb-2'><span className='fw-light'>Payment Type:</span> {paymentTypeData.PaymentType}</h6>
    //                     </Col>
    //                 </Row>
    //                 {/* <hr className='mx-5' />
    //                 <h2 className='text-center mb-2 fw-light'>Payment Details</h2>
    //                 <Row className='invoice-spacing'>
    //                     <Col className='d-flex flex-row flex-wrap justify-content-between align-items-center'>
    //                         <h6 className='mb-2 mx-2'><span className='fw-light'>Payment Mode:</span> {bookingDetails?.PaymentMode}</h6>
    //                         <h6 className='mb-2 mx-2'><span className='fw-light'>Payment Type:</span> {bookingDetails?.PaymentType}</h6>
    //                         <h6 className='mb-2 mx-2'><span className='fw-light'>Total Amount:</span> {bookingDetails?.TotalAmount}</h6>
    //                         <h6 className='mb-2 mx-2'><span className='fw-light'>Paid:</span> {bookingDetails?.RecievedAmount}</h6>
    //                         <h6 className='mb-2 mx-2'><span className='fw-light'>Balance Amount:</span> {bookingDetails?.PendingAmount}</h6>
    //                     </Col>
    //                 </Row> */}
    //             </CardBody>
    //             {/* /Address and Contact */}

    //             <hr className='invoice-spacing mx-5' />
    //             <CardBody className='invoice-padding'>
    //                 <h2 className='text-center mb-2 fw-light'>Booking Details</h2>
    //                 <Col className='invoice-spacing'>
    //                     <table>
    //                         <thead>
    //                             <tr>
    //                                 <th className='py-1 text-center'>Date</th>
    //                                 <th className='py-1 text-center'>Room</th>
    //                                 <th className='py-1 text-center'>Room No.</th>
    //                                 <th className='py-1 text-center'>Guests</th>
    //                                 <th className='py-1 text-center'>Meal/s</th>
    //                                 <th className='py-1 text-center'>Amount</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             {
    //                                 roomData.map((r, rid) => {
    //                                     return (
    //                                         <tr key={rid}>
    //                                             <td className='py-1'>{moment(r.Date).format('LL')}</td>
    //                                             <td className='py-1'>{r.RoomDisplayName}</td>
    //                                             <td className='py-1'>{r.RoomNo ? r.RoomNo : 'No room assigned'}</td>
    //                                             <td className='py-1'>
    //                                                 <Row className='text-center'>
    //                                                     <span>Adult: {r.Adult}</span>
    //                                                     <span>Children: {r.Children}</span>
    //                                                     <span>Infant: {r.Infant}</span>
    //                                                 </Row>
    //                                             </td>
    //                                             <td className='py-1'>{r.MealDetails}</td>
    //                                             <td>
    //                                                 <Row className='text-end'>
    //                                                     {/* <ListGroup flush> */}
    //                                                     {/* <div className='px-1 mb-1 justify-content-between'>
    //                                                             <span className='ms-1'>{r.TaxableAmount}/-</span>
    //                                                         </div>
    //                                                         <div className='px-1 mb-1 justify-content-between'>
    //                                                             <span>DISCOUNT:</span>
    //                                                             <span className='ms-1'>{r.Discount}/-</span>
    //                                                         </div>
    //                                                         <div className='px-1 mb-1 justify-content-between'>
    //                                                             <span>TAX:</span>
    //                                                             <span className='ms-1'>{r.TaxAmount}/-</span>
    //                                                         </div> */}
    //                                                     <div className='px-1 mb-1 justify-content-between'>
    //                                                         {/* <span>Net:</span> */}
    //                                                         <span className='ms-1 fw-bolder'>{r.GrossAmount}/-</span>
    //                                                     </div>
    //                                                     {/* </ListGroup> */}
    //                                                 </Row>
    //                                             </td>
    //                                         </tr>
    //                                     )
    //                                 })
    //                             }
    //                             <tr>
    //                                 <td></td>
    //                                 <td></td>
    //                                 <td></td>
    //                                 <td></td>
    //                                 {/* <td colSpan={2}>
    //                                     <Row className='text-end'>
    //                                         <ListGroup flush>
    //                                             <div className='px-1 my-1 justify-content-between'>
    //                                                 <span className='fw-bolder fs-5'>Subtotal:</span>
    //                                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.GrossAmount}/-</span>
    //                                             </div>
    //                                             <div className='px-1 mb-1 justify-content-between'>
    //                                                 <span className='fw-bolder fs-5'>DISCOUNT:</span>
    //                                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.Discount}/-</span>
    //                                             </div>
    //                                             <div className='px-1 mb-1 justify-content-between'>
    //                                                 <span className='fw-bolder fs-5'>CGST:</span>
    //                                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.CGSTA}/-</span>
    //                                             </div>
    //                                             <div className='px-1 mb-1 justify-content-between'>
    //                                                 <span className='fw-bolder fs-5'>SGST:</span>
    //                                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.SGSTA}/-</span>
    //                                             </div>
    //                                             <div className='px-1 mb-1 justify-content-between'>
    //                                                 <span className='fw-bolder fs-5'>Net:</span>
    //                                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.NetAmount}/-</span>
    //                                             </div>
    //                                         </ListGroup>
    //                                     </Row>
    //                                 </td> */}
    //                             </tr>
    //                         </tbody>
    //                     </table>
    //                     <Row className='text-end'>
    //                         <ListGroup flush>
    //                             <div className='px-1 my-1 justify-content-between'>
    //                                 <span className='fw-bolder fs-5'>Subtotal:</span>
    //                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.GrossAmount}/-</span>
    //                             </div>
    //                             <div className='px-1 mb-1 justify-content-between'>
    //                                 <span className='fw-bolder fs-5'>Discount:</span>
    //                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.Discount}/-</span>
    //                             </div>
    //                             <div className='px-1 mb-1 justify-content-between'>
    //                                 <span className='fw-bolder fs-5'>CGST:</span>
    //                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.CGSTA}/-</span>
    //                             </div>
    //                             <div className='px-1 mb-1 justify-content-between'>
    //                                 <span className='fw-bolder fs-5'>SGST:</span>
    //                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.SGSTA}/-</span>
    //                             </div>
    //                             <div className='px-1 mb-1 justify-content-between'>
    //                                 <span className='fw-bolder fs-5'>Net:</span>
    //                                 <span className='ms-1 fw-bolder fs-5'>{roomSummaryData.NetAmount}/-</span>
    //                             </div>
    //                         </ListGroup>
    //                     </Row>
    //                 </Col>
    //             </CardBody>

    //             <hr className='invoice-spacing mx-5' />

    //             {
    //                 addOnData.length > 0 ? (
    //                     <CardBody className='invoice-padding pb-0'>
    //                         <h2 className='text-center mb-2 fw-light'>Add-On Services</h2>
    //                         <Col className='invoice-spacing'>
    //                             <table>
    //                                 <thead>
    //                                     <tr>
    //                                         <th className='py-1 text-center'>Name</th>
    //                                         <th className='py-1 text-center'>Details</th>
    //                                         <th className='py-1 text-center'>Charge</th>
    //                                         <th className='py-1 text-center'>Tax</th>
    //                                         <th className='py-1 text-center'>Total</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                     {
    //                                         addOnData.map((r, rid) => {
    //                                             return (
    //                                                 <tr key={rid}>
    //                                                     <td className='py-1'>{r.ServiceName}</td>
    //                                                     <td className='py-1'>{r.ServiceDetails}</td>
    //                                                     <td className='py-1'>{r.ServiceCharge}</td>
    //                                                     <td className='py-1'>{r.TaxAmount}</td>
    //                                                     <td className='py-1'>{r.TotalAmount}</td>
    //                                                 </tr>
    //                                             )
    //                                         })
    //                                     }
    //                                     <tr>
    //                                         <td></td>
    //                                         <td></td>
    //                                         <td></td>
    //                                         <td></td>
    //                                         {/* <td>
    //                                             <Row className='text-end'>
    //                                                 <ListGroup flush>
    //                                                     <div className='px-1 my-1 justify-content-between'>
    //                                                         <span className='fw-bolder fs-5'>Subtotal:</span>
    //                                                         <span className='ms-1 fw-bolder fs-5'>{addOnSummaryData.ServiceCharge}/-</span>
    //                                                     </div>
    //                                                     <div className='px-1 mb-1 justify-content-between'>
    //                                                         <span className='fw-bolder fs-5'>TAX:</span>
    //                                                         <span className='ms-1 fw-bolder fs-5'>{addOnSummaryData.TaxAmount}/-</span>
    //                                                     </div>
    //                                                     <div className='px-1 mb-1 justify-content-between'>
    //                                                         <span className='fw-bolder fs-5'>Net:</span>
    //                                                         <span className='ms-1 fw-bolder fs-5'>{addOnSummaryData.TotalAmount}/-</span>
    //                                                     </div>
    //                                                 </ListGroup>
    //                                             </Row>
    //                                         </td> */}
    //                                     </tr>
    //                                 </tbody>
    //                             </table>
    //                             <Row className='text-end'>
    //                                 <ListGroup flush>
    //                                     <div className='px-1 my-1 justify-content-between'>
    //                                         <span className='fw-bolder fs-5'>Subtotal:</span>
    //                                         <span className='ms-1 fw-bolder fs-5'>{addOnSummaryData.ServiceCharge}/-</span>
    //                                     </div>
    //                                     <div className='px-1 mb-1 justify-content-between'>
    //                                         <span className='fw-bolder fs-5'>TAX:</span>
    //                                         <span className='ms-1 fw-bolder fs-5'>{addOnSummaryData.TaxAmount}/-</span>
    //                                     </div>
    //                                     <div className='px-1 mb-1 justify-content-between'>
    //                                         <span className='fw-bolder fs-5'>Net:</span>
    //                                         <span className='ms-1 fw-bolder fs-5'>{addOnSummaryData.TotalAmount}/-</span>
    //                                     </div>
    //                                 </ListGroup>
    //                             </Row>
    //                         </Col>
    //                         <Col className='text-end'>
    //                             <h4 className='fw-bolder mt-5'>Bill Amount: {payableAmount.BillAmount}/-</h4>
    //                         </Col>
    //                     </CardBody>
    //                 ) : null
    //             }

    //             <hr className='invoice-spacing' />

    //             {/* Invoice Note */}
    //             <CardBody className='invoice-padding pt-0 '>
    //                 <Row>
    //                     <Col sm='12' className='text-center'>
    //                         <span style={{ fontStyle: 'italic' }}>
    //                             It was a pleasure serving you, hoping to see you soon. Thank You!
    //                         </span>
    //                     </Col>
    //                 </Row>
    //             </CardBody>
    //             {/* /Invoice Note */}
    //         </Card>

    //     </div>
    // ) : null
}

export default Invoice