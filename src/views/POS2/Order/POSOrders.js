import React, { useEffect, useState } from 'react'
import { ArrowRight, ArrowRightCircle, ChevronLeft, Plus, Search } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import OrderTable from './OrderTable'
import GuestDetailForm from '../GuestDetailForm/GuestDetailForm'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'
import { setPosInvoiceID } from '../../../redux/voucherSlice'
import { store } from '@store/store'
import moment from 'moment/moment'
import CancelBill from './CancelBill'
import ReleaseBill from './ReleaseBill'
import HoldBill from './HoldBill'
import { openLinkInNewTab } from '../../../common/commonMethods'


const restoOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card/POS' },
    { value: 'online', label: 'Online' },
    // { value: 'complimentary', label: 'Complimentary (70% off)' }
]

const roomOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card/POS' },
    { value: 'online', label: 'Online' },
    { value: 'checkout', label: 'Pay at Checkout' }
]

const POSOrders = () => {

    const navigate = useNavigate()

    const { name, id } = useParams()

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token, CompanyID, PropertyID } = getUserData

    const [cgst, setCgst] = useState(0)
    const [sgst, setSgst] = useState(0)
    console.log(sgst , "sgst");
    
    const [igst, setIgst] = useState(0)
    const [outsisedState] = useState(false) // get tax from API

    const [posData, setPosData] = useState([])
    console.log('posData', posData)
    const getPosData = async () => {
        // const res = await axios.get('/pos', {
        const res = await axios.get('/pos/get', {
            params: {
                LoginID,
                Token,
                // id: id,
                PropertyID,
                CompanyID

            }
        })
        console.log('PosDatares', res)
        setPosData(res?.data[0])
        if (res?.data[0].length > 0) {
            let result = res?.data[0][0]
            setCgst(result.gstRate / 2)
            setSgst(result.gstRate / 2)
            setIgst(result.gstRate)
        }
    }

    // console.log('cgst', cgst)
    // console.log('sgst', sgst)
    // console.log('igst', igst)

    const [cancel, setCancel] = useState(false)
    const handleCancel = () => setCancel(!cancel)


    const [releaseBill, setReleaseBill] = useState(false)
    const handleRelease = () => setReleaseBill(!releaseBill)


    const [holdBill, setHoldBill] = useState(false)
    const handleHold = () => setHoldBill(!holdBill)

    const [tableOptions, setTableOptions] = useState([])
    const [orderOptions, setOrderOptions] = useState([])
    const [roomNoData, setRoomNoData] = useState([])
    console.log('roomNoData', roomNoData);
    const [prCatData, setPrCatData] = useState([])
    const [prData, setPrData] = useState([])
    console.log('prData', prData);
    const [selectedTable, setSelectedTable] = useState('')
    const [selTableObj, setSelTableObj] = useState({})
    const [selectedGuest, setSelectedGuest] = useState('')
    const [selGuestObj, setSelGuestObj] = useState({})
    const [inResto, setInResto] = useState(true)
    const [serverName, setServerName] = useState('')
    const [other, setOther] = useState('')

    const [activeCatID, setActiveCatID] = useState('')
    const [paymentOption, setPaymnetOption] = useState('')
    const [orderData, setOrderData] = useState([])
    console.log('orderData', orderData);

    const [orderItems, setOrderItems] = useState([])
    console.log('orderItemsss', orderItems);

    const [itemTotal, setItemTotal] = useState(0)
    const [showEdit, setShowEdit] = useState(false)
    const [remark, setRemark] = useState('')

    const [searchVal, setSearchVal] = useState("")
    const search = (data) => {
        return data.filter(item => item.posProductName.toLowerCase().includes(searchVal.toLowerCase()));
    };
    const [kotFlag, setKotFlag] = useState(false)

    const getTableData = async () => {
        try {
            const res = await axios.get('/pos_table', {
                params: {
                    LoginID,
                    Token,
                    PoSID: id
                }
            })
            console.log('tableres', res)
            let result = res?.data[0]
            let orderResult = res?.data[1]
            let tOpt
            let OrderOpt
            if (result.length > 0) {
                tOpt = result.map(r => {
                    return { value: r.posTableID, label: r.posTableName, ...r }
                })
                setTableOptions(tOpt)
            } else if (orderResult.length > 0) {
                OrderOpt = orderResult.map(r => {
                    // console.log('OrderOpt', r);
                    return { value: r.posOrderID, label: r.posOrderID, ...r }
                })
                setOrderOptions(OrderOpt)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const getRoomNoData = async () => {
        try {
            const res = await axios.get('/pos_orders/rooms', {
                params: {
                    LoginID,
                    Token
                }
            })
            let result = res?.data[0]
            console.log('result Room', result)
            let roomNo
            if (result.length > 0) {
                roomNo = result.filter(r => r.bookingID !== null).map(r => {
                    return { value: r.floorID, label: `${r.roomNo} - ${r.bookingID}`, ...r }
                })
                setRoomNoData(roomNo)
            } else {
                setRoomNoData([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const getPrCatData = async () => {
        try {
            const res = await axios.get('/pos_category', {
                params: {
                    LoginID,
                    Token,
                    PoSID: id
                }
            })
            console.log('catres', res)
            let result = res?.data[0]
            let tOpt
            if (result.length > 0) {
                tOpt = result.map(r => {
                    return { value: r.posTableID, label: r.posTableName, ...r }
                })
                setPrCatData(tOpt)
            } else {
                setPrCatData([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const getPrData = async () => {
        try {
            const res = await axios.get('/pos_product', {
                params: {
                    LoginID,
                    Token,
                    PoSID: id
                }
            })
            // console.log('productres', res)
            let result = res?.data[0]
            let tOpt
            if (result.length > 0) {
                tOpt = result.map(r => {
                    // return { value: r.posTableID, label: r.posTableName, ...r }
                    return { value: r.posProductID, label: r.posProductName, ...r }
                })
                setPrData(tOpt)
            } else {
                setPrData([])
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        getPosData()
        getTableData()
        getRoomNoData()
        getPrCatData()
        getPrData()
    }, [])

    const [active, setActive] = useState(1)

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    const [discount, setDiscount] = useState(0)
    const [discountType, setDiscountType] = useState('%')
    const [discountValue, setDiscountValue] = useState(0)

    const [tax, setTax] = useState(0)   // get tax from API
    const [orderTotal, setOrderTotal] = useState()

    const getTheTax = (total) => {
        let tx = 0
        if (outsisedState) {
            tx = +total * +igst / 100
        } else {
            tx = (+total * +cgst / 100) + (total * +sgst / 100)
        }
        return tx
    }

    const getItemTotal = (items) => {
        console.log('items', items)
        let newItems = items?.filter(i => i.EntryType !== "D")
        if (newItems?.length === 0) {
            setItemTotal(0)
        }
        let newTotal = newItems?.reduce(function (prev, current) { return prev + (+current?.price * current.quantity) }, 0)
        console.log('newT', newTotal)
        setItemTotal(newTotal)
    }

    // const addProduct2order = (prouctId) => {
    //     const productItem = prData?.filter(product => product.POSProductID === prouctId)[0]
    //     // console.log('productItem', productItem)
    //     const orderItem = orderItems?.filter(product => product.POSProductID === prouctId)
    //     // console.log('orderItems > ', orderItems)
    //     // console.log('orderItems---- ', orderItem)
    //     // if (orderItem?.length > 0) {
    //     //     toast.error(`'${productItem.POSProductName}' is already added in the order`)
    //     // }
    //     if (orderItem?.length > 0 && orderItem[0].EntryType === 'D') {
    //         let arr = orderItems.map(o => {
    //             if (o.POSProductID === orderItem[0].POSProductID) {
    //                 orderItem[0].EntryType = 'U'
    //             }
    //             return o
    //         })
    //         setOrderItems(arr)
    //         setKotFlag(true)
    //     } else {
    //         setOrderItems([...orderItems, { name: productItem.POSProductName, Price: productItem.Price, product_id: productItem.POSProductID, EntryType: 'I', ...productItem }])
    //         toast.success(`'${productItem.POSProductName}' is added in the order`)
    //     }
    // }
    const addProduct2order = (productId) => {
        const productItem = prData?.find(product => product.posProductID === productId);
        const orderItemIndex = orderItems.findIndex(item => item.posProductID === productId);

        if (orderItemIndex !== -1 && orderItems[orderItemIndex].isKOTPrint) {
            setOrderItems([...orderItems, { name: productItem.posProductName, Price: productItem.price, Quantity: 1, POSProductID: productItem.posProductID, EntryType: 'I', ...productItem }]);
            toast.success(`'${productItem.posProductName}' is added to the order`);
        } else if (orderItemIndex !== -1 && orderItems[orderItemIndex].EntryType === 'D') {
            const updatedOrderItems = orderItems.map(item => {
                if (item.posProductID === productId) {
                    return { ...item, EntryType: 'U' };
                }
                return item;
            });
            setOrderItems(updatedOrderItems);
            setKotFlag(true);
        } else if (orderItemIndex !== -1) {
            const updatedOrderItems = orderItems.map((item, index) => {
                if (index === orderItemIndex) {
                    return { ...item, Quantity: item.quantity + 1 };
                }
                return item;
            });
            setOrderItems(updatedOrderItems);
            toast.success(`Quantity of '${productItem.posProductName}' increased to ${orderItems[orderItemIndex].quantity + 1}`);
        } else {
            setOrderItems([...orderItems, { name: productItem.posProductName, Price: productItem.price, Quantity: 1, POSProductID: productItem.posProductID, EntryType: 'I', ...productItem }]);
            toast.success(`'${productItem.posProductName}' is added to the order`);
        }
    };


    const calcDiscount = () => {
        let discnt
        if (discountType === '%') {
            // console.log('total & tax', discountValue, itemTotal, getTheTax(+itemTotal))
            discnt = (+discountValue / 100) * (itemTotal + getTheTax(+itemTotal))
            // console.log('calculated discount', discnt)
            setDiscount(Number(discnt).toFixed(2))
        } else {
            setDiscount(discountValue)
        }
    }

    const getExistingTableOrderData = async (TableID) => {
        // console.log('kot par function chala');
        try {
            const res = await axios.get('/pos_orders', {
                params: {
                    LoginID,
                    Token,
                    Seckey:"abc",
                    TableID,
                    OrderID: posData[0]?.hasTables === false ? TableID : ''
                }
            })
            console.log('exist order res', res)
            if (res?.data[0].length > 0) {
                setOrderData(res?.data[0])
                setOrderItems(res?.data[1])
                getItemTotal(res?.data[1])
                setDiscountType(res?.data[0][0].discountType)
                setDiscountValue(res?.data[0][0].discount)
                getTheTax(res?.data[0][0].Total)
                calcDiscount()

            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const getExistingGuestOrderData = async (FloorID, BookingID) => {
        try {
            const res = await axios.get('/pos_orders/rooms', {
                params: {
                    LoginID,
                    Token,
                    FloorID,
                    BookingID
                }
            })
            // console.log('gettDAta', FloorID, BookingID)
            // console.log('result with FLRID', res?.data)
            if (res?.data[0].length > 0) {
                setOrderData(res?.data[0])
                setOrderItems(res?.data[1])
                getItemTotal(res?.data[1])
                setDiscountType(res?.data[0][0].discountType)
                setDiscountValue(res?.data[0][0].discount)
                getTheTax(res?.data[0][0].total)
                calcDiscount()
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const resetOrder = () => {
        setTax('')
        setDiscount('')
        setDiscountValue('')
        setItemTotal('')
        setOrderTotal('')
    }

    const saveSecondary = () => {
        // console.log('secondary0');
        setSelectedGuest('')
        setSelGuestObj({})
        setSelectedTable('')
        setSelTableObj({})
        setOrderData([])
        setOrderItems([])
        resetOrder()
        getTableData()
        // console.log('secondary1');
    }

    const selectTable = (e) => {
        saveSecondary()
        if (e) {
            setSelectedTable(e.value)
            setSelectedGuest('')
            setSelTableObj(e)
            getExistingTableOrderData(e.value)
        } else {
            setSelectedTable('')
        }
    }

    const selectGuest = (e) => {
        saveSecondary()
        let thisData = []
        if (e) {
            setSelectedGuest(e.value)
            setSelectedTable('')
            setSelGuestObj(e)
            getExistingGuestOrderData(e.value, e.bookingID)
        } else {
            setSelectedGuest('')
        }
        setOrderData(thisData)
        // const t = getItemTotal(thisData)
        // console.log("thisData - ", t)
        // setItemTotal(t)
    }

    useEffect(() => {
        saveSecondary()
        // search()
    }, [inResto])

    useEffect(() => {
        getItemTotal(orderItems)
    }, [orderItems])

    useEffect(() => {
        // console.log('oldTax', tax)
        const tx = getTheTax(+itemTotal)
        setTax(tx)
        // console.log('newTax', tx)
        setOrderTotal((+itemTotal + +tx) - +discount)
        calcDiscount()
    }, [itemTotal, orderItems])

    useEffect(() => {
        setOrderTotal(+itemTotal + +tax - +discount)
    }, [discount])

    useEffect(() => {
        calcDiscount()
    }, [discountType, discountValue, itemTotal,])

    // console.log('orderItems1', selectedTable);
    useEffect(() => {
        posData[0]?.hasTables === false ? getExistingTableOrderData(selectedTable) : ''
    }, [])

    // Save Order
    const saveOrder = async () => {
        if (orderItems && orderItems.length > 0) {
            let newArr = orderItems.map(
                item => Object.fromEntries(
                    Object.entries(item).map(([key, val]) => [key, String(val)])
                )
            )
            // console.log('modification', newArr)
            let GuestDataarr = roomNoData.filter(c => c.floorID === selectedGuest)
            let bArr = GuestDataarr.filter(g => g.bookingID === selGuestObj.bookingID)
            // console.log('GuestDataarr', GuestDataarr);
            // console.log('bArr', bArr);
            const postData = {
                LoginID: LoginID,
                Token: Token,
                Seckey:"abc",
                POSID: id,
                Seckey : "abc",
                ServedAt: inResto ? "Table" : "Room",
                POSTableID: inResto ? selectedTable : '',
                FloorID: inResto === false ? selectedGuest : '',
                ServerName: serverName,
                Remark: inResto ? `${selTableObj?.posTableName === undefined ? '' : selTableObj?.posTableName} ${other}` : `${selGuestObj?.roomNo}`,
                GuestID: GuestDataarr[0]?.guestID,
                BookingID: bArr[0]?.bookingID,
                TransactionID: GuestDataarr[0]?.transactionID,
                RoomAllocationID: GuestDataarr[0]?.roomAllocationID,
                CGST: cgst,
                SGST: sgst,
                IGST: igst,
                Taxes: tax,
                // Discount: Number(discount),
                Discount: Number(discountValue),
                DiscountType: discountType,
                TotalDue: orderTotal,
                Total: itemTotal,
                OrderDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                PoSOrderItems: newArr
            }
            console.log("postData", postData)
            try {
                const res = await axios.post("/pos_orders", postData)
                console.log('res', res);
                if (res?.data[0][0].status === "Success") {
                    toast.success(inResto ? `Order of POS ${selTableObj?.posTableName} saved` : `Order of POS ${selGuestObj?.roomNo} saved`)
                    setKotFlag(false)

                    if (inResto === false) {
                        // console.log('hit');
                        getExistingGuestOrderData(selectedGuest, bArr[0].bookingID)
                    } else if (posData[0]?.hasTables === false) {
                        saveSecondary()
                    } else {
                        getExistingTableOrderData(selectedTable)
                    }
                    // (inResto ? getExistingTableOrderData(selectedTable) : getExistingGuestOrderData(selectedGuest))
                } else {
                    toast.error("Something went wrong, Try again!")
                }
                // saveSecondary()
            } catch (error) {
                console.log('error', error)
                toast.error(`Something went wrong, Try again!`)
            }
        }
    }

    const editSaveOrder = async () => {
        // console.log('sel kot')
        try {
            let GuestDataarr = roomNoData.filter(c => c.floorID === selectedGuest)
            let bArr = GuestDataarr.filter(g => g.bookingID === selGuestObj.bookingID)
            // console.log('GuestDataarr', GuestDataarr);
            // console.log('bArr', bArr);
            const obj = {
                LoginID,
                Token,
                POSID: orderData[0]?.POSID,
                ServedAt: orderData[0]?.servedAt,
                POSTableID: orderData[0].pOSTableID,
                FloorID: orderData[0]?.floorID,
                ServerName: orderData[0]?.serverName,
                Remark: orderData[0]?.remark,
                GuestID: GuestDataarr[0]?.guestID,
                BookingID: bArr[0]?.bookingID,
                TransactionID: GuestDataarr[0]?.transactionID,
                RoomAllocationID: GuestDataarr[0]?.roomAllocationID,
                CGST: orderData[0]?.CGST,
                SGST: orderData[0]?.SGST,
                IGST: orderData[0]?.IGST,
                // Discount: orderData[0]?.Discount,
                Discount: Number(discountValue),
                TotalDue: orderTotal,
                Total: itemTotal,
                Taxes: tax,
                DiscountType: discountType,
                OrderDate: orderData[0]?.orderDate,
                PoSOrderItems: orderItems
            }
            console.log('sel kot', obj)
            const res = await axios.post(`/pos_orders/update?id=${orderData[0]?.posOrderID}`, obj)
            console.log('editres', res)
            if (res.data[0][0].status === "Success") {
                // saveSecondary()
                (inResto ? getExistingTableOrderData(orderData[0].posTableID) : getExistingGuestOrderData(orderData[0]?.floorID, bArr[0].bookingID))
                toast.success(`${orderData[0]?.posOrderID} updated!`)
                setKotFlag(false)
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Something went wrong, Try again!')
        }
    }

    // const holdBill = async () => {
    //     const OID = orderData[0]?.PoSOrderID
    //     if (remark) {
    //         axios.post(`/pos_orders/hold?id=${OID}`, {
    //             LoginID,
    //             Token,
    //             Remark: remark
    //         }).then(res => {
    //             console.log('hold', res.data)
    //             if (res.data[0][0].Status == "Success") {
    //                 toast.success(res.data[0][0].Message, { position: 'top-right' })
    //                 setShowEdit(!showEdit)
    //             }
    //         }).catch(e => {
    //             setShowEdit(!showEdit)
    //             toast.error(e.response.data.Message, { position: 'top-right' })
    //         })
    //     } else {
    //         toast.error("Please Add Remark To Hold Bill", { position: 'top-center' })
    //     }
    // }

    return (
        <>
            <div className='d-flex'>
                <Button className='mb-1 ' size='sm' color='primary' onClick={() => navigate(-1)}><ChevronLeft size={25} color='#FFF' /></Button>
                <span className='fs-3 mx-auto'>{name} - POS Orders</span>
            </div>
            <Row>
                <Col xl='12'>
                    <Card>
                        <CardBody>
                            <Row className='mb-1'>
                                <Col md='6'>
                                    <Row>
                                        <Col xl='12 mt-25 d-flex justify-content-between'>
                                            <Label className='fw-bold fs-5 me-1 cursor-pointer'>
                                                <Input
                                                    type='radio'
                                                    name='pos'
                                                    className='me-1'
                                                    checked={inResto}
                                                    onChange={() => setInResto(!inResto)}
                                                />
                                                {name} - Restaurant</Label>

                                            <Label className='fw-bold fs-5 ms-1 cursor-pointer'>
                                                <Input
                                                    type='radio'
                                                    name='pos'
                                                    className='me-1'
                                                    checked={!inResto}
                                                    onChange={() => setInResto(!inResto)}
                                                />
                                                Room Transfer</Label>
                                        </Col>

                                        {
                                            inResto ? (
                                                <>
                                                    {posData[0]?.hasTables === false ? <Col xl='12 mt-2'>
                                                        <Label>Select Order Id</Label>
                                                        <Select
                                                            name='TableName'
                                                            id='TableName'
                                                            key='TableName'
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={orderOptions}
                                                            onChange={selectTable}
                                                        />
                                                    </Col> : <Col xl='12 mt-2'>
                                                        <Label>Select Table</Label>
                                                        <Select
                                                            name='TableName'
                                                            id='TableName'
                                                            key='TableName'
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={tableOptions}
                                                            onChange={selectTable}
                                                        />
                                                    </Col>}
                                                    {/* <Col xl='12 mt-2'>
                                                        <Label>Select Table</Label>
                                                        <Select
                                                            name='TableName'
                                                            id='TableName'
                                                            key='TableName'
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={tableOptions}
                                                            onChange={selectTable}
                                                        />
                                                    </Col> */}
                                                    {/* <Col><button type="" onClick={() => getExistingTableOrderData()}>new</button></Col> */}

                                                    {/* <Col xl='12 mt-2'>
                                                        <Label>Other</Label>
                                                        <Input
                                                            type='text'
                                                            placeholder='Walkin or Parcel'
                                                            name='other'
                                                            value={other}
                                                            onChange={e => setOther(e.target.value)}
                                                        />
                                                    </Col> */}

                                                </>
                                            ) : (
                                                <>
                                                    <Col xl='12 mt-2'>
                                                        <Label>Room No.</Label>
                                                        <Select
                                                            name='GuestName'
                                                            id='GuestName'
                                                            key='GuestName'
                                                            placeholder=''
                                                            menuPlacement='auto'
                                                            theme={selectThemeColors}
                                                            className='react-select'
                                                            classNamePrefix='select'
                                                            options={roomNoData}
                                                            onChange={selectGuest}
                                                        />
                                                    </Col>
                                                    {/* {console.log('SelectedRoom', selGuestObj, selectedGuest)} */}
                                                    {
                                                        selectedGuest.length > 0 && (
                                                            <Col className='mt-1'>
                                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                                    {selGuestObj?.guestName && <p>Name: {selGuestObj?.guestName}</p>}
                                                                    {selGuestObj?.guestMobileNumber && <p>Phone: {selGuestObj?.guestMobileNumber}</p>}
                                                                </div>
                                                                <div className='d-flex flex-row justify-content-between align-items-center'>
                                                                    {selGuestObj?.guestEmail && <p>Email: {selGuestObj?.guestEmail}</p>}
                                                                    {selGuestObj?.ratePlan && <p>Rate Plan: {selGuestObj?.ratePlan}</p>}
                                                                </div>
                                                            </Col>
                                                        )
                                                    }
                                                </>
                                            )
                                        }</Row>
                                </Col>
                                <Col md='6'>
                                    <Row>

                                        <Col xl='12 mt-2 mt-md-4'>
                                            <Label>Server name</Label>
                                            <Input
                                                type='text'
                                                name='server'
                                                value={serverName}
                                                onChange={e => setServerName(e.target.value)}
                                            />
                                        </Col>
                                        {/* {console.log(orderData, !orderData[0]?.PoSOrderID, orderData[0]?.Status === "Hold", kotFlag)} */}
                                        {

                                            orderItems && orderItems.length > 0 && (
                                                <Col xl='12' className=' mt-2 mt-md-4 btn-group-sm d-flex justify-content-around'>
                                                    <Button
                                                        color='info'
                                                        disabled={!orderData[0]?.poSOrderID || orderData[0]?.status === "Hold" || kotFlag}
                                                        onClick={() => {
                                                            // setKotFlag(true)
                                                            // console.log('orderData[0].POSTableID', orderData, orderData[0].POSTableID, inResto, kotFlag, orderItems)
                                                            // { inResto ? getExistingTableOrderData(orderData[0].POSTableID) : getExistingGuestOrderData(orderData[0]?.FloorID, orderData[0].BookingID) }
                                                            saveSecondary()
                                                            // setSelectedTable('')
                                                            store.dispatch(setPosInvoiceID(orderData[0]?.poSOrderID))
                                                            openLinkInNewTab('/kot')
                                                        }}>Print KOT</Button>
                                                    <Button color={orderData[0]?.status === "Hold" ? 'success' : 'warning'} onClick={() => { orderData[0]?.status === "Hold" ? handleRelease() : handleHold() }} disabled={!orderData[0]?.poSOrderID}>{orderData[0]?.status === "Hold" ? 'Release Bill' : 'Hold Bill'} </Button>
                                                    <Button color='danger' disabled={!orderData[0]?.poSOrderID || orderData[0]?.status === "Hold"} onClick={handleCancel}>Cancel Bill</Button>
                                                </Col>
                                            )
                                        }
                                    </Row>
                                </Col>

                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{name}</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row className='mb-1'>
                                <Col>
                                    <Input
                                        type='text'
                                        name='search menu'
                                        placeholder='Search an Item'
                                        value={searchVal}
                                        onChange={e => setSearchVal(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row className='mb-1'>
                                <Col>
                                    {searchVal.length > 3 ? '' : <Nav tabs>
                                        {
                                            prCatData.length > 0 && (
                                                prCatData.map((cat, cidx) => {
                                                    return (
                                                        <NavItem key={cidx} className='posCategories'>
                                                            <NavLink active={active === (cidx + 1)} onClick={() => {
                                                                toggle(cidx + 1)
                                                                setActiveCatID(cat.productCategoryID)
                                                            }}>
                                                                {cat.productCategoryName}
                                                            </NavLink>
                                                        </NavItem>
                                                    )
                                                })
                                            )
                                        }
                                    </Nav>}

                                    <TabContent activeTab={active}>
                                        {
                                            prCatData.length > 0 && (
                                                prCatData.map((cat, cidx) => {
                                                    console.log('activeTab', cat)
                                                    return (
                                                        <TabPane tabId={cidx + 1}>
                                                            <ListGroup flush>
                                                                {
                                                                    prData.length > 0 && (
                                                                        search(prData).map((p, pid) => {
                                                                            if (searchVal.length > 3) {
                                                                                console.log('searched', p)
                                                                                return (
                                                                                    <ListGroupItem key={pid} className='d-flex flex-row justify-content-between'>
                                                                                        <Col className='me-1'>{p.posProductName}</Col>
                                                                                        <Col>₹ {p.price}</Col>
                                                                                        <Button
                                                                                            className='h-50'
                                                                                            color='primary'
                                                                                            size='sm'
                                                                                            onClick={() => {
                                                                                                if (posData[0]?.hasTables === false) {
                                                                                                    addProduct2order(p.posProductID)
                                                                                                } else if (selectedTable === '' && selectedGuest === '') {
                                                                                                    toast.error('Select a table or Room First!')
                                                                                                } else {
                                                                                                    addProduct2order(p.posProductID)
                                                                                                }
                                                                                            }}>
                                                                                            <Plus size={12} />
                                                                                        </Button>
                                                                                    </ListGroupItem>
                                                                                )
                                                                            } else if (p.productCategoryID === cat.productCategoryID) {
                                                                                return (
                                                                                    <ListGroupItem key={pid} className='d-flex flex-row justify-content-between'>
                                                                                        <Col className='me-1'>{p.posProductName}</Col>
                                                                                        <Col>₹ {p.price}</Col>
                                                                                        <Button
                                                                                            className='h-50'
                                                                                            color='primary'
                                                                                            size='sm'
                                                                                            onClick={() => {
                                                                                                if (posData[0]?.hasTables === false) {
                                                                                                    addProduct2order(p.posProductID)
                                                                                                } else if (selectedTable === '' && selectedGuest === '') {
                                                                                                    toast.error('Select a table or Room First!')
                                                                                                } else {
                                                                                                    addProduct2order(p.posProductID)
                                                                                                }
                                                                                            }}>
                                                                                            <Plus size={12} />
                                                                                        </Button>
                                                                                    </ListGroupItem>
                                                                                )

                                                                            }
                                                                        })
                                                                    )
                                                                }
                                                            </ListGroup>
                                                        </TabPane>
                                                    )
                                                })
                                            )
                                        }
                                    </TabContent>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                {/* {console.log('orderData', orderData)} */}
                <Col md='7'>
                    <Card>
                        <CardHeader>
                            <CardTitle>ORDERS</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {(orderItems && orderItems.length > 0) ? (<>
                                <Row className='mb-1'>
                                    <Col xl='12'>
                                        <OrderTable
                                            orderData={orderData}
                                            orderItems={orderItems}
                                            setOrderItems={setOrderItems}
                                            getItemTotal={getItemTotal}
                                            setKotFlag={setKotFlag
                                            } />
                                    </Col>
                                    <Col xl='12'>
                                        <ListGroup>

                                            <ListGroupItem>
                                                <Row>
                                                    {/* <Col>Total ( {orderItems.reduce(function (count, current) { return count + +current.Quantity }, 0)} item/s )</Col> */}
                                                    <Col>Total ( {orderItems.length} item/s )</Col>
                                                    <Col className='text-end'>{Number(itemTotal).toFixed(2)}</Col>
                                                </Row>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <Row>
                                                    <Col>SGST @{sgst}%</Col>
                                                    <Col className='text-end'>+ {Number(itemTotal * sgst / 100).toFixed(2)}</Col>
                                                </Row>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <Row>
                                                    <Col>CGST @{cgst}%</Col>
                                                    <Col className='text-end'>+ {Number(itemTotal * cgst / 100).toFixed(2)}</Col>
                                                </Row>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <Row>
                                                    <Col>Total (Incl All Taxes)</Col>
                                                    <Col className='text-end'>₹ {Number(+itemTotal + +tax).toFixed(2)}</Col>
                                                </Row>
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                <Row>
                                                    <Col><span>Discount</span></Col>
                                                    <Col className='p-0 d-flex'>
                                                        <div className='form-switch w-50 ps-0'>
                                                            Flat <Input type='switch' className='ms-25 mb-25 '
                                                                style={{ width: '28px', height: '16px' }}
                                                                name='posDiscount'
                                                                id='posDiscount'
                                                                checked={discountType === '%'}
                                                                onChange={(e) => {
                                                                    setDiscountType(e.target.checked ? '%' : 'F')
                                                                    setDiscountValue('')
                                                                }}
                                                            /> %
                                                        </div>
                                                        <Input
                                                            className='p-25 float-end w-25 text-end w-50'
                                                            type='number'
                                                            name='DiscountPercent'
                                                            value={discountValue}
                                                            onChange={(e) => {
                                                                setDiscountValue(e.target.value)
                                                                // setDiscount(Number((+itemTotal + +tax) * (+e.target.value / 100)).toFixed(2))
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col className='text-end'>

                                                        <h4 className='d-inline me-1' style={{ verticalAlign: '-webkit-baseline-middle' }}> - </h4>
                                                        <Input
                                                            className='p-25 w-50 float-end text-end'
                                                            type='text'
                                                            name='Discount'
                                                            value={discount}
                                                            disabled
                                                        />
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                            <ListGroupItem color='primary'>
                                                <Row>
                                                    <Col>Total Due (Rounded off)</Col>
                                                    <Col className='text-end'>₹ {Number(+orderTotal).toFixed(2)}</Col>
                                                </Row>
                                            </ListGroupItem>
                                        </ListGroup>
                                    </Col>
                                </Row>
                                <Row className='mt-1'>
                                    <Col className='text-center'>
                                        <Button color='success' onClick={orderData[0]?.posOrderID ? editSaveOrder : saveOrder}>{orderData[0]?.posOrderID ? `Edit & Save Order` : `Save Order`}</Button>
                                    </Col>
                                </Row>
                                <Row className='mb-1'>
                                    <Col>
                                        <Label className='fw-bold fs-5'>Payment Type</Label>
                                        <Select
                                            placeholder=''
                                            menuPlacement='auto'
                                            theme={selectThemeColors}
                                            className='react-select'
                                            classNamePrefix='select'
                                            options={inResto ? restoOptions : roomOptions}
                                            onChange={e => setPaymnetOption(e.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row className='mb-1'>
                                    {
                                        paymentOption && (
                                            <GuestDetailForm
                                                inResto={inResto}
                                                option={paymentOption}
                                                table={selectedTable}
                                                guest={selectedGuest}
                                                orderData={orderData}
                                                setOrderData={setOrderData}
                                                saveSecondary={saveSecondary}
                                                roomNoData={roomNoData}
                                                selGuestObj={selGuestObj}

                                            />
                                        )
                                    }
                                </Row></>) : null
                            }
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            {cancel && <CancelBill cancel={cancel} handleCancel={handleCancel} id={orderData[0]?.posOrderID} saveSecondary={saveSecondary} />}
            {releaseBill && <ReleaseBill releaseBill={releaseBill} handleRelease={handleRelease} id={orderData[0]?.posOrderID} saveSecondary={saveSecondary} />}
            {holdBill && <HoldBill holdBill={holdBill} handleHold={handleHold} id={orderData[0]?.posOrderID} saveSecondary={saveSecondary} />}

            <Modal
                isOpen={showEdit}
                toggle={() => setShowEdit(!showEdit)}
                className='modal-dialog-centered modal-md'
                backdrop={false}
            >
                <ModalHeader className='bg-transparent' toggle={() => setShowEdit(!showEdit)}>
                    Remark
                </ModalHeader>
                <ModalBody className='px-sm-2 mx-50 pb-5'>
                    <Row>
                        <Col>
                            <Label>Remark<span className='text-danger'>*</span></Label>
                            <Input
                                type='text'
                                name='name'
                                placeholder='Enter Remark'
                                value={remark}
                                onChange={e => setRemark(e.target.value)}
                            />
                        </Col>


                    </Row>
                    <Row tag='form' className='gy-1 gx-2 mt-75' >
                        <Col className='text-end mt-1' xs={12}>
                            <Button className='me-1' color='primary' onClick={holdBill}>
                                Submit
                            </Button>
                            <Button
                                color='secondary'
                                outline
                                onClick={() => {
                                    setShowEdit(!showEdit)
                                }}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            {
                showEdit ? (
                    <div className="modal-backdrop fade show" ></div>
                ) : null
            }
        </>

    )


}
export default POSOrders