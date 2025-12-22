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
const CreditReport = () => {


    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Credit Report"

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
            name: "bookingId",
            label: "Booking ID",
        },
        {
            name: "bookingTime",
            label: "Booking Date",
        },
        {
            name: "guestName",
            label: "Guest Name",
        },
        {
            name: "bill Amount",
            label: "Bill Amount",
            options: {
            customBodyRenderLite: (dataIndex) => creditData[dataIndex]["bill Amount"],
             },
        },
        {
            name: "pendingAmount",
            label: "Pending Amount",
        },
        // {
        //     name: "AmountExpectedDate",
        //     label: "Amount Expected Date",
        // },
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
                `/Reports/CreditDetails?FromDate=${moment(subtractMonths(new Date(), 1)).format("YYYY-MM-DD")}&ToDate=${moment(new Date()).format("YYYY-MM-DD")}`,
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
            const res = await axios.get(`/Reports/CreditDetails?FromDate=${moment(fromDate).format('YYYY-MM-DD')}&ToDate=${moment(toDate).format('YYYY-MM-DD')}`, {
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
                    <CardTitle>Credit Report</CardTitle>
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
                        {/* <Col className='text-start'>
                            <Label className='form-label' for='startDate'>
                                From Date
                            </Label>
                            <Flatpickr className='form-control' value={moment(fromDate).format('YYYY-MM-DD')} onChange={date => {
                                setFromDate(moment(date[0]).format('YYYY-MM-DD'))
                            }} id='startDate'
                                options={{
                                    altInput: true,
                                    // altFormat: 'F j, Y',
                                    dateFormat: 'Y-m-d'
                                }} />
                        </Col> */}
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

export default CreditReport

