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
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const GuestWithoutRate = () => {
  const [archiveGuest, SetArchiveGuest] = useState(false)
  const [businessSourceGuest, SetBusinessSourceGuest] = useState(false)
  const [roomTypeGuest, SetRoomTypeGuest] = useState(false)
  const [channelGuest, SetChannelGuest] = useState(false)
  const [floorGuest, SetFloorGuest] = useState(false)
  const [picker, setPicker] = useState(new Date())


  const businessSource = [
    { value: '...', label: '...' },
    { value: 'abc', label: 'abc' },
    { value: 'pqr', label: 'pqr' },
    { value: 'xyz', label: 'xyz' },
    { value: 'lmn', label: 'lmn' }
  ]

  const roomSource = [
    { value: '...', label: '...' },
    { value: 'def', label: 'def' },
    { value: 'ghi', label: 'ghi' },
    { value: 'jkl', label: 'jkl' },
    { value: 'lmn', label: 'lmn' }
  ]

  const channelSource = [
    { value: '...', label: '...' },
    { value: 'opq', label: 'opq' },
    { value: 'pqr', label: 'pqr' },
    { value: 'rst', label: 'rst' },
    { value: 'uvw', label: 'uvw' }
  ]

  const floorSource = [
    { value: '...', label: '...' },
    { value: 'abc', label: 'abc' },
    { value: 'pqr', label: 'pqr' },
    { value: 'xyz', label: 'xyz' },
    { value: 'lmn', label: 'lmn' }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Guest Without  Rate</CardTitle>
        </CardHeader>
        <CardBody className='text-center'>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetArchiveGuest(true)}>
            Archive Guest
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetBusinessSourceGuest(true)}>
            Guest  By Business Source
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetRoomTypeGuest(true)}>
            Guest  By Room Category
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetChannelGuest(true)}>
            Guest  By Channel
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetFloorGuest(true)}>
            Guest  By Floor
          </Button>
        </CardBody>
      </Card>
      <Modal
        isOpen={archiveGuest}
        toggle={() => SetArchiveGuest(!archiveGuest)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetArchiveGuest(!archiveGuest)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Archive Guest Report</h2>
          <Row>
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Row>
              <Col md='12 text-center my-2'>
                <Button color='primary' className='me-2'>SEARCH</Button>
                <Button color='primary' outline>PRINT</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={businessSourceGuest}
        toggle={() => SetBusinessSourceGuest(!businessSourceGuest)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetBusinessSourceGuest(!businessSourceGuest)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Archive Guest By Business Source</h2>
          <Row>
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Row>
              <Col className='mb-1' xl='6' md='6' sm='12'>
                <Label className='form-label' for='businessSource'>
                  Business Source :
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={businessSource[0]}
                  options={businessSource}
                  isClearable={false}
                />
              </Col>
            </Row>
            <Row>
              <Col md='12 text-center my-2'>
                <Button color='primary' className='me-2'>SEARCH</Button>
                <Button color='primary' outline>PRINT</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={roomTypeGuest}
        toggle={() => SetRoomTypeGuest(!roomTypeGuest)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetRoomTypeGuest(!roomTypeGuest)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Archive Guest By Room Category</h2>
          <Row>
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Row>
              <Col className='mb-1' xl='6' md='6' sm='12'>
                <Label className='form-label' for='roomSource'>
                  Room Category :
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={roomSource[0]}
                  options={roomSource}
                  isClearable={false}
                />
              </Col>
            </Row>
            <Row>
              <Col md='12 text-center my-2'>
                <Button color='primary' className='me-2'>SEARCH</Button>
                <Button color='primary' outline>PRINT</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={channelGuest}
        toggle={() => SetChannelGuest(!channelGuest)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetChannelGuest(!channelGuest)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Archive Guest By Domicile</h2>
          <Row>
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Row>
              <Col className='mb-1' xl='6' md='6' sm='12'>
                <Label className='form-label' for='channelSource'>
                  Channel :
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={channelSource[0]}
                  options={channelSource}
                  isClearable={false}
                />
              </Col>
            </Row>
            <Row>
              <Col md='12 text-center my-2'>
                <Button color='primary' className='me-2'>SEARCH</Button>
                <Button color='primary' outline>PRINT</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={floorGuest}
        toggle={() => SetFloorGuest(!floorGuest)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetFloorGuest(!floorGuest)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Archive Guest By Floor</h2>
          <Row>
            <Col xs={6}>
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
            <Col xs={6}>
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
            <Row>
              <Col className='mb-1' xl='6' md='6' sm='12'>
                <Label className='form-label' for='floorSource'>
                  Floor :
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={floorSource[0]}
                  options={floorSource}
                  isClearable={false}
                />
              </Col>
            </Row>
            <Row>
              <Col md='12 text-center my-2'>
                <Button color='primary' className='me-2'>SEARCH</Button>
                <Button color='primary' outline>PRINT</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>
      {
        archiveGuest | businessSourceGuest | roomTypeGuest | channelGuest | floorGuest ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default GuestWithoutRate