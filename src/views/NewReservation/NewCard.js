
import { React, useRef, useState, useEffect } from 'react'
import Wizard from '@components/wizard'
import NewSelectRoom from './SelectRoom/NewSelectRoom'
import NewGuestDetails from './Guest/NewGuestDetails'
import NewDatesInOut from './NewDatesInOut'
import NewConfirmationFinal from './Confirmation/NewConfirmationFinal'

import { FaCalendarCheck } from 'react-icons/fa'
import { BsPersonCircle } from 'react-icons/bs'
import { MdBedroomParent } from 'react-icons/md'
import { GiConfirmed } from 'react-icons/gi'

import { store } from '@store/store'
import { disposeNewStore } from '../../redux/reserve'

const NewCard = () => {
  const ref = useRef(null)
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-New Reservation"

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
      content: <NewDatesInOut stepper={stepper} type='modern-vertical' />
    },
    {
      id: 'select-room',
      title: 'Select Rooms',
      subtitle: 'Select rooms for booking',
      icon: <MdBedroomParent size={18} />,
      content: <NewSelectRoom stepper={stepper} type='modern-vertical' />
    },
    {
      id: 'guest-details',
      title: 'Guest Details',
      subtitle: 'Enter guest details',
      icon: <BsPersonCircle size={18} />,
      content: <NewGuestDetails stepper={stepper} type='modern-vertical' />
    },
    {
      id: 'final-step',
      title: 'Final Confirmation',
      subtitle: 'Give final confirmation on booking',
      icon: <GiConfirmed size={18} />,
      content: <NewConfirmationFinal stepper={stepper} type='modern-vertical' />
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

export default NewCard
