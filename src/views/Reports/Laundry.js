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

const Laundry = () => {
  const [laundryDetail, SetLaundryDetail] = useState(false)
  const [laundryReport, SetLaundryReport] = useState(false)
  const [paymentReport, SetPaymentReport] = useState(false)
  const [picker, setPicker] = useState(new Date())


  const type = [
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
          <CardTitle>Laundry Report</CardTitle>
        </CardHeader>
        <CardBody className='text-center'>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetLaundryDetail(true)}>
            Laundry Detail Report
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetLaundryReport(true)}>
            Laundry Report By Type
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetPaymentReport(true)}>
            Laundry Payment Report
          </Button>
        </CardBody>
      </Card>
      <Modal
        isOpen={laundryDetail}
        toggle={() => SetLaundryDetail(!laundryDetail)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetLaundryDetail(!laundryDetail)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Laundry Details Report</h2>
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
                <Button color='primary' outline>PRINT</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={laundryReport}
        toggle={() => SetLaundryReport(!laundryReport)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetLaundryReport(!laundryReport)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Laundry Report By Type</h2>
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
                <Label className='form-label' for='type'>
                  Type :
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={type[0]}
                  options={type}
                  isClearable={false}
                />
              </Col>
            </Row>
            <Row>
              <Col md='12 text-center my-2'>
                <Button color='primary' outline>PRINT</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={paymentReport}
        toggle={() => SetPaymentReport(!paymentReport)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetPaymentReport(!paymentReport)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Laundry Payment Report</h2>
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
                <Button color='primary' outline>PRINT</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>
      {
        laundryDetail | laundryReport | paymentReport ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default Laundry