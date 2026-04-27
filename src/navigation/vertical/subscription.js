// import { BiCurrentLocation } from "react-icons/bi"
import { MdOutlineInventory } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";

export default [
  {
    id: "subscription",
    title: "Subscription",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-credit-card"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8" /><path d="M3 10l18 0" /><path d="M7 15l.01 0" /><path d="M11 15l2 0" /></svg>,
    navLink: "/subscription",
    children: [
      {
        id: "paymentFolio",
        title: "Subscription History",
        icon: <AiOutlineArrowRight size={20} />,
        navLink: "/subscriptionHistory",
      },
      {
        id: "productMaster",
        title: "Subscription Pay",
        icon: <AiOutlineArrowRight size={20} />,
        navLink: "/allSubscription",
      },
      // {
      //     id: 'purchaseOrder',
      //     title: 'Active',
      //     icon: <AiOutlineArrowRight size={20} />,
      //     navLink: '/purchaseOrder'
      // },
      // {
      //     id: 'purchaseReceive',
      //     title: 'Expired',
      //     icon: <AiOutlineArrowRight size={20} />,
      //     navLink: '/purchaseReceive'
      // },
      // {
      //     id: 'stockCount',
      //     title: 'Stock Count',
      //     icon: <AiOutlineArrowRight size={20} />,
      //     navLink: '/stockCount'
      // }
    ],
  },
];