import axios from '../../../API/axios';
import React, { useEffect, useState } from 'react';
import {
    CardBody,
    Col,
    Input,
    Label,
    Table,
} from "reactstrap";
import axiosInstance from '../../../API/axios';
import RoomComponent from './RoomComponent';
import ServiceComponent from './ServiceComponent';


const BillSplitForm = ({ roomId, guestDetail, roomDetail, serviceDetail }) => {
    // console.log("roomName1", roomId);
    // console.log('guestDetail1', guestDetail);

    /* onclick check box disabled input */

    const [isChecked, setIsChecked] = useState(false);
    // console.log('isChecked', isChecked);
    const [isChecked2, setIsChecked2] = useState(false);
    const [isChecked3, setIsChecked3] = useState(false);
    const [checkBoxIndex, setCheckBoxIndex] = useState('');


    const [roomno, setroomno] = useState('');

    // console.log(roomno);



    const handleCheckboxChange = (event) => {
        // console.log(event.target.checked);
        // console.log(roomno);
        if (roomno !== '') {
            setIsChecked(event.target.checked);
        }
        // roomno && 
    };
    const handleCheckboxChange2 = (event) => {
        setIsChecked2(event.target.checked);
    };
    const handleCheckboxChange3 = (event) => {
        setIsChecked3(event.target.checked);
    };


    /* guest 1 */

    const [aum1, setAum1] = useState('');
    const [aum2, setAum2] = useState('');
    const [aum3, setAum3] = useState('');
    const [aum4, setAum4] = useState('');
    const [total1, setTotal1] = useState('');

    function handleAum1Change(event) {
        setAum1(Number(event.target.value));
    }

    function handleAum2Change(event) {
        setAum2(Number(event.target.value));
    }

    function handleAum3Change(event) {
        setAum3(Number(event.target.value));
    }
    function handleAum4Change(event) {
        setAum4(Number(event.target.value));
    }

    useEffect(() => {
        const aum = aum1 + aum2 + aum3 + aum4;
        setTotal1(aum);
    }, [aum1, aum2, aum3, aum4]);


    /* Extra Services */

    const [extra1, setExtra1] = useState('');
    const [extra2, setExtra2] = useState('');
    const [extra3, setExtra3] = useState('');



    const [guest, setGuest] = useState('');
    const [service, setService] = useState('');
    const [guest2, setGuest2] = useState('');
    const [guest3, setGuest3] = useState('');
    const [gTotal1, setGTotal1] = useState('');

    // function handleGuestChange(event) {
    //     setGuest(Number(event.target.value));
    // }

    function handleGuest2Change(event) {
        setGuest2(Number(event.target.value));
    }

    function handleGuest3Change(event) {
        setGuest3(Number(event.target.value));
    }
    function handleExtra1Change(event) {
        setExtra1(Number(event.target.value));
    }
    // useEffect(() => {
    //     const guest = guest + extra1 + guest2 + guest3
    //     setGTotal1(guest);
    // }, [guest, guest2, guest3, extra1]);



    /* guest 2*/



    const [person1, setPerson1] = useState('');
    const [person2, setPerson2] = useState('');
    const [person3, setPerson3] = useState('');
    const [pTotal1, setPTotal1] = useState('');

    function handlePerson1Change(event) {
        setPerson1(Number(event.target.value));
    }

    function handlePerson2Change(event) {
        setPerson2(Number(event.target.value));
    }

    function handlePerson3Change(event) {
        setPerson3(Number(event.target.value));
    }
    function handleExtra2Change(event) {
        setExtra2(Number(event.target.value));
    }
    useEffect(() => {
        const person = person1 + extra2 + person2 + person3
        setPTotal1(person);
    }, [person1, person2, person3, extra2]);



    /* guest 3 */


    const [human1, setHuman1] = useState('');
    const [human2, setHuman2] = useState('');
    const [human3, setHuman3] = useState('');
    const [hTotal1, setHTotal1] = useState('');

    function handleHuman1Change(event) {
        setHuman1(Number(event.target.value));
    }

    function handleHuman2Change(event) {
        setHuman2(Number(event.target.value));
    }

    function handleHuman3Change(event) {
        setHuman3(Number(event.target.value));
    }
    function handleExtra3Change(event) {
        setExtra3(Number(event.target.value));
    }

    useEffect(() => {
        const human = human1 + extra3 + human2 + human3
        setHTotal1(human);
    }, [human1, human2, human3, extra3]);


    /*horizontal total */
    const [grandTotal1, setGrandTotal1] = useState(0);

    useEffect(() => {
        if (isChecked && isChecked2 && isChecked3) {
            const Final = aum1 - (guest + person1 + human1);
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal1(FinalColor);
        } else if (!isChecked && isChecked2 && isChecked3) {
            const Final = aum1 - (person1 + human1);
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal1(FinalColor);
        } else if (isChecked && !isChecked2 && isChecked3) {
            const Final = aum1 - (guest + human1);
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal1(FinalColor);
        } else if (isChecked && isChecked2 && !isChecked3) {
            const Final = aum1 - (guest + person1);
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal1(FinalColor);
        } else if (!isChecked && !isChecked2 && isChecked3) {
            const Final = aum1 - human1;
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal1(FinalColor);
        } else if (isChecked && !isChecked2 && !isChecked3) {
            const Final = aum1 - guest;
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal1(FinalColor);
        } else if (!isChecked && isChecked2 && !isChecked3) {
            const Final = aum1 - person1;
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal1(FinalColor);
        } else if (!isChecked && !isChecked2 && !isChecked3) {

            const Final = aum1 ? <span style={{ color: 'red' }}>{aum1}</span> : 0;

            setGrandTotal1(Final);

        } else {
            setGrandTotal1(0);
        }

    }, [aum1, guest, person1, human1, isChecked, isChecked2, isChecked3]);

    const [grandTotal4, setGrandTotal14] = useState(0);

    useEffect(() => {
        if (isChecked && isChecked2 && isChecked3) {
            const Final = aum4 - (extra1 + extra2 + extra3);
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal14(FinalColor);
        } else if (!isChecked && isChecked2 && isChecked3) {
            const Final = aum4 - (extra2 + extra3);
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal14(FinalColor);
        } else if (isChecked && !isChecked2 && isChecked3) {
            const Final = aum4 - (extra1 + extra3);
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal14(FinalColor);
        } else if (isChecked && isChecked2 && !isChecked3) {
            const Final = aum4 - (extra1 + extra2);
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal14(FinalColor);
        } else if (!isChecked && !isChecked2 && isChecked3) {
            const Final = aum4 - extra3;
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal14(FinalColor);
        } else if (isChecked && !isChecked2 && !isChecked3) {
            const Final = aum4 - extra1;
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal14(FinalColor);
        } else if (!isChecked && isChecked2 && !isChecked3) {
            const Final = aum4 - extra2;
            const FinalColor = Final < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final === 0 ? 'green' : 'red' }}>{Final}</span>;
            setGrandTotal14(FinalColor);
        } else if (!isChecked && !isChecked2 && !isChecked3) {

            const Final = aum4 ? <span style={{ color: 'red' }}>{aum4}</span> : 0;

            setGrandTotal14(Final);

        } else {
            setGrandTotal14(0);
        }

    }, [aum4, extra1, extra2, extra3, isChecked, isChecked2, isChecked3]);

    const [grandTotal2, setGrandTotal2] = useState(0);

    useEffect(() => {
        if (isChecked && isChecked2 && isChecked3) {
            const Final2 = aum2 - (guest2 + person2 + human2);
            const FinalColor2 = Final2 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final2 === 0 ? 'green' : 'red' }}>{Final2}</span>;
            setGrandTotal2(FinalColor2);
        } else if (!isChecked && isChecked2 && isChecked3) {
            const Final2 = aum2 - (person2 + human2);
            const FinalColor2 = Final2 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final2 === 0 ? 'green' : 'red' }}>{Final2}</span>;
            setGrandTotal2(FinalColor2);
        } else if (isChecked && !isChecked2 && isChecked3) {
            const Final2 = aum2 - (guest2 + human2);
            const FinalColor2 = Final2 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final2 === 0 ? 'green' : 'red' }}>{Final2}</span>;
            setGrandTotal2(FinalColor2);
        } else if (isChecked && isChecked2 && !isChecked3) {
            const Final2 = aum2 - (guest2 + person2);
            const FinalColor2 = Final2 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final2 === 0 ? 'green' : 'red' }}>{Final2}</span>;
            setGrandTotal2(FinalColor2);
        } else if (!isChecked && !isChecked2 && isChecked3) {
            const Final2 = aum2 - human2;
            const FinalColor2 = Final2 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final2 === 0 ? 'green' : 'red' }}>{Final2}</span>;
            setGrandTotal2(FinalColor2);
        } else if (isChecked && !isChecked2 && !isChecked3) {
            const Final2 = aum2 - guest2;
            const FinalColor2 = Final2 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final2 === 0 ? 'green' : 'red' }}>{Final2}</span>;
            setGrandTotal2(FinalColor2);
        } else if (!isChecked && isChecked2 && !isChecked3) {
            const Final2 = aum2 - person2;
            const FinalColor2 = Final2 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final2 === 0 ? 'green' : 'red' }}>{Final2}</span>;
            setGrandTotal2(FinalColor2);
        } else if (!isChecked && !isChecked2 && !isChecked3) {

            const Final2 = aum2 ? <span style={{ color: 'red' }}>{aum2}</span> : 0;

            setGrandTotal2(Final2);

        } else {
            setGrandTotal2(0);
        }

    }, [aum2, guest2, person2, human2, isChecked, isChecked2, isChecked3]);


    const [grandTotal3, setGrandTotal3] = useState(0);


    useEffect(() => {
        if (isChecked && isChecked2 && isChecked3) {
            const Final3 = aum3 - (guest3 + person3 + human3);
            const FinalColor3 = Final3 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final3 === 0 ? 'green' : 'red' }}>{Final3}</span>;
            setGrandTotal3(FinalColor3);
        }
        else if (!isChecked && isChecked2 && isChecked3) {
            const Final3 = aum3 - (person3 + human3);
            const FinalColor3 = Final3 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final3 === 0 ? 'green' : 'red' }}>{Final3}</span>;
            setGrandTotal3(FinalColor3);
        } else if (isChecked && !isChecked2 && isChecked3) {
            const Final3 = aum3 - (guest3 + human3);
            const FinalColor3 = Final3 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final3 === 0 ? 'green' : 'red' }}>{Final3}</span>;
            setGrandTotal3(FinalColor3);
        } else if (isChecked && isChecked2 && !isChecked3) {
            const Final3 = aum3 - (guest3 + person3);
            const FinalColor3 = Final3 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final3 === 0 ? 'green' : 'red' }}>{Final3}</span>;
            setGrandTotal3(FinalColor3);
        } else if (!isChecked && !isChecked2 && isChecked3) {
            const Final3 = aum3 - human3;
            const FinalColor3 = Final3 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final3 === 0 ? 'green' : 'red' }}>{Final3}</span>;
            setGrandTotal3(FinalColor3);
        } else if (isChecked && !isChecked2 && !isChecked3) {
            const Final3 = aum3 - guest3;
            const FinalColor3 = Final3 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final3 === 0 ? 'green' : 'red' }}>{Final3}</span>;
            setGrandTotal3(FinalColor3);
        } else if (!isChecked && isChecked2 && !isChecked3) {
            const Final3 = aum3 - person3;
            const FinalColor3 = Final3 < 0 ?
                <span style={{ color: 'red' }}>0</span> :
                <span style={{ color: Final3 === 0 ? 'green' : 'red' }}>{Final3}</span>;
            setGrandTotal3(FinalColor3);
        } else if (!isChecked && !isChecked2 && !isChecked3) {

            const Final3 = aum3 ? <span style={{ color: 'red' }}>{aum3}</span> : 0;
            setGrandTotal3(Final3);

        } else {
            setGrandTotal3(0);
        }

    }, [aum3, guest3, person3, human3, isChecked, isChecked2, isChecked3]);

    /*api bill split */




    return (
        <div>
            <CardBody className="fs-4">
                <Table
                    border={"1px solid black"}
                    className="t_height"
                    bordered
                    responsive
                >
                    <tr>
                        <th
                            className="bg-primary text-light text-center head p-2"
                            rowSpan={1}
                        >
                            Room Type
                        </th>
                        <td className="text-center head">Amount</td>
                        {guestDetail.filter(a => a.RoomID === roomId).map((item, index) => {
                            // console.log('innerloop', item, index);
                            return (
                                <td className="text-center head" key={index}>
                                    {item.Name}
                                    <input type="checkbox" id={`custom-checkbox-${index}`} onChange={() => {
                                        setroomno(item.RoomNo)
                                        setCheckBoxIndex(index)
                                        // handleCheckboxChange(e)
                                    }} style={{
                                        transform: 'translate(10%,70%)'
                                    }} />
                                </td>
                            )
                        })}

                        {/* <td className="text-center head">
                            B
                            <input type="checkbox" checked={isChecked2} onChange={handleCheckboxChange2} style={{
                                transform: 'translate(10%,70%)'
                            }} />
                        </td>
                        <td className="text-center head">
                            C
                            <input type="checkbox" checked={isChecked3} onChange={handleCheckboxChange3} style={{
                                transform: 'translate(10%,70%)'
                            }} />
                        </td> */}
                        <td className="text-center head">Total</td>
                    </tr>
                    {roomDetail.filter(a => a.RoomID === roomId).map((item, index) => {
                        // console.log(item);
                        return (
                            <RoomComponent RNO={item.RoomNo} roomno={roomno} setGuest={setGuest} guest={guest} roomItem={item} roomIndex={index} guestDetail={guestDetail} roomId={roomId} />
                        )
                    })}
                    {serviceDetail.map((item, index) => {
                        // console.log(item);
                        return (
                            <ServiceComponent setService={setService} roomno={roomno} service={service} serviceItem={item} serviceIndex={index} guestDetail={guestDetail} roomId={roomId} />
                        )
                    })}

                    <tr>
                        <th
                            className="bg-primary text-light text-center head p-2 "
                            rowSpan={1}
                        >
                            Total
                        </th>
                        <td>
                            <Col >
                                <Label>Total</Label>
                                <Input type="number" value={total1} readOnly />
                            </Col>
                        </td>
                        {guestDetail.filter(a => a.RoomID === roomId).map((item, index) => {
                            return (
                                <td>
                                    <Col>
                                        <Label>Total</Label>
                                        <Input type="number" value={pTotal1} readOnly />
                                    </Col>
                                </td>
                            )
                        })}
                    </tr>
                </Table>
            </CardBody>
        </div>
    );
}

export default BillSplitForm;
