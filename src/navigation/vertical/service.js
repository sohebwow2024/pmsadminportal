import { MdOutlineAccountBox } from "react-icons/md"
import { AiOutlineArrowRight } from "react-icons/ai"

export default [
  {
    id: 'service',
    title: 'Service',
    icon: <MdOutlineAccountBox size={20} />,
    navLink: '/service',
    children: [
      {
        id: 'expressService',
        title: 'Express',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/expressService'
      },
      {
        id: 'contactlessRequest',
        title: 'Contactless Request',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/contactlessRequest'
      }
    ]
  }
]