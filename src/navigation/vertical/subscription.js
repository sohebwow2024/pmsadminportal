// import { BiCurrentLocation } from "react-icons/bi"
import { MdOutlineInventory } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";

export default [
  {
    id: "subscription",
    title: "Subscription",
    icon: <MdOutlineInventory size={20} />,
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
