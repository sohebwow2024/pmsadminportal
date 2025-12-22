import React, { useState, useEffect } from 'react'
import { ChevronDown, Coffee, Edit, Eye, List, Settings, Printer, Sliders, Trash, FileText } from 'react-feather'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar'
import NewPOSModal from './NewPOSModal'
import { useNavigate } from 'react-router-dom'
import UpdatePosModal from './UpdatePosModal'
import axios from '../../API/axios'
import { Image_base_uri } from '../../API/axios'
import { useSelector } from 'react-redux'
import DeletePOS from './DeletePOS'

const POS2 = () => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-POS"

    return () => {
      document.title = prevTitle
    }
  }, [])
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, CompanyID, PropertyID } = getUserData

  const [existPosData, setExistPosData] = useState([])
  const [posID, setPosID] = useState('')
  console.log("existPosData",existPosData);
  const [refresh, setRefresh] = useState(false)
  const handleRefresh = () => setRefresh(!refresh)

  const getPosData = async () => {
    try {
      const res = await axios.get('/pos/all', {
        params: {
          LoginID,
          Token,
          PropertyID,
          CompanyID,
          Status: ''
        }
      })
      // console.log('res', res.data[0])
      setExistPosData(res?.data[0])
    } catch (error) {
      console.log('error', error)
    }
  }

  const [selPOS, setSelPOS] = useState('')
  const [selPOSName, setSelPOSName] = useState('')

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(!open)

  const navigate = useNavigate()

  const [updateOpen, setUpdateOpen] = useState(false)
  const handleUpdateOpen = (row) => {
    console.log('handleUpdateOpen', row);
    setUpdateOpen(!updateOpen)
    setPosID(row?.id)
  }

  const [delOpen, setDelOpen] = useState(false)
  const handleDelOpen = () => setDelOpen(!delOpen)

  useEffect(() => {
    getPosData()
  }, [refresh, updateOpen, delOpen])

  const [query, setQuery] = useState("")
  const search = (data) => {
    return data.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  const posColumns = [
    {
      name: '',
      // minWidth: 'fit-content',
      selector: row => {
        return (
          <>
            {
              row.logoFile.length > 0 ? (
                <Avatar className='my-1' size="lg" img={`${Image_base_uri}${row?.fileURL}`} alt='logo' />
              ) : (
                <Avatar img={`${Image_base_uri}/uploads/dummy.jpg`} alt='logo' />
              )
            }
          </>
        )
      }
    },
    {
      name: 'POS Name',
      sortable: true,
      // minWidth: 'fit-content',
      minWidth: '13rem',
      selector: row => row.name
    },
    {
      name: 'Products',
      sortable: true,
      minWidth: '8.5rem',
      // minWidth: 'fit-content',
      selector: row => {
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/posProducts/${row.name}/${row.poSID}`)}>
            <Badge color='primary'>
              <Sliders size={12} className='me-25' />
              <span>Products</span>
            </Badge>
            {/* {console.log(row.id)} */}
          </div>
        )
      }
    },
    {
      name: 'Orders',
      sortable: true,
      minWidth: '7.5rem',
      selector: row => {
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/posOrders/${row.name}/${row.poSID}`)}>
            <Badge color='primary'>
              <List size={12} className='me-25' />
              <span>Orders</span>
            </Badge>
            {/* {console.log(row.id)} */}
          </div>
        )
      }
    },
    {
      name: 'Tables',
      sortable: true,
      minWidth: '7rem',
      selector: row => {
        return (
          <>
            {
              row.hasTables ? (
                <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/tableManage/${row.name}/${row.poSID}`)}>
                  <Badge color='primary'>
                    <Coffee size={12} className='me-25' />
                    <span>Tables</span>
                  </Badge>
                </div>
              ) : (
                <Col>
                  No Tables
                </Col>
              )
            }
          </>
        )
      }
    },
    {
      name: 'Invoice',
      sortable: true,
      minWidth: '8rem',
      selector: row => {
        // console.log(row);
        return (
          <>
            {
              row.poSID ? (
                <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/posInvoiceListing/${row.name}/${row.poSID}`)}>
                  <Badge color='primary'>
                    <FileText size={12} className='me-25' />
                    <span>Invoice</span>
                  </Badge>
                </div>
              ) : (
                <Col>
                  No Invoice
                </Col>
              )
            }
          </>
        )
      }
    },
    {
      name: 'Status',
      sortable: true,
      minWidth: '7rem',
      selector: row => {
        return (
          <>
            {
              row.status === "Active" ? (
                <Badge color='light-success'>
                  ACTIVE
                </Badge>
              ) : (
                <Badge color='light-danger'>
                  INACTIVE
                </Badge>
              )
            }
          </>
        )
      }
    },
    {
      name: 'Actions',
      center: true,
      selector: row => {
        return (
          <>
            <Col>
              <Edit className='me-1 cursor-pointer' size={15} onClick={() => {
                handleUpdateOpen(row)
                setSelPOS(row.poSID)
              }} />
              <Trash className='ms-1 cursor-pointer' size={15} onClick={() => {
                setSelPOS(row.poSID)
                setSelPOSName(row.name)
                handleDelOpen()
              }} />
            </Col>
          </>
        )
      }
    }

  ]

  return (
    <>
      <Card>
        <CardHeader className='d-flex flex-row flex-wrap justify-content-between align-items-center'>
          <CardTitle>POS</CardTitle>
          <input type="text" placeholder="search" className="form-control input-default w-50" onChange={e => setQuery(e.target.value)} />
          <Button color='primary' onClick={handleOpen}>Add New POS</Button>
        </CardHeader>
        <CardBody>
          <Row>
            <Col>
              <DataTable
                noHeader
                pagination
                data={search(existPosData)}
                columns={posColumns}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                paginationRowsPerPageOptions={[10, 25, 50]}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      {open && <NewPOSModal open={open} handleOpen={handleOpen} handleRefresh={handleRefresh} />}
      {updateOpen && <UpdatePosModal updateOpen={updateOpen} handleUpdateOpen={handleUpdateOpen} posID={selPOS} handleRefresh={handleRefresh} />}
      {delOpen && <DeletePOS open={delOpen} handleOpen={handleDelOpen} handleRefresh={handleRefresh} id={selPOS} name={selPOSName} />}
    </>
  )
}

export default POS2