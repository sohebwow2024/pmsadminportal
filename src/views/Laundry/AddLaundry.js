import { React, useState, useEffect } from 'react'
import { Row, Col, Button, Card, CardHeader, CardTitle, CardBody, Label, Input, Modal, ModalBody, ModalHeader, Form, FormFeedback, Badge } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash, Trash2 } from 'react-feather'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
// ** Styles
import '@styles/react/libs/editor/editor.scss'
import axios from './../../API/axios'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'


const AddLaundry = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Add Laundry"

    return () => {
      document.title = prevTitle
    }
  }, [])

  const getUserData = useSelector(state => state.userManageSlice.userData)

  const { LoginID, Token } = getUserData
  // const userId = localStorage.getItem('user-id')
  // const userToken = localStorage.getItem('user-token')
  const [userData, setUserData] = useState([])
  const [sel_id, setSel_id] = useState()
  const [laundryModal, setLaundryModal] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const handleUserModal = () => setLaundryModal(!laundryModal)
  const [updateLaundry, setupdateLaundry] = useState(false)
  const [submit, setSubmit] = useState(false)

  const handleUpdateLaundry = () => setupdateLaundry(!updateLaundry)

  const [delUser, setDelUser] = useState(false)
  const handleDeleteUser = () => setDelUser(!delUser)

  const laundaryData = async () => {
    setDataLoading(true)
    const postData = {
      LoginID: LoginID,
      Token: Token,
      Seckey: "abc",
      Event: "select"
    }
    try {
      await axios.post("/laundry", postData).then((res) => {
        console.log(res.data[0])
        setUserData(res.data[0])
        setDataLoading(false)
      })
    } catch (error) {
      console.log("file: AddLaundry.js:107  laundaryData  error", error)
      setDataLoading(false)
    }
  }

  const deleteLaundary = (id) => {
    const postData = {
      LoginID: LoginID,
      Token: Token,
      Seckey: "abc",
      Event: "delete",
      LaundryID: id
    }

    axios.post("laundry", postData).then((res) => {
      console.log("file: AddLaundry.js:59  awaitaxios.post  res", res)
      laundaryData()
      handleDeleteUser()
    }).catch(e => {
      console.log("file: AddLaundry.js:107  laundaryData  error", e)
      setDataLoading(false)
    })
  }

  useEffect(() => {
    laundaryData()
  }, [])
  const NewLaundryModal = ({ open, handleUserModal }) => {
    const [newGender, setNewGender] = useState('')
    const [clothesName, setClothesName] = useState("")
    const [washingRate, setWashingRate] = useState('')
    const [dryCleaningRate, setDryCleaningRate] = useState('')
    const [pressingRate, setPressingRate] = useState('')
    const genderOptions = [
      { value: '', label: 'Select Gender' },
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Child', label: 'Child' }
    ]
    const handleNewUser = (e) => {
      e.preventDefault()
      const postData = {
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "insert",
        Gender: newGender,
        ClothName: clothesName,
        WashingRate: washingRate,
        DryCleaningRate: dryCleaningRate,
        PressingRate: pressingRate
      }

      if (newGender !== '' && clothesName !== '' && washingRate !== '' && dryCleaningRate !== '' && pressingRate !== '') {
        axios.post("laundry", postData).then(() => {
          setSubmit(false)
          laundaryData()
          handleUserModal()
          toast.success('Laundry Created')
        }).catch(e => {
          console.log('error laundry: ', e)
          toast.error(e.response.data.Message)
        })
      } else {
        setSubmit(true)
      }

    }

    return (
      <>
        <Modal isOpen={open} toggle={handleUserModal} className='modal-dialog-centered modal-lg' backdrop={false}>
          <ModalHeader toggle={handleUserModal}>
            Add new Laundry
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => handleNewUser(e)}>
              <Row className='mb-1'>
                <Col sm='6' className='mb-1'>
                  <Label className='form-label' for='nameVertical'>
                    Select Gender :
                  </Label>
                  <Select
                    theme={selectThemeColors}
                    className='react-select w-100'
                    classNamePrefix='select'
                    defaultValue={genderOptions[0]}
                    options={genderOptions}
                    isClearable={false}
                    onChange={(e) => setNewGender(e?.value)}
                    value={genderOptions.filter((c) => c?.value === newGender)}
                  />
                </Col>
                <Col sm={6} className='mb-1'>
                  <Label className='form-label'>Cloth Name :</Label>
                  <Input
                    type='text'
                    name='Cloth Name'
                    placeholder='Enter Cloth Name'
                    value={clothesName}
                    onChange={e => setClothesName(e.target?.value)}
                    invalid={submit && clothesName === ''}
                  />
                  {submit && clothesName === '' && <FormFeedback>Cloth Name is required</FormFeedback>}
                </Col>
                <Col sm={4} className='mb-1'>
                  <Label className='form-label'>Washing Rate :</Label>
                  <Input
                    type='number'
                    name='WashingRate'
                    placeholder='Enter Washing Rate'
                    value={washingRate}
                    onChange={e => setWashingRate(e.target?.value)}
                    invalid={submit && washingRate === ''}
                  />
                  {submit && washingRate === '' && <FormFeedback>Washing Rate is require</FormFeedback>}
                </Col>
                <Col sm={4} className='mb-1'>
                  <Label className='form-label'>Dry Cleaning Rate :</Label>
                  <Input
                    type='number'
                    name='DryCleaningRate'
                    placeholder='Enter Cleaning Rate'
                    value={dryCleaningRate}
                    onChange={e => setDryCleaningRate(e.target?.value)}
                    invalid={submit && dryCleaningRate === ''}
                  />
                  {submit && dryCleaningRate === '' && <FormFeedback>Dry Cleaning Rate is required</FormFeedback>}
                </Col>
                <Col sm={4} className='mb-1'>
                  <Label className='form-label'>Pressing Rate :</Label>
                  <Input
                    type='number'
                    name='PressingRate'
                    placeholder='Enter Pressing Rate'
                    value={pressingRate}
                    onChange={e => setPressingRate(e.target?.value)}
                    invalid={submit && pressingRate === ''}
                  />
                  {submit && pressingRate === '' && <FormFeedback>Pressing Rate is required</FormFeedback>}
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <Button color='primary' type='submit'>Create Laundry</Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
        {
          open ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }
  // edit laundry
  const UpdateLaundry = ({ open, handleUpdateLaundry, id }) => {

    const updgenderOptions = [
      { value: '', label: 'All' },
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Child', label: 'Child' }
    ]

    const data = userData?.filter(user => user.laundryID === id)
    // const LaundryID = data[0]?.LaundryID
    console.log("file: AddLaundry.js:213  UpdateLaundry  StatusID", id)

    const [updateGender, setUpdateGender] = useState(data[0]?.gender)
    const [updateCloth, setUpdateCloth] = useState(data[0]?.clothName)
    const [updWashRate, setUpdWashRate] = useState(data[0]?.washingRate)
    const [updPressingRate, setUpdPrissingRate] = useState(data[0]?.pressingRate)
    const [updDryClean, setUpdDryClean] = useState(data[0]?.dryCleaningRate)
    const [editSubmit, setEditSubmit] = useState(false)

    const updateLaundryData = async (e) => {
      e.preventDefault()
      const postData = {
        LaundryID: id,
        LoginID: LoginID,
        Token: Token,
        Seckey: "abc",
        Event: "update",
        Gender: updateGender,
        ClothName: updateCloth,
        WashingRate: updWashRate,
        DryCleaningRate: updDryClean,
        PressingRate: updPressingRate,
      }
      console.log("file: AddLaundry.js:236  updateLaundryData  postData", postData)
      setEditSubmit(true)
      try {
        if (updateGender !== '' && updateCloth !== '' && updWashRate !== '' && updDryClean !== '' && updPressingRate !== '') {
          await axios.post("laundry", postData).then(() => {
            setEditSubmit(false)
            laundaryData()
            handleUpdateLaundry()
            toast.success('Laundary updated')
          })
        }
      } catch (error) {
        console.log("file: AddLaundry.js:90  handleNewUser  error", error)
      }
    }


    return (
      <>
        <Modal isOpen={open} toggle={handleUpdateLaundry} className='modal-dialog-centered modal-lg' backdrop={false}>
          <ModalHeader toggle={handleUpdateLaundry}>
            Edit Laundry
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row className='mb-1'>
                <Col sm='6' className='mb-1'>
                  <Label className='form-label' for='nameVertical'>
                    Select Gender :
                  </Label>
                  <Select
                    theme={selectThemeColors}
                    className='react-select w-100'
                    classNamePrefix='select'
                    defaultValue={updgenderOptions.filter(opt => opt.value === updateGender)}
                    options={updgenderOptions}
                    isClearable={false}
                    onChange={(e) => setUpdateGender(e?.value)}
                    invalid={editSubmit && updateGender === ''}
                  />
                  {editSubmit && updateGender === '' && <FormFeedback>Gender is required</FormFeedback>}
                </Col>
                <Col sm={6} className='mb-1'>
                  <Label className='form-label'>Cloth Name :</Label>
                  <Input
                    type='text'
                    name='ClothName'
                    placeholder='Enter Cloth Name'
                    value={updateCloth}
                    onChange={e => setUpdateCloth(e.target?.value)}
                    invalid={editSubmit && updateCloth === ''}
                  />
                  {editSubmit && updateCloth === '' && <FormFeedback>Cloth Name Required</FormFeedback>}
                </Col>
                <Col sm={4} className='mb-1'>
                  <Label className='form-label'>Washing Rate :</Label>
                  <Input
                    type='text'
                    name='WashingRate'
                    placeholder='Enter Washing Rate'
                    value={updWashRate}
                    onChange={e => setUpdWashRate(e.target?.value)}
                    invalid={editSubmit && updWashRate === ''}
                  />
                  {editSubmit && updWashRate === '' && <FormFeedback>update washing rate</FormFeedback>}
                </Col>
                <Col sm={4} className='mb-1'>
                  <Label className='form-label'>Dry Cleaning Rate :</Label>
                  <Input
                    type='text'
                    name='DryCleaningRate'
                    placeholder='Enter Dry Cleaning Rate'
                    value={updDryClean}
                    onChange={e => setUpdDryClean(e.target?.value)}
                    invalid={editSubmit && updDryClean === ''}
                  />
                  {editSubmit && updDryClean === '' && <FormFeedback>update Dry Cleaning rate</FormFeedback>}
                </Col>
                <Col sm={4} className='mb-1'>
                  <Label className='form-label'>Pressing Rate :</Label>
                  <Input
                    type='text'
                    name='PressingRate'
                    placeholder='Enter Pressing Rate'
                    value={updPressingRate}
                    onChange={e => setUpdPrissingRate(e.target?.value)}
                    invalid={editSubmit && updPressingRate === ''}
                  />
                  {editSubmit && updPressingRate === '' && <FormFeedback>update Pressing rate</FormFeedback>}
                </Col>
              </Row>
              <Row>
                <Col className='text-center'>
                  <Button color='primary' onClick={e => updateLaundryData(e)}>Update</Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
        {
          open ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const DeleteUser = ({ open, handleDeleteUser, id }) => {
    const data = userData.filter(user => user.laundryID === id)
    return (
      <>
        <Modal isOpen={open} toggle={handleDeleteUser} className='modal-dialog-centered' backdrop={false}>
          <ModalHeader toggle={handleDeleteUser}></ModalHeader>
          <ModalBody>
            <Row>
              <Col className='text-center'>
                {console.log("laundry", data[0])}
                <h5 >Are you sure you want to Delete Laundry Item </h5>
                <h5 className='pb-1'>{'('}Gender: {data[0]?.gender} and Cloth Name: {data[0]?.clothName}{')'}?</h5>
              </Col>
            </Row>
            <Row>
              <Col className='text-center'>
                <Button className='mx-1' color='danger' onClick={() => deleteLaundary(data[0]?.laundryID)}>Delete</Button>
                <Button className='mx-1' color='secondary' outline onClick={handleDeleteUser}>Cancel</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        {
          open ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }

  const UsersColumns = [
    {
      name: 'ID',
      sortable: true,
      selector: row => row.laundryID
    },
    {
      name: 'Gender',
      sortable: true,
      selector: row => row.gender
    },
    {
      name: 'Cloth Name',
      minWidth: '150px',
      sortable: true,
      selector: row => row.clothName
    },
    {
      name: 'Washing Rate',
      minWidth: '150px',
      sortable: true,
      selector: row => row.washingRate
    },
    {
      name: 'Dry Cleaning Rate',
      minWidth: '170px',
      sortable: true,
      selector: row => row.dryCleaningRate
    },
    {
      name: 'Pressing Rate',
      minWidth: '150px',
      sortable: true,
      selector: row => row.pressingRate
    },
    {
      name: 'Actions',
      sortable: true,
      minWidth: '150px',
      center: true,
      selector: row => {
        return (
          <>
            <Col>
              <Trash2 className='mx-1' size={20} onClick={() => {
                setSel_id(row.laundryID)
                handleDeleteUser()
              }} />
              <Edit className='mx-1' size={20} onClick={() => {
                setSel_id(row.laundryID)
                handleUpdateLaundry()
              }}
              />
            </Col>

          </>
        )
      }
    }
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Laundry</CardTitle>
          <Button color='primary' onClick={handleUserModal}>Add Laundry Master</Button>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              {dataLoading ? <div style={{ textAlign: 'center', marginTop: "3rem" }}> <h2 style={{ text: 'center' }}>Loading...</h2></div> : (
                <DataTable
                  noHeader
                  pagination
                  data={userData}
                  columns={UsersColumns}
                  className='react-dataTable'
                  sortIcon={<ChevronDown size={10} />}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                />
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
      {laundryModal ? <NewLaundryModal open={laundryModal} handleUserModal={handleUserModal} /> : <></>}
      {updateLaundry ? <UpdateLaundry open={updateLaundry} handleUpdateLaundry={handleUpdateLaundry} id={sel_id} /> : <></>}
      {delUser ? <DeleteUser open={delUser} handleDeleteUser={handleDeleteUser} id={sel_id} /> : <></>}

    </>
  )
}

export default AddLaundry