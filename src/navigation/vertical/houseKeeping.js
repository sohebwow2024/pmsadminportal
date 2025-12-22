import { MdOutlineOtherHouses, MdHorizontalSplit } from "react-icons/md"
import { AiOutlineArrowRight } from "react-icons/ai"
export default [
    {
    id: 'housekeeping',
    title: 'Housekeeping',
    icon: <MdOutlineOtherHouses size={20} />,
    navLink: '/housekeeping',
        children: [
            {
                id: 'housekeepingstatus',
                title: 'Status',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/housekeepingstatus'
            },
            {
                id: 'housekeepingchecklist',
                title: 'CheckList',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/housekeepingchecklist'
            },
            // {
            //     id: 'housekeepingusers',
            //     title: 'Users',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/housekeepingusers'
            // },
            // {
            //     id: 'housekeepinglogin',
            //     title: 'LogIn',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/housekeepinglogin'
            // }
        ]
    }
]