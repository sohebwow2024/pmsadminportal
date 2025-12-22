import React from 'react'
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, BlobProvider, PDFViewer, usePDF, Image } from '@react-pdf/renderer';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const RevModal = ({ open, handleOpen, data }) => {
    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, PropertyID, HotelName } = getUserData
    
    const [headers] = useState(data.length > 0 ? data[0][0] : [])
    const [bookings] = useState(data.length > 0 ? data[1] : [])
    const [month] = useState(moment().subtract(1, 'days').month() + 1)
    console.log('month', month)

    console.log('data', data)
    const PdfComp = () => {
        const styles = StyleSheet.create({
            body: {
                paddingTop: 35,
                paddingBottom: 65,
                paddingHorizontal: 35,
            },
            pageNumber: {
                position: "absolute",
                fontSize: 12,
                bottom: 30,
                left: 0,
                right: 0,
                textAlign: "center",
                color: "#000000cc",
            },
            red: {
                color: "#000000cc",
                marginBottom: 20,
            },
            secondtext: {
                color: "#000000cc",
                fontSize: "15",
            },
            border: {
                border: 1,
                marginTop: 15,
                borderColor: "#7367f0",
            },
            table: {
                display: "table",
                width: "auto",
                marginTop: 50,
                border: 1,
                borderColor: "#7367f0",
                color: "#000000cc",
                // padding:'0 10'
            },
            tableRow: {
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#7367f0",
                alignItems: "center",
                // height: 24,
                textAlign: "center",
            },
            tableRow1: {
                flexDirection: "row",
                borderColor: "#7367f0",
                alignItems: "center",
                // height: 24,
                textAlign: "center",
            },
            tableHeader: {
                width: "33.33%",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                padding: '0 1',
                fontSize: 10,
            },
            tableHeader1: {
                width: "50px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                padding: '0 1',
                fontSize: 10,
            },
            tableHeader2: {
                width: "100px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                padding: '0 1',
                fontSize: 10,
            },
            tableHeader3: {
                width: "90px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                padding: '0 1',
                fontSize: 10,
            },
            tableHeader4: {
                width: "90px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                padding: '0 1',
                fontSize: 10,
            },
            tableHeader5: {
                width: "100px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                padding: '0 1',
                fontSize: 10,
            },
            tableHeader6: {
                width: "120px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                padding: '0 1',
                fontSize: 10,
            },
            tableHeader7: {
                width: "90px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                padding: '0 1',
                fontSize: 10,
            },
            tableHeader8: {
                width: "33.33%",
                borderColor: "#7367f0",
                // paddingRight: 5,
                fontSize: 10,
            },
            tableCell: {
                width: "33.33%",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCell1: {
                width: "50px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCell2: {
                width: "100px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCell3: {
                width: "90px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCell4: {
                width: "90px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCell5: {
                width: "100px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCell6: {
                width: "120px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCell7: {
                width: "90px",
                borderRightWidth: 1,
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCell8: {
                width: "33.33%",
                borderColor: "#7367f0",
                paddingLeft: 5,
                fontSize: 10,
            },
            tableCellLast: {
                width: "33.33%",
                paddingLeft: 5,
            },
        });

        return (
            <Document>
                <Page style={styles.body}>
                    <View>
                        <View>
                            <View>
                                <Text style={{ fontSize: 16, color: "#7367f0" }}>
                                    Date: {moment().subtract(1, 'days').format("DD-MM-YYYY")}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 5,
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        color: "#7367f0",
                                    }}
                                    weight={700}
                                >
                                    {HotelName}
                                </Text>
                            </View>
                            <View style={styles.border}></View>

                            <View style={{ marginTop: 30 }}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <View
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: 1,
                                            padding: 15,
                                            width: "100%",
                                            borderRadius: "20",
                                            borderColor: "#7367f0",
                                        }}
                                    >
                                        <Text style={styles.red}>{headers.DayBookings}</Text>
                                        <Text style={styles.secondtext}>Today's Bookings</Text>
                                    </View>
                                    <View
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: 1,
                                            padding: 15,
                                            width: "100%",
                                            borderRadius: "20",
                                            marginRight: 5,
                                            marginLeft: 5,
                                            borderColor: "#7367f0",
                                        }}
                                    >
                                        <Text style={styles.red}>{headers.DayEarnings}/-</Text>
                                        <Text style={styles.secondtext}>Today's Earning</Text>
                                    </View>
                                    <View
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: 1,
                                            padding: 15,
                                            width: "100%",
                                            borderRadius: "20",
                                            borderColor: "#7367f0",
                                        }}
                                    >
                                        <Text style={styles.red}>{headers.DayDeparture}</Text>
                                        <Text style={styles.secondtext}>Today's Check Out</Text>
                                    </View>
                                </View>

                                <View
                                    style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
                                >
                                    <View
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: 1,
                                            padding: 15,
                                            width: "100%",
                                            borderRadius: "20",
                                            borderColor: "#7367f0",
                                        }}
                                    >
                                        <Text style={styles.red}>{headers.DayArrival}</Text>
                                        <Text style={styles.secondtext}>Today's Check In</Text>
                                    </View>
                                    <View
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: 1,
                                            padding: 15,
                                            width: "100%",
                                            borderRadius: "20",
                                            marginRight: 5,
                                            marginLeft: 5,
                                            borderColor: "#7367f0",
                                        }}
                                    >
                                        <Text style={styles.red}>{headers.MonthBookings}</Text>
                                        <Text style={styles.secondtext}>{moment(month, "M").format('MMMM')} Bookings</Text>
                                    </View>
                                    <View
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: 1,
                                            padding: 15,
                                            width: "100%",
                                            borderRadius: "20",
                                            borderColor: "#7367f0",
                                        }}
                                    >
                                        <Text style={styles.red}>{headers.MonthEarnings}/-</Text>
                                        <Text style={styles.secondtext}>{moment(month, "M").format('MMMM')} Earning</Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginTop: 100,
                                    fontSize: 16,
                                    textDecoration: "underline",
                                }}
                            >
                                <Text style={{ color: "#7367f0" }}>Booking Report:</Text>
                            </View>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <View style={styles.tableHeader1}>
                                        <Text wrap={true}>#</Text>
                                    </View>
                                    <View style={styles.tableHeader2}>
                                        <Text wrap={true}>Channel</Text>
                                    </View>
                                    <View style={styles.tableHeader3}>
                                        <Text wrap={true}>Bookings</Text>
                                    </View>
                                    <View style={styles.tableHeader4}>
                                        <Text wrap={true}>Check In</Text>
                                    </View>
                                    <View style={styles.tableHeader5}>
                                        <Text wrap={true}>Check Out</Text>
                                    </View>
                                    <View style={styles.tableHeader6}>
                                        <Text wrap={true}>Room Type</Text>
                                    </View>
                                    <View style={styles.tableHeader7}>
                                        <Text wrap={true}>Status</Text>
                                    </View>
                                    <View style={styles.tableHeader8}>
                                        <Text wrap={true}>Received Amount</Text>
                                    </View>
                                </View>
                            </View>
                            {
                                bookings.length > 0 && bookings.map((b, i) => {
                                    return (
                                        <View key={i + 1} style={styles.tableRow}>
                                            <View style={styles.tableCell1}>
                                                <Text>{i + 1}</Text>
                                            </View>
                                            <View style={styles.tableCell2}>
                                                <Text>{b.Channel}</Text>
                                            </View>
                                            <View style={styles.tableCell3}>
                                                <Text>{b.Bookings}</Text>
                                            </View>
                                            <View style={styles.tableCell4}>
                                                <Text>{moment(b.CheckInDate).format('DD/MM/YY')}</Text>
                                            </View>
                                            <View style={styles.tableCell5}>
                                                <Text>{moment(b.CheckOutDate).format('DD/MM/YY')}</Text>
                                            </View>
                                            <View style={styles.tableCell6}>
                                                <Text>{b.RoomType}</Text>
                                            </View>
                                            <View style={styles.tableCell7}>
                                                <Text>{b.Status}</Text>
                                            </View>
                                            <View style={styles.tableCell8}>
                                                <Text>{b.ReceivedAmount}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                        fixed
                    />
                </Page>
            </Document>
        )
    }

    return (
        <>
            <Modal
                isOpen={open}
                toggle={() => handleOpen()}
                className='modal-dialog-centered modal-lg'
                backdrop={true}
            >
                <ModalHeader toggle={() => handleOpen()}>Revenue Report</ModalHeader>
                <ModalBody>
                    <Row className='ps-1 text-center'>
                        {
                            data.length > 0 ? (
                                <PDFViewer
                                    className='vh-100 vw-100'
                                    showToolbar={true}
                                    children={<PdfComp />}
                                />
                            ) : (
                                <h3>No data available</h3>
                            )
                        }
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default RevModal