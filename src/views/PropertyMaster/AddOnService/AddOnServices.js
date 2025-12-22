import React, { useState, useEffect } from 'react'
import { Badge, Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'
import axios from '../../../API/axios'
import { useSelector } from 'react-redux'
import NewAddOnServiceModal from './NewAddOnServiceModal'

const AddOnServices = () => {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Add On Services"

    return () => {
      document.title = prevTitle
    }
  }, [])
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token } = getUserData

  const [addOnServices, setAddOnServices] = useState([])

  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)

  const [showEdit, setShowEdit] = useState(false)
  const handleEditModal = () => setShowEdit(!showEdit)

  const [del, setDel] = useState(false)
  const handleDeleteModal = () => setDel(!del)

  const [selected_service, setSelected_service] = useState()

  const getAddOnServices = async () => {
    try {
      // const res = await axios.get('/master/extraservice/all', {
      const res = await axios.get('/master/extraservice/all/Active', {
        headers: {
          LoginID,
          Token,
          Seckey: "123"
        }
      })
      console.log('res', res)
      if (res.data[0].length > 0) {
        setAddOnServices(res.data[0])
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getAddOnServices()
  }, [show, showEdit, del])

  // const NewAddOnServiceModal = () => {

  //   const [serviceName, setServiceName] = useState('')
  //   const [serviceDesc, setServiceDesc] = useState('')
  //   const [serviceCharge, setServiceCharge] = useState('')
  //   const [serviceGst, setServiceGst] = useState('')
  //   const [serviceType, setServiceType] = useState('')

  //   const [display, setDisplay] = useState(false)

  //   const handleSubmit = async () => {
  //     setDisplay(true)
  //     // if (serviceName && serviceCharge && serviceGst && serviceType !== '') {
  //     //   setAddOnServices([...addOnServices, addOnServiceObj])
  //     //   handleModal()
  //     //   toast.success('Service Added!', { position: "top-center" })
  //     // }
  //     if (serviceName && serviceDesc && serviceCharge && serviceGst && serviceType !== '') {
  //       try {
  //         const obj = {
  //           ServiceDesc: serviceName,
  //           ServiceName: serviceName,
  //           ServiceCharge: serviceCharge,
  //           ServiceTax: serviceGst,
  //           ServiceType: serviceType,
  //           TaxName: "GST"
  //         }
  //         const res = await axios.post('/master/extraservice', obj, {
  //           headers: {
  //             LoginID,
  //             Token,
  //             Seckey: "123"
  //           }
  //         })
  //         if (res.data[0][0].Status === "Success") {
  //           setDisplay(false)
  //           handleModal()
  //           toast.success('Service Added!')
  //         }
  //       } catch (error) {
  //         console.log('error', error)
  //         toast.error("Something went wrong, Try again!")
  //       }
  //     } else toast.error("Fill all details!")
  //   }

  //   const reset = () => {
  //     setDisplay(false)
  //     setServiceName('')
  //     setServiceDesc('')
  //     setServiceCharge('')
  //     setServiceGst('')
  //     setServiceType('')
  //   }

  //   return (
  //     <>
  //       <Modal
  //         isOpen={show}
  //         toggle={handleModal}
  //         className='modal-dialog-centered modal-lg'
  //         backdrop={false}
  //       >
  //         <ModalHeader className='bg-transparent' toggle={handleModal}>
  //           Add Service
  //         </ModalHeader>
  //         <ModalBody className='px-sm-2 mx-50 pb-5'>
  //           <>
  //             <Row>
  //               <Col lg='3' className='mb-lg-2'>
  //                 <Label className='form-label' for='serviceName'>
  //                   <span className='text-danger'>*</span>Service Name</Label>
  //               </Col>
  //               <Col lg='9' className='mb-2'>
  //                 <Input
  //                   type='text'
  //                   placeholder='Service Name'
  //                   name='serviceName'
  //                   id='serviceName'
  //                   value={serviceName}
  //                   onChange={e => setServiceName(e.target.value)}
  //                   invalid={display && serviceName === ''}
  //                 />
  //                 {display === true && !serviceName ? <span className='error_msg_lbl'>Enter Service Name </span> : <></>}
  //               </Col>
  //               <Col lg='3' className='mb-lg-2'>
  //                 <Label className='form-label' for='serviceName'>
  //                   <span className='text-danger'>*</span>Service Description</Label>
  //               </Col>
  //               <Col lg='9' className='mb-2'>
  //                 <Input
  //                   type='textarea'
  //                   placeholder='Service Description'
  //                   name='serviceDesc'
  //                   id='serviceDesc'
  //                   value={serviceDesc}
  //                   onChange={e => setServiceDesc(e.target.value)}
  //                   invalid={display && serviceName === ''}
  //                 />
  //                 {display === true && !serviceName ? <span className='error_msg_lbl'>Enter Service Description </span> : <></>}
  //               </Col>
  //               <Col lg='3' className='mb-lg-2'>
  //                 <Label className='form-label' for='serviceCharge'>
  //                   <span className='text-danger'>*</span>Service Charge</Label>
  //               </Col>
  //               <Col lg='9' className='mb-2'>
  //                 <Input
  //                   type='number'
  //                   placeholder='Service Charge'
  //                   name='serviceCharge'
  //                   id='serviceCharge'
  //                   value={serviceCharge}
  //                   onChange={e => setServiceCharge(e.target.value)}
  //                   invalid={display && serviceCharge === ''}
  //                 />
  //                 {display === true && !serviceCharge ? <span className='error_msg_lbl'>Enter Service Charge </span> : <></>}
  //               </Col>
  //               <Col lg='3' className='mb-lg-2'>
  //                 <Label className='form-label' for='serviceGst'>
  //                   <span className='text-danger'>*</span>Service GST</Label>
  //               </Col>
  //               <Col lg='9' className='mb-2'>
  //                 <Input
  //                   type='number'
  //                   placeholder='Service GST'
  //                   name='serviceGst'
  //                   id='serviceGst'
  //                   value={serviceGst}
  //                   onChange={e => setServiceGst(e.target.value)}
  //                   invalid={display && serviceGst === ''}
  //                 />
  //                 {display === true && !serviceGst ? <span className='error_msg_lbl'>Enter GST </span> : <></>}
  //               </Col>
  //               <Col lg='3' className='mb-lg-2'>
  //                 <Label className='form-label' for='serviceType'>
  //                   <span className='text-danger'>*</span>Service Type</Label>
  //               </Col>
  //               <Col lg='9' className='mb-2'>
  //                 <div>
  //                   <Input
  //                     type='radio'
  //                     name='serviceType'
  //                     id='perNight'
  //                     value="Night"
  //                     checked={serviceType === "Night"}
  //                     onChange={e => setServiceType(e.target.value)}
  //                   />
  //                   <Label className='ms-1' for='perNight'>
  //                     Per Night
  //                   </Label>
  //                   <Input
  //                     type='radio'
  //                     className='ms-3'
  //                     name='serviceType'
  //                     id='perPerson'
  //                     value="Person"
  //                     checked={serviceType === "Person"}
  //                     onChange={e => setServiceType(e.target.value)} />
  //                   <Label className='ms-1' for='perPerson'>
  //                     Per Person
  //                   </Label>
  //                 </div>
  //                 {display === true && !serviceType ? <span className='error_msg_lbl'>Please Select Something </span> : <></>}
  //               </Col>
  //             </Row>
  //             <Row tag='form' >
  //               <Col className='text-lg-end text-md-center mt-1' lg='12'>
  //                 <Button className='me-1' color='primary' onClick={handleSubmit}>
  //                   Submit
  //                 </Button>
  //                 <Button
  //                   color='secondary'
  //                   outline
  //                   onClick={() => {
  //                     setShow(!show)
  //                     reset()
  //                   }}
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Col>
  //             </Row>
  //           </>
  //         </ModalBody>
  //       </Modal>
  //       {
  //         show ? (
  //           <div className="modal-backdrop fade show" ></div>
  //         ) : null
  //       }
  //     </>
  //   )
  // }

  const EditAddOnServiceModal = ({ id }) => {

    const addOnServiceData = addOnServices.filter(addOnService => addOnService.serviceID === id)
    console.log('Edit addOnServiceData', addOnServiceData)

    const [serviceID] = useState(addOnServiceData[0]?.serviceID)
    const [editServiceName, setEditServiceName] = useState(addOnServiceData[0]?.serviceName)
    const [editServiceDesc, setEditServiceDesc] = useState(addOnServiceData[0]?.serviceDesc)
    const [editServiceCharge, setEditServiceCharge] = useState(addOnServiceData[0]?.serviceCharge)
    const [editServiceGst, setEditServiceGst] = useState(addOnServiceData[0]?.serviceTax)
    const [editServiceType, setEditServiceType] = useState(addOnServiceData[0]?.serviceType)
    console.log('editServiceGst', editServiceGst);
    const [editDisplay, setEditDisplay] = useState(false)

    const editHandleSubmit = async () => {
      setEditDisplay(true)
      console.log(editServiceGst);
      if (editServiceName && editServiceDesc && editServiceCharge && editServiceGst && editServiceType === '') {
        toast.error("Fill all Details")
      }
      else {
        try {
          const obj = {
            ServiceDesc: editServiceDesc,
            ServiceName: editServiceName,
            ServiceCharge: editServiceCharge,
            ServiceTax: editServiceGst,
            ServiceType: editServiceType,
            TaxName: "GST"
          }
          const res = await axios.post(`/master/extraservice/update/${serviceID}`, obj, {
            headers: {
              LoginID,
              Token,
              Seckey: "123"
            }
          })
          console.log('edit res', res)
          if (res.data[0][0].status === "Success") {
            toast.success("Add-On Service updated!")
            handleEditModal()
          }
        } catch (error) {
          console.log('error', error)
          toast.error("Something went wrong, Try again!")
        }
      }
    }

    return (
      <>
        <Modal
          isOpen={showEdit}
          toggle={handleEditModal}
          className='modal-dialog-centered modal-lg'
          backdrop={false}
        >
          <ModalHeader className='bg-transparent' toggle={handleEditModal}>
            Edit Service
          </ModalHeader>
          <ModalBody className='px-sm-2 mx-50 pb-5'>
            <>
              <Row>
                <Col lg='3' className='mb-lg-2'>
                  <Label className='form-label' for='serviceName'>
                    <span className='text-danger'>*</span>Service Name</Label>
                </Col>
                <Col lg='9' className='mb-2'>
                  <Input type='text' placeholder='Service Name' name='serviceName' id='serviceName' value={editServiceName} onChange={e => setEditServiceName(e.target.value)} invalid={editDisplay && editServiceName === ''} />
                  {editDisplay === true && !editServiceName ? <span className='error_msg_lbl'>Enter Service Name </span> : <></>}
                </Col>
                <Col lg='3' className='mb-lg-2'>
                  <Label className='form-label' for='serviceDesc'>
                    <span className='text-danger'>*</span>Service Description</Label>
                </Col>
                <Col lg='9' className='mb-2'>
                  <Input type='textarea' placeholder='Service Description' name='serviceDesc' id='serviceDesc' value={editServiceDesc} onChange={e => setEditServiceDesc(e.target.value)} invalid={editDisplay && editServiceName === ''} />
                  {editDisplay === true && !editServiceDesc ? <span className='error_msg_lbl'>Enter Service Description </span> : <></>}
                </Col>
                <Col lg='3' className='mb-lg-2'>
                  <Label className='form-label' for='serviceCharge'>
                    <span className='text-danger'>*</span>Service Charge</Label>
                </Col>
                <Col lg='9' className='mb-2'>
                  <Input type='number' placeholder='Service Charge' name='serviceCharge' id='serviceCharge' value={editServiceCharge} onChange={e => setEditServiceCharge(e.target.value)} invalid={editDisplay && editServiceCharge === ''} />
                  {editDisplay === true && !editServiceCharge ? <span className='error_msg_lbl'>Enter Service Charge </span> : <></>}
                </Col>
                <Col lg='3' className='mb-lg-2'>
                  <Label className='form-label' for='serviceGst'>
                    <span className='text-danger'>*</span>Service GST</Label>
                </Col>
                <Col lg='9' className='mb-2'>
                  <Input type='number' placeholder='Service GST' name='serviceGst' id='serviceGst' value={editServiceGst} onChange={e => setEditServiceGst(e.target.value)} invalid={editDisplay && editServiceGst === ''} />
                  {editDisplay === true && editServiceGst === '' ? <span className='error_msg_lbl'>Enter GST </span> : <></>}
                </Col>
                <Col lg='3' className='mb-lg-2'>
                  <Label className='form-label' for='serviceType'>
                    <span className='text-danger'>*</span>Service Type</Label>
                </Col>
                <Col lg='9' className='mb-2'>
                  <Input type='radio' name='serviceType' id='perNight' value="Night" checked={editServiceType === "Night"} onChange={e => setEditServiceType(e.target.value)} />
                  <Label className='ms-1' for='perNight'>
                    Per Night
                  </Label>
                  <Input type='radio' className='ms-3' name='serviceType' id='perPerson' value="Person" checked={editServiceType === "Person"} onChange={e => setEditServiceType(e.target.value)} />
                  <Label className='ms-1' for='perPerson'>
                    Per Person
                  </Label>
                </Col>
                {editDisplay === true && !editServiceType ? <span className='error_msg_lbl'>Please Select Something </span> : <></>}
              </Row>
              <Row tag='form'>
                <Col className='text-center mt-1' lg='12'>
                  <Button className='me-1' color='primary' onClick={editHandleSubmit}>
                    Submit
                  </Button>
                  <Button
                    color='secondary'
                    outline
                    onClick={handleEditModal}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </>
          </ModalBody>
        </Modal>
        {
          showEdit ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const DeleteAddOnServiceModal = ({ id }) => {

    const data = addOnServices.filter(addOnService => addOnService.serviceID === id)
    console.log('data', data)

    const handleDeleteAddOnService = async () => {
      try {
        const res = await axios.post(`/master/extraservice/delete/${data[0].serviceID}`, null, {
          headers: {
            LoginID,
            Token,
            Seckey: "123"
          }
        })
        console.log('deleteres', res)
        if (res.data[0][0].status === "Success") {
          toast.success("Add-On Service Deleted!")
          handleDeleteModal()
        }
      } catch (error) {
        console.log('error', error)
        toast.error("Something went wrong, Try again!")
      }
    }

    return (
      <>
        <Modal
          isOpen={del}
          toggle={() => setDel(!del)}
          className='modal-dialog-centered'
          backdrop={false}
        >
          <ModalHeader className='bg-transparent' toggle={() => setDel(!del)}>
            Are you sure to delete  "{data[0]?.serviceName}" permanently?
          </ModalHeader>
          <ModalBody>
            <Row className='text-center'>
              <Col xs={12}>
                <Button color='danger' className='m-1' onClick={handleDeleteAddOnService}>
                  Delete
                </Button>
                <Button className='m-1' color='secondary' outline onClick={() => setDel(!del)}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        {
          del ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const [query, setQuery] = useState("")
  const search = (data) => {
    return data.filter(item =>
      item.serviceID.toLowerCase().includes(query.toLowerCase()) ||
      item.serviceName.toLowerCase().includes(query.toLowerCase()) ||
      item.serviceType.toLowerCase().includes(query.toLowerCase())
    )
  }


  const addOnServiceTable = [
    {
      name: 'ID',
      width: '18rem',
      sortable: true,
      selector: row => row.serviceID
    },
    {
      name: "Service Name",
      width: '15rem',
      center: true,
      selector: row => row.serviceName
    },
    {
      name: "Service Charge",
      width: '8rem',
      center: true,
      selector: row => row.serviceCharge
    },
    {
      name: "Service GST",
      width: '8rem',
      center: true,
      selector: row => row.serviceTax
    },
    {
      name: "Service Type",
      width: '10rem',
      center: true,
      selector: row => row.serviceType
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => row.status,
      cell: row => {
        return (
          <>
            {
              row.status === 'Active' ? (
                <Badge color='light-success'> {row.status}</Badge>
              ) : (
                <Badge color='light-danger'> {row.status}</Badge>
              )
            }
          </>
        )
      }
    },
    {
      name: 'Action',
      sortable: true,
      selector: row => (
        <>
          <Col>
            <Edit className='me-50 pe-auto' onClick={() => {
              setShowEdit(true)
              setSelected_service(row.serviceID)
            }} size={15} />
            <Trash className='me-50' size={15} onClick={() => {
              setDel(true)
              setSelected_service(row.serviceID)
            }} />
          </Col>
        </>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Add On Service Master
          </CardTitle>
          <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
          <Button color='primary' onClick={() => setShow(true)}>Add New Service</Button>
        </CardHeader>
        <CardBody>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                data={search(addOnServices)}
                columns={addOnServiceTable}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      {show && <NewAddOnServiceModal show={show} handleModal={handleModal} />}
      {showEdit && <EditAddOnServiceModal id={selected_service} />}
      {del && <DeleteAddOnServiceModal id={selected_service} />}
    </>
  )
}

export default AddOnServices