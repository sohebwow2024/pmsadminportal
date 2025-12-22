import { React, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardBody } from 'reactstrap'
import Category from './Category'
import ProductCategory from './ProductCategory'
const ProductMaster = () => {
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const [refresh, setRefresh] = useState(false)
  const handleRefresh = () => setRefresh(!refresh)

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle>Product Master</CardTitle>
          <Nav tabs>
            <NavItem>
              <NavLink
                active={active === '1'}
                onClick={() => {
                  toggle('1')
                }}
              >
                Category
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '2'}
                onClick={() => {
                  toggle('2')
                }}
              >
                Product Master
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className='py-50' activeTab={active}>
            <TabPane tabId='1'>
              <Category handleRefresh={handleRefresh} />
            </TabPane>
            <TabPane tabId='2'>
              <ProductCategory refresh={refresh} />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </>
  )
}

export default ProductMaster