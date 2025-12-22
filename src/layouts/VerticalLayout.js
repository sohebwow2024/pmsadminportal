// ** React Imports
import { Outlet } from "react-router-dom"

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout"

// ** Menu Items Array
import navigation from "@src/navigation/vertical"

//** redux */
import { useSelector } from "react-redux"

const VerticalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])
  const userDataStore = useSelector(state => state.userManageSlice.userData)
  // console.log('userStore::::::: ', userDataStore)

  let roleType = userDataStore?.UserRoleType
  let menuData = []
  let menuData1 = []
  console.log('menudata', navigation);
  if (roleType == 'Travel Agent') {
    // console.log('role', roleType)
    menuData = navigation.filter(a => a.id != 'housekeeping' && a.id != "nightAudit" && a.id != 'laundry' && a.id != 'WakeUpCall' && a.id != 'pos' && a.id != 'promotions' && a.id != 'Audit' && a.id != 'GuestMaster' && a.id != 'masterSetting' && a.id != 'propertyMaster' && a.id != 'roomInventory' && a.id != 'help')
    function filterObjectArray(arr, filter) {
      return arr.filter(filter).map(obj => obj.children ? {
        ...obj,
        children: filterObjectArray(obj.children, filter)
      } : obj);
    };

    let data = menuData
    menuData = filterObjectArray(data, obj => obj?.id !== "onlinebooking" && obj?.id !== "stayOver" && obj?.id !== "paymentFolio" && obj?.id !== "guestList" && obj?.id !== "creditReport" && obj?.id !== "revenueReport" && obj?.id !== "otaReport")
    console.log('filterObjectArray', filterObjectArray(data, obj => obj?.id !== "onlinebooking"));
  } else {
    menuData = navigation
  }

  // menuData = menuData[1].children.filter(a => a.id != "onlinebooking")
  console.log("navigation", menuData)




  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  return (
    <Layout menuData={menuData} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
