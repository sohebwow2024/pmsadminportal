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

const Cashiering = () => {
  const [gstReport, SetGstReport] = useState(false)
  const [settlementReport, SetSettlementReport] = useState(false)
  const [taxRegister, SetTaxRegister] = useState(false)
  const [gstSale, SetGstSale] = useState(false)
  const [monthlyCollection, SetMonthlyCollection] = useState(false)
  const [dailyCollection, SetDailyCollection] = useState(false)
  const [foodSaleReport, SetFoodSaleReport] = useState(false)
  const [picker, setPicker] = useState(new Date())

  const tax = [
    { value: '...', label: '...' },
    { value: 'def', label: 'def' },
    { value: 'ghi', label: 'ghi' },
    { value: 'jkl', label: 'jkl' },
    { value: 'lmn', label: 'lmn' }
  ]

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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cashiering Report</CardTitle>
        </CardHeader>
        <CardBody className='text-center'>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetGstReport(true)}>
            GST Report
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetSettlementReport(true)}>
            Settlement Report
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetTaxRegister(true)}>
            Tax Register
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetGstSale(true)}>
            GST Sale Report
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetMonthlyCollection(true)}>
            Monthly Collection
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetDailyCollection(true)}>
            Daily Collection
          </Button>
          <Button className='me-2 mb-2' color='primary' onClick={() => SetFoodSaleReport(true)}>
            Food Sale Report
          </Button>
        </CardBody>
      </Card>
      <Modal
        isOpen={gstReport}
        toggle={() => SetGstReport(!gstReport)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetGstReport(!gstReport)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>GST Report</h2>
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
        isOpen={settlementReport}
        toggle={() => SetSettlementReport(!settlementReport)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetSettlementReport(!settlementReport)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Archive Settlement Report</h2>
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
        isOpen={taxRegister}
        toggle={() => SetTaxRegister(!taxRegister)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetTaxRegister(!taxRegister)}></ModalHeader>
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
                <Label className='form-label' for='tax'>
                  Tax :
                </Label>
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={tax[0]}
                  options={tax}
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
        isOpen={gstSale}
        toggle={() => SetGstSale(!gstSale)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetGstSale(!gstSale)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>GST Sale Report</h2>
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
                <Button color='primary' outline>DOWNLOAD</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={monthlyCollection}
        toggle={() => SetMonthlyCollection(!monthlyCollection)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetMonthlyCollection(!monthlyCollection)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>GST Sale Report</h2>
          <Row>
            <Col className='mb-1' xl='6' md='6' sm='12'>
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
            <Col className='mb-1' xl='6' md='6' sm='12'>
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
            <Row>
              <Col md='12 text-center my-2'>
                <Button color='primary' outline>DOWNLOAD</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={dailyCollection}
        toggle={() => SetDailyCollection(!dailyCollection)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetDailyCollection(!dailyCollection)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          <h2 className='text-center mb-1'>Daily Collection</h2>
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
                <Button color='primary' outline>DOWNLOAD</Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={foodSaleReport}
        toggle={() => SetFoodSaleReport(!foodSaleReport)}
        className='modal-dialog-centered'
        backdrop={false}
      >
        <ModalHeader className='bg-transparent' toggle={() => SetFoodSaleReport(!foodSaleReport)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50'>
          <h2 className='text-center mb-1'>Food Sale Report</h2>
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
                <Button color='primary' outline>DOWNLOAD</Button>
              </Col>
            </Row>
          </Row>
        </ModalBody>
      </Modal>
      {
        gstReport | settlementReport | taxRegister | gstSale | monthlyCollection | dailyCollection | foodSaleReport ? (
          <div className="modal-backdrop fade show" ></div>
        ) : null
      }
    </>
  )
}

export default Cashiering