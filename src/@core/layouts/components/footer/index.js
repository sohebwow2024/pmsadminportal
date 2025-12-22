// ** Icons Import
// import { Heart } from "react-feather"
import WowLogo from "@src/assets/images/logo/krafitech-icon-40x40.png"

const Footer = () => {
  return (
    <p className="clearfix mb-0">
      {/* <span className="float-md-start d-block d-md-inline-block mt-25">
        COPYRIGHT © {new Date().getFullYear()}{" "}
        <a
          href="https://1.envato.market/pixinvent_portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pixinvent
        </a>
        <span className="d-none d-sm-inline-block">, All rights Reserved</span>
      </span> */}
      <span className="float-md-end d-none d-md-block">
        Powered by <img src={WowLogo} alt="Krafitech Solutions" height={20} />{" "}
        Krafitech Solutions
        {/* <Heart size={14} /> */}
      </span>
    </p>
  )
}

export default Footer
