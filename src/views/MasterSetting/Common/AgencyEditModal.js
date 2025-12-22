import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const AgencyEditModal = ({ open, handleEditAgency }) => {

    const getUserData = useSelector(state => state.userManageSlice.userData)
    const { LoginID, Token } = getUserData

    const [agency, setAgency] = useState('')
    const [countryOpt, setCountryOpt] = useState([])
    const [stateOpt, setStateOpt] = useState([])
    const [districtOpt, setDistrictOpt] = useState([])
    const [cityOpt, setCity] = useState([])
    const [selCountry, setSelCountry] = useState('')
    const [selState, setSelState] = useState('')
    const [selDistrict, setSelDistrict] = useState('')
    const [selCity, setSelCity] = useState('')

    return (
        <>hi</>
        // <Modal
        //     isOpen={open}
        //     toggle={handleEditAgency}
        //     backdrop
        //     className='moadal-dialog-centered modal-lg'
        // >
        //     <ModalHeader toggle={handleEditAgency}>Edit Agency</ModalHeader>
        //     <ModalBody>
        //         <Form onSubmit={e => handleAddAgency(e)}>
        //             <Row className='mb-1'>
        //                 <Col>
        //                     <Label className='form-label' for='cname'>
        //                         Company Name<span className='text-danger'>*</span>
        //                     </Label>
        //                     <Input
        //                         type='text'
        //                         name='cname'
        //                         placeholder='Enter Company name'
        //                         value={cname}
        //                         onChange={e => setCname(e.target.value)}
        //                         invalid={submit && cname === ""}
        //                     />
        //                     {submit && cname === "" && <FormFeedback>Company Name is required!</FormFeedback>}
        //                 </Col>
        //                 <Col>
        //                     <Label className='form-label' for='aname'>
        //                         Agent Name<span className='text-danger'>*</span>
        //                     </Label>
        //                     <Input
        //                         type='text'
        //                         name='aname'
        //                         placeholder='Enter agent name'
        //                         value={aname}
        //                         onChange={e => setAname(e.target.value)}
        //                         invalid={submit && aname === ""}
        //                     />
        //                     {submit && aname === "" && <FormFeedback>Agent Name is required!</FormFeedback>}
        //                 </Col>
        //                 <Col>
        //                     <Label className='form-label' for='aemail'>
        //                         Contact Email<span className='text-danger'>*</span>
        //                     </Label>
        //                     <Input
        //                         type='email'
        //                         name='aemail'
        //                         placeholder='Enter contact email'
        //                         value={aemail}
        //                         onChange={e => setAemail(e.target.value)}
        //                         invalid={submit && aemail === ""}
        //                     />
        //                     {submit && aemail === "" && <FormFeedback>Contact Email is required!</FormFeedback>}
        //                 </Col>
        //             </Row>
        //             <Row className='mb-1'>
        //                 <Col className='d-flex flex-row justify-content-between align-items-center'>
        //                     <div className='w-50 me-1'>
        //                         <Label className='form-label' for='prefix'>
        //                             Country Code<span className='text-danger'>*</span>
        //                         </Label>
        //                         <Input
        //                             type='number'
        //                             name='prefix'
        //                             placeholder='91'
        //                             value={prefix}
        //                             onChange={e => setPrefix(e.target.value)}
        //                             invalid={submit && prefix === ""}
        //                         />
        //                         {submit && prefix === "" && <FormFeedback>Country Code is required!</FormFeedback>}
        //                     </div>
        //                     <div className='w-100 ms-1'>
        //                         <Label className='form-label' for='cnumber'>
        //                             Contact No.<span className='text-danger'>*</span>
        //                         </Label>
        //                         <Input
        //                             type='number'
        //                             name='cnumber'
        //                             placeholder='Enter contact no.'
        //                             value={cnum}
        //                             onChange={e => setCnum(e.target.value)}
        //                             invalid={submit && cnum === ""}
        //                         />
        //                         {submit && cnum === "" && <FormFeedback>Contact No. is required!</FormFeedback>}
        //                     </div>
        //                 </Col>
        //                 <Col>
        //                     <Label className='form-label' for='wsite'>
        //                         Website
        //                     </Label>
        //                     <Input
        //                         type='text'
        //                         name='wsite'
        //                         placeholder='Enter website URL'
        //                         value={wsite}
        //                         onChange={e => setWsite(e.target.value)}
        //                     />
        //                 </Col>
        //             </Row>
        //             <Row className='mb-1'>
        //                 <Col>
        //                     <Label className='form-label' for='gst'>
        //                         GST Number
        //                     </Label>
        //                     <Input
        //                         type='text'
        //                         name='gst'
        //                         placeholder='Enter GST number'
        //                         value={gst}
        //                         onChange={e => setGst(e.target.value)}
        //                     />
        //                 </Col>
        //             </Row>
        //             <Row className='mb-1'>
        //                 <Col>
        //                     <Label className='form-label' for='add'>
        //                         Address
        //                     </Label>
        //                     <Input
        //                         type='textarea'
        //                         name='add'
        //                         value={add}
        //                         onChange={e => setAdd(e.target.value)}
        //                     />
        //                 </Col>
        //             </Row>
        //             <Row className='mb-1'>
        //                 <Col>
        //                     <Label className='form-label' for='country'>Country</Label>
        //                     <Select
        //                         placeholder='Select Country'
        //                         menuPlacement='auto'
        //                         theme={selectThemeColors}
        //                         className='react-select'
        //                         classNamePrefix='select'
        //                         options={countryOpt}
        //                         value={countryOpt?.filter(c => c.value === selCountry)}
        //                         onChange={e => {
        //                             setSelCountry(e.value)
        //                         }}
        //                         invalid={submit && selCountry === ''}
        //                     />
        //                 </Col>
        //                 <Col>
        //                     <Label className='form-label' for='country'>State</Label>
        //                     <Select
        //                         isDisabled={selCountry === ''}
        //                         placeholder='Select State'
        //                         menuPlacement='auto'
        //                         theme={selectThemeColors}
        //                         className='react-select'
        //                         classNamePrefix='select'
        //                         options={stateOpt}
        //                         value={stateOpt?.filter(c => c.value === selState)}
        //                         onChange={e => {
        //                             setSelState(e.value)
        //                         }}
        //                         invalid={submit && selState === ''}
        //                     />
        //                 </Col>
        //                 <Col>
        //                     <Label className='form-label' for='country'>District</Label>
        //                     <Select
        //                         isDisabled={selState === ''}
        //                         placeholder='Select District'
        //                         menuPlacement='auto'
        //                         theme={selectThemeColors}
        //                         className='react-select'
        //                         classNamePrefix='select'
        //                         options={districtOpt}
        //                         value={districtOpt?.filter(c => c.value === selDistrict)}
        //                         onChange={e => {
        //                             setSelDistrict(e.value)
        //                         }}
        //                         invalid={submit && selDistrict === ''}
        //                     />
        //                 </Col>
        //                 <Col>
        //                     <Label className='form-label' for='country'>City</Label>
        //                     <Select
        //                         isDisabled={selDistrict === ''}
        //                         placeholder='Select City'
        //                         menuPlacement='auto'
        //                         theme={selectThemeColors}
        //                         className='react-select'
        //                         classNamePrefix='select'
        //                         options={cityOpt}
        //                         value={cityOpt?.filter(c => c.value === selCity)}
        //                         onChange={e => {
        //                             setSelCity(e.value)
        //                         }}
        //                         invalid={submit && selCity === ''}
        //                     />
        //                 </Col>
        //             </Row>
        //             <Row className='text-center'>
        //                 <Col>
        //                     <Button className='m-1' color='success' type='Submit'>Save</Button>
        //                     <Button className='m-1' color='primary' onClick={reset}>Cancel</Button>
        //                 </Col>
        //             </Row>
        //         </Form>
        //     </ModalBody>
        // </Modal>
    )
}

export default AgencyEditModal