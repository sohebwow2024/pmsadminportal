// import { BsTagFill } from "react-icons/bs"


// export default [
//   {
//     id: 'Licences',
//     title: 'Licences',
//     icon: <BsTagFill size={20} />,
//     navLink: '/licenseManagement'
//   }
// ]

import { BsTagFill } from "react-icons/bs"
import { BiBuildingHouse } from "react-icons/bi"
import { AiOutlineArrowRight } from "react-icons/ai"


export default [
  {
    id: 'Licences',
    title: 'Plan Master',
    icon: <BiBuildingHouse size={20} />,
    navLink: '/pannelmaster',
    children: [
      {
        id: 'plansMaster',
        title: 'Plans',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/plans'
      },

      {
        id: 'planincluding',
        title: 'Plan Including',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/planincluding'
      },
      {
        id: 'planexcluding',
        title: 'Plan Excluding',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/planexcluding'
      },

      {
        id: 'planrate',
        title: 'Plan Rate',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/planrate'
      },
      {
        id: 'planpoint',
        title: 'Plan Points',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/planpoint'
      },

      {
        id: 'promocode',
        title: 'Promocode',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/promocode'
      },
    ]
  }
]

