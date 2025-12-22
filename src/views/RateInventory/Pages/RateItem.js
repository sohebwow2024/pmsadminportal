import React, { useState } from 'react'
import {
    Row, Col, Input, AccordionBody, AccordionHeader, AccordionItem, Button
} from 'reactstrap'

function RateItem({ rateItem, theKey, index, displayName, RatePlanID, defaultItem, handleRate, setExtraAdultPrice, setExtraChildPrice, setRoomRate, roomRate, extraChildPrice, extraAdultPrice }) {
    // console.log(index, " - ", rateItem)
    const [rate, setRate] = useState(rateItem?.rate)
    const [child, setChild] = useState(rateItem?.child)
    const [adult, setAdult] = useState(rateItem?.adult)

    const changeRate = (val) => {
        rateItem.rate = +val
        setRate(val)
    }
    const changeChild = (val) => {
        rateItem.child = +val
        setChild(val)
    }
    const changeAdult = (val) => {
        rateItem.adult = +val
        setAdult(val)
    }
    return (
        <AccordionItem key={`${theKey}`}>
            <AccordionHeader targetId={`${index}`}>{displayName} - {RatePlanID}</AccordionHeader>
            <AccordionBody accordionId={`${index}`}>
                <Row>
                    <Col md='4' className='my-50'>
                        <span>Set Rate</span>
                        <Input type='number' name="Child" value={roomRate} bssize='small' onChange={(e) => setRoomRate(e.target.value)} />
                    </Col>
                    <Col md='4' className='my-50'>
                        <span>Extra Adult Rate</span>
                        <Input type='number' name="Rate" value={extraAdultPrice} bssize='small' onChange={(e) => setExtraAdultPrice(e.target.value)} />
                    </Col>
                    <Col md='4' className='my-50'>
                        <span>Extra Child Rate</span>
                        <Input type='number' name="Adult" value={extraChildPrice} bssize='small' onChange={(e) => setExtraChildPrice(e.target.value)} />
                    </Col>
                    <Button color='primary' className='mt-1 w-auto ms-auto' onClick={() => handleRate(defaultItem)}>Save</Button>
                </Row>
            </AccordionBody>
        </AccordionItem>
    )


}

export default RateItem