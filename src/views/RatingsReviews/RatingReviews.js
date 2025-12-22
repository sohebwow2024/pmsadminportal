import Rating from 'react-rating'
import { Star } from 'react-feather'
import { React, useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Progress, Label } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { AiFillStar } from "react-icons/ai"

let data
axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
  data = response.data
  console.log('Ratingdata', data)
})
const textWidth = {
  width: 'fit-content'
}
const RatingReviews = ({ dir }) => {
  const [value, setValue] = useState(0)

  const onHover = rate => {
    if (rate !== undefined) {
      setValue(rate)
    }
  }

  const ratingReviews = [
    { value: 'All Stars', label: 'All Stars' },
    { value: 'def', label: 'def' },
    { value: 'ghi', label: 'ghi' },
    { value: 'jkl', label: 'jkl' },
    { value: 'mno', label: 'mno' }
  ]

  const ratingReviewsTable = [
    {
      name: 'Name',
      selector: row => row.name
    },
    {
      name: 'Date',
      cell: row => (
        <p name={row.id}>20-08-2022</p>
      )
    },
    {
      name: 'Rating',
      cell: row => (
        <>
          <Rating name={row.id}
            direction={dir}
            id='ratings-hover'
            initialRating={value}
            onHover={rate => onHover(rate)}
            onChange={rate => setValue(rate)}
            emptySymbol={<Star size={15} fill='#babfc7' stroke='#babfc7' />}
            fullSymbol={<Star size={15} fill={'#ffe234'} stroke={'#ffe234'} />}
          />
        </>
      )
    },
    {
      name: 'Comment',
      cell: row => (
        <>
          <p name={row.age} >Nice Service</p>
        </>
      )
    }
  ]
  useEffect(() => {
    const prevTitle = document.title
    document.title = "PMS-Rating & Reviews"

    return () => {
      document.title = prevTitle
    }
  }, [])
  return (
    <Card>
      <CardHeader>
        <Row md='12 w-100 border-bottom'>
          <Col>
            <CardTitle>Ratings & Reviews</CardTitle>
            <Rating
              direction={dir}
              id='ratings-hover'
              initialRating={value}
              onHover={rate => onHover(rate)}
              onChange={rate => setValue(rate)}
              emptySymbol={<Star size={32} fill='#babfc7' stroke='#babfc7' />}
              fullSymbol={<Star size={32} fill={'#ffe234'} stroke={'#ffe234'} />}
            />
            <div className='counter-wrapper mb-1 mt-1'>
              <span>Ratings: {value}</span>
            </div>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            <div className='demo-vertical-spacing w-50 m-auto'>
              <Row>
                <Col md='2' style={textWidth}>
                  <Label>9.0 <AiFillStar /></Label>
                </Col>
                <Col md='8'>
                  <Progress value={90} />
                </Col>
                <Col md='2' style={textWidth}>
                  <Label>9</Label>
                </Col>
              </Row>
              <Row>
                <Col md='2' style={textWidth}>
                  <Label>4.0 <AiFillStar /></Label>
                </Col>
                <Col md='8'>
                  <Progress className='progress-bar-secondary' value={40} />
                </Col>
                <Col md='2' style={textWidth}>
                  <Label>4</Label>
                </Col>
              </Row>
              <Row>
                <Col md='2' style={textWidth}>
                  <Label>6.5 <AiFillStar /></Label>
                </Col>
                <Col md='8'>
                  <Progress className='progress-bar-success' value={65} />
                </Col>
                <Col md='2' style={textWidth}>
                  <Label>0</Label>
                </Col>
              </Row>
              <Row>
                <Col md='2' style={textWidth}>
                  <Label>2.5 <AiFillStar /></Label>
                </Col>
                <Col md='8'>
                  <Progress className='progress-bar-danger' value={25} />
                </Col>
                <Col md='2' style={textWidth}>
                  <Label>2</Label>
                </Col>
              </Row>
              <Row>
                <Col md='2' style={textWidth}>
                  <Label>8.0 <AiFillStar /></Label>
                </Col>
                <Col md='8'>
                  <Progress className='progress-bar-warning' value={80} />
                </Col>
                <Col md='2' style={textWidth}>
                  <Label>8</Label>
                </Col>
              </Row>
              <Row>
                <Col md='2' style={textWidth}>
                  <Label>5.0 <AiFillStar /></Label>
                </Col>
                <Col md='8'>
                  <Progress className='progress-bar-info' value={50} />
                </Col>
                <Col md='2' style={textWidth}>
                  <Label>5</Label>
                </Col>
              </Row>
              <Row>
                <Col md='2' style={textWidth}>
                  <Label>2.0 <AiFillStar /></Label>
                </Col>
                <Col md='8'>
                  <Progress className='progress-bar-dark' value={20} />
                </Col>
                <Col md='2' style={textWidth}>
                  <Label>2</Label>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md='12 text-end my-2 d-flex justify-content-end'>
            <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue={ratingReviews[0]}
              options={ratingReviews}
              isClearable={false}
            />
          </Col>
        </Row>
        <DataTable
          noHeader
          data={data}
          columns={ratingReviewsTable}
          className='react-dataTable'
        />
      </CardBody>
    </Card>
  )
}

export default RatingReviews