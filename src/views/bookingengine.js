
import { React, useRef, useState, useEffect } from 'react'
import Wizard from '@components/wizard'
// import NewSelectRoom from './SelectRoom/NewSelectRoom'
// import NewGuestDetails from './Guest/NewGuestDetails'
// import NewDatesInOut from './NewDatesInOut'
// import NewConfirmationFinal from './Confirmation/NewConfirmationFinal'

import { FaCalendarCheck } from 'react-icons/fa'
import { BsPersonCircle } from 'react-icons/bs'
import { MdBedroomParent } from 'react-icons/md'
import { GiConfirmed } from 'react-icons/gi'

import { store } from '@store/store'
// import { disposeNewStore } from '../../redux/reserve'
import NewDatesInOut from './NewReservation/NewDatesInOut'
import NewSelectRoom from './NewReservation/SelectRoom/NewSelectRoom'
import NewGuestDetails from './NewReservation/Guest/NewGuestDetails'
import NewConfirmationFinal from './NewReservation/Confirmation/NewConfirmationFinal'
import { disposeNewStore } from '../redux/reserve'
import logo from '../assets/images/logo/hostynnist-logo.png'
import { Card } from 'reactstrap'
import BKDatesInOut from './BKDatesInOut'
import BKNewSelectRoom from './BKNewSelectRoom'
import BKNewGuestDetails from './BKNewGuestDetails'
import BKNewConfimationFinal from './BKNewConfimationFinal'

const bookingengine = () => {


    const ref = useRef(null)
    useEffect(() => {
        const prevTitle = document.title
        document.title = "PMS- Booking Engine"

        return () => {
            document.title = prevTitle
        }
    }, [])
    // ** State
    const [stepper, setStepper] = useState(null)

    const steps = [
        {
            id: 'stay-dates',
            title: 'Stay Dates',
            subtitle: 'Enter Your Check-In & Check-out Dates.',
            icon: <FaCalendarCheck size={18} />,
            content: <BKDatesInOut stepper={stepper} type='vertical' />
        },
        {
            id: 'select-room',
            title: 'Select Rooms',
            subtitle: 'Select rooms for booking',
            icon: <MdBedroomParent size={18} />,
            content: <BKNewSelectRoom stepper={stepper} type='vertical' />
        },
        {
            id: 'guest-details',
            title: 'Guest Details',
            subtitle: 'Enter guest details',
            icon: <BsPersonCircle size={18} />,
            content: <BKNewGuestDetails stepper={stepper} type='vertical' />
        },
        {
            id: 'final-step',
            title: 'Final Confirmation',
            subtitle: 'Give final confirmation on booking',
            icon: <GiConfirmed size={18} />,
            content: <BKNewConfimationFinal stepper={stepper} type='vertical' />
        }
    ]

    useEffect(() => {
        return () => {
            console.log('hit retirn');
            store.dispatch(disposeNewStore(true))
        }
    }, [])


    return (
        <>
            {/* <div className='modern-vertical-wizard'> */}
            <style>
                {
                    `.bs-stepper-header{
             justify-content: space-between;
          }`
                }
            </style>
            <div>
                <Card>
                    <div className='d-flex m-1'>
                        <img
                            className="fallback-logo"
                            height={28}
                            width={30}
                            src={logo}
                            alt="logo"
                        />
                        <h1 className="brand-text" style={{ color: "#7B68EE" }}>
                            Hostynnist
                        </h1>
                    </div>
                </Card>
            </div>
            <div className='vertical-wizard bookingEngineWizard'>
                <Wizard
                    type='vertical'
                    ref={ref}
                    steps={steps}
                    instance={el => {
                        setStepper(el)
                    }}
                />
            </div>
        </>
    )
}

export default bookingengine
