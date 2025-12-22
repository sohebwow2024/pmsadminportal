import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Alert
} from 'reactstrap';
import NewBillSplitForm from './NewBillSplitForm';

const BillSplitAccordion = ({ rooms, serviceData, errFlag }) => {
  // console.log('serviceData', serviceData);
  const [open, setOpen] = useState('1')
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  }

  return (
    <>
      {
        errFlag && (
          <>
            <Alert color='warning'>
              <p className='alert-heading text-center'>
                Warning Bill split is incomplete, check if the total for all rooms is split in between guest accordingly.
              </p>
            </Alert>
          </>
        )
      }
      {
        rooms.length > 0 ? (rooms.map((item, index) => {
          return (
            <Accordion className='accordion-margin' open={open} toggle={toggle} key={index}>
              <AccordionItem>
                <AccordionHeader targetId={index + 1}>
                  {item.RoomNo} - {item.RoomType}
                </AccordionHeader>
                <AccordionBody accordionId={index + 1}>
                  <NewBillSplitForm data={item} />
                  {/* <BillSplitForm roomId={roomId} guestDetail={item.GUEST} roomDetail={roomDetail} serviceDetail={serviceDetail} /> */}
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          )
        })
        ) : (
          <h3 className='fw-light fs-4 text-center'>Enter Guest details for all rooms</h3>
        )
      }
    </>
  )
}

export default BillSplitAccordion;