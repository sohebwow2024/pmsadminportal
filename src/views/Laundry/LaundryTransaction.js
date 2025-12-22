import React, { useEffect, useState } from 'react'
import { ChevronLeft, Plus, ChevronDown, Trash2, User, UserX, Minus } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane, Badge } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import DataTable from 'react-data-table-component'
import GuestDetailForm from './GuestDetailForm'
import { toast } from 'react-hot-toast'
import axios from '../../API/axios'
import { useSelector } from 'react-redux'
import moment from 'moment'
import LaundryTemplate from '../../apps/Templates/LaundryTemplate'
import { openLinkInNewTab } from '../../common/commonMethods'
import InputNumber from 'rc-input-number';

const paymentOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card/POS' },
    { value: 'online', label: 'Online' },
    { value: 'checkout', label: 'Pay at Checkout' }
]

const LaundryTransaction = () => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS-Laundry Transaction"

        return () => {
            document.title = prevTitle
        }
    }, [])

    const getUserData = useSelector(state => state.userManageSlice.userData)

    const { LoginID, Token } = getUserData

    const [paymentOption, setPaymnetOption] = useState('')
    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestMail] = useState('')
    const [guestMobileumber, setGuestMobileumber] = useState('')
    const [guestLabel, setGuestLabel] = useState('')
    const [dataLoading, setDataLoading] = useState('')
    const [laundryMaster, setLaundryMaster] = useState([]);
    const [roomNoOptions, setRoomNoOptions] = useState([])
    const [roomData, setRoomData] = useState()
    const [roomListData, setRoomListData] = useState([]);
    const [laundryData, setLaundryData] = useState([]);
    const [laundryUpdated, setlaundryUpdated] = useState(false);
    const [transactionId,setTransactionId] = useState()
    // const [laundryMaster, setLaundryMaster] = useState([]);

    console.log("laundryData", laundryData);

    const [discount, setDiscount] = useState(0)
    // const [discountType, setDiscountType] = useState('%')
    const [discountType, setDiscountType] = useState('flat')
    const [discountPercent, setDiscountPercent] = useState(0)

    const [cgst] = useState(2.5) // get tax from API
    const [sgst] = useState(2.5) // get tax from API
    const [igst] = useState(5)   // get tax from API
    const [outsisedState] = useState(false) // get tax from API

    const [orderTotal, setOrderTotal] = useState()
    // const [newLaundaryId, setNewLaundaryId] = useState('')
    // console.log('newLaundaryId', newLaundaryId);
    const navigate = useNavigate()

    const [active, setActive] = useState('1')

    const [serviceSelected, setServiceSelected] = useState('')

    const [localLaundryData, setLocalLaundaryData] = useState([])

    const [laundryTotal, setLaundryTotal] = useState()

    const [tax, setTax] = useState()   // get tax from API
    const [render, setRender] = useState(false);


    //get laundry master data 
    // const getLaundaryList = async () => {
    //     setDataLoading(true)
    //     const postData = {
    //         LoginID: LoginID,
    //         Token: Token,
    //         Seckey: "abc",
    //         Event: "select"
    //     }
    //     try {
    //         await axios.post("/laundry", postData).then((res) => {
    //             setLaundryMaster(res.data[0])
    //             console.log("laundry master", res.data[0])
    //             setDataLoading(false)
    //         })
    //     } catch (error) {
    //         console.log("file: AddLaundry.js:107  laundaryData  error", error)
    //         setDataLoading(false)
    //     }
    // }

    const getLaundaryList = async () => {
        setDataLoading(true);
        const postData = {
            LoginID: LoginID,
            Token: Token,
            Seckey: "abc",
            Event: "select"
        };
        try {
            const res = await axios.post("/laundry", postData);

            // 👇 Add `service` and `disabledServices` to each item
            const updatedList = res.data[0].map(item => ({
                ...item,
                service: '',
                disabledServices: {
                    Washing: false,
                    Pressing: false,
                    'Dry Cleaning': false
                }
            }));

            setLaundryMaster(updatedList);
            console.log("laundry master", updatedList);
            setDataLoading(false);
        } catch (error) {
            console.log("file: AddLaundry.js:107  laundaryData  error", error);
            setDataLoading(false);
        }
    };


    //get room number and guest details for dropdown
    const roomNumberOptions = async () => {
        const postData = {
            LoginID: LoginID,
            Token: Token,
            Seckey: "abc",
            Event: "select",
            FloorID: null,
            laundryTransactionDetails : []
        }
        try {
            await axios.post("/laundry/transaction", postData)
                .then((res) => {
                    console.log('nnnn', res)
                    setRoomListData(res.data[0])
                    setRoomNoOptions(res.data[0].map((roomNo) => {
                        return { value: roomNo.guestName, label: `${roomNo.roomNo}-${roomNo.bookingID}` }
                    }))
                })
        } catch (error) {
            console.log("file: LaundryTransaction.js:69  roomNumberOptions  error", error)
        }
    }

    //initial function calls 
    useEffect(() => {
        getLaundaryList()
        roomNumberOptions()
    }, [])

    //get room data from selected room id
    useEffect(() => {
        if (roomData) {
            getDataByRoomNo(roomData)
        }
    }, [roomData, laundryUpdated])

    // calculate total
    const getLaundryTotal = (data) => {
        console.log('hggsdhgdsjhg', data, data?.reduce((prev, current) => prev + current.Amount, 0))
        if (!data) {
            calData = laundryData
        }
        let calData = data.filter(data => ((data.EntryType && data.EntryType == 'I') || (data.EntryType == undefined)))

        if (calData?.length < 1) {
            return 0
        }


        let total = calData?.reduce(function (prev, current) { return prev + (+current?.Amount * current.Quantity) }, 0)


        console.log("hggsdhgdsjhg", total)
        return total
    }

    //calculate tax
    const getTheTax = (total) => {
        let tx = 0
        if (outsisedState) {
            tx = +total * +igst / 100
        } else {
            tx = (+total * +cgst / 100) + (total * +sgst / 100)
        }
        return tx
    }

    //toggle tabs
    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

const removeLaundry = async (row) => {
    console.log("Row Data==>",row)
    let laundryList = [...laundryData];
    const laundryIndex = laundryList.findIndex(data => data === row);
    const laundryitem = laundryList[laundryIndex];
    
    // Remove the item
    if (laundryitem.EntryType !== undefined && laundryitem.EntryType === 'I') {
        laundryList.splice(laundryIndex, 1);
    } else {
        laundryList.push({
            LaundryOrderItemID: laundryitem.LaundryOrderItemID,
            EntryType: "D",
            LaundryTransactionId: transactionId,
            Gender: laundryitem.Gender,
            ClothName: laundryitem.ClothName,
            Amount: laundryitem.Amount,
            Service: laundryitem.Service,
        });
        laundryList.splice(laundryIndex, 1);
    }

    setLaundryData(laundryList);
    setLaundryTotal(getLaundryTotal(laundryList));


    const updatedMaster = laundryMaster.map(item => {
        if (item.laundryID === row.laundryOrderItemID) {
            const serviceToEnable = row.Service;
            return {
                ...item,
                disabledServices: {
                    ...item.disabledServices,
                    [serviceToEnable]: false
                },
                service: '' // optional: reset selection
            };
        }
        return item;
    });
    setLaundryMaster(updatedMaster);

    // Force render if needed
    setRender(!render);
};

    // let index = -1
    // laundryData.forEach((x, i) => {
    //     if (x.LaundryID === LaundryID) {
    //         index = i
    //     }
    // })
    // laundryData.splice(index, 1)
    // let laundryList=laundryData.filter(data=>data.LaundryTransactionId!=LaundryID)
    // console.log("laundryList",laundryList)
    // setLaundryData(laundryList)
    // const postData = {
    //     LoginID: LoginID,
    //     Token: Token,
    //     Seckey: "abc",
    //     Event: "delete",
    //     LaundryID
    // }
    // try {
    //     await axios.post("laundry", postData).then((res) => {
    //         console.log("file: LaundryTransaction.js:153  awaitaxios.post  res", res)
    //         toast.success("Successfully removed")
    //     })
    // } catch (error) {
    //     console.log("file: LaundryTransaction.js:154  removeLaundry  error", error)
    // }


    // const addLaundry = (LaundryID) => {
    //     // console.log('newservice', service);
    //     console.log("laundryMaster", laundryMaster)
    //     const data = laundryMaster.filter(x => x.LaundryID === LaundryID)[0];
    //     console.log('amountdtaa', data);
    //     let laundryList = [];
    //     laundryList = laundryData;

    //     if (data.service) {
    //         let serviceAmount;
    //         if (data.service === "Washing") {
    //             serviceAmount = data.WashingRate
    //         } else if (data.service === "Pressing") {
    //             serviceAmount = data.PressingRate
    //         } else if (data.service === 'Dry Cleaning') {
    //             serviceAmount = data.DryCleaningRate
    //         }
    //         // switch (data.service) {
    //         //     case 'Washing': serviceAmount = data.WashingRate
    //         //     case 'Pressing': serviceAmount = data.PressingRate
    //         //     case 'Dry Cleaning': serviceAmount = data.DryCleaningRate
    //         // }
    //         console.log(serviceAmount)
    //         laundryList.push({
    //             LaundryOrderItemID: "0",
    //             EntryType: "I",
    //             Quantity: 1,
    //             // LaundryTransactionId: data.LaundryID,
    //             Gender: data.Gender == 'Male' ? "M" : data.Gender == 'Female' ? 'F' : 'X',
    //             ClothName: data.ClothName,
    //             Amount: serviceAmount,
    //             Service: data.service,
    //         })

    //         console.log("After", laundryList)
    //         setLaundryData(laundryList)
    //         laundryMaster.map(obj => {
    //             if (obj.LaundryID === LaundryID) {
    //                 obj.service = ''
    //             }
    //         })
    //         const lt = getLaundryTotal(laundryList)
    //         console.log('ltttttttttt', lt);
    //         setLaundryTotal(lt)
    //     } else {
    //         toast.error("please select service option")
    //     }

    // }

    console.log('laundryData', laundryData);
    const updatePrice = (e, id, clothName, service) => {
        console.log('orderItemmmm', e, id);
        const updatedOrderItems = laundryData.map(orderItem => {
            console.log('orderItemmmm', orderItem);
            if (orderItem.ClothName === clothName && orderItem.Service === service && orderItem.LaundryOrderItemID === id) {
                orderItem.Quantity = e;
                orderItem.EntryType = orderItem.LaundryOrderItemID === 0 ? "U" : "I";
                // orderItem.Amount = +orderItem.Amount * +e
                // setLaundryTotal(+orderItem.Amount * +e)
            }
            return orderItem;
        });
        console.log('orderItemmmm', updatedOrderItems);
        setLaundryData(updatedOrderItems);
        // getLaundryTotal(updatedOrderItems);
        const lt = getLaundryTotal(updatedOrderItems)
        console.log('ltttttttttt', lt);
        setLaundryTotal(lt)
    }
    const resetOrder = () => {
        setTax('')
        setDiscount(0)
        setDiscountPercent('')
        setLaundryTotal('')
        setOrderTotal('')
    }

    const getDataByRoomNo = async (obj) => {
        console.log('objjjjjjjjjjjjjj', obj)
        const postData = {
            LoginID: LoginID,
            Token: Token,
            Seckey: "abc",
            Event: "select",
            RoomNo: obj.RoomNo,
            FloorID: obj.FloorID,
            BookingID: obj.BookingID,
            laundryTransactionDetails : []
        }
        try {
            await axios.post("/laundry/transaction", postData).then((res) => {
                console.log('getDataByRoomNo11', res)
                console.log('getDataByRoomNo111', res?.data[1])
                console.log("getDataByRoomNo:1111 ", res.data[0][0])
                setGuestMobileumber(res.data[0][0].guestMobileNumber || "")
                setGuestMail(res.data[0][0].guestEmail || "")
                setTransactionId(res.data.transactionID[0])

                setDiscount(res?.data[0][0]?.Discount ? res?.data[0][0]?.discount : 0)
                if (res?.data[1]) {
                    setLocalLaundaryData(res?.data[1])
                    setLaundryData(res?.data[1])
                    // let array=[...]
                    // let data= res?.data[1];
                    // data?.forEach(element => {
                    //     array.push(element[0])
                    // });
                    const t = res?.data[1].reduce((a, c) => a += c.Amount * c.Quantity, 0)

                    console.log("ltttttttttt ", t)
                    setLaundryTotal(t)
                } else {
                    setLaundryData([])
                }
            })
        } catch (error) {
            console.log("file: LaundryTransaction.js:222  getDataByRoomNo  error", error)
        }
    }

    const setSelectedGuest = (v) => {
        console.log('vvvvv', v, roomListData);
        resetOrder()
        if (v) {
            setGuestName(v.value);
            setGuestLabel(v.label);
            const roomData = roomListData.find(guest => `${guest.roomNo}-${guest.bookingID}` == v.label);
            console.log('roomDataa', roomData);
            setRoomData(roomData);
        } else {
            setGuestName("")
            setGuestLabel("")
            setRoomData("");
            setLaundryData([])
        }

    }
    // console.log('roomData', roomData);

    const calcDiscount = () => {

        let discnt = discount
        console.log('checcccck', typeof discnt, discnt)
        const tx = getTheTax(laundryTotal)
        if (discountType === '%') {
            discnt = (+discountPercent / 100) * (+laundryTotal + +tx)
            console.log('checcccck', typeof discnt, discnt)
            setDiscount(discnt)
        }
        if (discnt === 0 || discnt === discount) {
            setTax(tx)
            setOrderTotal(+laundryTotal + +tx - +(discount && discount))
        }
    }

    useEffect(() => {
        setOrderTotal(+laundryTotal + +tax - +(discount && discount))
    }, [discount])
    console.log('orderTotal', 'laundryTotal-', laundryTotal, 'tax-', tax, 'discount-', (discount && discount), 'orderTotal-', orderTotal);

    useEffect(() => {
        const tx = getTheTax(+laundryTotal)
        setTax(tx)
        calcDiscount()
    }, [laundryTotal])

    const laundryColumns = [

        {
            name: 'Cloth',
            //sortable: true,
            style: { paddingLeft: 0 },
            with: 100,
            selector: row => row.clothName
        },
        {
            name: (
                <>
                    <div className='me-2'>Services</div>
                    <div className='ms-2'>Amount</div></>),
            minWidth: 400,
            // sortable: true,
            selector: (row) => {
                return (
                    <>
                        <ServicesChange LaundryID={row.laundryID} />
                    </>
                )
            }
        },
        // {
        //     name: 'Amount',
        //     minWLaundryIDth: 200,
        //     sortable: true,
        //     selector: row => row.amount
        // },
        {
            name: 'Action',
            //sortable: true,
            selector: (row) => {
                return (
                    <Button LaundryID={row.laundryID} key={`add_laundry_action_${row.laundryID}`} color='primary' size='sm' onClick={() => {
                        guestName ? addLaundry(row.laundryID) : toast.error("please select room number")
                    }}>+</Button>

                )
            }
        }
    ]
    const laundryAddColumns = [
        {
            name: 'Gender',
            //sortable: true,
            style: { flexGrow: 0 },
            selector: row => {
                return <Badge className={row.Gender === 'M' ? 'p-25 bg-light-primary' : row.Gender === 'F' ? 'bg-light-danger' : 'bg-light-info'} pill>{row.gender === 'M' ? "m" : row.gender === 'F' ? 'f' : 'c'}</Badge>
            }
        },
        {
            name: 'Cloth',
            selector: row => row.ClothName,
            wrap: true
        },
        {
            name: 'Quantity',
            center: true,
            width: 'max-content',
            selector: (row) => {
                console.log('rowwwww', row);
                return (
                    // console.log('rowhjsdhjhdd', row.POSProductID, row.Quantity),
                    <>
                        <InputNumber
                            min={1}
                            upHandler={<Plus />}
                            downHandler={<Minus />}
                            key={`quant_${row.LaundryOrderItemID}`}
                            value={row.Quantity}
                            disabled={!row.LaundryOrderItemID}
                            onChange={(e) => updatePrice(e, row.LaundryOrderItemID, row.ClothName, row.Service)}
                        />
                    </>
                )
            }
        },
        {
            name: 'Services',
            // minWLaundryIDth: 300,
            style: { flexGrow: 2 },
            wrap: true,
            //sortable: true,
            selector: (row) => {
                return (
                    <>
                        <ServiceSelected LaundryOrderItemID={row.laundryOrderItemID} LaundryTransactionId={row.laundryTransactionId} Service={row.service} />
                    </>
                )
            }
        },
        {
            name: 'Amount',
            // minWLaundryIDth: 150,
            //sortable: true,
            selector: row => { return (`₹${+row.amount * +row.quantity}`) }
        },
        {
            name: 'Action',
            //sortable: true,
            selector: (row, i) => {
                return (
                    <Button color='outline-danger' size='sm' onClick={() => removeLaundry(row)}><Trash2 size={15} /></Button>
                )
            }
        }
    ]

    const addLaundry = (LaundryID) => {
        const data = laundryMaster.find(x => x.laundryID === LaundryID);
        console.log("Data===>11",data)
        if (!data?.service) {
            toast.error("Please select a service option.");
            return;
        }

        let serviceAmount = 0;
        switch (data.service) {
            case 'Washing': serviceAmount = data.washingRate; break;
            case 'Pressing': serviceAmount = data.pressingRate; break;
            case 'Dry Cleaning': serviceAmount = data.dryCleaningRate; break;
        }

        const newItem = {
            LaundryOrderItemID:LaundryID,
            EntryType: "I",
            Quantity: 1,
            Gender: data.gender === 'Male' ? "M" : data.gender === 'Female' ? 'F' : 'X',
            ClothName: data.clothName,
            Amount: serviceAmount,
            Service: data.service
        };

        const updatedMaster = laundryMaster.map(obj => {
            if (obj.laundryID === LaundryID) {
                obj.disabledServices[data.service] = true;
                obj.service = ''; // reset after use
            }
            return obj;
        });

        const updatedList = [...laundryData, newItem];
        setLaundryData(updatedList);
        setLaundryMaster(updatedMaster);
        setLaundryTotal(getLaundryTotal(updatedList));
    };

    // const ServicesChange = ({ LaundryID }) => {
    //     // setNewLaundaryId(LaundryID)
    //     const data = laundryMaster.filter(laundry => laundry.LaundryID === LaundryID)[0]
    //     const [service, setService] = useState('')
    //     const [serviceCharge, setServiceCharge] = useState()
    //     const [laundryMasterData, setLaundryMasterData] = useState(laundryMaster)

    //     let ser = "";
    //     console.log("Services: ", service)
    //     // const updateLaundry = (e) => {

    //     //     console.log("servicebnghghdfggdf", service, "servicebnghghdfggdf", e.target?.value)
    //     //     if (service != e.target?.value) {
    //     //         setService(e.target?.value)
    //     //         ser = e.target?.value
    //     //         setServiceCharge(ser === 'Washing' ? data.WashingRate : ser === 'Pressing' ? data.PressingRate : data.DryCleaningRate)


    //     //     } else {
    //     //         setService("")
    //     //         setServiceCharge(0)
    //     //     }
    //     //     console.log("file: LaundryTransaction.js:306  updateLaundry  ser", ser)

    //     //     if (e.target?.value !== '') {
    //     //         laundryMasterData.map(obj => {
    //     //             if (obj.LaundryID === LaundryID) {
    //     //                 obj.service = e.target?.value
    //     //             }
    //     //         })
    //     //     }
    //     //     setLaundryMaster(laundryMasterData)
    //     // }

    //     const updateLaundry = (e, LaundryID) => {
    //         const updated = laundryMaster.map(obj => {
    //             if (obj.LaundryID === LaundryID) {
    //                 const selectedService = e.target?.value;
    //                 if (obj.service !== selectedService) {
    //                     obj.service = selectedService;
    //                     setServiceCharge(
    //                         selectedService === 'Washing' ? obj.WashingRate :
    //                             selectedService === 'Pressing' ? obj.PressingRate :
    //                                 obj.DryCleaningRate
    //                     );
    //                 } else {
    //                     obj.service = '';
    //                     setServiceCharge(0);
    //                 }
    //             }
    //             return obj;
    //         });
    //         setLaundryMaster([...updated]);
    //     };


    //     // const [laundryData, setLaundryData] = useState([]);
    //     // const [serviceCharge, setServiceCharge] = useState(0);
    //     // const [laundryTotal, setLaundryTotal] = useState(0);

    //     // const getLaundryTotal = (data) => {
    //     //     return data.reduce((sum, item) => sum + item.Amount * item.Quantity, 0);
    //     // };

    //     return (
    //         <>
    //             {/* <div className='d-flex' > */}
    //             {/* <div className='d-flex'>
    //                     <div className='form-check form-check-success'>
    //                         <Input type='radio' className='border-success' LaundryID='success-checkbox' value='Washing' checked={service === 'Washing'} onClick={updateLaundry} />
    //                     </div>
    //                     <div className='form-check form-check-warning'>
    //                         <Input type='radio' className='border-warning' LaundryID='warning-checkbox' value='Pressing' checked={service === 'Pressing'} onClick={updateLaundry} />
    //                     </div>
    //                     <div className='form-check form-check-info'>
    //                         <Input type='radio' className='border-info' LaundryID='info-checkbox' value='Dry Cleaning' checked={service === 'Dry Cleaning'} onClick={updateLaundry} />
    //                     </div>
    //                 </div> */}
    //             {laundryMaster.map(data => (
    //                 <div className='d-flex align-items-center mb-2' key={data.LaundryID}>
    //                     {/* <div className='me-3'>{data.ClothName}</div> */}
    //                     <div className='d-flex'>
    //                         <div className='form-check form-check-success me-2'>
    //                             <Input
    //                                 type='radio'
    //                                 className='border-success'
    //                                 value='Washing'
    //                                 checked={data.service === 'Washing'}
    //                                 onClick={(e) => updateLaundry(e, data.LaundryID)}
    //                                 disabled={data.disabledServices?.Washing}
    //                             />
    //                         </div>
    //                         <div className='form-check form-check-warning me-2'>
    //                             <Input
    //                                 type='radio'
    //                                 className='border-warning'
    //                                 value='Pressing'
    //                                 checked={data.service === 'Pressing'}
    //                                 onClick={(e) => updateLaundry(e, data.LaundryID)}
    //                                 disabled={data.disabledServices?.Pressing}
    //                             />
    //                         </div>
    //                         <div className='form-check form-check-info me-2'>
    //                             <Input
    //                                 type='radio'
    //                                 className='border-info'
    //                                 value='Dry Cleaning'
    //                                 checked={data.service === 'Dry Cleaning'}
    //                                 onClick={(e) => updateLaundry(e, data.LaundryID)}
    //                                 disabled={data.disabledServices?.['Dry Cleaning']}
    //                             />
    //                         </div>
    //                     </div>
    //                     <div className='ms-3'>{data.service ? serviceCharge : 0}</div>
    //                     {/* <div className='ms-3'>
    //                         <Button color='primary' onClick={() => addLaundry(data.LaundryID)}>+</Button>
    //                     </div> */}
    //                 </div>
    //             ))}

    //             {/* <div className='ms-2'>{serviceCharge ?? '0'}</div> */}
    //             {/* </div> */}
    //         </>
    //     )
    // }

    const ServicesChange = ({ LaundryID }) => {
        const data = laundryMaster.find(laundry => laundry.laundryID === LaundryID);

        const updateLaundry = (e) => {
            const selectedService = e.target?.value;
            const updated = laundryMaster.map(obj => {
                if (obj.laundryID === LaundryID) {
                    return {
                        ...obj,
                        service: obj.service !== selectedService ? selectedService : ''
                    };
                }
                return obj;
            });
            setLaundryMaster([...updated]);
        };

        const getServiceCharge = () => {
            switch (data?.service) {
                case 'Washing': return data.WashingRate;
                case 'Pressing': return data.PressingRate;
                case 'Dry Cleaning': return data.DryCleaningRate;
                default: return 0;
            }
        };

        return (
            <div className='d-flex align-items-center laundry-transaction'>
                <div className='d-flex ps-0'>
                    <div className='form-check form-check-success'>
                        <Input
                            type='radio'
                            className='border-success'
                            value='Washing'
                            checked={data?.service === 'Washing'}
                            onClick={updateLaundry}
                            disabled={data?.disabledServices?.Washing}
                        />
                    </div>
                    <div className='form-check form-check-warning'>
                        <Input
                            type='radio'
                            className='border-warning'
                            value='Pressing'
                            checked={data?.service === 'Pressing'}
                            onClick={updateLaundry}
                            disabled={data?.disabledServices?.Pressing}
                        />
                    </div>
                    <div className='form-check form-check-info'>
                        <Input
                            type='radio'
                            className='border-info'
                            value='Dry Cleaning'
                            checked={data?.service === 'Dry Cleaning'}
                            onClick={updateLaundry}
                            disabled={data?.disabledServices?.['Dry Cleaning']}
                        />
                    </div>
                </div>
                <div className='ms-1'>{getServiceCharge()}</div>
            </div>
        );
    };

    const ServiceSelected = (obj) => {
        console.log("before dataaa", obj)
        let LaundryTransactionId = obj.LaundryTransactionId
        let LaundryOrderItemID = obj.LaundryOrderItemID
        let service = obj.Service
        // const data = laundryData.filter(user => ((user.LaundryOrderItemID === LaundryOrderItemID) && (user.LaundryTransactionId === LaundryTransactionId)))
        // console.log("data",data,data[0]?.Service)
        // const service = data[0]?.Service
        const [cssClass] = useState(service === 'Washing' ? 'success' : service === 'Pressing' ? 'warning' : 'info')

        return (
            <>
                <div className='d-flex'>
                    <div className={'form-check form-check-'.concat(cssClass)}>
                        <Label>
                            <Input key={LaundryOrderItemID} type='radio' LaundryID={cssClass.concat('-checkbox')} value={service} defaultChecked />{service}</Label>
                    </div>
                </div>
                { //<span>{service}</span>  
                }
            </>
        )
    }

    // console.log('laundryData', laundryData);
    const saveOrder = async () => {
        console.log('roomDatalist', roomData);
        if (laundryData && laundryData.length > 0) {
            let event = 'insert'
            let laundryTransactionId = "0";
            console.log("laundryDataassssss", laundryData)
            let laundryList = [];
            laundryData.map(data => {
                if ((data.LaundryTransactionId != undefined && data.LaundryTransactionId != "0") && event == 'insert') {
                    console.log(data.LaundryTransactionId, data)
                    event = 'update';
                    laundryTransactionId = data.LaundryTransactionId
                }
                if (data.EntryType && (data.EntryType == 'I' || data.EntryType == 'D')) {
                    let item = { ...data }
                    delete item.LaundryTransactionId
                    laundryList.push(item);
                }
            })
            console.log("laundryList", laundryList)
            //get laundry master data 
            setDataLoading(true)
            const postData = {
                LoginID: LoginID,
                Token: Token,
                Seckey: "abc",
                Event: event,
                LaundryTransactionId: laundryTransactionId,
                FloorID: roomData.floorID,
                RoomNo: roomData.roomNo,
                GuestID: roomData.guestID,
                GuestName: roomData.guestName,
                BookingID: roomData.bookingID,
                TransactionId: roomData.transactionID,
                GuestMobileNumber: "",
                GuestEmail: "",
                Total: laundryTotal,
                CGST: (laundryTotal * +cgst / 100).toFixed(2),
                SGST: (laundryTotal * +sgst / 100).toFixed(2),
                Total_inc_all_taxes: Number(laundryTotal + tax).toFixed(2),
                Discount: Number(discount),
                TotalDue: Number(orderTotal).toFixed(2),
                PaymentMode: null,
                PaymentCollectorsName: null,
                BillGSTNo: null,
                CreatedDate: "2023-01-25T00:00:00",
                UpdatedDate: "2023-01-25T00:00:00",
                StatusID: "SDT001",
                Status: "Active",
                laundryTransactionDetails: laundryList
            }
            console.log("postData", postData)
            try {
                axios.post("/laundry/transaction", postData).then((res) => {
                    console.log('savetran', res);
                    setlaundryUpdated(!laundryUpdated)
                    setDataLoading(false)
                    // const lt = getLaundryTotal(laundryList)
                    // setLaundryTotal(lt)
                    // setLaundryTransationId(res)
                    toast.success(`Laundry Order of room number '${guestName}' saved`)
                    console.log('onsaveorder', laundryTotal);
                })
            } catch (error) {
                toast.error(`Laundry Order not saved`)
                setDataLoading(false)
            }
        }
    }


    return (
        <>
            <Button className='mb-1' size='sm' color='primary' onClick={() => navigate(-1)}><ChevronLeft size={25} color='#FFF' /></Button>
            <Row>
                <Col md={6} lg={6}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Laundry List</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row className='mb-1 text-center'>
                                <Col className='p-0'><Badge color='success'>Washing</Badge></Col>
                                <Col className='p-0'><Badge color='warning'>Pressing</Badge></Col>
                                <Col className='p-0'><Badge color='info'>Dry Cleaning</Badge></Col>
                            </Row>
                            <Row className='mb-1'>
                                <Col>
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink active={active === '1'} onClick={() => toggle('1')}>
                                                All
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink active={active === '2'} onClick={() => toggle('2')}>
                                                Male
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink active={active === '3'} onClick={() => toggle('3')}>
                                                Female
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink active={active === '4'} onClick={() => toggle('4')}>
                                                Child
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={active}>
                                        <TabPane tabId='1'>
                                            {dataLoading ? <div style={{ textAlign: 'center', marginTop: "3rem" }}> <h2 style={{ text: 'center' }}>Loading...</h2></div> : (
                                                <DataTable
                                                    noHeader
                                                    data={laundryMaster}
                                                    columns={laundryColumns}
                                                    className='react-dataTable'
                                                    sortIcon={<ChevronDown size={10} />}
                                                />
                                            )}
                                        </TabPane>
                                        <TabPane tabId='2'>
                                            <DataTable
                                                noHeader
                                                data={laundryMaster.filter(data => data.gender === 'Male')}
                                                columns={laundryColumns}
                                                className='react-dataTable'
                                                sortIcon={<ChevronDown size={10} />}
                                            />
                                        </TabPane>
                                        <TabPane tabId='3'>
                                            <DataTable
                                                noHeader
                                                data={laundryMaster.filter(data => data.gender === 'Female')}
                                                columns={laundryColumns}
                                                className='react-dataTable'
                                                sortIcon={<ChevronDown size={10} />}
                                            />
                                        </TabPane>
                                        <TabPane tabId='4'>
                                            <DataTable
                                                noHeader
                                                data={laundryMaster.filter(data => data.gender === 'Child')}
                                                columns={laundryColumns}
                                                className='react-dataTable'
                                                sortIcon={<ChevronDown size={10} />}
                                            />
                                        </TabPane>
                                    </TabContent>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} lg={6}>
                    {console.log("india")}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transactions</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row className='mb-1'>
                                <Col md='3' sm='col-4'>
                                    <Label className='fw-bold fs-5'>Room No.</Label>
                                </Col>

                                <Col md='9' sm='col-8'>
                                    <Select
                                        isClearable
                                        placeholder=''
                                        menuPlacement='auto'
                                        theme={selectThemeColors}
                                        className='react-select'
                                        // value={roomNoOptions.filter(v => v?.label === guestLabel)}
                                        classNamePrefix='select'
                                        options={roomNoOptions}
                                        onChange={(e) => {
                                            setSelectedGuest(e)
                                        }}
                                        getOptionValue={option => option.label}
                                    />
                                </Col>
                                <Col md='3' sm='col-4'>
                                    <Label className='fw-bold fs-5 mt-2 '>Guest Name</Label>

                                </Col>
                                <Col md='9' sm='col-8'>
                                    <Input type='text' className='form-control mt-2' readOnly LaundryID='guestName' name='guestName' value={guestName} />
                                </Col>
                            </Row>
                            {console.log("laundryDAta", laundryData)}
                            {
                                (laundryData && laundryData.length > 0) ? (
                                    <>
                                        <Row className='mb-1 d-flex flex-column'>
                                            <Col className='mb-1' id="LaundryTransaction">
                                                <DataTable
                                                    noHeader
                                                    data={laundryData.filter(data => ((data.EntryType && data.EntryType == 'I') || (data.EntryType == undefined)))}
                                                    columns={laundryAddColumns}
                                                    className='react-dataTable'
                                                    sortIcon={<ChevronDown size={10} />}
                                                />

                                            </Col>
                                            <Col>
                                                <ListGroup>
                                                    <ListGroupItem>
                                                        <Row>
                                                            {console.log('onsaveorder', laundryTotal)}
                                                            <Col>Total</Col>
                                                            <Col className='text-end'>{laundryTotal}</Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                    {
                                                        outsisedState ? (
                                                            <ListGroupItem>
                                                                <Row>
                                                                    <Col>IGST @{igst}%</Col>
                                                                    <Col className='text-end'>{Number(laundryTotal * +igst / 100).toFixed(2)}</Col>
                                                                </Row>
                                                            </ListGroupItem>
                                                        ) : (
                                                            <>
                                                                <ListGroupItem>
                                                                    <Row>
                                                                        <Col>SGST @{sgst}%</Col>
                                                                        <Col className='text-end'>{Number(laundryTotal * +sgst / 100).toFixed(2)}</Col>
                                                                    </Row>
                                                                </ListGroupItem>
                                                                <ListGroupItem>
                                                                    <Row>
                                                                        <Col>CGST @{cgst}%</Col>
                                                                        <Col className='text-end'>{Number(laundryTotal * +cgst / 100).toFixed(2)}</Col>
                                                                    </Row>
                                                                </ListGroupItem>
                                                            </>
                                                        )
                                                    }
                                                    <ListGroupItem>
                                                        <Row>
                                                            <Col>Total (Incl All Taxes)</Col>
                                                            <Col className='text-end'>{Number(laundryTotal + tax).toFixed(2)}</Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                    {/* <ListGroupItem>
                                                <Row>
                                                    <Col>Rounding Off</Col>
                                                    <Col className='text-end'>0</Col>
                                                </Row>
                                            </ListGroupItem> */}
                                                    <ListGroupItem>
                                                        <Row>
                                                            <Col><span>Discount</span>

                                                            </Col>
                                                            <Col className='p-0 d-flex'>
                                                                <div className='form-switch w-50 ps-0'>
                                                                    {console.log('setDiscountPercent', discountPercent, discount)}
                                                                    Flat <Input type='switch' className='ms-25 mb-25 '
                                                                        style={{ wLaundryIDth: '28px', height: '16px' }}
                                                                        name='LaundryDiscount'
                                                                        LaundryID='LaundryDiscount'
                                                                        checked={discountType === '%'}
                                                                        onChange={(e) => (setDiscountType(e.target.checked ? '%' : 'flat'), setDiscountPercent(0), setDiscount(0))}
                                                                    /> %
                                                                </div>
                                                                <Input
                                                                    className='p-25 float-end w-25 text-end w-50'
                                                                    type='number'
                                                                    name='DiscountPercent'
                                                                    value={discountPercent}
                                                                    disabled={discountType !== '%'}
                                                                    onChange={(e) => { setDiscountPercent(e.target.value), setDiscount(Number((+laundryTotal) * (+e.target.value / 100)).toFixed(2)) }}
                                                                />
                                                            </Col>
                                                            <Col className='text-end'>

                                                                <Input
                                                                    className='p-25 w-50 float-end text-end'
                                                                    type='text'
                                                                    name='Discount'
                                                                    value={discount}
                                                                    disabled={discountType === '%'}
                                                                    onChange={(e) => setDiscount(e.target.value)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                    <ListGroupItem color='primary'>
                                                        <Row>
                                                            <Col>Total Due</Col>
                                                            <Col className='text-end'>₹ {Number(orderTotal).toFixed(2)}</Col> {/*Number(laundryTotal + tax - discount).toFixed(2)} / */}
                                                        </Row>
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </Col>
                                        </Row>
                                        <Row className='mt-1'>
                                            <Col className='text-center'>
                                                <Button color='success' onClick={saveOrder}>Save Order</Button>
                                            </Col>
                                        </Row>
                                        {laundryData[0].LaundryTransactionId &&
                                            <Row className='mb-1'>
                                                <Col>
                                                    <Label className='fw-bold fs-5'>Payment Type</Label>
                                                    <Select
                                                        placeholder=''
                                                        menuPlacement='auto'
                                                        theme={selectThemeColors}
                                                        className='react-select'
                                                        classNamePrefix='select'
                                                        options={paymentOptions}
                                                        onChange={e => setPaymnetOption(e.value)}
                                                    />
                                                </Col>
                                            </Row>}

                                        <Row className='mb-1'>
                                            {
                                                paymentOption && <GuestDetailForm inResto={true}
                                                    laudryTxnId={laundryData[0].LaundryTransactionId}
                                                    orderTotal={Number(orderTotal).toFixed(2)}
                                                    setLaundryData={setLaundryData}
                                                    guestDetails={{ GuestName: guestName, GuestEmail: guestEmail, GuestMobileNumber: guestMobileumber }}
                                                    option={paymentOption} guest={'selectedGuest'}
                                                    transactionId={roomData.TransactionID}
                                                    bookingId={roomData.BookingID} />
                                            }
                                        </Row>
                                    </>
                                ) : null
                            }

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default LaundryTransaction