import { FaHome } from "react-icons/fa"
import { AiOutlineArrowRight } from "react-icons/ai"

export default [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <FaHome size={20} />,
    navLink: '/dashboard'
    // children: [
    //   {
    //     id: 'analyticsDashboard',
    //     title: 'Dashboard analytics',
    //     icon: <AiOutlineArrowRight size={20} />,
    //     navLink: '/analyticsDashboard'
    //   }
    // ]
  }
]
