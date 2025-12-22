import { MdOutlineLocalLaundryService } from "react-icons/md"
import { AiOutlineArrowRight } from "react-icons/ai"

export default [
  {
    id: 'laundry',
    title: 'Laundry',
    icon: <MdOutlineLocalLaundryService size={20} />,
    navLink: '/laundry',
    children: [
      {
        id: 'addLaundry',
        title: 'Add Laundry',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/addLaundry'
      },
      {
        id: 'transaction',
        title: 'Transaction',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/laundry/transaction'
      },
      {
        id: 'history',
        title: 'History',
        icon: <AiOutlineArrowRight size={20} />,
        navLink: '/history'
      }
    ]
  }
]