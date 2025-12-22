import { MdHorizontalSplit } from "react-icons/md"
import { AiOutlineArrowRight } from "react-icons/ai"

export default [
  {
    id: 'frontDesk',
    title: 'Front Desk',
    icon: <MdHorizontalSplit size={20} />,
    navLink: '/front-desk'
    // children: [
    //     {
    //       id: 'roomCategory',
    //       title: 'Room Category',
    //       icon: <AiOutlineArrowRight size={20} />,
    //       navLink: '/roomCategory'
    //     },
    //     {
    //         id: 'roomNumber',
    //         title: 'Room Number',
    //         icon: <AiOutlineArrowRight size={20} />,
    //         navLink: '/roomNumber'
    //       }
    //   ]
  }
]