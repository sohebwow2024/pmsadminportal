import React, { useEffect, useState } from 'react'
import { Col, Input, Label } from 'reactstrap'
import AmountComponent from './AmountComponent'



const RoomComponent = ({ roomItem, roomIndex, guestDetail, roomId, RNO, roomno }) => {
    // const [splitAmount, setSplitAmount] = useState('')
    // console.log(splitAmount)
    // console.log(RNO, roomno)
    const [roomRemaining, setRoomRemaining] = useState(roomItem.NetAmount)


    const _remainingAmount = (splitAmount) => {
        console.log('splitAmount', [{ ...splitAmount }]);
        let IntialAmount = parseInt(roomItem.NetAmount)
        let calculatedAmount = 0
        let remainAmount = IntialAmount - calculatedAmount

        calculatedAmount = remainAmount - splitAmount

        setRoomRemaining(calculatedAmount)
    }

    // useEffect(() => {

    // }, [])

    return (
        <tr key={roomIndex}>
            <th
                className="bg-primary text-light text-center head p-2"
                rowSpan={1}
            >
                {/* <h4 style={{ color: "white" }}>Rate</h4> */}
                <h4 style={{ color: "white" }}>Room No: {roomItem.RoomNo}</h4>
            </th>
            <td>
                <Col>
                    <Label>Rate</Label>
                    <Input type="number" value={roomItem.NetAmount} disabled />
                </Col>
            </td>
            {guestDetail.filter(a => a.RoomID === roomId).map((item, index) => {
                return (
                    <AmountComponent item={item} index={index} _remainingAmount={_remainingAmount} roomRemaining setRoomRemaining={setRoomRemaining} roomno={roomno} />
                )
            })}

            <td>
                <Col style={{
                    textAlign: "center"
                }}>
                    <Label>Remaining</Label>
                    <h1 >{roomRemaining}</h1>
                </Col>
            </td>
        </tr>
    )
}

export default RoomComponent