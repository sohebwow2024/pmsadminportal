import React from 'react'
import { Card, CardBody } from 'reactstrap'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Styles
import '@styles/react/apps/app-calendar.scss'

const RoomCategory = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Room Category"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const calendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-light-${colorName}`
      ]
    }
  }

  return (
    <Card>
      <CardBody>
        <FullCalendar {...calendarOptions} />
      </CardBody>
    </Card>
  )
}

export default RoomCategory