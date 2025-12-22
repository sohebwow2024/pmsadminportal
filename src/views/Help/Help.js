
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import axios from '../../API/axios'
import NewFaqModal from './NewFaqModal'

const Help = () => {

  // const questions = [
  //   {
  //     id: '1',
  //     question: 'WHAT IS ADD ON SERVICES?',
  //     answer: 'Fees or charges that are added to the basic price of a good or service for additional features or benefits as those added to the price You need to click Add On Services in rate management section .'
  //   },
  //   {
  //     id: '2',
  //     question: 'HOW TO SERVICES?',
  //     answer: 'Fees or charges that are added to the basic price of a good or service for additional features or benefits as those added to the price You need to click Add On Services in rate management section .'
  //   },
  //   {
  //     id: '3',
  //     question: 'WHEN TO SERVICES?',
  //     answer: 'Fees or charges that are added to the basic price of a good or service for additional features or benefits as those added to the price You need to click Add On Services in rate management section .'
  //   }
  // ]

  const [questions, setQuestions] = useState('')
  const [filterString, setFilterString] = useState('')
  const [show, setShow] = useState(false)
  const handleModal = () => setShow(!show)
  const [catModal, setCatModal] = useState(false)
  const handleCatModal = () => setCatModal(!catModal)
  const [open, setOpen] = useState('')

  const toggle = id => {
    open === id ? setOpen() : setOpen(id)
  }

  const getUserData = useSelector(state => state.userManageSlice.userData)
  const { LoginID, Token } = getUserData


  const [category, setCategory] = useState([])
  const [categoryId, setCategoryId] = useState('')
  console.log('categoryId', category);
  const getFAQCat = async () => {
    try {
      const res = await axios.get('/faq/getallCat', {
        headers: {
          LoginID,
          Token
        }
      })
      console.log('resfaq', res)
      let data = res?.data[0]
      if (data.length > 0) {
        const options = data.map(c => {
          return { value: c.id, label: c.faqCatName }
        })
        setCategory(options)
      }
    } catch (error) {
      console.log('error', error)
    }
  }




  useEffect(() => {
    getFAQCat()
  }, [show])

  const getFAQ = async () => {
    try {
      const res = await axios.get('/faq/getall', {
        headers: {
          LoginID,
          Token
        }
      })
      console.log('resfaq', res)
      setQuestions(res?.data[0])
    } catch (error) {
      console.log('error', error)
    }
  }



  // const NewFAQModal = () => {

  //   const [title, setTitle] = useState('')
  //   const [description, setDescription] = useState('')
  //   const [display, setDisplay] = useState(false)




  //   const handleSubmit = async () => {
  //     // getFAQCat()
  //     setDisplay(true)
  //     // setShow(true)
  //     if (title && description && categoryId !== '') {
  //       const res = await axios.post('/faq/save', {}, {
  //         headers: {
  //           LoginID,
  //           Token
  //         },
  //         params: {
  //           FAQCatId: categoryId,
  //           FAQTitle: title,
  //           Description: description
  //         }
  //       })
  //         .then(response => {
  //           console.log('res', response)
  //           getFAQ()
  //           setShow(!show)
  //           toast.success('FAQ Added Successfully!', { position: "top-center" })
  //         }).catch(function (error) {
  //           console.log("User Login Error=====", error?.response?.data?.Message)
  //           toast.error(error?.response?.data?.Message)
  //         })
  //     } else {
  //       toast.error('Please fill all the fields')
  //     }
  //   }



  //   return (
  //     <>
  //       <Modal
  //         isOpen={show}
  //         toggle={handleModal}
  //         className='modal-dialog-centered modal-lg'
  //         backdrop={false}
  //       >
  //         <ModalHeader className='bg-transparent' toggle={handleModal}>
  //           <span className=' mb-1'>Add FAQ</span>
  //         </ModalHeader>
  //         <ModalBody className='px-sm-2 mx-50 pb-5'>
  //           <>
  //             <Form>

  //               <Row>
  //                 <Col lg='6' className='mb-1'>
  //                   <Label className='form-label' for='userName'>
  //                     <span className='text-danger'>*</span>Title
  //                   </Label>
  //                   <Select
  //                     theme={selectThemeColors}
  //                     className='react-select'
  //                     classNamePrefix='select'
  //                     placeholder="Select Category"
  //                     options={category}
  //                     onChange={e => {
  //                       setCategoryId(e.value)
  //                     }}
  //                   // invalid={display && country === ''}
  //                   />
  //                   {display === true && !categoryId ? <span className='error_msg_lbl'>Enter Category </span> : <></>}
  //                 </Col>
  //                 <Col lg='6' className='mb-1'>
  //                   <Label className='form-label' for='userName'>
  //                     <span className='text-danger'>*</span>Title
  //                   </Label>
  //                   <Input type='text' name='userName' id='userName' value={title} onChange={e => setTitle(e.target.value)} invalid={display ? title === '' : false} />
  //                   {display === true && !title ? <span className='error_msg_lbl'>Enter Title </span> : <></>}
  //                 </Col>
  //                 <Col lg='12' className='mb-1'>
  //                   <Label className='form-label' for='password'>
  //                     <span className='text-danger'>*</span>Description
  //                   </Label>
  //                   <Input type='text' name='password' id='password' value={description} onChange={e => setDescription(e.target.value)} invalid={display ? description === '' : false} />
  //                   {display === true && !description ? <span className='error_msg_lbl'>Enter Description </span> : <></>}
  //                 </Col>
  //               </Row>
  //             </Form>
  //             <Row tag='form' className='gy-1 gx-2 mt-75' >
  //               <Col className='text-lg-end text-md-center mt-1' xs={12}>
  //                 <Button className='me-1' color='primary' onClick={handleSubmit}>
  //                   Submit
  //                 </Button>
  //                 <Button
  //                   color='secondary'
  //                   outline
  //                   onClick={() => {
  //                     setShow(!show)
  //                   }}
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Col>
  //             </Row>
  //           </>
  //         </ModalBody>
  //       </Modal>
  //       {
  //         show ? (
  //           <div className="modal-backdrop fade show" ></div>
  //         ) : null
  //       }
  //     </>
  //   )
  // }

  const NewFAQCatModal = () => {

    const [category, setCategory] = useState('')
    const [display, setDisplay] = useState(false)





    const handleCatSubmit = async () => {
      setDisplay(true)
      console.log('clicking');
      if (category !== '') {
        const res = await axios.post('/faq/saveFCat', {}, {
          headers: {
            LoginID,
            Token
          },
          params: {
            FAQCatName: category
          }
        })
          .then(response => {
            console.log('resCat', response)
            getFAQ()
            setCatModal(!catModal)
            if (response?.data[0][0]?.error) {
              toast.error(response?.data[0][0]?.error, { position: "top-center" })
            } else {
              toast.success(response?.data[0][0]?.status, { position: "top-center" })
            }
          }).catch(function (error) {
            console.log("User Login Error=====", error)
            toast.error(error?.response?.data?.message)
          })
      }
    }

    return (
      <>
        <Modal
          isOpen={catModal}
          toggle={handleCatModal}
          className='modal-dialog-centered modal-lg'
          backdrop={false}
        >
          <ModalHeader className='bg-transparent' toggle={handleCatModal}>
            <span className=' mb-1'>Add FAQ Category</span>
          </ModalHeader>
          <ModalBody className='px-sm-2 mx-50 pb-5'>
            <>
              <Form>

                <Row>
                  <Col lg='12' className='mb-1'>
                    <Label className='form-label' for='userName'>
                      <span className='text-danger'>*</span>Category
                    </Label>
                    <Input type='text' name='userName' id='userName' value={category} onChange={e => setCategory(e.target.value)} invalid={display ? category === '' : false} />
                    {display === true && !category ? <span className='error_msg_lbl'>Enter Category </span> : <></>}
                  </Col>
                </Row>
              </Form>
              <Row tag='form' className='gy-1 gx-2 mt-75' >
                <Col className='text-lg-end text-md-center mt-1' xs={12}>
                  <Button className='me-1' color='primary' onClick={handleCatSubmit}>
                    Submit
                  </Button>
                  <Button
                    color='secondary'
                    outline
                    onClick={() => {
                      setCatModal(!catModal)
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </>
          </ModalBody>
        </Modal>
        {
          catModal ? (
            <div className="modal-backdrop fade show" ></div>
          ) : null
        }
      </>
    )
  }




  const data = { category, questions }
  console.log('datacategories', data);
  useEffect(() => {
    getFAQ()
    data
  }, [])


  const mapFAQsToCategories = (categories, faqs) => {
    const faqMap = {};

    // Initialize the map with empty arrays for each category
    categories.forEach(category => {
      faqMap[category.label] = [];
    });

    // Map FAQs to their respective categories
    faqs && faqs.forEach(questions => {
      const categoryLabel = questions.faqCatName;
      if (faqMap[categoryLabel]) {
        faqMap[categoryLabel].push(questions);
      }
    });

    return faqMap;
  };

  const faqMap = mapFAQsToCategories(data.category, data.questions);
  console.log('faqMap', faqMap);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>FAQ's</CardTitle>
          <Button color='primary' className='ms-auto me-3' onClick={() => setCatModal(true)}>Add Category</Button>
          <Button color='primary' onClick={() => setShow(true)}>Add FAQ</Button>
        </CardHeader>
        <CardBody>
          <Row className='mb-1'>
            <Col>
              <Label className='fw-bold fs-5'>Search Questions</Label>
              <Input
                type='text'
                name='Question'
                placeholder='Enter your question here..'
                value={filterString}
                onChange={e => setFilterString(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>

              {/* {console.log(questions)}, */}
              {/* {
                data.category && data.category.filter(qt => qt.Title.includes(filterString)).map((q, index) => {
                  
                  { console.log(q) }
                  return (
                    <>
                      <h2>{q.FAQCatName}</h2>
                      <Accordion key={index} className='accordion-margin' open={open} toggle={toggle} >
                        <AccordionItem>
                          <AccordionHeader targetId={index}>
                            {q.Title}
                          </AccordionHeader>
                          <AccordionBody accordionId={index}>
                            {q.Description}
                          </AccordionBody>
                        </AccordionItem>
                      </Accordion>
                    </>
                  )
                })
              } */}

              {/* {data.category.map(category => (
                <div key={category.value}>
                  <h4>{category.label}</h4>
                  {faqMap[category.label].filter(qt => qt.Title.includes(filterString) || qt.FAQCatName.includes(filterString)).map((faq, index) => (
                    <Accordion key={index} className='accordion-margin' open={open} toggle={toggle} >
                      {console.log(`${category.label}_${index}`)}
                      <AccordionItem>
                        <AccordionHeader targetId={`${category.label}_${index}`}>
                          {faq.Title}
                        </AccordionHeader>
                        <AccordionBody accordionId={`${category.label}_${index}`}>
                          {faq.Description}
                        </AccordionBody>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              ))} */}

              {data.category.map(category => {
                const matchingFaqs = faqMap[category.label].filter(
                  qt => qt.title.toLowerCase().includes(filterString.toLowerCase()) || qt.faqCatName.toLowerCase().includes(filterString.toLowerCase())
                );
console.log('matchingFaqs', category);
                // Check if there are matching FAQs in the current category
                if (matchingFaqs.length > 0) {
                  return (
                    <div key={category.value}>
                      <h2>{category.label}</h2>

                      <Accordion className='accordion-margin' open={open} toggle={toggle}>
                        {matchingFaqs.map((faq, index) => (
                          <AccordionItem key={index}>
                            <AccordionHeader targetId={`${category.label}_${index}`}>
                              {faq.title}
                            </AccordionHeader>
                            <AccordionBody accordionId={`${category.label}_${index}`}>
                              <div dangerouslySetInnerHTML={{ __html: faq.description }} />
                            </AccordionBody>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  );
                }

                // Return null if there are no matching FAQs, which will effectively hide the category
                return null;
              })}



            </Col>
          </Row>
        </CardBody>
      </Card>
      <NewFaqModal show={show} setShow={setShow} handleModal={handleModal} getFAQ={getFAQ} category={category} />
      <NewFAQCatModal show={show} setShow={setShow} handleModal={handleModal} getFAQ={getFAQ} category={category}/>
    </>
  )
}

export default Help