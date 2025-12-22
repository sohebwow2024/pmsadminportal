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
import DataTable from 'react-data-table-component'
import { data, debtorsLedgerTable, roomAvailabilityTable } from './data'

const Admin = () => {
  const [voidTransaction, SetVoidTransaction] = useState(false)
  const [debtorsLedgerDetails, SetDebtorsLedgerDetails] = useState(false)
  const [roomAvailabilityReport, SetRoomAvailabilityReport] = useState(false)
  const [revenueReport, SetRevenueReport] = useState(false)
  const [picker, setPicker] = useState(new Date())

  const month = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' }
  ]

  const year = [
    { value: '2000', label: '2000' },
    { value: '2010', label: '2010' },
    { value: '2015', label: '2015' },
    { value: '2020', label: '2020' }
  ]

  const roomType = [
    { value: 'abc', label: 'abc' },
    { value: 'def', label: 'def' },
    { value: 'ghi', label: 'ghi' },
    { value: 'jkl', label: 'jkl' },
    { value: 'mno', label: 'mno' }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Admin Report</CardTitle>
        </CardHeader>
        <CardBody className='text-center'>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetVoidTransaction(true)}>
            Void Transaction
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetDebtorsLedgerDetails(true)}>
            Debtors Ledger Details
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetRoomAvailabilityReport(true)}>
            Room Availability Report
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetRevenueReport(true)}>
            Revenue Report
          </Button>
        </CardBody>
      </Card>
      <Modal
        isOpen={voidTransaction}
        toggle={() => SetVoidTransaction(!voidTransaction)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetVoidTransaction(!voidTransaction)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Void Transaction</h2>
          <Row>
            <Col xs={6}>
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
        isOpen={debtorsLedgerDetails}
        toggle={() => SetDebtorsLedgerDetails(!debtorsLedgerDetails)}
        className='modal-dialog-centered modal-xl'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetDebtorsLedgerDetails(!debtorsLedgerDetails)}>
        </ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>Debtors Ledger Details</h3>
          <Row>
            <Col md={3}>
              <Label className='form-label' for='startDate'>
                Start Date :
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
            <Col md={3}>
              <Label className='form-label' for='startDate'>
                End Date :
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
            <Col md='6 text-center my-2'>
              <Button color='primary' className='me-2'>SEARCH</Button>
              <Button color='primary' outline>PRINT</Button>
            </Col>
          </Row>
          <Row className='my-1'>
            <Col>
              <DataTable
                noHeader
                data={data}
                columns={debtorsLedgerTable}
                className='react-dataTable'
              />
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={roomAvailabilityReport}
        toggle={() => SetRoomAvailabilityReport(!roomAvailabilityReport)}
        className='modal-dialog-centered modal-xl'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetRoomAvailabilityReport(!roomAvailabilityReport)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h3 className='text-center mb-1'>Room Availability Report</h3>
          <Row>
            <Col className='mb-1' xl='3' md='6' sm='12'>
              <Label className='form-label' for='month'>
                Month :
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={month[0]}
                options={month}
                isClearable={false}
              />
            </Col>
            <Col className='mb-1' xl='3' md='6' sm='12'>
              <Label className='form-label' for='year'>
                Year :
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={year[0]}
                options={year}
                isClearable={false}
              />
            </Col>
            <Col className='mb-1' xl='3' md='6' sm='12'>
              <Label className='form-label' for='roomType'>
                Room Category :
              </Label>
              <Select
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                defaultValue={roomType[0]}
                options={roomType}
                isClearable={false}
              />
            </Col>
            <Col md={3}>
              <div className='demo-inline-spacing'>
                <Button.Ripple color='primary'>SEARCH</Button.Ripple>
              </div>
            </Col>
          </Row>
          <br></br>
          <DataTable
            noHeader
            data={data}
            columns={roomAvailabilityTable}
            className='react-dataTable'
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={revenueReport}
        toggle={() => SetRevenueReport(!revenueReport)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetRevenueReport(!revenueReport)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h2 className='text-center mb-1'>Revenue Report</h2>
          <Row>
            <Col xs={6}>
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
            <Col xs={6}>
              <div className='demo-inline-spacing'>
                <Button.Ripple color='primary'>SEARCH</Button.Ripple>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {
        voidTransaction | debtorsLedgerDetails | roomAvailabilityReport | revenueReport ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default Admin