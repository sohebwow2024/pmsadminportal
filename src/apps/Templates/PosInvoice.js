import { data } from 'jquery'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import { Button } from 'reactstrap'
import axios from '../../API/axios'
import { store } from '@store/store'
import '../../assets/scss/style.scss';
const moment = require('moment')

const PosInvoice = () => {
    const [invoicedata, setInvoicedata] = useState([])
    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    })
    const PosInvoiceId = useSelector(state => state.voucherSlice.posInvoiceID)
    console.log(PosInvoiceId);
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const getInvoiceData = async () => {
        try {
            const res = await axios.get('/pos_orders/invoice', {
                params: {
                    LoginID,
                    Token,
                    id: PosInvoiceId
                }
            })
            console.log('posres', res)
            setInvoicedata(res?.data)

        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getInvoiceData()
    }, [])

    // const handleBlob = async (newBlob) => {
    //     const myFile = new File([newBlob], 'test.pdf', {
    //         type: newBlob.type,
    //     });
    //     console.log('myFile', myFile);

    //     let newDocData = new FormData()
    //     newDocData.append('file', myFile)
    //     newDocData.append('ToMail', bookingDetails?.GuestEmail)
    //     newDocData.append('Name', bookingDetails?.GuestName)
    //     newDocData.append('BookingID', bookingDetails?.BookingId)
    //     try {
    //         const res = await axios({
    //             method: "post",
    //             baseURL: `${Image_base_uri}`,
    //             url: "/api/booking/send/voucher",
    //             data: newDocData,
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //                 LoginID,
    //                 Token
    //             },
    //         })
    //         console.log('Docres', res)
    //         if (res?.data[0][0]?.Status === "Success") {
    //             toast.success(res?.data[0]?.Message)
    //         }
    //     } catch (error) {
    //         console.log('uploadError', error)
    //         toast.error('Something went wrong, Try again!')
    //     }
    // }

    // const pdfComp = () => {

    //     const styles = StyleSheet.create({
    //         body: {
    //           paddingTop: 35,
    //           paddingBottom: 65,
    //           paddingHorizontal: 35,
    //         },

    //         adjus: {
    //           display: "flex",
    //           flexDirection: "row",
    //           justifyContent: "space-between",
    //         },

    //         bott: {
    //           marginBottom: 10,
    //           fontSize: 10,
    //         },

    //         bott1: {
    //           marginBottom: 10,
    //           fontSize: 20,
    //         },

    //         center: {
    //           textAlign: "center",
    //         },

    //         maihead: {
    //           fontSize: 15,
    //           fontWeight: "lighter",
    //         },

    //         maihead1: {
    //           fontSize: 15,
    //           fontWeight: "lighter",
    //           marginBottom: 10,
    //         },

    //         border: {
    //           border: 0.3,
    //           marginTop: 20,
    //         },

    //         image: {
    //           marginVertical: 15,
    //           marginHorizontal: 100,
    //         },
    //         header: {
    //           fontSize: 12,
    //           marginBottom: 20,
    //           textAlign: "center",
    //           color: "grey",
    //         },
    //         pageNumber: {
    //           position: "absolute",
    //           fontSize: 12,
    //           bottom: 30,
    //           left: 0,
    //           right: 0,
    //           textAlign: "center",
    //           color: "grey",
    //         },
    //       })

    //     return (
    //       <Document>
    //         <Page size="A4">
    //           <View style={styles.adjus}>
    //             <View>
    //               <Text style={styles.bott1}>{item.HotelName}</Text>
    //               <Text style={styles.bott}>{item.AddressLine}</Text>
    //               <Text style={styles.bott}>www.mywebsite.com</Text>
    //               <Text style={styles.bott}>+919876251230
    //               </Text>
    //             </View>
    //             <View>
    //               <Text style={styles.bott}>Invoice #TSID20230503AA00209</Text>
    //               <Text style={styles.bott}>Date: May 3, 2023</Text>
    //               <Text style={styles.bott}>GST: IFSC</Text>
    //               <Text style={styles.bott}>Lisc No:1234567890</Text>
    //             </View>
    //           </View>
    //           <View style={styles.center}><Text style={styles.maihead}>Guest Details</Text></View>
    //           <View style={styles.adjus}>
    //             <View>
    //               <Text style={styles.bott}>Bushra Shaikh</Text>
    //               <Text style={styles.bott}>Add: Goa Panaji - 0</Text>
    //               <Text style={styles.bott}>bushra@gmail.com </Text>
    //               <Text style={styles.bott}>919867100030</Text>
    //               <Text style={styles.bott}>Id: BKID20230503AA00265</Text>
    //             </View>
    //             <View>
    //               <Text style={styles.bott}>Check In: May 4, 2023 12:00 PM</Text>
    //               <Text style={styles.bott}>Check Out: May 5, 2023 12:00 PM</Text>
    //               <Text style={styles.bott}>Total Stay (Night): 1</Text>
    //               <Text style={styles.bott}>Payment Mode: Credit Card</Text>
    //               <Text style={styles.bott}>Payment Type: Prepaid</Text>
    //             </View>
    //           </View>
    //           <View style={styles.center}><Text style={styles.maihead1}>Booking Details</Text></View>
    //           <View>
    //             <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '10', }}>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Date</Text>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Room </Text>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Room No.</Text>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Guests</Text>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Meal/s</Text>
    //               <Text style={{ flex: 0.4, fontSize: '11' }}>Amount</Text>
    //             </View>
    //             <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '15', }}>
    //               <Text style={{ flex: 0.9, fontSize: '9' }}>May 4,2023</Text>
    //               <Text style={{ flex: 1, fontSize: '9', }}>Classic Room</Text>
    //               <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>No room assigned</Text>
    //               <View style={{ flex: 1 }}>
    //                 <Text style={{ flex: 1, fontSize: '9', marginBottom: '10' }}> Adult: 3</Text>
    //                 <Text style={{ flex: 1, fontSize: '9', marginBottom: '10' }}> Children: 0 </Text>
    //                 <Text style={{ flex: 1, fontSize: '9', }}> Infant: 0</Text>
    //               </View>
    //               <Text style={{ flex: 1, fontSize: '9' }}>Bed & breakfast</Text>
    //               <Text style={{ flex: 0.4, fontSize: '9' }}> ₹ 1945/-</Text>
    //             </View>
    //             <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '25', }}>
    //               <Text style={{ flex: 0.9, fontSize: '9' }}>May 4,2023</Text>
    //               <Text style={{ flex: 1.2, fontSize: '9', }}>Classic Dormitory</Text>
    //               <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>No room assigned</Text>
    //               <View style={{ flex: 1 }}>
    //                 <Text style={{ flex: 1, fontSize: '9', marginBottom: '10' }}> Adult: 5</Text>
    //                 <Text style={{ flex: 1, fontSize: '9', marginBottom: '10' }}> Children: 0 </Text>
    //                 <Text style={{ flex: 1, fontSize: '9', }}> Infant: 0</Text>
    //               </View>
    //               <Text style={{ flex: 1.2, fontSize: '9' }}>Bed & breakfast</Text>
    //               <Text style={{ flex: 0.4, fontSize: '9' }}> ₹ 6000/-</Text>
    //             </View>
    //             <View style={{ textAlign: 'right' }}>
    //               <Text style={{ fontSize: '10', marginBottom: '8' }}>Sub-total: ₹ 7945/</Text>
    //               <Text style={{ fontSize: '10', marginBottom: '8' }}>Discount: ₹ 0/-</Text>
    //               <Text style={{ fontSize: '10', marginBottom: '8' }}>CGST: ₹ 535.05/-</Text>
    //               <Text style={{ fontSize: '10', marginBottom: '8' }}>SGST: ₹ 535.05/-</Text>
    //               <Text style={{ fontSize: '10', marginBottom: '8' }}>Net: ₹ 9015.1/-</Text>
    //             </View>
    //             <View style={styles.center}><Text style={styles.maihead1}>Add-On Services</Text></View>
    //             <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '20', }}>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Name</Text>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Details</Text>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Charge</Text>
    //               <Text style={{ flex: 1, fontSize: '11' }}>Tax</Text>
    //               <Text style={{ flex: 0.3, fontSize: '11' }}>Total</Text>
    //             </View>
    //             <View style={{ display: 'flex', flexDirection: 'row', marginBottom: '60', }}>
    //               <Text style={{ flex: 0.9, fontSize: '9' }}>Extra Service</Text>
    //               <Text style={{ flex: 1.2, fontSize: '9', }}>Birthday Decoration</Text>
    //               <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}>₹ 250</Text>
    //               <Text style={{ flex: 1, fontSize: '9', wordWrap: 'break-word' }}> ₹ 12.5</Text>
    //               <Text style={{ flex: 0.3, fontSize: '9' }}>₹ 262.5</Text>
    //             </View>
    //             <View style={{ textAlign: 'right' }}>
    //               <Text style={{ fontSize: '10', marginBottom: '10' }}>Subtotal: ₹ 250/-</Text>
    //               <Text style={{ fontSize: '10', marginBottom: '10' }}>TAX: ₹ 12.5/-</Text>
    //               <Text style={{ fontSize: '10', marginBottom: '10' }}>Net: ₹ 262.5/-</Text>
    //             </View>
    //             <View style={{ textAlign: 'right' }}>
    //               <Text style={{ fontSize: '12', marginTop: '10' }}>Bill Amount: ₹ 9278/-</Text>
    //             </View>
    //             <View style={styles.border}></View>
    //             <View style={styles.center}><Text style={{ fontSize: '8', marginTop: '10', fontStyle: 'italic', fontWeight: 'lighter', }}>It was a pleasure serving you, hoping to see you soon. Thank You!</Text></View>

    //           </View>

    //           <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
    //             `${pageNumber} / ${totalPages}`
    //           )} fixed />

    //         </Page>
    //       </Document>
    //     )
    //   }

    //New PDF return
    //   return (
    //     <>
    //       <div>
    //         <BlobProvider document={<PdfComp />} >
    //           {({ blob, url, loading, error }) => {
    //             return (
    //               <div className='m-1 text-end'>
    //                 <Button.Ripple color='success' onClick={() => handleBlob(blob)}>Send Via Email</Button.Ripple>
    //               </div>
    //             )
    //           }}
    //         </BlobProvider>
    //         <Row className='ps-1 text-center'>
    //           <PDFViewer
    //             className='vh-100 vw-100'
    //             // style={{
    //             //   height: '100vh',
    //             //   width: '100vw',
    //             // }}
    //             showToolbar={true}
    //             children={<PdfComp />}
    //           />
    //         </Row>
    //       </div>
    //     </>
    //   )

    return (
        <div className=' m-5 '>
            <div ref={componentRef} className='px-2 m-auto' style={{ width: 'fit-content' }}>
                {invoicedata[2]?.map((item, index) => {
                    return (
                        <div className='text-center mb-1' key={index} >
                            <h3 className='fw-bolder' style={{ color: 'black' }}>{item.hotelName}</h3>
                            <p>{item.addressLine}</p>
                            <p>Phone: {item.phoneNumber}</p>
                            <p>Email: {item.email}</p>
                            <p>Pincode - {item.postalCode}</p>
                            <p>IFSC No - {item.ifsc}</p>
                            <p>GST No - {item.gstNumber}</p>
                        </div>
                    )
                })}
                {invoicedata[0]?.map((r, i) => {
                    return (
                        <div key={i} className='text-center' style={{ borderBottom: '2px solid black' }}>
                            <h3>Guest Details</h3>
                            {/* <div className='d-flex flex-row'>
                                <p >{`Guest Name: `}</p> */}
                            <p className='mx-1'>Guest Name: {r.guestName}</p>
                            {/* </div> */}

                            <p>Mobile: {r.guestMobileNumber}</p>
                        </div>
                    )
                })}
                {invoicedata[0]?.map((item, index) => {
                    return (
                        <div className='mb-5' key={index}>
                            <div className='d-flex'>
                                <p className='w-25 fw-bolder mb-0' style={{ color: 'black' }}>POS Name:</p>
                                <p>{item.poSName}</p>
                            </div>
                            <div className='d-flex'>
                                <p className='w-25 fw-bolder mb-0' style={{ color: 'black' }}>Time:</p>
                                <p>{moment(item.invoiceDate).format('LLL')}</p>
                            </div>
                            {/* <div className='d-flex'>
                                <p className='w-25 fw-bolder mb-0' style={{ color: 'black' }}>Invoice No:</p>
                                <p>{item.InvoiceNumber}</p>
                            </div> */}

                            <div className='d-flex'>
                                <p className='w-25 fw-bolder mb-0' style={{ color: 'black' }}>Invoice No:</p>
                                <p>{item.invoiceID}</p>
                            </div>
                            <div className='d-flex'>
                                <p className='w-25 fw-bolder mb-0' style={{ color: 'black' }}>Payment Type:</p>
                                <p>{item.paymentType}</p>
                            </div>
                            <div className='d-flex'>
                                <p className='w-25 fw-bolder mb-0' style={{ color: 'black' }}>Served At:</p>
                                <p>{item.servedAt}</p>
                            </div>
                            <div className='d-flex'>
                                <p className='w-25 fw-bolder mb-0' style={{ color: 'black' }}>Detail:</p>
                                <p>{item.remark1}</p>
                            </div>

                        </div>
                    )
                })}
                <table className='table mb-1'>
                    <thead>
                        <tr className='fw-bolder' style={{ color: 'black' }}>
                            <th >No</th>
                            <th>Item</th>
                            {/* <th>MRP</th> */}
                            <th>QTY</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody className='mb-1'>

                        {invoicedata[1]?.map((item, index) => {
                            console.log('item', item)
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.posProductName}</td>
                                    {/* <td>150.00</td> */}
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {invoicedata[0]?.map((item, index) => {
                    console.log(item);
                    const discnt = (+item.discount / 100) * (item.total + item.taxes)
                    console.log(discnt);
                    return (
                        <div className='mb-1' style={{ borderBottom: '2px solid black' }} key={index}>
                            <div className='d-flex justify-content-end '>
                                <p >Sub-Total Amount</p>
                                <p className='text-end' style={{ width: '80px' }}>₹ {(item.total)}</p>
                            </div>
                            <div className='d-flex justify-content-end '>
                                <p >Taxes</p>
                                <p className='text-end' style={{ width: '80px' }}>₹ {(item.taxes)}</p>
                            </div>
                            <div className='d-flex justify-content-end'>
                                <p >Discount</p>

                                <p className='text-end' style={{ width: '80px' }}>₹ {item.discountType === '%' ? discnt.toFixed(2) : item.discount.toFixed(2)} </p>
                            </div>
                            <div className='d-flex justify-content-end fw-bolder' style={{ color: 'black' }}>
                                <p >Total (Incl All Taxes)</p>
                                <p className='text-end' style={{ width: '80px' }}>₹ {item.discountType === '%' ? item.total + item.taxes - discnt : item.total + item.taxes - item.discount.toFixed(1)}</p>
                            </div>
                            {/* <div className='d-flex justify-content-end'>
                                <p >Paid Amount</p>
                                <p className='text-end' style={{ width: '80px' }}>{parseInt(item.PaidAmount)}</p>
                            </div> */}
                            {/* <div className='d-flex justify-content-end fw-bolder' style={{ color: 'black' }}>
                                <p >Grand Total</p>
                                <p className='text-end' style={{ width: '80px' }}>{parseInt(item.PaidAmount)}</p>
                            </div> */}
                        </div>
                    )
                })}
                <div className='text-center'>
                    <p>Thank You. Please Visit Again.</p>
                </div>
            </div>
            <Button color='success' onClick={handlePrint} style={{ float: 'right', margin: 10 }}>Print</Button>
        </div>

    )
}

export default PosInvoice
