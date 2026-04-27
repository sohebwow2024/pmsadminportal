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
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-list"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" /><path d="M9 12l.01 0" /><path d="M13 12l2 0" /><path d="M9 16l.01 0" /><path d="M13 16l2 0" /></svg>,
    navLink: '/pannelmaster',
    children: [
      {
        id: 'plansMaster',
        title: 'Plans',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/plans'
      },

      // {
      //   id: 'planincluding',
      //   title: 'Plan Including',
      //   icon: <AiOutlineArrowRight size={20} />,
      //   navLink: '/planincluding'
      // },
      // {
      //   id: 'planexcluding',
      //   title: 'Plan Excluding',
      //   icon: <AiOutlineArrowRight size={20} />,
      //   navLink: '/planexcluding'
      // },

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