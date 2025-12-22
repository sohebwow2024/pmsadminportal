import React from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row } from 'reactstrap'
const labelStyle = {
  fontSize: '16px'
}
const PayAtHotelSetting = () => {
  return (
    <>
      <Row>
        <Col>
          <Label className='fw-bold fs-4 mb-3'>Pay At Hotel (PAH) Settings</Label>
        </Col>
        <Row>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Pay At Hotel Mode</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Credit Card</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Do you want to create Pay At Hotel Pre Pay Policy?</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* </Row>
        <Row> */}
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Bank Transfer</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Bill To Company</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Card Machine</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* </Row>
        <Row> */}
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Cash</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Cheque Deposit</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Credit</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* </Row>
        <Row> */}
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Credit Card</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Debit Card</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Discount</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Google Pay</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>IMPS</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Mobile Wallet</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* </Row>
        <Row> */}
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>NEFT</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>OTA</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Other</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* </Row>
        <Row> */}
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Payment Gateway</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Paytm</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>POS</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* </Row>
        <Row> */}
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>RTGS</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>Travel Agent</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg='4' md='6'>
            <Card>
              <CardHeader tag='h4' className='justify-content-center'>UPI</CardHeader>
              <CardBody>
                <div className='form-check form-switch ps-0 d-sm-flex justify-content-sm-center'>
                  <Row className='px-4 ps-2'>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label'>
                      Enabled
                    </Label></Col>
                    <Col md='3' sm='4'><Input type='switch' className='ms-1' name='customSwitch' id='exampleCustomSwitch' /></Col>
                    <Col md='4' sm='4'><Label for='exampleCustomSwitch' className='form-check-label ms-2'>
                      Disabled
                    </Label></Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg='12' className='mt-1 text-center'>
            <Button color='primary me-2'>Save Settings</Button>
          </Col>
        </Row>
        <Row>
          <Col lg='12' className='mt-3'>
            <h4 className='pb-3'>Pay At Hotel (PAH) Blackout Dates</h4>
          </Col>
          <Col lg='12'>
            <Label style={labelStyle} className='form-label'>Selected Blackout Out Dates</Label>
            <Row>
              <Col lg='9' md='9' sm='9'><Input type='text' /></Col>
              <Col lg='3' md='3' sm='3'><Button color='primary me-2'>Save</Button></Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </>
  )
}

export default PayAtHotelSetting