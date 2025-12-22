import { React, useEffect, useState } from 'react'
import { Button, Card, CardTitle, CardBody, CardText, Row, Col, CardHeader, Label, Badge } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import DataTable from 'react-data-table-component'
import axios from '../../API/axios'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import moment from 'moment'
import StockOut from './StockOut'
import { ChevronDown } from 'react-feather'

let venderOptions = []


function StockCount() {

  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Stock Count"

    return () => {
      document.title = prevTitle
    }
  }, [])


  const [poutOpen, setPoutOpen] = useState(false)
  const handlePoutOpen = () => setPoutOpen(!poutOpen)

  const [data, setData] = useState([])
  const [selectedCategoryID, setSelectedCategoryID] = useState('')
  const [productId, setProductId] = useState('')
  const [productName, setProductName] = useState('')
  const [prd, setPrd] = useState('')
  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token, PropertyID } = getUserData

  const getAllStockList = () => {
    axios.get(`/inventory/stock/calc?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`).then(res => {
      if (res !== null) {
        console.log('data', res)
        setData(res.data[0])
      }
    })
  }
  useEffect(() => {
    axios.get(`/inventory/product_all?PropertyID=${PropertyID}&LoginID=${LoginID}&Token=${Token}`).then(res => {
      console.log('productres', res);
      if (res !== null) {
        res.data[0].map(i => venderOptions.push({
          value: i.productID, label: i.productName
        }))
        getAllStockList()
      }
    }).catch(e => {
      toast.error(e.response.data.message, { position: 'top-right' })
    })
    getAllStockList()
  }, [poutOpen])

  const stockCountTable = [
    {
      name: 'Product ID',
      selector: row => row.productID,
      minWidth: '220px',
      style: {
        color: 'black'
      }
    },
    {
      name: 'PO Number',
      selector: row => row.poNumber,
      minWidth: '220px',
      style: {
        color: 'black'
      }
    },
    {
      name: 'Product Name',
      selector: row => row.productName,
      minWidth: '180px',
      style: {
        color: 'black'
      }
    },
    // {
    //   name: "Open Quantity",
    //   selector: row => row.OpenQuantity,
    //   minWidth: '150px',
    // },
    {
      name: "Total Quantity",
      selector: row => row.inQuantity,
      minWidth: '150px',
    },
    {
      name: "Remaining Quantity",
      selector: row => row.closeQuantity,
      minWidth: '200px',
    },
    {
      name: "Out Quantity",
      selector: row => row.outQuantity,
      minWidth: '150px',
    },
    {
      name: "Status",
      sortable: true,
      selector: row => row.masterStatus,
      cell: row => {
        return (
          <>
            {
              row.masterStatus === 'Active' ? (
                <Badge color='light-success'> {row.masterStatus}</Badge>
              ) : (
                <Badge color='light-danger'> {row.masterStatus}</Badge>
              )
            }
          </>
        )
      }
    },
    {
      name: 'Action',
      minWidth: '180px',
      sortable: true,
      selector: row => {
        return (
          // row.masterStatus === 'Active' && row.closeQuantity !== 0 && (
            <Button.Ripple color='primary'
              onClick={() => {
                handlePoutOpen()
                setProductId(row.productID)
                setProductName(row.productName)
                setPrd(row)
              }}
            >
              Product Out
            </Button.Ripple>
          // )
        )
      }
    },
  ]
  return (
    <>
      <Row>
        <Col md='12' className='mb-1'>
          <Card>
            <CardHeader>
              <CardTitle className='mb-1'>Product Stock Count</CardTitle>
            </CardHeader>
            <CardBody>
              <Row className='d-flex flex-row flex-wrap justify-content-between align-items-center'>
                <Col className='mb-1'>
                  <Label>Filter by Product Name</Label>
                  <Select
                    theme={selectThemeColors}
                    className='react-select w-50'
                    classNamePrefix='select'
                    defaultValue={venderOptions[0]}
                    onChange={e => e === null ? setSelectedCategoryID('') : setSelectedCategoryID(e.value)}
                    options={venderOptions}
                    isClearable={true}
                  />
                </Col>
              </Row>
              <CardText>
                <DataTable
                  noHeader
                  data={selectedCategoryID === '' ? data : data.filter(i => i.productID === selectedCategoryID)}
                  columns={stockCountTable}
                  className='react-dataTable'
                  sortIcon={<ChevronDown size={10} />}
                  pagination
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                />
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {poutOpen && <StockOut open={poutOpen} handleOpen={handlePoutOpen} id={productId} name={productName} prd={prd} />}
    </>


  )
}

export default StockCount