import { BiBuildingHouse } from "react-icons/bi"
import { AiOutlineArrowRight } from "react-icons/ai"
// import { HiOutlineHomeModern } from "react-icons/hi"

export default [
    {
        id: 'propertyMaster',
        title: 'Property Master',
        icon: <BiBuildingHouse size={20} />,
        navLink: '/propertyMaster',
        children: [
            {
                id: 'hotelMaster',
                title: 'Hotel',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/hotelMaster'
            },
            {
                id: 'userMaster',
                title: 'User',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/userMaster'
            },
            {
                id: 'floorMaster',
                title: 'Floor',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/floorMaster'
            },
            // {
            //     id: 'contact',
            //     title: 'Contact',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/contact'
            // },
            // {
            //     id: 'bankDetails',
            //     title: 'Bank Details',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/bankDetails'
            // },
            {
                id: 'roomDetails',
                title: 'Room Type',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/roomDetails'
            },
            {
                id: 'roomType',
                title: 'Room Category',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/roomType'
            },
            {
                id: 'bedType',
                title: 'Bed Type',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/bedType'
            },
            {
                id: 'extraBedType',
                title: 'Extra Bed Type',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/extraBedType'
            },
            {
                id: 'roomView',
                title: 'Room View',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/roomView'
            },
            {
                id: 'accountSetup',
                title: 'Account Setup',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/accountSetup'
            },
            {
                id: 'propertyPhotos',
                title: 'Property Photos',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/propertyPhotos'
            },
            {
                id: 'propertyDocument',
                title: 'Property Document',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/propertyDocument'
            },
            // {
            //     id: 'cancelPolicy',
            //     title: 'Cancel Policy',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/cancelPolicy'
            // },
            // {
            //     id: 'payAtHotelSetting',
            //     title: 'Pay At Hotel Setting',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/payAtHotelSetting'
            // },
            // {
            //     id: 'gstDetails',
            //     title: 'GST Details',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/gstDetails'
            // },
            {
                id: 'gstTaxes',
                title: 'GST Taxes',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/gstTaxes'
            },
            {
                id: 'addOnServices',
                title: 'Add On Services',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/addOnServices'
            },
            {
                id: 'promoCode',
                title: 'Promo Code',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/promoCode'
            },
            {
                id: 'packageMaster',
                title: 'Package',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/packageMaster'
            },
            {
                id: 'termsConditions',
                title: 'Terms & Conditions',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/termsConditions'
            }
        ]
    }
]
