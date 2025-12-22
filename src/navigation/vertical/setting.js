// import { BiCurrentLocation } from "react-icons/bi"
import { Settings } from "react-feather"
import { AiOutlineArrowRight } from "react-icons/ai"
import { TbReportSearch } from "react-icons/tb"

export default [
    {
        id: 'setting',
        title: 'Settings',
        icon: <Settings size={20} />,
        navLink: '/setting',
        children: [
            {
                id: 'changepassword',
                title: 'Change Password',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/changepassword'
            },
            // {
            //     id: 'forgot-password',
            //     title: 'Generate Password',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     // navLink: '/forgot-password'
            //     navLink: {
            //         pathname: '/forgot-password',
            //         state: { fromGeneratePassword: true } // Pass additional state
            //     }
            // },
            {
                id: 'generate-password',
                title: 'Generate Password',
                icon: <AiOutlineArrowRight size={20} />,
                // navLink: '/forgot-password'
                navLink: {
                    pathname: '/generate-password',
                    state: { fromGeneratePassword: true } // Pass additional state
                }
            },
        ]
    }
]
