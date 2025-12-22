import React, { useState } from 'react'
import { Col, Input, Label } from 'reactstrap';

const AmountComponent = ({ item, index, setSplitAmount, _remainingAmount, roomRemaining, setRoomRemaining, roomno }) => {
    // console.log(item);
    const [guest, setGuest] = useState(0);
    const [input_value, setinput_Value] = useState(0);
    // setSplitAmount(guest)

    const calculateTotal = (numbers) => {
        return Object.entries(numbers).reduce((finalValue, [key, value]) => {
            if (value === "") {
                // if entered value is empty string "", omits it
                return finalValue;
            }
            return finalValue + value;
        }, 0);
    }

    // console.log("value", value)
    return (
        <td key={index}>
            <Col>
                <Label>Amount</Label>
                <Input type="number" name={'roomrat' + index} value={guest} onChange={(e) => {
                    setGuest(e.target.value)
                    // // setValue(p => p + parseInt(e.target.value))

                    // _remainingAmount(e.target.value)

                    const { value, name } = e.target; // gets the name and value from input field
                    const parsedValue = value === "" ? "" : parseFloat(value); // parses the value as a number or if empty treats it as empty string ""
                    setinput_Value((prevState) => {
                        // creates new immutable numbers object, using previous number values and the currently changed input value
                        const updatedNumbers = {
                            ...prevState.numbers,
                            [name]: parsedValue
                            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
                        };
                        // calculates the new total from updated numbers:
                        // console.log(updatedNumbers);
                        // const newTotal = calculateTotal(updatedNumbers);
                        // return {
                        //     numbers: updatedNumbers,
                        //     total: newTotal
                        // }

                        return updatedNumbers

                    })
                    _remainingAmount(input_value)
                }} />
            </Col>
        </td>
    )
}

export default AmountComponent