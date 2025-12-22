
import { React, useRef, useState } from 'react'
import Wizard from '@components/wizard'
import SelectRoom from './SelectRoom'
import GuestDetails from './GuestDetails'
import DatesInOut from './DatesInOut'
import ConfirmationFinal from './ConfirmationFinal'

import { FaCalendarCheck } from 'react-icons/fa'
import { BsPersonCircle } from 'react-icons/bs'
import { MdBedroomParent } from 'react-icons/md'
import { GiConfirmed } from 'react-icons/gi'

const Card = () => {
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = [
    {
      id: 'stay-dates',
      title: 'Stay Dates',
      subtitle: 'Enter Your Check-In & Check-out Dates.',
      icon: <FaCalendarCheck size={18} />,
      content: <DatesInOut stepper={stepper} type='modern-vertical' />
    },
    {
      id: 'select-room',
      title: 'Select Rooms',
      subtitle: 'Select rooms for booking',
      icon: <MdBedroomParent size={18} />,
      content: <SelectRoom stepper={stepper} type='modern-vertical' />
    },
    {
      id: 'guest-details',
      title: 'Guest Details',
      subtitle: 'Enter guest details',
      icon: <BsPersonCircle size={18} />,
      content: <GuestDetails stepper={stepper} type='modern-vertical' />
    },
    {
      id: 'final-step',
      title: 'Final Confirmation',
      subtitle: 'Give final confirmation on booking',
      icon: <GiConfirmed size={18} />,
      content: <ConfirmationFinal stepper={stepper} type='modern-vertical' />
    }
  ]
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
      <div className='modern-horizontal-wizard'>
        <Wizard
          type='modern-horizontal'
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

export default Card
