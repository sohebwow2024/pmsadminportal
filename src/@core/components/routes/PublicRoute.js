// ** React Imports
import { Suspense } from "react"
import { Navigate } from "react-router-dom"

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils"

// ** Spinner (Splash Screen)
// import Spinner from "./@core/components/spinner/Fallback-spinner"
import Loading from "../spinner/Fallback-spinner"

const PublicRoute = ({ children, route }) => {
  if (route) {
    const user = getUserData()

    const restrictedRoute = route.meta && route.meta.restricted

    console.log(user, restrictedRoute, "checking")
    // return;

    // if (user && restrictedRoute) {
    //   return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />
    // }
  }

  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export default PublicRoute
