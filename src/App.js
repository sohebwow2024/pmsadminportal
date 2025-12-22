// import React, { Suspense } from "react"

// // ** Router Import
// import Router from "./router/Router"

// // ** Spinner (Splash Screen)
// import Spinner from "./@core/components/spinner/Fallback-spinner"

// const App = () => {
//   return (
//     <Suspense fallback={<Spinner />}>
//       <Router />
//     </Suspense>
//   )
// }
//just for checking
// export default App


import React, { useState, useEffect, Suspense } from 'react'

// ** Router Import
import Router from './router/Router'

// ** Routes & Default Routes
import { getRoutes } from './router/routes'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

//** Notification Context
// import { NotificationProvider } from './utility/context/NotificationContext'
import { useSelector } from 'react-redux'

const App = () => {
  const [allRoutes, setAllRoutes] = useState([])
 const userData = useSelector((state) => state.userManageSlice.userData || {})
 const LoginID = userData?.LoginID
const Token = userData?.Token
  // ** Hooks
  const { layout } = useLayout()

  useEffect(() => {
    setAllRoutes(getRoutes(layout))


  }, [layout])
  // console.log("allRoutes:", allRoutes);

  return (
      <Suspense fallback={null}>
        <Router allRoutes={allRoutes} />
         {/* <NotificationProvider loginID={LoginID} token={Token}> */}
      {/* </NotificationProvider> */}
      </Suspense>
  )
}

export default App
