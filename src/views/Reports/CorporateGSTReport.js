
import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, InputGroup, InputGroupText, Label, Row } from 'reactstrap';
import Flatpickr from 'react-flatpickr'
import { MdDateRange } from "react-icons/md"
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import axios from '../../API/axios'
import { useSelector } from 'react-redux';
import moment from 'moment';
const CorporateGSTReport = () => {


    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Corporate GST Report"

        return () => {
            document.title = prevTitle
        }
    }, [])




    function subtractMonths(date, months) {
        date.setMonth(date.getMonth() - months);
        return date;
    }

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData
    const [fromDate, setFromDate] = useState(moment(subtractMonths(new Date(), 1)).format('YYYY-MM-DD'))
    const [toDate, setToDate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [creditData, setCreditData] = useState([])
    const [dType, setDType] = useState('')
    console.log('creditData', creditData);
    const dateType = [
        { value: '', label: '' },
        { value: 'Booking Date', label: 'Booking Date' },
        { value: 'Checkin Date', label: 'Checkin Date' },
        { value: 'Checkout Date', label: 'Checkout Date' },
    ]

    const columns = [
        {
            name: "voucher",
            label: "Voucher",
        },
        {
            name: "bookingID",
            label: "Booking ID",
        },
        {
            name: "invNo",
            label: "Invoice No",
        },
        {
            name: "invDt",
            label: "Invoice Date",
        },
        {
            name: "companyName",
            label: "Company Name"
        },
        {
            name: "companyAddress",
            label: "Company Address"
        },
        {
            name: "state",
            label: "State",
        },
        {
            name: "guestName",
            label: "Guest Name",
        },
        {
            name: "grossAmount",
            label: "Gross Amount",
        },
        // {
        //     name: "OtherAdd",
        //     label: "Extra Services",
        // },
        {
            name: "otherLess",
            label: "Discount",
        },
        {
            name: "taxableAmount",
            label: "Taxable Amount",
        },
        {
            name: "cgsT_Amount",
            label: "CGST",
        },
        {
            name: "sgsT_Amount",
            label: "SGST",
        },
        // {
        //     name: "IGST_Amount",
        //     label: "IGST",
        // },

        {
            name: "netAmount",
            label: "Net Amount",
        },

        {
            name: "gst",
            label: "GST No",
        },


    ];


    const options = {
        filterType: 'dropdown',
        download: true,
    };

    const handelReset = async () => {
        setFromDate(moment(subtractMonths(new Date(), 1)).format("YYYY-MM-DD"));
        setToDate(moment(new Date()).format("YYYY-MM-DD"));
        try {
            const res = await axios.get(
                `/Reports/CorporateGSTDetails?FromDate=${moment(subtractMonths(new Date(), 1)).format("YYYY-MM-DD")}&ToDate=${moment(new Date()).format("YYYY-MM-DD")}`,
                {
                    headers: {
                        LoginID,
                        Token,
                    },
                }
            );
            console.log("resData", res.data[0]);
            setCreditData(res?.data[0]);
        } catch (error) {
            console.log("error", error);
        }
    };
    const getcreditData = async () => {
        try {
            const res = await axios.get(`/Reports/CorporateGSTDetails?FromDate=${moment(fromDate).format('YYYY-MM-DD')}&ToDate=${moment(toDate).format('YYYY-MM-DD')}`, {
                headers: {
                    LoginID,
                    Token
                }
            })
            console.log('resData', res.data[0])
            setCreditData(res?.data[0])
        } catch (error) {
            console.log('error', error)
        }
    }
    useEffect(() => {
        getcreditData()
    }, [])

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Corporate GST Report</CardTitle>
                </CardHeader>
                <CardBody className='text-center'>
                    <Row className='align-items-end'>
                        {/* <Col className='text-start'>
                            <Label className='form-label' for='dateType'>
                                Date Type
                            </Label>
                            <Select
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={dateType[0]}
                                onChange={e => {
                                    // console.log(e.value);
                                    setDType(e.value)
                                }}
                                options={dateType}
                                isClearable={false}
                            />
                        </Col> */}
                        <Col className='text-start'>
                            <Label className='form-label' for='startDate'>
                                From Date
                            </Label>
                            {/* <div className='datePicker'>
                                <InputGroup className='input-group-merge'> */}
                            <Flatpickr className='form-control' value={moment(fromDate).format('YYYY-MM-DD')} onChange={date => {
                                setFromDate(moment(date[0]).format('YYYY-MM-DD'))
                            }} id='startDate'
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }} />
                            {/* <InputGroupText>
                                        <MdDateRange size={15} />
                                    </InputGroupText>
                                </InputGroup>
                            </div> */}
                        </Col>
                        <Col className='text-start'>
                            <Label className='form-label' for='startDate'>
                                To Date
                            </Label>
                            {/* <div className='datePicker'>
                                <InputGroup className='input-group-merge'> */}
                            <Flatpickr className='form-control' value={toDate} onChange={date => {
                                setToDate(moment(date[0]).format('YYYY-MM-DD'))
                            }} id='startDate'
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }} />
                            {/* <InputGroupText>
                                        <MdDateRange size={15} />
                                    </InputGroupText>
                                </InputGroup>
                            </div> */}
                        </Col>
                        <Col>
                            <Button className='me-1' color='primary' onClick={getcreditData}>
                                Search
                            </Button>
                            <Button className="me-1" color="primary" onClick={handelReset}>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
                <MUIDataTable
                    // title={"Booking Report"}
                    data={creditData}
                    columns={columns}
                    options={options}
                />
            </Card>

        </>


    )
}

export default CorporateGSTReport

