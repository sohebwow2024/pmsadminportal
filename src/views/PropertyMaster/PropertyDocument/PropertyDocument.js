import { React, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, Row, Col, Button, CardBody } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { Edit, Trash, ExternalLink, Eye } from 'react-feather'
import NewPropDoc from './NewPropDoc'
import EditPropDoc from './EditPropDoc'
import DeletePropDoc from './DeletePropDoc'
import PreviewPropDoc from './PreviewPropDoc'
import { useSelector } from 'react-redux'
import axios from '../../../API/axios'

const PropertyDocument = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Property Document"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const [existDocs, setExistDocs] = useState([])

  const [open, setOpen] = useState(false)
  const handleModal = () => setOpen(!open)

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(!show)

  const [edit, setEdit] = useState(false)
  const handleEdit = () => setEdit(!edit)

  const [del, setDel] = useState(false)
  const handleDel = () => setDel(!del)

  const getExistingDocs = async () => {
    try {
      const res = await axios.get(`/property/docs?PropertyID=${PropertyID}`, {
        headers: {
          LoginID,
          Token
        }
      })
      console.log('res', res)
      setExistDocs(res?.data[0])
    } catch (error) {
      console.log('existData', error)
    }
  }

  useEffect(() => {
    getExistingDocs()
  }, [open, edit, del])

  const [selected_propertyDoc, setSelected_propertyDoc] = useState('')

  const propertyDocTable = [
    {
      name: 'ID',
      width: '18rem',
      selector: row => row.documentID
    },
    {
      name: 'Type',
      selector: row => row.documentType === '' ? '-' : row.documentType
    },
    {
      name: "Name",
      width: '18rem',
      selector: row => row.documentName
    },
    {
      name: 'Description',
      width: '20rem',
      selector: row => row.documentDescription
    },
    // {
    //   name: 'Document URL',
    //   selector: row => <a href={defaultFileSrc} alt={row.uploadDocument} target='_new'><ExternalLink className='me-50' size={15} /></a> // row.uploadDocument
    // },
    {
      name: 'Action',
      selector: row => (
        <>
          <Edit className='me-50 pe-auto' size={15} onClick={() => {
            handleEdit()
            setSelected_propertyDoc(row.documentID)
          }} />
          <Trash className='me-50' size={15} onClick={() => {
            handleDel()
            setSelected_propertyDoc(row.documentID)
          }} />
          <Eye className='me-50' size={15} onClick={() => {
            handleShow()
            setSelected_propertyDoc(row.documentID)
          }} />
        </>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Documents
          </CardTitle>
          <Button color='primary' onClick={() => handleModal()}>Add Documents</Button>
        </CardHeader>
        <CardBody>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                data={existDocs}
                columns={propertyDocTable}
                className='react-dataTable'
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      {open ? <NewPropDoc open={open} handleOpen={handleModal} /> : <></>}
      {edit ? <EditPropDoc edit={edit} handleEdit={handleEdit} id={selected_propertyDoc} /> : <></>}
      {del ? <DeletePropDoc del={del} handleDel={handleDel} id={selected_propertyDoc} /> : <></>}
      {show ? <PreviewPropDoc show={show} handleShow={handleShow} id={selected_propertyDoc} /> : <></>}
    </>
  )
}

export default PropertyDocument