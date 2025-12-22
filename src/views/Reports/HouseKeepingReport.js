import { React, useState } from 'react'
import {
  Row,
  Col,
  Card,
  CardHeader,
  Modal,
  Label,
  Button,
  CardBody,
  CardTitle,
  ModalBody,
  InputGroup,
  ModalHeader,
  InputGroupText
} from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import { MdDateRange } from "react-icons/md"

const HouseKeepingReport = () => {
  const [floor, setFloor] = useState(false)
  const [room, setRoom] = useState(false)
  const [summarisedStatus, SetSummarisedStatus] = useState(false)
  const [permanentOutOfOrder, SetPermanentOutOfOrder] = useState(false)
  const [temporaryOutOfOrder, SetTemporaryOutOfOrder] = useState(false)
  const [picker, setPicker] = useState(new Date())

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>House Keeping Report</CardTitle>
        </CardHeader>
        <CardBody className='text-center'>
          <Button className='me-2 mb-2' color='primary' onClick={() => setFloor(true)}>
            FloorWise Status
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => setRoom(true)}>
            RoomWise Status
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetSummarisedStatus(true)}>
            Summarised Status Report
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetPermanentOutOfOrder(true)}>
            Permanent Out Of Order
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetTemporaryOutOfOrder(true)}>
            Temporarily Out Of Order
          </Button>
        </CardBody>
      </Card>
      <Modal
        isOpen={floor}
        toggle={() => setFloor(!floor)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => setFloor(!floor)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h2 className='text-center mb-1'>Floorwise Report For Housekeeping</h2>
          <Row>
            <Col xs={8}>
              <Label className='form-label' for='startDate'>
                Date :
              </Label>
              <div className='datePicker'>
                <InputGroup className='input-group-merge'>
                  <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='startDate' />
                  <InputGroupText>
                    <MdDateRange size={15} />
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col md={4}>
              <div className='demo-inline-spacing'>
                <Button color='primary' outline>PRINT</Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={room}
        toggle={() => setRoom(!room)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => setRoom(!room)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h2 className='text-center mb-1'>Roomwise Report For Housekeeping</h2>
          <Row>
            <Col xs={8}>
              <Label className='form-label' for='startDate'>
                Date :
              </Label>
              <div className='datePicker'>
                <InputGroup className='input-group-merge'>
                  <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='startDate' />
                  <InputGroupText>
                    <MdDateRange size={15} />
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col md={4}>
              <div className='demo-inline-spacing'>
                <Button color='primary' outline>PRINT</Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={summarisedStatus}
        toggle={() => SetSummarisedStatus(!summarisedStatus)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetSummarisedStatus(!summarisedStatus)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h2 className='text-center mb-1'>Roomwise Report For Housekeeping</h2>
          <Row>
            <Col xs={8}>
              <Label className='form-label' for='startDate'>
                Date :
              </Label>
              <div className='datePicker'>
                <InputGroup className='input-group-merge'>
                  <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='startDate' />
                  <InputGroupText>
                    <MdDateRange size={15} />
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col md={4}>
              <div className='demo-inline-spacing'>
                <Button color='primary' outline>PRINT</Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={permanentOutOfOrder}
        toggle={() => SetPermanentOutOfOrder(!permanentOutOfOrder)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetPermanentOutOfOrder(!permanentOutOfOrder)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h2 className='text-center mb-1'>Permanent Out Of Order</h2>
          <Row>
            <Col md={5}>
              <Label className='form-label' for='startDate'>
                From Date :
              </Label>
              <div className='datePicker'>
                <InputGroup className='input-group-merge'>
                  <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='startDate' />
                  <InputGroupText>
                    <MdDateRange size={15} />
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col md={5}>
              <Label className='form-label' for='startDate'>
                To Date :
              </Label>
              <div className='datePicker'>
                <InputGroup className='input-group-merge'>
                  <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='startDate' />
                  <InputGroupText>
                    <MdDateRange size={15} />
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col md={2}>
              <div className='demo-inline-spacing'>
                <Button color='primary' outline>PRINT</Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={temporaryOutOfOrder}
        toggle={() => SetTemporaryOutOfOrder(!temporaryOutOfOrder)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetTemporaryOutOfOrder(!temporaryOutOfOrder)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h2 className='text-center mb-1'>Temporary Out Of Order</h2>
          <Row>
            <Col xs={8}>
              <Label className='form-label' for='startDate'>
                Date :
              </Label>
              <div className='datePicker'>
                <InputGroup className='input-group-merge'>
                  <Flatpickr className='form-control' value={picker} onChange={date => setPicker(date)} id='startDate' />
                  <InputGroupText>
                    <MdDateRange size={15} />
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>
            <Col md={4}>
              <div className='demo-inline-spacing'>
                <Button color='primary' outline>PRINT</Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {
        floor | room | summarisedStatus | permanentOutOfOrder | temporaryOutOfOrder ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default HouseKeepingReport