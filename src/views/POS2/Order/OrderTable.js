import InputNumber from 'rc-input-number'
//import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Check, ChevronDown, Edit, Minus, Plus, Printer, Trash2 } from 'react-feather'
import { Button, Col, Input, Row } from 'reactstrap'

// ** Styles
import '@styles/react/libs/input-number/input-number.scss'
//import { containerCSS } from 'react-select/dist/declarations/src/components/containers'

const OrderTable = ({ orderData, orderItems, setOrderItems, getItemTotal, setKotFlag }) => { // () => {
    console.log('orderItems', orderItems)

    // const updatePrice = (e, id) => {
    //     if (orderData[0]?.PoSOrderID) {
    //         const orderElement = orderItems.filter(obj => obj.POSProductID === id)[0]
    //         console.log('orderElement', orderElement)
    //         orderElement.Quantity = e
    //         orderElement.EntryType = "U"
    //         setOrderItems(orderItems)
    //         getItemTotal(orderItems)
    //         setKotFlag(true)
    //     } else {
    //         const orderElement = orderItems.filter(obj => obj.POSProductID === id)[0]
    //         console.log('orderElement', orderElement)
    //         orderElement.Quantity = e
    //         orderElement.EntryType = "I"
    //         setOrderItems(orderItems)
    //         getItemTotal(orderItems)
    //         setKotFlag(true)
    //     }

    // }
    const updatePrice = (e, id) => {
        const updatedOrderItems = orderItems.map(orderItem => {
            console.log('orderItem', orderItem);
            if (orderItem.poSOrderID === id && orderItem.isKOTPrint !== true) {
                orderItem.quantity = e;
                orderItem.EntryType = orderItem.poSOrderItemID ? "U" : "I";
            }
            return orderItem;
        });

        setOrderItems(updatedOrderItems);
        getItemTotal(updatedOrderItems);
        setKotFlag(true);
    }

    const removeOrderItem = (itemId) => {
        const orderElement = orderItems.filter(obj => obj.posProductID === itemId)[0]
        orderElement.EntryType = "D"
        setOrderItems(orderItems)
        getItemTotal(orderItems)
        setKotFlag(true)
    }

    const columns = [
        {
            name: 'Item Name',
            selector: row => {
                { console.log('row', row); }
                return (
                    <>
                        <p style={{ marginBottom: 0 }}>{row.posProductName}</p>
                        <p style={{ marginTop: 0, color: 'green', fontSize: '8px' }}>{row.isKOTPrint === true ? 'KOT Printed' : ''}</p>
                    </>
                )
            }
        },
        {
            name: 'Quantity',
            center: true,
            width: 'max-content',
            selector: row => {
                return (
                    // console.log('rowhjsdhjhdd', row.POSProductID, row.Quantity),
                    <>
                        <InputNumber
                            key={`quant_${row.posProductID}`}
                            min={1}
                            upHandler={<Plus />}
                            downHandler={<Minus />}
                            value={row.quantity}
                            disabled={row.isKOTPrint === true}
                            //placeholder={+row.quantity}
                            onChange={(e) => updatePrice(e, row.posProductID)}
                        />
                    </>
                )
            }
        },
        {
            name: 'Action',
            right: true,
            selector: (row, i) => {
                return (
                    <>
                        <Button key={`del_pos_action_${row.id}`} color='outline-danger' size='sm' onClick={() => removeOrderItem(row.posProductID)} 
                        disabled={row.isKOTPrint === true}
                        ><Trash2 size={15} /></Button>

                        {/* <Printer className='ms-1 cursor-pointer' size={15} /> */}
                    </>
                )
            }
        },
        {
            name: 'Price',
            right: true,
            selector: row => { return (`₹${+row.price * +row.quantity}`) }
        }

    ]

    return (
        <Row>
            <Col id='pos_table' className='react-dataTable'>
                <DataTable
                    noHeader
                    data={orderItems.filter(o => o.EntryType !== "D")}
                    columns={columns}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10} />}
                />
            </Col>
        </Row>
    )
}

export default OrderTable