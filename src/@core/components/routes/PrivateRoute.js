// ** React Imports
import { Navigate } from "react-router-dom"
import {
  // useContext, 
  Suspense
} from "react"

// ** Context Imports
// import { AbilityContext } from "@src/utility/context/Can"

// ** Spinner (Splash Screen)
import Spinner from "@components/spinner/Fallback-spinner"
import { useSelector } from "react-redux"
import { getUserData } from "@utils"

const PrivateRoute = ({ children, route }) => {
  const userDataStore = useSelector(state => state.userManageSlice.userData)
  console.log('userStore: ', userDataStore)
  // ** Hooks & Vars
  // const ability = useContext(AbilityContext)
  // const user = JSON.parse(localStorage.getItem("userData"))
  //const user = getUserData()
  const user = userDataStore?.UserID

  if (route) {
    // let action = null
    // let resource = null
    const restrictedRoute = false
    const userRoleType = userDataStore?.userRoleType
    const userRole = userDataStore?.userRole

    // if (route.meta) {
    //   action = route.meta.action
    //   resource = route.meta.resource
    //   restrictedRoute = route.meta.restricted
    // }
    console.log('PrivateRoute');
    if (!user) {
      return <Navigate to="/login" />
    }
    if (user && restrictedRoute) {
      return <Navigate to="/" />
    }
    if (restrictedRoute) {
      return <Navigate to="/" />
    }

    if (user && restrictedRoute && userRoleType === 'Travel Agent') {
      return <Navigate to="/new_reservation" />
    }

    // if (user && restrictedRoute && user.role === "client") {
    //   return <Navigate to="/access-control" />
    // }
    // if (user && !ability.can(action || "read", resource)) {
    //   return <Navigate to="/misc/not-authorized" replace />
    // }
  }

  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}

export default PrivateRoute
