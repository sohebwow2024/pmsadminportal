import { React, useEffect, useLayoutEffect, useState } from 'react'
import { Accordion } from 'reactstrap'
import PropertyAccordion from './PropertyAccordion'
import RoomAccordion from './RoomAccordion'
import './accordion.scss'
import { LabelList } from 'recharts'
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'
const PropertyPhotos = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Properety Photos"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const [open, setOpen] = useState('property_1')
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID, CompanyID } = getUserData
  const [propertyData, setPropertyData] = useState({ photos: [] })
  // console.log('propertyData', propertyData);
  const [roomsData, setRoomsData] = useState(
    {
      id: '1',

      labels: 'Bed, TV, Front Door, Kitchen, Ameneties',
      rooms: [

      ],

    }
  )
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Token': Token,
      'LoginID': LoginID
    }
  }

  const [tags, setTags] = useState([])
  const uniqVal = (a) => {
    var change = a.join(',').split(',')
    return [...new Set(change)]
  }

  const getAllTags = () => {
    axios.get('/property/photo/tags?PropertyID=' + PropertyID, config).then(res => {
      if (res != null) {
        setTags(res.data[0])
      }
    })
  }

  const getPropertyPhoto = async () => {
    axios.get('/property/photo?PropertyID=' + PropertyID, config).then(res => {
      console.log('propertyphoto', res);  
      if (res != null) {
        setPropertyData(res.data[0])
      }
    }).catch(e => {
      console.log(e)
    })
  }

  const getRoomsData = () => {
    axios.post('/getdata/bookingdata/roomdetails', { "LoginID": LoginID, "Token": Token, "Seckey": "abc", "Event": "selectall" }, config).then(res => {
      console.log('roomdetails', res);
      if (res.data !== null) {
        let rdata = []
        res.data[0].filter(r => r.status === "Active").map(i => {
          rdata.push({ type: i.roomDisplayName, id: i.roomID, photos: [] })
        })
        roomsData.rooms = rdata
        console.log('rr', rdata);
      }
      setRoomsData(roomsData)
    }).catch(e => {
      console.log(e)
    })
  }

  const [flag, setFlag] = useState(false)
  const handleFlag = () => setFlag(!flag)

  useEffect(() => {
    getPropertyPhoto()
    getRoomsData()
  }, [flag])

  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }

  return (
    <>
      <h4 className='mb-1'>Photos</h4>
      <p>Add quality photos showcase all your property. Good photos attract potential customers. Better the photo quality, higher the score will be. </p>
      <Accordion className='accordion-margin' open={open} toggle={toggle}>
        <PropertyAccordion data={propertyData} getPropertyPhoto={getPropertyPhoto} handleFlag={handleFlag} />
        {roomsData?.rooms.length > 0 && <RoomAccordion data={roomsData} handleFlag={handleFlag} />}
      </Accordion>
    </>
  )
}

export default PropertyPhotos
