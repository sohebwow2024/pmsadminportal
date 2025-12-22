import React, { useState } from 'react'
import { Col, Input, Label } from 'reactstrap'
import AmountComponent from './AmountComponent'

const ServiceComponent = ({ serviceItem, serviceIndex, setService, service, roomno, guestDetail, roomId }) => {
    const [serviceAmount] = useState(serviceItem.TotalAmount)
    return (
        <tr key={serviceIndex}>
            <th
                className="bg-primary text-light text-center head p-2 "
                rowSpan={1}
            >
                {serviceItem.ServiceName}
            </th>
            <td>
                <Col>
                    <Label>Rate</Label>
                    <Input type="number" disabled value={serviceItem.TotalAmount} />
                </Col>
            </td>
            {guestDetail.filter(a => a.RoomID === roomId).map((item, index) => {
                return (
                    <AmountComponent item={item} index={index} roomno={roomno} />
                )
            })}
            <td>
                <Col style={{
                    textAlign: "center"
                }}>
                    <Label>Remaining</Label>
                    <h1>{serviceAmount}</h1>
                </Col>
            </td>
        </tr>
    )
}

export default ServiceComponent