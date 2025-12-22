import { BsGlobe2 } from "react-icons/bs"
import { AiOutlineArrowRight } from "react-icons/ai"

export default [
    {
        id: 'regionMaster',
        title: 'Region Master',
        icon: <BsGlobe2 size={20} />,
        navLink: '/regionMaster',
        children: [
            {
                id: 'countryMaster',
                title: 'Country',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/countryMaster'
            },
            {
                id: 'stateMaster',
                title: 'State',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/stateMaster'
            },
            // {
            //     id: 'districtMaster',
            //     title: 'District',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/districtMaster'
            // },
            {
                id: 'cityMaster',
                title: 'City',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/cityMaster'
            }
        ]
    }
]