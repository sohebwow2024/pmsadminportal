import { BiBuildingHouse } from "react-icons/bi"
import { AiOutlineArrowRight } from "react-icons/ai"
// import { HiOutlineHomeModern } from "react-icons/hi"

export default [
    {
        id: 'pannelmaster',
        title: 'Product Master',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-database"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" /><path d="M4 6v6a8 3 0 0 0 16 0v-6" /><path d="M4 12v6a8 3 0 0 0 16 0v-6" /></svg>,
        navLink: '/pannelmaster',
        children: [
            {
                id: 'productsMaster',
                title: 'Products',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/products'
            },
            {
                id: 'categoryMaster',
                title: 'Category',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/category'
            },
            {
                id: 'industrycategory',
                title: 'Industry Category',
                icon: <AiOutlineArrowRight size={20} />,
                navLink: '/industrycategory'
            }
            // {
            //     id: 'plansMaster',
            //     title: 'Plans',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/plans'
            // },
            // {
            //     id: 'priceMaster',
            //     title: 'Plan Pricing',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/priceMaster'
            // },
            // {
            //     id: 'feature',
            //     title: 'Features',
            //     icon: <AiOutlineArrowRight size={20} />,
            //     navLink: '/featureMaster'
            // },
            
        ]
    }
]