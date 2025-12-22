import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Card, CardBody, Col, Input, Label, Row, Form } from 'reactstrap'
const newpage = () => {
    const [showErrors, setShowErrors] = useState(false);
    const [guestEmailId, setGuestEmailId] = useState('')
    console.log('guestEmailId', guestEmailId);
    const saveBooking = async () => {
        setShowErrors(true);
        try {
            toast.success('success', { position: "top-center" })
        } catch (error) {
            console.log("Error", error)
        }
    }
    return (
        <div>
            <Form>
                <div className='pe-1 w-25'>
                    <Label>
                        Email Id<span className='text-danger'>*</span>
                    </Label>
                    <Input
                        type='text'
                        value={guestEmailId}
                        invalid={guestEmailId === '' && showErrors}
                        onChange={e => setGuestEmailId(e.target.value)}
                    />
                    {showErrors && guestEmailId === '' && <span className='text-danger'>Enter Email Id</span>}
                </div>
                <Button className='me-1' color='primary' style={{ width: '100%' }} onClick={() => saveBooking()}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default newpage